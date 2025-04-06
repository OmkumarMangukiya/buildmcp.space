import { v4 as uuidv4 } from 'uuid';
import { logPrompt, readDocFile } from './promptLogger';

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

6. TOOL REQUIREMENTS:
- Tools must have descriptive names that clearly indicate their purpose
- Each tool description should be detailed (3-5 lines minimum)
- Descriptions should explain what the tool does, when to use it, and its key features
- Include parameter descriptions that explain expected formats and limitations
- Follow a consistent naming pattern: [category]_[action] (e.g., file_read, web_search)
- Use proper TypeScript interfaces for all parameters and return types

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
   - DETAILED DESCRIPTIONS: Tools should have thorough descriptions (3-5 lines) that explain:
     * What the tool does in detail
     * When to use it (best use cases)
     * What parameters it accepts 
     * What responses it returns
   - NAMING CONVENTION: Tools should be named using [category]_[action] format:
     * file_read, file_write, file_search
     * web_search, web_fetch, web_post
     * db_query, db_update, db_delete

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

MODERN MCP SDK EXAMPLES:

1. Tool Definition:
\`\`\`typescript
// Define a weather tool with Zod validation
server.tool(
  "weather_current",
  { 
    location: z.string().describe("City or location name"), 
    units: z.enum(["metric", "imperial"]).default("metric")
      .describe("Temperature units (metric or imperial)")
  },
  async ({ location, units }) => {
    try {
      // Tool implementation
      const weather = await fetchWeatherData(location, units);
      return {
        content: [{ 
          type: "text", 
          text: \`Current weather in \${location}: \${weather.temperature}°\${units === "metric" ? "C" : "F"}, \${weather.description}\` 
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: \`Error fetching weather: \${error.message}\` }],
        isError: true
      };
    }
  }
);
\`\`\`

2. Resource Definition:
\`\`\`typescript
// Define a dynamic file resource
server.resource(
  "file",
  new ResourceTemplate("file:///{path}", { list: undefined }),
  async (uri, { path }) => {
    try {
      const content = await fs.promises.readFile(path, 'utf8');
      return {
        contents: [{
          uri: uri.href,
          mimeType: getMimeType(path),
          text: content
        }]
      };
    } catch (error) {
      throw new Error(\`Failed to read file: \${error.message}\`);
    }
  }
);
\`\`\`

3. Prompt Definition:
\`\`\`typescript
// Define a code review prompt
server.prompt(
  "review_code",
  { 
    code: z.string().describe("Code to review"),
    language: z.string().describe("Programming language")
  },
  ({ code, language }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: \`Please review this \${language} code and suggest improvements:\n\n\${code}\`
      }
    }]
  })
);
\`\`\`
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

  // Modern API usage check
  if (!serverCode.includes('McpServer')) {
    issues.push('Should use modern McpServer API from the TypeScript SDK');
  }
  
  if (!serverCode.includes('server.tool(')) {
    issues.push('Should use server.tool() to define tools');
  }
  
  if (serverCode.includes('ListToolsRequestSchema') || 
      serverCode.includes('CallToolRequestSchema')) {
    issues.push('Should not use low-level request handler schemas directly');
  }

  // Check for tool description quality
  if (serverCode.includes('description:') && 
      !serverCode.match(/description:\s*"[^"]{100,}/)) {
    issues.push('Tool descriptions should be detailed (at least 100 characters)');
  }

  // Check for proper tool naming
  if (serverCode.includes('name:') && 
      !serverCode.match(/name:\s*"[a-z]+_[a-z]+/)) {
    issues.push('Tool names should follow the pattern [category]_[action]');
  }

  // Check for case-insensitive search implementation
  const hasSearchFunctionality = serverCode.includes('search') || 
                               serverCode.includes('find') || 
                               serverCode.includes('query');
  
  if (hasSearchFunctionality) {
    const hasCaseInsensitiveSearch = serverCode.includes('.toLowerCase()') || 
                                   serverCode.includes('IGNORECASE') ||
                                   serverCode.includes('/i') ||
                                   serverCode.includes('(?i)') ||
                                   serverCode.includes('re.I');
    
    if (!hasCaseInsensitiveSearch) {
      issues.push('Search functionality should be case-insensitive (use .toLowerCase(), IGNORECASE flag, or similar)');
    }
  }

  // Check for TypeScript type handling
  if (language?.toLowerCase().includes('typescript')) {
    const hasComplexTypeHandling = serverCode.includes('interface') || 
                                 serverCode.includes('type ') || 
                                 serverCode.includes('<');
    
    const hasAnyTypeUsage = serverCode.includes(': any') || 
                          serverCode.includes('as any') || 
                          serverCode.includes('<any>');
    
    if (hasComplexTypeHandling && !hasAnyTypeUsage) {
      issues.push('Complex types should include fallback to "any" type where appropriate to avoid type errors');
    }
  }

  // Check for proper handling of string | string[] union types
  const hasUnionTypes = serverCode.includes('z.union') || 
                      serverCode.includes('oneOf') || 
                      serverCode.includes('|') || 
                      serverCode.includes('Union[');
                      
  if (hasUnionTypes) {
    // Check for proper type guards in TypeScript
    if (language?.toLowerCase().includes('typescript') && 
        !serverCode.includes('Array.isArray') &&
        !serverCode.includes('ensureString') &&
        !serverCode.includes('ensureArray')) {
      issues.push('String | string[] union types should be handled with proper type guards (Array.isArray or helper functions)');
    }
    
    // Check for proper type handling in Python
    if (language?.toLowerCase().includes('python') && 
        !serverCode.includes('isinstance') &&
        !serverCode.includes('ensure_string') &&
        !serverCode.includes('ensure_list')) {
      issues.push('Union[str, List[str]] types should be handled with proper type checks (isinstance or helper functions)');
    }
  }

  // Check for path operations with String() conversion
  const hasPathOperations = serverCode.includes('path.join') || 
                         serverCode.includes('os.path.join') ||
                         serverCode.includes('path.resolve');
                         
  if (hasPathOperations) {
    const hasStringConversion = serverCode.includes('String(') || 
                             serverCode.includes('str(') ||
                             serverCode.includes('safePathJoin') ||
                             serverCode.includes('safe_path_join');
    
    if (!hasStringConversion) {
      if (language?.toLowerCase().includes('typescript')) {
        issues.push('Path operations (path.join, path.resolve) should use String() conversion for all arguments');
      } else if (language?.toLowerCase().includes('python')) {
        issues.push('Path operations (os.path.join) should use str() conversion for all arguments');
      }
    }
  }

  // Check for TypeScript-specific requirements
  if (language?.toLowerCase().includes('typescript')) {
    // TypeScript-specific checks
    if (!serverCode.includes('import { McpServer }')) {
      issues.push('Should import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"');
    }
    
    if (!serverCode.includes('StdioServerTransport')) {
      issues.push('No StdioServerTransport import found');
    }
    
    if (!serverCode.includes('.js"')) {
      issues.push('Imports should use .js extension for ES modules compatibility');
    }
    
    if (!serverCode.includes('z.')) {
      issues.push('Should use Zod (z) for parameter validation');
    }
    
    // Check for try/catch error handling
    if (!serverCode.includes('try {') || !serverCode.includes('catch (')) {
      issues.push('Missing try/catch error handling');
    }
    
    // Check for error type handling in TypeScript
    const hasExplicitErrorAny = serverCode.includes('catch (error: any') || 
                              serverCode.includes('error: Error | any') ||
                              serverCode.includes('error: any');
    
    if (!hasExplicitErrorAny && serverCode.includes('catch (')) {
      issues.push('Error types in catch blocks should use "any" type (e.g., catch (error: any) or error: Error | any)');
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
3. Add proper error handling with try/catch blocks
4. CRITICAL: Always use 'any' type for error variables in catch blocks: catch (error: any) { ... }
5. Implement type guards for validating tool arguments
6. Use ES modules syntax with "type": "module" in package.json
7. Prefer async/await over callbacks
8. Use proper TypeScript configurations for NodeNext modules
9. CRITICAL: Implement all search functions with case-insensitivity using .toLowerCase() on both the search term and the target
10. IMPORTANT: For complex or unknown types, use 'any' type to avoid compilation errors:
   - Use ': any' when declaring variables with unknown types
   - Use 'as any' for type assertions when working with external libraries
   - Use '<any>' for generic type parameters when specific types are not known
   - Add 'Record<string, any>' for objects with unknown property types
   - Define error types as 'any' or 'Error | any' in all functions that might throw errors
11. CRITICAL: For path operations, ALWAYS use String() conversion:
   - path.join(baseDir, String(variable)) to avoid string | string[] type errors
   - Use helper functions like safePathJoin to handle mixed type arguments
   - Always use explicit String() conversion, NOT toString() which can fail on null/undefined
   - When working with Obsidian vault paths, always use String() conversion
12. CRITICAL: For fs.promises.readdir and other fs functions, ALWAYS use String() conversion:
   - fs.promises.readdir(String(directory)) to prevent 'Argument of type string | string[] is not assignable to parameter of type PathLike' errors
`;
  } else if (language?.toLowerCase().includes('python')) {
    additionalGuidance = `
When refining Python MCP server implementations:
1. Use modern Python async/await syntax
2. Add proper type annotations using Python type hints
3. Implement proper error handling
4. Follow PEP 8 style guidelines
5. Add docstrings for public functions and classes
6. CRITICAL: Implement all search functions with case-insensitivity using .lower() or re.IGNORECASE flag
7. For complex type annotations, use 'Any' from the typing module
8. For path operations, always use str() conversion:
   - os.path.join(base_dir, str(variable)) to handle mixed types
   - Use helper functions like safe_path_join to convert all parts to strings
   - Always check types before combining paths
`;
  } else {
    additionalGuidance = `
Regardless of implementation language:
CRITICAL: Ensure all search functionality uses case-insensitive matching to avoid errors when users input mixed-case search terms. This is especially important for:
1. File name searching and matching
2. Content search within files
3. Path comparison and resolution
4. String equality checks for user input

For TypeScript specifically:
1. Use 'any' type for unknown or complex types to avoid compilation errors
2. Add type assertions with 'as any' when working with external libraries or JSON data
3. Use type guards to safely narrow types after using 'any' or 'unknown'
4. IMPORTANT: When using path.join(), ALWAYS convert all arguments to strings with String()
5. For Obsidian vault paths handling, always use String() to convert note names or paths

For Python specifically:
1. Use str() conversion with os.path.join for all path components
2. Check types with isinstance() before operations
3. Implement helper functions for path operations
`;
  }

  return `
Your initial implementation is good, but needs the following refinements:

${issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}

${additionalGuidance}

Please refine the implementation to address these issues, with special attention to making all search functionality case-insensitive and handling types appropriately to avoid TypeScript errors.
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
    "express": "^4.17.1",
    "zod": "^3.22.4"
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
    "express": "^4.17.1",
    "zod": "^3.22.4"
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

  // Use OpenAI's API to generate server code
  let serverCode: string;
  
  try {
    // Use OpenAI API if available
    if (process.env.OPENAI_API_KEY) {
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      console.log("Generating MCP server code using OpenAI...");
      
      // Load additional documentation
      const llmTextDocs = readDocFile('llm-text.md');
      const mcpDocs = readDocFile('mcp-docs.md');
      
      // Add documentation to the prompt
      const fullPromptWithDocs = `
