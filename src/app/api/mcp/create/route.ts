import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { generateMcpServer } from '@/lib/mcpServerGenerator';
import { createMcp } from '@/lib/mockDatabase';
import { checkSubscription, recordMcpUsage } from '@/app/api/middleware/checkSubscription';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Make sure to set this in your environment variables
});

// Function to generate a concise name for the MCP
async function generateMcpName(description: string): Promise<string> {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a naming expert. Generate a short, concise, and descriptive name (max 3-4 words) for an MCP (Model Context Protocol) server based on its description. The name should be clear and professional, focusing on the main functionality. Don't use special characters except hyphens if needed."
        },
        {
          role: "user",
          content: `Generate a short name for this MCP server: ${description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const generatedName = chatCompletion.choices[0]?.message?.content?.trim() || 'Untitled MCP';
    // Ensure the name is not too long
    return generatedName.substring(0, 50);
  } catch (error) {
    console.error('Error generating MCP name:', error);
    return 'Untitled MCP';
  }
}

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

  // More comprehensive matching patterns
  const clientMatches = {
    claude: input.match(/claude|anthropic|desktop/gi),
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
  if (input.match(/cloud|remote|online|web|hosted|deploy|server/gi)) {
    deploymentPreference = 'cloud';
  }
  if (input.match(/both|local and cloud|cloud and local/gi)) {
    deploymentPreference = 'both';
  }
  if (input.match(/local|desktop|my computer|my machine|locally/gi)) {
    // If explicitly mentioned local, prioritize that over cloud
    deploymentPreference = 'local';
  }

  // More comprehensive language preference parsing
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
    (languageMatches.typescript && languageMatches.typescript.length > 0)
  ) {
    languagePreference = 'TypeScript';
  } else if (
    (languageMatches.javascript && languageMatches.javascript.length > 0) ||
    (languageMatches.node && languageMatches.node.length > 0)
  ) {
    languagePreference = 'JavaScript';
  }

  // More comprehensive authentication requirements parsing
  let authRequirements = 'None specified';
  if (input.match(/auth|authentication|login|secure|credentials/gi)) {
    authRequirements = 'Requires authentication';
  }
  if (input.match(/api key|apikey|token|secret|password/gi)) {
    authRequirements = 'Requires API key or token';
  }
  if (input.match(/oauth|oauth2|google auth|github auth|social login/gi)) {
    authRequirements = 'Requires OAuth';
  }

  // Extract specific features mentioned in the input
  const features = [];
  if (input.match(/file|directory|folder|path|read file|write file/gi)) features.push('file access');
  if (input.match(/database|sql|postgres|mysql|mongodb|sqlite/gi)) features.push('database access');
  if (input.match(/web|http|api|rest|fetch|axios/gi)) features.push('web API access');
  if (input.match(/image|photo|picture|vision/gi)) features.push('image processing');
  if (input.match(/chat|conversation|message/gi)) features.push('conversation management');
  if (input.match(/obsidian|vault|note|markdown/gi)) features.push('obsidian integration');
  if (input.match(/pdf|document/gi)) features.push('PDF processing');
  if (input.match(/code|git|github|repository/gi)) features.push('code analysis');
  if (input.match(/search|find|query/gi)) features.push('search capabilities');

  // Add features to the description for better LLM context
  let enhancedDescription = input;
  if (features.length > 0) {
    enhancedDescription += `\n\nDetected features: ${features.join(', ')}`;
  }

  return {
    serverDescription: enhancedDescription,
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
    
    // Extract tools from the server code
    const toolsMatch = serverPackage.serverCode.match(/server\.tool\([\s\S]*?\)/g);
    const tools = toolsMatch ? toolsMatch.map(tool => {
      const nameMatch = tool.match(/"(.*?)"/);
      const descMatch = tool.match(/description:\s*"(.*?)"/);
      const paramsMatch = tool.match(/parameters:\s*({[\s\S]*?})/);
      
      return {
        name: nameMatch ? nameMatch[1] : '',
        description: descMatch ? descMatch[1] : '',
        parameters: paramsMatch ? JSON.parse(paramsMatch[1]) : {}
      };
    }) : [];
    
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
      tools,
      resources: [],
      prompts: []
    }, null, 2);
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

    // Check if the user has an active subscription and available MCP generations
    const subscriptionCheck = await checkSubscription(request as NextRequest, userId);
    const subscriptionData = await subscriptionCheck.json();

    // If subscription check failed, return the error
    if (!subscriptionData.success) {
      return subscriptionCheck;
    }

    // Generate the MCP configuration
    const config = await generateMcpConfig(input);
    const mcpId = uuidv4();

    // Parse the config to extract relevant information
    const configObj = JSON.parse(config);
    
    // Generate a concise name using AI
    const name = await generateMcpName(input);
    
    // Determine client and integration types from the config
    const clientType = configObj.metadata?.requirements?.targetClients?.includes('Claude Desktop') ? 'claude' : 
                     configObj.metadata?.requirements?.targetClients?.includes('Cursor AI') ? 'cursor' : 'custom';
    
    // Determine integration type based on detected features or content
    let integrationType = 'custom';
    const serverDesc = configObj.description || '';
    if (serverDesc.match(/database|sql|postgres|mysql|mongodb|sqlite/gi)) {
      integrationType = 'database';
    } else if (serverDesc.match(/api|rest|http|web|fetch/gi)) {
      integrationType = 'api';
    } else if (serverDesc.match(/file|directory|folder|path/gi)) {
      integrationType = 'files';
    }

    // Import supabase client if it wasn't already imported at the top
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized');
    }

    // Insert into mcp_projects table
    const { data, error } = await supabaseAdmin
      .from('mcp_projects')
      .insert({
        id: mcpId,
        user_id: userId,
        name: name,
        description: configObj.description || input.substring(0, 200),
        client_type: clientType,
        integration_type: integrationType,
        config: configObj,
        code: configObj.serverCode,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing MCP in Supabase:', error);
      
      // Fall back to mock database if Supabase fails
      createMcp(mcpId, { 
        config, 
        createdAt: new Date(),
        userId 
      });
      console.log(`MCP created with ID (mock): ${mcpId}`);
    } else {
      console.log(`MCP stored in Supabase with ID: ${mcpId}`);
      
      // Also create an initial version in mcp_versions
      const { error: versionError } = await supabaseAdmin
        .from('mcp_versions')
        .insert({
          project_id: mcpId,
          version: 1,
          config: configObj,
          notes: 'Initial version',
          created_at: new Date().toISOString(),
          created_by: userId
        });
        
      if (versionError) {
        console.error('Error storing MCP version in Supabase:', versionError);
      }
      
      // Record MCP usage for subscription tracking
      await recordMcpUsage(userId, mcpId);
    }

    // Return the remaining MCP generations along with the response
    return NextResponse.json({ 
      mcpId, 
      config,
      remainingGenerations: subscriptionData.remaining - 1 // Decrement by 1 to account for this generation
    });
  } catch (error) {
    console.error('Error creating MCP:', error);
    return NextResponse.json({ error: 'Failed to create MCP configuration' }, { status: 500 });
  }
}
