import { NextResponse } from 'next/server';

// Placeholder for database interaction (shared or imported)
// Ideally, this would be a proper database connection module
// For simplicity, we'll redefine it here, but in a real app, share the state.
const mockDatabase: Record<string, { config: string; createdAt: Date; userId?: string }> = {
  // Add some mock data if needed for testing GET/PUT/DELETE
  'test-uuid-123': {
    config: JSON.stringify({ description: 'Initial test MCP', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(),
    userId: 'mock-user-1'
  }
};

// GET /api/mcp/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // TODO: Add user validation to ensure user owns this MCP

    const mcpData = mockDatabase[id];

    if (!mcpData) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    return NextResponse.json({ mcpId: id, ...mcpData });
  } catch (error) {
    console.error(`Error fetching MCP ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch MCP configuration' }, { status: 500 });
  }
}

// PUT /api/mcp/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { config } = body; // Expecting updated config in the body

    if (!config) {
      return NextResponse.json({ error: 'Missing config in request body' }, { status: 400 });
    }

    // TODO: Add user validation to ensure user owns this MCP

    if (!mockDatabase[id]) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    // Simulate updating the database
    mockDatabase[id].config = config;
    console.log(`MCP updated: ${id}`);

    return NextResponse.json({ mcpId: id, config: mockDatabase[id].config });
  } catch (error) {
    console.error(`Error updating MCP ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update MCP configuration' }, { status: 500 });
  }
}

// DELETE /api/mcp/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // TODO: Add user validation to ensure user owns this MCP

    if (!mockDatabase[id]) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    // Simulate deleting from the database
    delete mockDatabase[id];
    console.log(`MCP deleted: ${id}`);

    return NextResponse.json({ message: 'MCP deleted successfully' });
  } catch (error) {
    console.error(`Error deleting MCP ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete MCP configuration' }, { status: 500 });
  }
}
