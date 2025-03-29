import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { generateMcpServer } from '@/lib/mcpServerGenerator';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Make sure to set this in your environment variables
});

// Placeholder for database interaction
const mockDatabase: Record<string, { config: string; createdAt: Date; userId?: string }> = {};

// MCP documentation from the project
const MCP_DOCS = `
# Model Context Protocol Documentation

## Core Concepts
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

## Protocol Specifications
- Tools must include name, description, parameters, and return types
- Resources must have content-type and data fields
- Error handling must follow protocol-defined formats
- Transport mechanisms include stdio and sse options
`;

// Prompt guidance for MCP creation
const PROMPT_GUIDANCE = `
Once you've provided the documentation, clearly describe to Claude what kind of server you want to build. Be specific about:

- What resources your server will expose
- What tools it will provide
- Any prompts it should offer
- What external systems it needs to interact with

For example:
Build an MCP server that:
- Connects to my company's PostgreSQL database
- Exposes table schemas as resources
- Provides tools for running read-only SQL queries
- Includes prompts for common data analysis tasks

Working with Claude:
- Start with the core functionality first, then iterate to add more features
- Ask Claude to explain any parts of the code you don't understand
- Request modifications or improvements as needed
- Have Claude help you test the server and handle edge cases
`;

// Parse the input to extract server requirements
function parseUserInput(input: string): {
  serverDescription: string;
  targetClients: string[];
  authRequirements: string;
  deploymentPreference: 'local' | 'cloud' | 'both';
  languagePreference?: string;
} {
  // Default values
  const defaultRequirements = {
    serverDescription: input,
    targetClients: ['Claude Desktop', 'Cursor AI'],
    authRequirements: 'None specified',
    deploymentPreference: 'local' as const,
  };

  // Basic parsing logic - this could be improved with NLP/LLM assistance in a real implementation
  const clientMatches = {
    claude: input.match(/claude|anthropic/gi),
    cursor: input.match(/cursor/gi),
    vscode: input.match(/vscode|vs code/gi),
    chatgpt: input.match(/chatgpt|gpt|openai/gi),
  };

  const targetClients = [];
  if (clientMatches.claude && clientMatches.claude.length > 0) targetClients.push('Claude Desktop');
  if (clientMatches.cursor && clientMatches.cursor.length > 0) targetClients.push('Cursor AI');
  if (clientMatches.vscode && clientMatches.vscode.length > 0) targetClients.push('VS Code');
  if (clientMatches.chatgpt && clientMatches.chatgpt.length > 0) targetClients.push('ChatGPT');
  
  // If no clients were matched, use the defaults
  if (targetClients.length === 0) {
    targetClients.push(...defaultRequirements.targetClients);
  }

  // Deployment preference parsing
  let deploymentPreference: 'local' | 'cloud' | 'both' = 'local';
  if (input.match(/cloud|remote|online|web/gi)) {
    deploymentPreference = 'cloud';
  }
  if (input.match(/both|local and cloud|cloud and local/gi)) {
    deploymentPreference = 'both';
  }

  // Language preference parsing
  let languagePreference: string | undefined;
  const languageMatches = {
    python: input.match(/python/gi),
    javascript: input.match(/javascript|js/gi),
    typescript: input.match(/typescript|ts/gi),
    node: input.match(/node\.?js/gi),
  };

  if (languageMatches.python && languageMatches.python.length > 0) {
    languagePreference = 'Python';
  } else if (
    (languageMatches.javascript && languageMatches.javascript.length > 0) ||
    (languageMatches.typescript && languageMatches.typescript.length > 0) ||
    (languageMatches.node && languageMatches.node.length > 0)
  ) {
    languagePreference = 'Node.js';
  }

  // Authentication requirements parsing
  let authRequirements = 'None specified';
  if (input.match(/auth|authentication|login|secure/gi)) {
    authRequirements = 'Requires authentication';
  }
  if (input.match(/api key|apikey|token/gi)) {
    authRequirements = 'Requires API key or token';
  }
  if (input.match(/oauth/gi)) {
    authRequirements = 'Requires OAuth';
  }

  return {
    serverDescription: input,
    targetClients,
    authRequirements,
    deploymentPreference,
    languagePreference,
  };
}

