import { v4 as uuidv4 } from 'uuid';

// Types for server generation
export interface ServerRequirements {
  serverDescription: string;
  targetClients: string[];
  authRequirements: string;
  deploymentPreference: 'local' | 'cloud' | 'both';
  languagePreference?: string;
}

export interface ClientConfig {
  name: string;
  configuration: Record<string, any>;
}

export interface ServerPackage {
  serverCode: string;
  clientConfigs: Record<string, ClientConfig>;
  packages: {
    local?: Record<string, string>;
    cloud?: Record<string, string>;
  };
  documentation: string;
}

/**
 * Construct the base prompt for the LLM to generate the MCP server
 */
function constructBasePrompt(
  serverDescription: string,
  targetClients: string[],
  authRequirements: string,
  deploymentPreference: string,
  languagePreference?: string
): string {
  return `
You are an expert MCP server developer. Your task is to create a complete, working MCP server based on the following requirements:

1. SERVER DESCRIPTION:
${serverDescription}

2. TARGET MCP CLIENT(S):
${targetClients.join(', ')}

3. AUTHENTICATION NEEDS:
${authRequirements}

4. DEPLOYMENT PREFERENCE:
${deploymentPreference}

5. PROGRAMMING LANGUAGE:
${languagePreference || "Choose the most appropriate language"}

Please generate a complete, working MCP server implementation that follows all MCP protocol specifications and best practices.
`;
}

/**
 * Get client-specific instructions based on the target client
 */
function getClientSpecificInstructions(client: string): string {
  if (client.toLowerCase().includes('claude')) {
    return `
Since this server will be used with Claude Desktop:
- Include a sample claude_desktop_config.json configuration
- Ensure compatibility with stdio transport
- Implement appropriate error handling for local execution
- Follow Claude Desktop's security model for local tools
`;
  } else if (client.toLowerCase().includes('cursor')) {
    return `
Since this server will be used with Cursor AI:
- Include a sample .cursor/mcp.json configuration
- Support both stdio and sse transport options
- Implement appropriate authentication for Cursor AI's interaction model
`;
  }
  
  // Default instructions
  return `
For this MCP client:
- Include appropriate configuration files
- Support recommended transport options
- Implement appropriate error handling
`;
}

/**
 * Get MCP documentation for the LLM prompt
 */
function getMcpDocumentation(): string {
  return `
REFERENCE DOCUMENTATION:

The Model Context Protocol (MCP) defines three fundamental concepts:

1. TOOLS: Executable functions that LLMs can invoke with user authorization
   - Example: weather.getCurrentAlerts(), database.executeQuery()
   - Must return structured data or error information

2. RESOURCES: Static, file-like data that clients can access
   - Example: API responses, file contents, database schemas
   - Accessed via unique identifiers

3. PROMPTS: Pre-defined templates that guide LLM behavior
   - Example: Standardized greeting formats or analytical frameworks
   - Include arguments that can be filled at runtime

PROTOCOL SPECIFICATIONS:
- Tools must include name, description, parameters, and return types
- Resources must have content-type and data fields
- Error handling must follow protocol-defined formats
- Transport mechanisms include stdio and sse options
`;
}

/**
 * Validate a generated server against MCP compliance rules
 */
