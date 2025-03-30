// Import necessary modules
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { exec } from 'child_process';
import { URL } from 'url';
import fetch from 'node-fetch';

// Define the MCP server configuration
const PORT = 8080;
const BRAVE_SEARCH_API_URL = 'https://api.search.brave.com/res/v1/web/search';
const BRAVE_SEARCH_API_KEY = 'YOUR_BRAVE_SEARCH_API_KEY'; // Replace with your Brave API key

// Define the MCP Tool for web search
interface MCPTool {
  name: string;
  description: string;
  parameters: { [key: string]: string };
  execute: (params: { [key: string]: string }) => Promise<any>;
}

// Define the search tool
const searchTool: MCPTool = {
  name: 'web.search',
  description: 'Performs a web search using the Brave Search API.',
  parameters: {
    query: 'The search query string.',
  },
  async execute(params) {
    const { query } = params;
    if (!query) {
      throw new Error('Query parameter is required.');
    }

    const response = await fetch(`${BRAVE_SEARCH_API_URL}?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${BRAVE_SEARCH_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },
};

// Define the MCP server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'POST' && req.url === '/execute') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { tool, params } = JSON.parse(body);
        if (tool === searchTool.name) {
          const result = await searchTool.execute(params);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', data: result }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Invalid tool name.' }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});

// Sample Claude Desktop configuration
const claudeDesktopConfig = {
  tools: [
    {
      name: 'web.search',
      description: 'Performs a web search using the Brave Search API.',
      parameters: {
        query: 'string',
      },
    },
  ],
  transport: 'stdio',
  security: {
    localExecution: true,
  },
};

// Write the configuration to a file
import { writeFileSync } from 'fs';
writeFileSync('claude_desktop_config.json', JSON.stringify(claudeDesktopConfig, null, 2));