// Generate MCP config using ChatGPT API
async function generateMcpConfig(input: string): Promise<string> {
  try {
    console.log(`Generating MCP config for: ${input}`);
    
    // Parse the user input to extract requirements
    const requirements = parseUserInput(input);
    
    // Generate the MCP server
    const serverPackage = await generateMcpServer(
      requirements.serverDescription,
      requirements.targetClients,
      requirements.authRequirements,
      requirements.deploymentPreference,
      requirements.languagePreference
    );
    
    // For the UI, convert the server package to a JSON representation
    return JSON.stringify({
      description: requirements.serverDescription,
      serverCode: serverPackage.serverCode,
      clientConfigs: serverPackage.clientConfigs,
      deploymentOptions: {
        local: serverPackage.packages.local ? Object.keys(serverPackage.packages.local) : [],
        cloud: serverPackage.packages.cloud ? Object.keys(serverPackage.packages.cloud) : [],
      },
      documentation: serverPackage.documentation,
      metadata: {
        generatedBy: 'mcp-server-generator',
        timestamp: new Date().toISOString(),
        requirements,
      },
    }, null, 2);

    // The following code is kept as a fallback in case the generator fails
    /*
    // Create a prompt for the LLM
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert MCP (Model Context Protocol) server developer. Your task is to create a complete, working MCP server configuration based on the user's requirements. 
          
Follow these guidelines:
1. The configuration should include appropriate resources, tools, prompts, and metadata
2. Resources should have URIs, names, descriptions, and content types
3. Tools should have names, descriptions, parameter schemas, and return types
4. Prompts should include names, descriptions, and argument definitions
5. The output must be in valid JSON format
6. Include proper client configuration for both Claude Desktop and Cursor AI
7. Focus on creating a practical, working configuration that follows MCP standards`
        },
        {
          role: "user",
          content: `I want to create an MCP configuration. Here's the documentation and my input:
          
## MCP Documentation
${MCP_DOCS}

## Creating MCP Servers
${PROMPT_GUIDANCE}

## User Input
${input}

Based on the above documentation and my input, please generate a complete MCP configuration in JSON format. The configuration should include appropriate resources, tools, prompts, and metadata sections.

The response should be formatted as valid JSON, with no markdown formatting or additional text.`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Extract the generated config
    const generatedConfig = chatCompletion.choices[0]?.message?.content || '{}';
    
    // Ensure the response is valid JSON
    try {
      // Try to parse the response to ensure it's valid JSON
      const parsedConfig = JSON.parse(generatedConfig);
      return JSON.stringify(parsedConfig, null, 2);
    } catch (error) {
      console.error("Error parsing generated config:", error);
      // Extract JSON if it's embedded in markdown or other text
      const jsonMatch = generatedConfig.match(/```json\n([\s\S]*?)\n```/) || 
                        generatedConfig.match(/```\n([\s\S]*?)\n```/) ||
                        generatedConfig.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[1] || jsonMatch[0];
          const parsedJson = JSON.parse(extractedJson);
          return JSON.stringify(parsedJson, null, 2);
        } catch (e) {
          console.error("Error parsing extracted JSON:", e);
        }
      }
      
      // Fallback to a basic structure if parsing fails 
      return JSON.stringify({
        description: input,
        resources: [],
        tools: [],
        prompts: [],
        metadata: {
          generatedBy: 'chatgpt-fallback',
          timestamp: new Date().toISOString(),
          error: 'Failed to parse AI response',
        },
      }, null, 2);
    }
    */
  } catch (error) {
    console.error('Error generating MCP config:', error);
    // Return a fallback config in case of error
    return JSON.stringify({
      description: input,
      resources: [],
      tools: [],
      prompts: [],
      metadata: {
        generatedBy: 'error-fallback',
        timestamp: new Date().toISOString(),
        error: 'Failed to generate configuration',
      },
    }, null, 2);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, input } = body;

    if (!userId || !input) {
      return NextResponse.json({ error: 'Missing userId or input' }, { status: 400 });
    }

    // Simulate user validation (replace with actual authentication check)
    console.log(`Validating user: ${userId}`);

    const config = await generateMcpConfig(input);
    const mcpId = uuidv4();

    // Simulate storing in database (replace with actual DB call)
    mockDatabase[mcpId] = { 
      config, 
      createdAt: new Date(),
      userId 
    };
    console.log(`MCP created with ID: ${mcpId}`);

    return NextResponse.json({ mcpId, config });
  } catch (error) {
    console.error('Error creating MCP:', error);
    return NextResponse.json({ error: 'Failed to create MCP configuration' }, { status: 500 });
  }
}