function validateMcpCompliance(serverCode: string, language?: string): { isValid: boolean; issues: string[] } {
  // In a real implementation, this would do actual validation
  // For now, we'll just do basic checks

  const issues: string[] = [];
  
  // Check for basic validity
  if (!serverCode) {
    issues.push('Server code is empty');
    return { isValid: false, issues };
  }

  // Add language-specific checks
  if (language?.toLowerCase().includes('typescript')) {
    // TypeScript-specific checks
    if (!serverCode.includes('import { Server }')) {
      issues.push('No Server import found');
    }
    
    if (!serverCode.includes('StdioServerTransport')) {
      issues.push('No StdioServerTransport import found');
    }
    
    if (!serverCode.includes('.js"')) {
      issues.push('Imports should use .js extension for ES modules compatibility');
    }
    
    if (!serverCode.includes('interface') && !serverCode.includes('type ')) {
      issues.push('No TypeScript interfaces or type definitions found');
    }
    
    if (!serverCode.includes('try {') || !serverCode.includes('catch (')) {
      issues.push('Missing try/catch error handling');
    }
  } else {
    // Generic or Python checks
    if (!serverCode.includes('resources') && !serverCode.includes('Resources')) {
      issues.push('No resources implementation found');
    }
    
    if (!serverCode.includes('tools') && !serverCode.includes('Tools')) {
      issues.push('No tools implementation found');
    }
  }

  // Check for MCP required components
  if (!serverCode.includes('setRequestHandler')) {
    issues.push('No request handlers implemented');
  }
  
  if (!serverCode.includes('ListToolsRequestSchema')) {
    issues.push('No tools listing handler implemented');
  }
  
  if (!serverCode.includes('CallToolRequestSchema')) {
    issues.push('No tool execution handler implemented');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Create a refinement prompt based on validation issues
 */
function createRefinementPrompt(issues: string[], language?: string): string {
  // Add language-specific guidance
  let additionalGuidance = '';
  
  if (language?.toLowerCase().includes('typescript')) {
    additionalGuidance = `
When refining TypeScript MCP server implementations:
1. Ensure all imports use the .js extension (e.g., '@modelcontextprotocol/sdk/server/index.js')
2. Add proper type definitions for request parameters
3. Use explicit error handling with try/catch blocks
4. Implement type guards for validating tool arguments
5. Use ES modules syntax with "type": "module" in package.json
6. Prefer async/await over callbacks
7. Use proper TypeScript configurations for NodeNext modules
`;
  } else if (language?.toLowerCase().includes('python')) {
    additionalGuidance = `
When refining Python MCP server implementations:
1. Use modern Python async/await syntax
2. Add proper type annotations using Python type hints
3. Implement proper error handling
4. Follow PEP 8 style guidelines
5. Add docstrings for public functions and classes
`;
  }

  return `
Your initial implementation is good, but needs the following refinements:

${issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}

${additionalGuidance}

Please refine the implementation to address these issues.
`;
}

/**
 * Generate client configuration files based on the server code
 */
function generateClientConfig(client: string, serverCode: string): ClientConfig {
  const isTypeScript = serverCode.includes('import { Server }') || serverCode.includes('@modelcontextprotocol/sdk');

  if (client.toLowerCase().includes('claude')) {
    return {
      name: 'Claude Desktop',
      configuration: {
        servers: [
          {
            name: `mcp-server-${uuidv4().substring(0, 8)}`,
            command: "{full_path_to_executable}",
            args: []
          }
        ]
      }
    };
  } else if (client.toLowerCase().includes('cursor')) {
    return {
      name: 'Cursor AI',
      configuration: {
        mcp: {
          servers: [
            {
              name: `mcp-server-${uuidv4().substring(0, 8)}`,
              transport: "stdio",
              command: isTypeScript ? "node" : "python",
              args: [isTypeScript ? "{path_to_script}/dist/server.js" : "{path_to_script}"]
            }
          ]
        }
      }
    };
  }
  
  // Default configuration
  return {
    name: 'Generic Client',
    configuration: {
      name: `mcp-server-${uuidv4().substring(0, 8)}`,
      command: "{path_to_executable}",
      args: []
    }
  };
}

/**
 * Package the server for local execution
 */
function packageForLocalExecution(serverCode: string, language?: string): Record<string, string> {
  // This would generate actual files in a real implementation
  // For now, we'll just return placeholders
  
  if (language?.toLowerCase().includes('python')) {
    return {
      'server.py': serverCode,
      'requirements.txt': 'modelcontextprotocol>=1.0.0\n',
      'setup.sh': '#!/bin/bash\npython -m venv venv\n./venv/bin/pip install -r requirements.txt\n',
      'setup.bat': '@echo off\npython -m venv venv\nvenv\\Scripts\\pip install -r requirements.txt\n',
      'run.sh': '#!/bin/bash\n./venv/bin/python server.py\n',
      'run.bat': '@echo off\nvenv\\Scripts\\python server.py\n'
    };
  } else if (language?.toLowerCase().includes('typescript')) {
    return {
      'server.ts': serverCode,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules"]
}`,
      'package.json': `{
  "name": "mcp-server",
  "version": "1.0.0",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/express": "^4.17.13",
    "typescript": "^5.0.4"
  }
}`,
      'setup.sh': '#!/bin/bash\nnpm install\nnpm run build\n',
      'setup.bat': '@echo off\nnpm install\nnpm run build\n',
      'run.sh': '#!/bin/bash\nnpm start\n',
      'run.bat': '@echo off\nnpm start\n',
      'README.md': `# MCP Server

This MCP server was generated automatically. It implements the Model Context Protocol (MCP) specification.

## Requirements

- Node.js 18+
- npm or yarn

## Installation

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Build the TypeScript code:
   \`\`\`
   npm run build
   \`\`\`

3. Run the server:
   \`\`\`
   npm start
   \`\`\`

## Client Configuration

### Claude Desktop
Add the server in Claude Desktop settings:
- **Name**: MCP Server
- **Command**: Full path to Node.js executable (e.g., /usr/bin/node)
- **Arguments**: ["path/to/dist/server.js"]

### Cursor AI
Place this in your .cursor/mcp.json file:
\`\`\`json
{
  "mcp": {
    "servers": [
      {
        "name": "mcp-server",
        "transport": "stdio",
        "command": "node",
        "args": ["path/to/dist/server.js"]
      }
    ]
  }
}
\`\`\`
`
    };
  } else if (language?.toLowerCase().includes('node') || language?.toLowerCase().includes('javascript')) {
    return {
      'server.js': serverCode,
      'package.json': '{\n  "name": "mcp-server",\n  "version": "1.0.0",\n  "main": "server.js",\n  "type": "module",\n  "scripts": {\n    "start": "node server.js"\n  },\n  "dependencies": {\n    "@modelcontextprotocol/sdk": "^1.0.0"\n  }\n}',
      'setup.sh': '#!/bin/bash\nnpm install\nnpm run build\n',
      'setup.bat': '@echo off\nnpm install\nnpm run build\n',
      'run.sh': '#!/bin/bash\nnpm start\n',
      'run.bat': '@echo off\nnpm start\n'
    };
  }
  
  // Default to TypeScript if language not specified
  return {
    'server.ts': serverCode,
    'tsconfig.json': '{\n  "compilerOptions": {\n    "target": "ES2018",\n    "module": "CommonJS",\n    "esModuleInterop": true,\n    "outDir": "dist",\n    "strict": true\n  },\n  "include": ["*.ts"],\n  "exclude": ["node_modules"]\n}',
    'package.json': '{\n  "name": "mcp-server",\n  "version": "1.0.0",\n  "main": "dist/server.js",\n  "scripts": {\n    "build": "tsc",\n    "start": "node dist/server.js"\n  },\n  "dependencies": {\n    "@modelcontextprotocol/sdk": "^1.0.0"\n  },\n  "devDependencies": {\n    "@types/node": "^18.0.0",\n    "ts-node": "^10.9.1",\n    "typescript": "^4.9.5"\n  }\n}',
    'setup.sh': '#!/bin/bash\nnpm install\nnpm run build\n',
    'setup.bat': '@echo off\nnpm install\nnpm run build\n',
    'run.sh': '#!/bin/bash\nnpm start\n',
    'run.bat': '@echo off\nnpm start\n'
  };
}

