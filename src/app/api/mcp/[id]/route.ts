import { NextResponse } from 'next/server';
import { getMcp, updateMcp, deleteMcp } from '@/lib/mockDatabase';
import { supabaseAdmin } from '@/lib/supaClient';

// GET /api/mcp/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const debug = new URL(request.url).searchParams.get('debug') === 'true';
    
    // Try to fetch from Supabase first
    let supabaseResult = null;
    let mockResult = null;
    
    if (supabaseAdmin) {
      console.log(`Fetching MCP ${id} from Supabase`);
      // Try to fetch from Supabase first
      const { data, error } = await supabaseAdmin
        .from('mcp_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn(`Error fetching MCP ${id} from Supabase:`, error);
      } else if (data) {
        supabaseResult = data;
      }
    } else {
      console.warn('Supabase admin client not available, falling back to mock database');
    }
    
    // Fall back to mock database
    const mcpData = getMcp(id);
    if (mcpData) {
      mockResult = mcpData;
    }

    // If the debug parameter is true, return detailed information about where the MCP was found
    if (debug) {
      return NextResponse.json({
        mcpId: id,
        foundInSupabase: !!supabaseResult,
        foundInMockDb: !!mockResult,
        supabaseData: supabaseResult ? {
          id: supabaseResult.id,
          name: supabaseResult.name,
          createdAt: supabaseResult.created_at,
          updatedAt: supabaseResult.updated_at,
          userId: supabaseResult.user_id,
          clientType: supabaseResult.client_type,
          integrationType: supabaseResult.integration_type,
          hasConfig: !!supabaseResult.config
        } : null,
        mockData: mockResult ? {
          createdAt: mockResult.createdAt,
          userId: mockResult.userId,
          hasConfig: !!mockResult.config
        } : null
      });
    }

    // Standard response flow - choose the appropriate data source
    const data = supabaseResult || mcpData;

    if (!data) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    // Format the response with expected structure
    return NextResponse.json({
      mcpId: id,
      config: supabaseResult ? JSON.stringify(supabaseResult.config) : mcpData.config,
      createdAt: supabaseResult ? supabaseResult.created_at : mcpData.createdAt,
      userId: supabaseResult ? supabaseResult.user_id : mcpData.userId
    });
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

    // Parse the config to ensure it's an object in the database
    const configObj = typeof config === 'string' ? JSON.parse(config) : config;
    
    // Check if Supabase admin client is available
    if (supabaseAdmin) {
      // Try to update in Supabase
      const { data, error } = await supabaseAdmin
        .from('mcp_projects')
        .update({ 
          config: configObj,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        console.log(`MCP updated in Supabase: ${id}`);
        
        // Create a new version
        const { error: versionError } = await supabaseAdmin
          .from('mcp_versions')
          .insert({
            project_id: id,
            version: 1, // Should increment this based on previous versions
            config: configObj,
            notes: 'Updated version',
            created_at: new Date().toISOString(),
            created_by: data.user_id
          });
          
        if (versionError) {
          console.error('Error storing MCP version in Supabase:', versionError);
        }
        
        return NextResponse.json({ mcpId: id, config });
      }
      
      if (error) {
        console.warn(`Error updating MCP ${id} in Supabase:`, error);
      }
    } else {
      console.warn('Supabase admin client not available, falling back to mock database');
    }
    
    // Fall back to mock database
    if (!getMcp(id)) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }
    
    // Update the mock database
    updateMcp(id, { config });
    console.log(`MCP updated in mock DB: ${id}`);
    
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
    
    // Check if Supabase admin client is available
    if (supabaseAdmin) {
      // Try to delete from Supabase
      const { error } = await supabaseAdmin
        .from('mcp_projects')
        .delete()
        .eq('id', id);

      if (!error) {
        console.log(`MCP deleted from Supabase: ${id}`);
        return NextResponse.json({ message: 'MCP deleted successfully' });
      }
      
      if (error) {
        console.warn(`Error deleting MCP ${id} from Supabase:`, error);
      }
    } else {
      console.warn('Supabase admin client not available, falling back to mock database');
    }
    
    // Fall back to mock database
    if (!getMcp(id)) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }
    
    // Delete from the mock database
    deleteMcp(id);
    console.log(`MCP deleted from mock DB: ${id}`);
    
    return NextResponse.json({ message: 'MCP deleted successfully' });
  } catch (error) {
    console.error(`Error deleting MCP ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete MCP configuration' }, { status: 500 });
  }
}
