#!/usr/bin/env node

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
              text: `Tool executed with input: ${input}`
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
              text: `Unknown tool: ${name}`
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
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
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
});