/**
 * Package the server for cloud deployment
 */
function packageForCloudDeployment(serverCode: string, language?: string): Record<string, string> {
  // Base files for cloud deployment
  const baseFiles = {
    'Dockerfile': '',
    'docker-compose.yml': '',
    '.env.example': '',
    'README.md': '# MCP Server Cloud Deployment\n\nThis MCP server is configured for cloud deployment.\n'
  };
  
  if (language?.toLowerCase().includes('python')) {
    return {
      ...baseFiles,
      'server.py': serverCode,
      'requirements.txt': 'modelcontextprotocol>=1.0.0\ngunicorn>=20.0.0\nuvicorn>=0.15.0\n',
      'Dockerfile': 'FROM python:3.9-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\nCMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]\n',
      'docker-compose.yml': 'version: "3"\nservices:\n  mcp-server:\n    build: .\n    ports:\n      - "8000:8000"\n    env_file:\n      - .env\n'
    };
  } else if (language?.toLowerCase().includes('typescript')) {
    return {
      ...baseFiles,
      'server.ts': serverCode,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules"]
}`,
      'package.json': `{
  "name": "mcp-server",
  "version": "1.0.0",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/express": "^4.17.13",
    "typescript": "^5.0.4"
  }
}`,
      'Dockerfile': `FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Run server
CMD ["npm", "start"]`,
      'docker-compose.yml': `version: "3"
services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped`,
      '.env.example': `# MCP Server Configuration
NODE_ENV=production

# Add your API keys and secrets here
# API_KEY=your_api_key_here`
    };
  } else if (language?.toLowerCase().includes('node') || language?.toLowerCase().includes('javascript')) {
    return {
      ...baseFiles,
      'server.js': serverCode,
      'package.json': `{
  "name": "mcp-server",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "express": "^4.17.1"
  }
}`,
      'Dockerfile': `FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Run server
CMD ["npm", "start"]`,
      'docker-compose.yml': `version: "3"
services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped`
    };
  }
  
  // Default to TypeScript if language not specified
  return {
    ...baseFiles,
    'server.ts': serverCode,
    'tsconfig.json': '{\n  "compilerOptions": {\n    "target": "ES2018",\n    "module": "CommonJS",\n    "esModuleInterop": true,\n    "outDir": "dist",\n    "strict": true\n  },\n  "include": ["*.ts"],\n  "exclude": ["node_modules"]\n}',
    'package.json': '{\n  "name": "mcp-server",\n  "version": "1.0.0",\n  "main": "dist/server.js",\n  "scripts": {\n    "build": "tsc",\n    "start": "node dist/server.js"\n  },\n  "dependencies": {\n    "@modelcontextprotocol/sdk": "^1.0.0",\n    "express": "^4.17.1"\n  },\n  "devDependencies": {\n    "@types/node": "^18.0.0",\n    "@types/express": "^4.17.13",\n    "typescript": "^4.9.5"\n  }\n}',
    'Dockerfile': 'FROM node:16-slim\n\nWORKDIR /app\n\nCOPY package*.json ./\nRUN npm install\n\nCOPY . .\nRUN npm run build\n\nCMD ["npm", "start"]\n',
    'docker-compose.yml': 'version: "3"\nservices:\n  mcp-server:\n    build: .\n    ports:\n      - "3000:3000"\n    env_file:\n      - .env\n'
  };
}

