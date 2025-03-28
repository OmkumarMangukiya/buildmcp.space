import { NextResponse } from 'next/server';

// Placeholder for database interaction (shared or imported)
const mockDatabase: Record<string, { config: string; createdAt: Date; userId?: string }> = {
  'test-uuid-123': {
    config: JSON.stringify({ description: 'Initial test MCP', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(),
    userId: 'mock-user-1'
  },
  'test-uuid-456': {
    config: JSON.stringify({ description: 'Another MCP', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    userId: 'mock-user-1'
  },
   'test-uuid-789': {
    config: JSON.stringify({ description: 'Third MCP Example', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    userId: 'mock-user-2' // Different user
  }
};

// GET /api/mcp
export async function GET(request: Request) {
  try {
    // TODO: Add user filtering based on authenticated user (e.g., Supabase Auth)
    // For now, return all MCPs
    const allMcps = Object.entries(mockDatabase).map(([id, data]) => ({
      mcpId: id,
      // Optionally parse config to get name/description for listing
      name: JSON.parse(data.config).description || `MCP ${id.substring(0, 6)}`,
      createdAt: data.createdAt,
      userId: data.userId
      // Add other relevant fields for listing
    })); //.filter(mcp => mcp.userId === currentUserId); // Example filtering

    return NextResponse.json(allMcps);
  } catch (error) {
    console.error('Error fetching all MCPs:', error);
    return NextResponse.json({ error: 'Failed to fetch MCP list' }, { status: 500 });
  }
}
