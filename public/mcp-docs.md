# MCP Server Implementation Guide

## Core Components

### 1. Server Object
The central component of an MCP server implementation is the `McpServer` object, which manages all capabilities and handles connections.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0"
});
```

### 2. Tools
Tools are functions that can be called by the LLM client to perform actions or retrieve computed results.

```typescript
import { z } from "zod";

server.tool(
  "file_read", // Tool name (category_action format)
  { 
    // Parameters with Zod validation
    path: z.string().describe("File path to read"),
    encoding: z.enum(["utf8", "base64"]).default("utf8").describe("File encoding")
  },
  // Implementation function
  async ({ path, encoding }) => {
    try {
      const content = await fs.promises.readFile(path, encoding);
      return {
        content: [{ type: "text", text: content }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error reading file: ${error.message}` }],
        isError: true
      };
    }
  }
);
```

Each tool must:
- Have a descriptive name in `category_action` format
- Define parameters using Zod schemas with descriptions
- Return structured content in the format: `{ content: [{ type: "text", text: "..." }] }`
- Handle errors and return `isError: true` when errors occur

### 3. Resources
Resources are file-like objects that provide data to the LLM client.

```typescript
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

// Static resource
server.resource(
  "config", // Resource name
  "config://app", // URI pattern
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify({ version: "1.0.0" })
    }]
  })
);

// Dynamic resource with templated URI
server.resource(
  "user_profile",
  new ResourceTemplate("user://{userId}/profile", { list: undefined }),
  async (uri, { userId }) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify({ id: userId, name: "Example User" })
    }]
  })
);
```

Resources must:
- Have a unique URI pattern
- Return contents with proper MIME types
- Handle URI parameters when using templates
- Properly escape content based on the MIME type

### 4. Prompts
Prompts are templates that guide LLM responses on specific topics.

```typescript
server.prompt(
  "code_review",
  { 
    code: z.string().describe("Code to review"), 
    language: z.string().describe("Programming language")
  },
  ({ code, language }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please review this ${language} code and suggest improvements:\n\n${code}`
      }
    }]
  })
);
```

### 5. Transport
The transport layer handles communication between the client and server.

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// For command-line tools
const transport = new StdioServerTransport();
await server.connect(transport);

// For HTTP SSE (Server-Sent Events)
import express from 'express';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const app = express();
const transports = {};

app.get("/sse", async (_, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found');
  }
});

app.listen(3000);
```

## Advanced Features

### Error Handling
Implement comprehensive error handling to provide clear feedback:

```typescript
try {
  // Implementation
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
```

### Authentication and Security
For sensitive operations, implement proper authentication:

```typescript
server.tool(
  "db_query",
  { 
    query: z.string().describe("SQL query"),
    apiKey: z.string().describe("API key for authentication")
  },
  async ({ query, apiKey }) => {
    if (!validateApiKey(apiKey)) {
      return {
        content: [{ type: "text", text: "Unauthorized: Invalid API key" }],
        isError: true
      };
    }
    
    // Execute query
  }
);
```

### Rate Limiting
Implement rate limiting for resource-intensive operations:

```typescript
const rateLimits = {
  perMinute: 10,
  lastReset: Date.now(),
  count: 0
};

function checkRateLimit() {
  const now = Date.now();
  if (now - rateLimits.lastReset > 60000) {
    rateLimits.count = 0;
    rateLimits.lastReset = now;
  }
  
  if (rateLimits.count >= rateLimits.perMinute) {
    throw new Error("Rate limit exceeded");
  }
  
  rateLimits.count++;
}
```

## Client Configurations

### Claude Desktop Configuration
```json
{
  "servers": [
    {
      "name": "example-mcp-server",
      "command": "/path/to/node",
      "args": ["/path/to/server.js"]
    }
  ]
}
```

### Cursor AI Configuration
```json
{
  "mcp": {
    "servers": [
      {
        "name": "example-mcp-server",
        "transport": "stdio",
        "command": "node",
        "args": ["path/to/server.js"]
      }
    ]
  }
} 