/**
 * Generate usage documentation for the server
 */
function generateUsageDocumentation(serverCode: string, configs: Record<string, ClientConfig>): string {
  // Generate appropriate documentation based on the server and configs
  return `
# MCP Server Documentation

## Overview
This MCP server was generated automatically. It implements the Model Context Protocol (MCP) specification and provides tools, resources, and prompts as specified.

## Installation

### Local Installation

1. Download the server files
2. Run the setup script:
   - Windows: \`setup.bat\`
   - Mac/Linux: \`./setup.sh\`
3. Run the server:
   - Windows: \`run.bat\`
   - Mac/Linux: \`./run.sh\`

### Client Configuration

${Object.entries(configs).map(([client, config]) => `
#### ${config.name}
\`\`\`json
${JSON.stringify(config.configuration, null, 2)}
\`\`\`
`).join('\n')}

## Usage

1. Start the server using the instructions above
2. Configure your MCP client to connect to the server
3. Begin using the tools and resources provided by the server

## Security Considerations

- Store API keys and sensitive credentials in environment variables
- Follow the principle of least privilege for all operations
- Validate all inputs to prevent injection attacks
`;
}

/**
 * Main function to generate an MCP server based on user requirements
 */
export async function generateMcpServer(
  userDescription: string,
  targetClients: string[],
  authRequirements: string,
  deploymentPreference: 'local' | 'cloud' | 'both',
  languagePreference?: string,
  llmProvider?: any // This would be the actual LLM provider interface
): Promise<ServerPackage> {
  // For now, this is a placeholder that simulates the generation process
  // In a real implementation, it would integrate with an LLM

  // Override languagePreference to TypeScript if not specifically set to something else
  if (!languagePreference || !languagePreference.toLowerCase().includes('python')) {
    languagePreference = 'TypeScript';
  }

  // Construct the base prompt
  const basePrompt = constructBasePrompt(
    userDescription,
    targetClients,
    authRequirements,
    deploymentPreference,
    languagePreference
  );

  // Add client-specific instructions
  let fullPrompt = basePrompt;
  for (const client of targetClients) {
    fullPrompt += getClientSpecificInstructions(client);
  }

  // Add MCP documentation
  fullPrompt += getMcpDocumentation();

  // Determine which implementation to use based on language preference
  let serverCode: string;

  if (languagePreference.toLowerCase().includes('typescript')) {
    // TypeScript implementation
    serverCode = `#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";