${fullPrompt}

## Additional Implementation Documentation

### MCP Protocol Guidelines
${llmTextDocs}

### MCP Implementation Details
${mcpDocs}
`;
      
      // Log the full prompt being sent to the LLM
      logPrompt(fullPromptWithDocs, {
        userDescription,
        targetClients,
        authRequirements,
        deploymentPreference,
        languagePreference
      });
      
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06", // Using GPT-4o for sophisticated code generation
        messages: [
          {
            role: "system",
            content: `You are an expert MCP (Model Context Protocol) server developer. Your task is to create a complete, production-ready MCP server implementation tailored to the specific requirements provided.
            
Follow these guidelines to create high-quality code:

1. MODERN MCP SDK USAGE:
   - Use the modern McpServer API from the TypeScript SDK (@modelcontextprotocol/sdk/server/mcp.js)
   - Use server.tool() for defining tools (not setRequestHandler)
   - Use server.resource() for defining resources (with ResourceTemplate where appropriate)
   - Use Zod (z) for parameter validation
   - Example:
     \`\`\`typescript
     import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
     import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
     import { z } from "zod";

     const server = new McpServer({
       name: "example-server",
       version: "1.0.0"
     });

     server.tool(
       "tool_name",
       { param1: z.string().describe("Description"), param2: z.number() },
       async ({ param1, param2 }) => ({
         content: [{ type: "text", text: "Result" }]
       })
     );
     \`\`\`

2. TOOL DESIGN:
   - Give tools descriptive, specific names (e.g., "file_read" instead of "read")
   - Write detailed descriptions (3-5 lines minimum) for each tool that thoroughly explain:
     * What the tool does in detail
     * When to use it (best use cases)
     * What parameters it accepts
     * What responses it returns
   - Include precise parameter descriptions with Zod validators

3. CODE QUALITY:
   - Generate complete, ready-to-run code in ${languagePreference}
   - Add thorough error handling with specific error messages
   - Implement rate limiting when appropriate
   - Add comprehensive parameter validation
   - Include proper TypeScript typing throughout
   - For any external API, include necessary authentication handling
   - IMPORTANT: When types are not known or complex, use 'any' type to avoid type errors
   - CRITICAL: Always define error types as 'any' in TypeScript implementations to avoid type errors

4. TECHNICAL REQUIREMENTS:
   - For TypeScript, use .js extension in imports for ESM compatibility
   - Include proper NodeJS error handling
   - Follow MCP protocol specifications exactly
   - Make server code that can be deployed and run immediately
   - Implement the exact functionality requested in the description
   - CRITICAL: For interfaces or types that might cause TypeScript errors, default to 'any' type
   - Use type assertions (as any) when necessary to avoid compilation errors
   - IMPORTANT: Never use top-level await in CommonJS modules - always wrap async code in functions
   - Use proper async function wrappers with explicit function calls to avoid top-level await errors
   - CRITICAL: Always define error variables as 'any' or 'Error | any' to handle all error types safely

5. SEARCH FUNCTIONALITY:
   - IMPORTANT: Make ALL search functions case-insensitive by default
   - When implementing string matching or file search functions, always use case-insensitive comparisons
   - For regular expressions, always include the 'i' flag for case insensitivity
   - For filesystem operations (especially for Obsidian vault access), handle path and filename comparisons in a case-insensitive manner
   - For content searching, implement fuzzy matching with case-insensitivity
   - Test all search functions to ensure they work with mixed case input

6. TYPE SAFETY:
   - Ensure TypeScript code compiles without errors
   - For unknown or complex external library types, use 'any' type
   - When working with JSON or untyped data, use appropriate type guards or assertions
   - Prefer 'unknown' over 'any' when parsing external data, then use type guards
   - For callback functions with complex signatures, use 'any' for parameters when specific types are not clear
   - CRITICAL: For union types like 'string | string[]', always add type guards or use Array.isArray() to handle both cases
   - When functions expect strings, explicitly convert arrays to strings when needed (e.g., using .join())
   - Use type narrowing techniques to safely handle different possible types
   - CRITICAL: ALWAYS use 'any' type for error variables in catch blocks: catch (error: any) or catch (error) when dealing with errors

7. MODULE STRUCTURE:
   - For TypeScript code, ensure proper module configuration in package.json ("type": "module")
   - If using CommonJS format, NEVER use top-level await statements
   - Always properly wrap async code in functions and call those functions
   - For Python, use proper asyncio structure with asyncio.run() to start async functions

8. COMMON TYPE ERROR PREVENTION:
   - Always handle 'string | string[]' errors with proper type guards: Array.isArray(value) ? value.join(',') : value
   - Check for null and undefined before accessing properties: value?.property or value && value.property
   - When working with parameters, validate types before using them
   - Always initialize variables with appropriate default values
   - Use optional chaining (?.) and nullish coalescing (??) operators to handle potential undefined values
   - CRITICAL: When using path.join(), ALWAYS convert all arguments to strings: path.join(dir, String(filename))
   - CRITICAL: For fs.promises.readdir() and similar fs.promises functions, ALWAYS use String() conversion: fs.promises.readdir(String(directory)) to prevent 'Argument of type string | string[] is not assignable to parameter of type PathLike' errors
   - For any Node.js path operations (path.join, path.resolve, etc.), explicitly cast parameters to string using String()
   - Prefer explicit String() conversion over toString() to avoid null/undefined errors
   - CRITICAL: Use 'error: any' or just 'error' (without type) in all catch blocks to ensure compatibility with all error types

9. KNOWLEDGE TOOL INTEGRATION:
   - For knowledge base tools (Obsidian, Notion, etc.), NEVER include a hardcoded default path with a specific user directory
   - Use a pattern like: const KNOWLEDGE_BASE_PATH = providedPath || process.env.KNOWLEDGE_BASE_PATH || "./docs"
   - For file path parameters, make it clear in the description that users must specify their own path
   - Example: filePath: z.string().describe("Path to the file within your knowledge base. You must specify the path to your document storage.")
   - Clearly communicate in tool descriptions that users need to provide their document storage path
   - Make all path parameters required by default, with clear instructions that they need to be specified
   - Implement path validation to ensure users provide valid paths
   - For document/note paths, design the interface to ask for the path if not provided
   - Keep tool naming generic (e.g., use "kb_read" instead of "obsidian_read")

10. SECURITY AND ARCHITECTURE BEST PRACTICES:
   - Implement thorough path validation to prevent directory traversal attacks
   - Normalize paths with path.normalize() and handle case-sensitivity issues
   - Add command-line argument parsing for configuration values instead of hardcoding
   - Create security utilities like validatePath() to ensure files are only accessed within allowed directories
   - Handle symlinks securely with fs.realpath() to prevent access outside allowed directories
   - Implement configurable limits (e.g., SEARCH_LIMIT) to prevent performance issues with large datasets
   - Use batch processing for operations on multiple files to prevent memory issues
   - Organize code with clear separation of concerns (validation, business logic, API handling)
   - Add informative error messages that don't leak sensitive information
   - Implement proper logging with console.error for server operations and diagnostics
   - Support functionality to work with multiple files in a single operation when appropriate

11. PERFORMANCE OPTIMIZATION:
   - Use asynchronous operations with Promise.all for parallel processing when appropriate
   - Add pagination or result limits for functions that might return large datasets
   - Implement caching for frequently accessed data or expensive operations
   - Use streams for reading large files instead of loading entire files into memory
   - Add early termination options for expensive operations
   - Include options to filter results to reduce data transfer
   - Use appropriate data structures for fast lookups and searches
   - Consider adding command-line flags for performance tuning and debug options

The output should be ONLY the code with NO explanations, markdown formatting, or additional text outside the code. Focus on creating production-ready code that closely resembles real-world examples.`
          },
          {
            role: "user",
            content: fullPromptWithDocs
          }
        ],
        temperature: 0.2, // Lower temperature for more deterministic code generation
        max_tokens: 4000,
      });
      
      // Extract the generated code
      serverCode = chatCompletion.choices[0]?.message?.content || '';
      
      // Clean up the code (remove markdown formatting if present)
      serverCode = cleanGeneratedCode(serverCode);
    } else {
      console.log("OpenAI API key not found, using fallback template");
      serverCode = getTemplateServerCode(languagePreference);
    }
  } catch (error) {
    console.error("Error generating server code with LLM:", error);
    // Fallback to template if LLM generation fails
    serverCode = getTemplateServerCode(languagePreference);
  }

  // Validate the generated server code
  const validationResults = validateMcpCompliance(serverCode, languagePreference);
  
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

