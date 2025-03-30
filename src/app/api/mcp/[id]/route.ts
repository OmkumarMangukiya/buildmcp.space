import { NextResponse } from 'next/server';
import { getMcp, updateMcp, deleteMcp } from '@/lib/mockDatabase';

// GET /api/mcp/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // TODO: Add user validation to ensure user owns this MCP

    const mcpData = getMcp(id);

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

    if (!getMcp(id)) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    // Update the database
    updateMcp(id, { config });
    console.log(`MCP updated: ${id}`);

    return NextResponse.json({ mcpId: id, config });
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

    if (!getMcp(id)) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    // Delete from the database
    deleteMcp(id);
    console.log(`MCP deleted: ${id}`);

    return NextResponse.json({ message: 'MCP deleted successfully' });
  } catch (error) {
    console.error(`Error deleting MCP ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete MCP configuration' }, { status: 500 });
  }
}