// Type definitions
interface ResourceRequest {
  params: {
    uri: string;
  };
}

interface ToolRequest {
  params: {
    name: string;
    arguments: Record<string, any>;
  };
}

// Define sample tool
const SAMPLE_TOOL: Tool = {
  name: "sample_tool",
  description: "A sample tool for demonstration purposes",
  inputSchema: {
    type: "object",
    properties: {
      input: { 
        type: "string",
        description: "Input text to process"
      }
    },
    required: ["input"]
  }
};

// Type guard for tool arguments
function isSampleToolArgs(args: unknown): args is { input: string } {
  return (
    typeof args === "object" &&
    args !== null &&
    "input" in args &&
    typeof (args as { input: string }).input === "string"
  );
}

// Initialize the server
const server = new Server(
  {
    name: "example-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      resources: {},
      tools: {}
    }
  }
);

// Resources implementation
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "file:///sample/resource.txt",
        name: "Sample Resource",
        description: "A sample resource for demonstration",
        mimeType: "text/plain"
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request: ResourceRequest) => {
  const uri = request.params.uri;
  if (uri === "file:///sample/resource.txt") {
    return {
      contents: [
        {
          uri: uri,
          mimeType: "text/plain",
          text: "This is a sample resource content."
        }
      ]
    };
  }
  return { contents: [] };
});