/**
 * Clean up generated code by removing markdown code blocks if present
 */
function cleanGeneratedCode(code: string): string {
  // Check if the code is wrapped in markdown code blocks
  const markdownMatch = code.match(/```(?:typescript|javascript|python|ts|js|py)?\n([\s\S]*?)\n```/);
  if (markdownMatch) {
    return markdownMatch[1];
  }
  return code;
}

/**
 * Get the template server code as a fallback
 */
function getTemplateServerCode(languagePreference: string): string {
  if (languagePreference.toLowerCase().includes('typescript')) {
    return `#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Type definitions with fallbacks to 'any' for potentially unknown types
type SearchResult = {
  matches: string[];
  totalCount: number;
  metadata?: Record<string, any>; // Using 'any' for unknown metadata types
};

// Generic result handler for various response types
type ResponseHandler<T = any> = (data: T) => Promise<void>;

// Helper functions for type safety
// Safely handle string or string[] union types
function ensureString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value || '';
}

// Safely handle potentially undefined arrays
function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

// Safely join paths with proper type handling
function safePathJoin(base: string, ...parts: (string | string[] | undefined)[]): string {
  // Convert each part to string safely
  const safeParts = parts.map(part => {
    if (part === undefined || part === null) {
      return '';
    }
    // Explicitly convert to String to avoid type errors
    return String(part);
  });
  
  return path.join(base, ...safeParts);
}

// Initialize the server
const server = new McpServer({
  name: "example-mcp-server",
  version: "1.0.0"
});

// Define search tool with case-insensitive functionality
server.tool(
  "file_search",
  { 
    query: z.string().describe("Search term to find in files"),
    directory: z.string().default(".").describe("Directory to search in (defaults to current directory)"),
    extensions: z.union([z.string(), z.array(z.string())]).optional()
      .describe("File extensions to search (e.g., 'md' or ['md', 'txt'])")
  },
  async ({ query, directory, extensions }) => {
    try {
      // Convert query to lowercase for case-insensitive comparison
      const queryLower = query.toLowerCase();
      
      // Handle extensions parameter which could be string or string[]
      const extensionList = ensureArray(extensions);
      
      // Log safely using proper type handling
      console.error(\`Searching for "\${query}" in \${directory} with extensions: \${Array.isArray(extensions) ? extensions.join(', ') : extensions || 'any'}\`);
      
      // Simple file search implementation (would be more sophisticated in production)
      // IMPORTANT: Use String() to avoid 'Argument of type string | string[] is not assignable to parameter of type PathLike' errors
      const files = await fs.readdir(String(directory));
      const matchingFiles = files.filter(file => {
        // Case-insensitive comparison
        const matchesQuery = file.toLowerCase().includes(queryLower);
        
        // Check extensions if specified
        if (extensionList.length > 0) {
          const fileExt = path.extname(file).toLowerCase().replace('.', '');
          return matchesQuery && extensionList.some(ext => 
            ext.toLowerCase() === fileExt
          );
        }
        
        return matchesQuery;
      });
      
      // Create a properly typed result with fallback to any for complex structures
      const result: SearchResult = {
        matches: matchingFiles,
        totalCount: matchingFiles.length,
        metadata: {} // Type is Record<string, any> so can accept any metadata
      };
      
      // Process the result (using 'as any' for flexibility)
      const processedResult = processSearchResult(result as any);
      
      return {
        content: [
          {
            type: "text",
            text: \`Found \${matchingFiles.length} files matching "\${query}":\n\${matchingFiles.join("\\n")}\`
          }
        ]
      };
    } catch (error: any) { // IMPORTANT: Using 'any' type for error to handle all possible error types
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
  }
);

// Knowledge base file reading tool - demonstrates proper path handling
server.tool(
  "kb_read",
  { 
    document_path: z.union([z.string(), z.array(z.string())])
      .describe("Path to the document within your knowledge base - can be string or array of path segments"),
    kb_path: z.string()
      .describe("Path to your knowledge base. You must specify the full path to your document storage.")
  },
  async ({ document_path, kb_path }) => {
    try {
      // Use provided knowledge base path - no default fallback to avoid hardcoded paths
      const KNOWLEDGE_BASE_PATH = kb_path;
      
      // IMPORTANT: Use String() to avoid type errors with path.join
      // This is the proper way to handle string | string[] union types with path operations
      const filePath = path.join(KNOWLEDGE_BASE_PATH, String(document_path));
      
      // Read the document content
      const content = await fs.readFile(filePath, 'utf-8');
      
      return {
        content: [
          {
            type: "text",
            text: \`Content of document "\${document_path}":\n\${content}\`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: \`Error reading document: \${error instanceof Error ? error.message : String(error)}\`
          }
        ],
        isError: true
      };
    }
  }
);

// Example function showing proper error handling and type handling
function processSearchResult(result: any): any {
  try {
    // Safe type checking
    if (typeof result !== 'object' || result === null) {
      return { processed: false, error: 'Invalid result type' };
    }
    
    // Use any to avoid type errors with unknown properties
    const metadata: Record<string, any> = result.metadata || {};
    
    return {
      processed: true,
      count: result.totalCount || 0,
      enhancedMetadata: {
        ...metadata,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    // Proper error handling
    console.error('Error processing result:', error);
    return { processed: false, error: String(error) };
  }
}

// Define content search tool with case-insensitive functionality
server.tool(
  "content_search",
  { 
    query: z.string().describe("Text to search for within files"),
    filePath: z.union([z.string(), z.array(z.string())])
      .describe("Path(s) to the file(s) to search - can be a single path or an array of paths")
  },
  async ({ query, filePath }) => {
    try {
      // Handle filePath which could be string or string[]
      const filePaths = ensureArray(filePath);
      
      // Case-insensitive search
      const queryLower = query.toLowerCase();
      let allMatches: string[] = [];
      
      // Process each file
      for (const path of filePaths) {
        try {
          // Read file content
          const content = await fs.readFile(path, 'utf-8');
          const lines = content.split('\\n');
          const fileMatches: string[] = [];
          
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(queryLower)) {
              fileMatches.push(\`\${path} (Line \${i+1}): \${lines[i].trim()}\`);
            }
          }
          
          allMatches = [...allMatches, ...fileMatches];
        } catch (fileError) {
          allMatches.push(\`Error reading \${path}: \${fileError instanceof Error ? fileError.message : String(fileError)}\`);
        }
      }
      
      return {
        content: [
          {
            type: "text",
            text: allMatches.length > 0 
              ? \`Found \${allMatches.length} matches for "\${query}":\n\${allMatches.join("\\n")}\`
              : \`No matches found for "\${query}" in specified file(s)\`
          }
        ]
      };
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
  }
);

// Basic sample tool
server.tool(
  "sample_tool",
  { 
    input: z.string().describe("Input text to process"),
    tags: z.union([z.string(), z.array(z.string())]).optional()
      .describe("Optional tags for categorization - can be a single tag or multiple tags")
  },
  async ({ input, tags }) => {
    try {
      // Handle the string | string[] union type safely
      const tagList = ensureArray(tags);
      const tagsDisplay = tagList.length > 0 ? \`with tags: \${tagList.join(', ')}\` : 'without tags';
      
      return {
        content: [
          {
            type: "text",
            text: \`Tool executed with input: \${input} \${tagsDisplay}\`
          }
        ]
      };
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
  }
);

// Helper function for parsing data with unknown structure
async function parseDataSafely(data: unknown): Promise<Record<string, any>> {
  // Using any as fallback for unknown structures
  let result: Record<string, any> = {};
  
  try {
    if (typeof data === 'string') {
      result = JSON.parse(data) as Record<string, any>;
    } else if (data && typeof data === 'object') {
      result = data as Record<string, any>;
    }
  } catch (error) {
    console.error('Error parsing data:', error);
  }
  
  return result;
}

// Define a resource
server.resource(
  "sample_resource",
  new ResourceTemplate("file:///sample/{filename}", { list: undefined }),
  async (uri, { filename }) => {
    if (filename.toLowerCase() === "resource.txt") { // Case-insensitive matching
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: "This is a sample resource content."
          }
        ]
      };
    }
    return { contents: [] };
  }
);

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

// Call the async function to start the server
// This avoids using top-level await which isn't supported in CommonJS modules
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});`;
  } else {
    // Python implementation (fallback)
    return `
# Sample MCP Server Implementation in Python
# This is a placeholder - in production, this would be generated by an LLM

from modelcontextprotocol import Server, Transport, ListResourcesRequestSchema, ReadResourceRequestSchema, ListToolsRequestSchema, CallToolRequestSchema
import os
import re
import json
import asyncio
from typing import Any, Dict, List, Optional, Union, cast
from modelcontextprotocol.transports import StdioTransport

# Helper functions for type safety
def ensure_string(value: Union[str, List[str], None]) -> str:
    """Convert a potential string or list of strings to a single string."""
    if value is None:
        return ""
    if isinstance(value, list):
        return ",".join(value)
    return value

def ensure_list(value: Union[Any, List[Any], None]) -> List[Any]:
    """Convert a value to a list if it's not already."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]

# Safe path joining
def safe_path_join(base: str, *parts: Any) -> str:
    """Safely join paths, converting all parts to strings."""
    safe_parts = []
    for part in parts:
        if part is None:
            continue
        # Convert each part to string to avoid type errors
        safe_parts.append(str(part))
    return os.path.join(base, *safe_parts)

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
    # Case-insensitive comparison for resource URI
    if uri.lower() == "file:///sample/resource.txt".lower():
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

# Safe parsing function for unknown data structures
def parse_data_safely(data: Any) -> Dict[str, Any]:
    """Parse data of unknown structure, using Any type for flexibility."""
    result: Dict[str, Any] = {}
    
    try:
        if isinstance(data, str):
            result = json.loads(data)
        elif isinstance(data, dict):
            result = data
    except Exception as e:
        print(f"Error parsing data: {e}")
    
    return result

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
                        "input": {"type": "string"},
                        "tags": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}}
                            ]
                        }
                    },
                    "required": ["input"]
                }
            },
            {
                "name": "file_search",
                "description": "Search for files with case-insensitive matching",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Search term to find in files"},
                        "directory": {"type": "string", "description": "Directory to search in"},
                        "extensions": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}}
                            ],
                            "description": "File extensions to search (can be single string or array)"
                        }
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "content_search",
                "description": "Search for text within files with case-insensitive matching",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Text to search for"},
                        "filePath": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}}
                            ],
                            "description": "Path to file(s) to search in - can be a single path or array of paths"
                        }
                    },
                    "required": ["query", "filePath"]
                }
            }
        ]
    }

@server.request_handler(CallToolRequestSchema)
async def call_tool(request):
    tool_name = request.params.name
    arguments = request.params.arguments
    
    if tool_name == "sample_tool":
        input_value = arguments.get("input", "")
        tags = arguments.get("tags", [])
        
        # Handle string or list of strings
        tag_list = ensure_list(tags)
        tags_display = f"with tags: {', '.join(tag_list)}" if tag_list else "without tags"
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": f"Tool executed with input: {input_value} {tags_display}"
                }
            ]
        }
    elif tool_name == "content_search":
        query = arguments.get("query", "")
        file_paths = arguments.get("filePath", "")
        
        # Handle string or list of file paths
        path_list = ensure_list(file_paths)
        
        try:
            all_matches = []
            
            for file_path in path_list:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Case-insensitive content search using regex with 'i' flag
                    pattern = re.compile(re.escape(query), re.IGNORECASE)
                    lines = content.split('\\n')
                    
                    for i, line in enumerate(lines):
                        if pattern.search(line):
                            all_matches.append(f"{file_path} (Line {i+1}): {line.strip()}")
                            
                except Exception as file_error:
                    all_matches.push(\`Error reading \${file_path}: \${file_error}\`);
              
              return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Found \${len(all_matches)} instances of '{query}'" + 
                               (f":\\n{chr(10).join(all_matches)}" if all_matches else "")
                    }
                ]
            }
        except Exception as e:
            return {
                "isError": True,
                "content": [
                    {
                        "type": "text",
                        "text": f"Error in content search: \${str(e)}"
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

# Define async main function to properly handle async operations
async def main():
    transport = StdioTransport()
    await server.connect(transport)
    print("MCP Server connected and running on stdio", file=sys.stderr)

# Main entry point
if __name__ == "__main__":
    import sys
    
    # Use asyncio to run the main function without top-level await
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Fatal error: \${e}", file=sys.stderr)
        sys.exit(1)
`;
  }
} 