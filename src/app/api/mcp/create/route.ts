import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Make sure to set this in your environment variables
});

// Placeholder for database interaction
const mockDatabase: Record<string, { config: string; createdAt: Date }> = {};

// Function to read file contents
async function readFileContent(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    return fs.readFileSync(absolutePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return `Error reading file: ${filePath}`;
  }
}

// Generate MCP config using ChatGPT API
async function generateMcpConfig(input: string): Promise<string> {
  try {
    console.log(`Generating MCP config for: ${input}`);
    
    // Read the content of the three files
    const mcpDocsContent = await readFileContent('mcp-docs.md');
    const llmTextContent = await readFileContent('llm-text.md');
    const promptContent = await readFileContent('prompt.md');
    
    // Create a prompt for ChatGPT
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates MCP (Multi-agent Collaboration Protocol) configurations based on provided documentation and user input."
        },
        {
          role: "user",
          content: `I want to create an MCP configuration. Here's the documentation and my input:
          
## MCP Documentation
${mcpDocsContent.substring(0, 4000)}... (truncated for brevity)

## LLM Text
${llmTextContent.substring(0, 4000)}... (truncated for brevity)

## Prompt
${promptContent}

## User Input
${input}

Based on the above documentation and my input, please generate a complete MCP configuration in JSON format. The configuration should include appropriate resources, tools, prompts, and metadata sections.`
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

    // Simulate user validation (replace with actual Supabase Auth check)
    console.log(`Validating user: ${userId}`);

    const config = await generateMcpConfig(input);
    const mcpId = uuidv4();

    // Simulate storing in database (replace with actual Supabase DB call)
    mockDatabase[mcpId] = { config, createdAt: new Date() };
    console.log(`MCP created with ID: ${mcpId}`);

    return NextResponse.json({ mcpId, config });
  } catch (error) {
    console.error('Error creating MCP:', error);
    return NextResponse.json({ error: 'Failed to create MCP configuration' }, { status: 500 });
  }
}