// Tools implementation
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [SAMPLE_TOOL]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request: ToolRequest) => {
  try {
    const { name, arguments: args } = request.params;
    
    if (!args) {
      throw new Error("No arguments provided");
    }

    switch (name) {
      case "sample_tool": {
        if (!isSampleToolArgs(args)) {
          throw new Error("Invalid arguments for sample_tool");
        }
        
        const { input } = args;
        return {
          content: [
            {
              type: "text",
              text: \`Tool executed with input: \${input}\`
            }
          ],
          isError: false
        };
      }
      
      default:
        return {
          content: [
            {
              type: "text",
              text: \`Unknown tool: \${name}\`
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: \`Error: \${error instanceof Error ? error.message : String(error)}\`
        }
      ],
      isError: true
    };
  }
});

// Main entry point
async function runServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server connected and running on stdio");
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});`;
  } else {
    // Python implementation (keeping this as a fallback)
    serverCode = `
# Sample MCP Server Implementation in Python
# This is a placeholder - in production, this would be generated by an LLM

from modelcontextprotocol import Server, Transport, ListResourcesRequestSchema, ReadResourceRequestSchema, ListToolsRequestSchema, CallToolRequestSchema

# Initialize the server
server = Server(
    metadata={
        "name": "example-mcp-server",
        "version": "1.0.0"
    },
    capabilities={
        "resources": {},
        "tools": {}
    }
)

# Resources implementation
@server.request_handler(ListResourcesRequestSchema)
async def list_resources(request):
    return {
        "resources": [
            {
                "uri": "file:///sample/resource.txt",
                "name": "Sample Resource",
                "description": "A sample resource for demonstration",
                "mimeType": "text/plain"
            }
        ]
    }

@server.request_handler(ReadResourceRequestSchema)
async def read_resource(request):
    uri = request.params.uri
    if uri == "file:///sample/resource.txt":
        return {
            "contents": [
                {
                    "uri": uri,
                    "mimeType": "text/plain",
                    "text": "This is a sample resource content."
                }
            ]
        }
    return {"contents": []}

# Tools implementation
@server.request_handler(ListToolsRequestSchema)
async def list_tools(request):
    return {
        "tools": [
            {
                "name": "sample_tool",
                "description": "A sample tool for demonstration",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "input": {"type": "string"}
                    },
                    "required": ["input"]
                }
            }
        ]
    }

@server.request_handler(CallToolRequestSchema)
async def call_tool(request):
    if request.params.name == "sample_tool":
        input_value = request.params.arguments.get("input", "")
        return {
            "content": [
                {
                    "type": "text",
                    "text": f"Tool executed with input: {input_value}"
                }
            ]
        }
    return {
        "isError": True,
        "content": [
            {
                "type": "text",
                "text": "Tool not found"
            }
        ]
    }

# Main entry point
if __name__ == "__main__":
    import asyncio
    from modelcontextprotocol.transports import StdioTransport
    
    async def main():
        transport = StdioTransport()
        await server.connect(transport)
    
    asyncio.run(main())
`;
  }

  // Validate the generated server code
  const validationResults = validateMcpCompliance(serverCode, languagePreference);
  
  // In a real implementation, you would regenerate if validation fails
  if (!validationResults.isValid && llmProvider) {
    // Create a refinement prompt
    const refinementPrompt = createRefinementPrompt(validationResults.issues, languagePreference);
    
    // In a real implementation, you would send this to the LLM for refinement
    console.log(`Refinement needed: ${refinementPrompt}`);
    
    // Attempt refinement with LLM (simulated here)
    // serverCode = await llmProvider.generateRefinement(fullPrompt + refinementPrompt);
  }
  
  // Generate client configurations with the generated server code
  const clientConfigs: Record<string, ClientConfig> = {};
  for (const client of targetClients) {
    clientConfigs[client] = generateClientConfig(client, serverCode);
    
    // Update command for TypeScript implementation
    if (languagePreference.toLowerCase().includes('typescript')) {
      if (client.toLowerCase().includes('cursor') && clientConfigs[client]) {
        clientConfigs[client].configuration.mcp.servers[0].command = "node";
        clientConfigs[client].configuration.mcp.servers[0].args = ["{path_to_script}/dist/server.js"];
      } else if (client.toLowerCase().includes('claude') && clientConfigs[client]) {
        // No changes needed for Claude, as it uses the full path to executable
      }
    }
  }

  // Package for deployment
  let packages: { local?: Record<string, string>; cloud?: Record<string, string> } = {};
  if (deploymentPreference === 'local' || deploymentPreference === 'both') {
    packages.local = packageForLocalExecution(serverCode, languagePreference);
  }
  if (deploymentPreference === 'cloud' || deploymentPreference === 'both') {
    packages.cloud = packageForCloudDeployment(serverCode, languagePreference);
  }

  // Generate documentation
  const documentation = generateUsageDocumentation(serverCode, clientConfigs);

  // Return the complete package
  return {
    serverCode,
    clientConfigs,
    packages,
    documentation
  };
} 