import { NextResponse } from 'next/server';
import { listMcps } from '@/lib/mockDatabase';

// GET /api/mcp
export async function GET(request: Request) {
  try {
    // TODO: Add user filtering based on authenticated user (e.g., Supabase Auth)
    // For now, return all MCPs
    const allMcps = listMcps();

    return NextResponse.json(allMcps);
  } catch (error) {
    console.error('Error fetching all MCPs:', error);
    return NextResponse.json({ error: 'Failed to fetch MCP list' }, { status: 500 });
  }
}
