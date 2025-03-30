import { NextResponse } from 'next/server';
import { listMcps } from '@/lib/mockDatabase';
import { supabaseAdmin } from '@/lib/supaClient';

// GET /api/mcp
export async function GET(request: Request) {
  try {
    // Try to use Supabase first if available
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('mcp_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Format the response to match the expected structure
        const formattedMcps = data.map(mcp => ({
          mcpId: mcp.id,
          name: mcp.name || 'Untitled MCP',
          createdAt: mcp.created_at,
          userId: mcp.user_id
        }));
        
        return NextResponse.json(formattedMcps);
      }
      
      if (error) {
        console.warn('Error fetching MCPs from Supabase:', error);
      }
    } else {
      console.warn('Supabase admin client not available, falling back to mock database');
    }

    // Fall back to mock database
    const allMcps = listMcps();
    return NextResponse.json(allMcps);
  } catch (error) {
    console.error('Error fetching all MCPs:', error);
    return NextResponse.json({ error: 'Failed to fetch MCP list' }, { status: 500 });
  }
}
