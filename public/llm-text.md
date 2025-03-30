# MCP Protocol Guidelines for AI-Generated Servers

## Protocol Overview
The Model Context Protocol (MCP) enables AI systems to access external information and functionality through standardized interfaces. MCP servers expose three core capabilities:

1. **Resources**: File-like objects that provide data (read-only)
2. **Tools**: Functions that can be invoked to perform actions or compute results
3. **Prompts**: Templates that guide LLM responses on specific topics

## Key Principles
- Use declarative definitions over imperative code where possible
- Design clear, self-documenting interfaces for AI interaction
- Follow naming conventions for tools: `<category>_<action>` (e.g., `file_read`, `web_search`)
- Provide detailed descriptions for all components
- Include proper error handling and validation

## TypeScript SDK Implementation
The latest TypeScript SDK uses a modern, fluent API with these key components:

```typescript
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // For parameter validation

// Initialize server
const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

// Define tool with Zod schema
server.tool(
  "weather_forecast", // Follow category_action naming
  { 
    location: z.string().describe("City or location name"), 
    days: z.number().min(1).max(7).default(3).describe("Number of forecast days")
  },
  async ({ location, days }) => {
    try {
      // Tool implementation
      return {
        content: [{ type: "text", text: `Weather forecast for ${location}...` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Define resource with templated URI
server.resource(
  "documentation",
  new ResourceTemplate("docs://{topic}", { list: undefined }),
  async (uri, { topic }) => ({
    contents: [{
      uri: uri.href,
      mimeType: "text/plain",
      text: `Documentation for: ${topic}`
    }]
  })
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Best Practices
1. **Tool Design**:
   - Name tools descriptively: `<category>_<action>`
   - Write multi-line descriptions that explain purpose, usage, parameters, and returns
   - Validate parameters with Zod schemas
   - Handle errors gracefully and return meaningful error messages

2. **Resource Design**:
   - Use templated URIs for dynamic resources
   - Provide appropriate MIME types
   - Organize resources hierarchically
   - Use caching when appropriate

3. **Code Structure**:
   - Follow ES module conventions
   - Include proper error handling
   - Use async/await for asynchronous operations
   - Document code with comments 