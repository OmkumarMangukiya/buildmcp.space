import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import JSZip from 'jszip';
import { getMcp } from '@/lib/mockDatabase';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Create a zip file containing all the server files
 */
async function createZipArchive(files: Record<string, string>, filename: string): Promise<Buffer> {
  const zip = new JSZip();
  
  // Add each file to the zip
  Object.entries(files).forEach(([filepath, content]) => {
    zip.file(filepath, content);
  });
  
  // Generate the zip file
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  return zipBuffer;
}

/**
 * Save a zip file to a temporary location and return the path
 */
async function saveZipToTemp(zipBuffer: Buffer, filename: string): Promise<string> {
  const tempDir = path.join(os.tmpdir(), 'mcp-servers');
  
  // Create the temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const zipPath = path.join(tempDir, `${filename}.zip`);
  fs.writeFileSync(zipPath, zipBuffer);
  
  return zipPath;
}

// Prepare server files for deployment
async function prepareServerFiles(config: string, deployTarget: string): Promise<{
  files: Record<string, Record<string, string>>,
  downloadLinks: Record<string, string>
}> {
  try {
    // Parse the configuration
    const parsedConfig = JSON.parse(config);
    
    // Extract deployment files from the configuration
    let files: Record<string, Record<string, string>> = {};
    
    if (deployTarget === 'local' && parsedConfig.deploymentOptions?.local) {
      // For local deployment, use the local package files
      files.server = parsedConfig.serverPackage?.packages?.local || {};
    } else if (deployTarget === 'cloud' && parsedConfig.deploymentOptions?.cloud) {
      // For cloud deployment, use the cloud package files
      files.server = parsedConfig.serverPackage?.packages?.cloud || {};
    } else {
      // Fallback to extracting from serverCode if packages are not available
      const serverCode = parsedConfig.serverCode || '';
      const language = parsedConfig.metadata?.requirements?.languagePreference || 'python';
      
      if (language.toLowerCase() === 'python') {
        files.server = {
          'server.py': serverCode,
          'requirements.txt': 'modelcontextprotocol>=1.0.0\n',
          'README.md': parsedConfig.documentation || '# MCP Server\n\nGenerated MCP server.'
        };
      } else {
        files.server = {
          'server.js': serverCode,
          'package.json': '{\n  "name": "mcp-server",\n  "version": "1.0.0",\n  "dependencies": {\n    "@modelcontextprotocol/sdk": "^1.0.0"\n  }\n}',
          'README.md': parsedConfig.documentation || '# MCP Server\n\nGenerated MCP server.'
        };
      }
    }
    
    // Add client configurations
    const clientConfigs = parsedConfig.clientConfigs || {};
    
    if (clientConfigs['Claude Desktop']) {
      files.claudeConfig = {
        'claude_desktop_config.json': JSON.stringify(clientConfigs['Claude Desktop'].configuration, null, 2)
      };
    }
    
    if (clientConfigs['Cursor AI']) {
      files.cursorConfig = {
        'mcp.json': JSON.stringify(clientConfigs['Cursor AI'].configuration, null, 2)
      };
    }
    
    // Generate download links (placeholder URLs for now)
    // In a real implementation, these would be actual URLs to the generated files
    const baseUrl = 'https://mcp.example.com/download';
    const mockId = Math.random().toString(36).substring(2, 10);
    const downloadLinks: Record<string, string> = {};
    
    for (const key in files) {
      downloadLinks[key] = `${baseUrl}/${mockId}/${key}.zip`;
    }
    
    return { files, downloadLinks };
  } catch (error) {
    console.error('Error preparing server files:', error);
    throw new Error('Failed to prepare server files');
  }
}

// Main deployment function to handle both local and cloud deployments
async function triggerDeployment(mcpId: string, deployTarget: 'local' | 'cloud') {
  console.log(`Deploying MCP ID ${mcpId} to ${deployTarget}`);
  
  try {
    // First, try to get the MCP from Supabase
    const { data: mcpData, error } = await supabase
      .from('mcp_projects')
      .select('*')
      .eq('id', mcpId)
      .single();
    
    if (error) {
      console.error('Error fetching MCP from Supabase:', error);
      throw new Error(`MCP not found: ${error.message}`);
    }
    
    if (!mcpData) {
      console.error('MCP not found in database');
      throw new Error('MCP not found in database');
    }
    
    console.log(`Found MCP: ${mcpData.name}`);
    
    // Handle local deployment (download)
    if (deployTarget === 'local') {
      // For local deployment, we'll return download links and setup instructions
      const baseDownloadUrl = `/api/mcp/download/${mcpId}`;
      
      return {
        success: true,
        deploymentUrl: `${baseDownloadUrl}/bundle`,
        message: 'MCP server is ready for download',
        downloadLinks: {
          server: `${baseDownloadUrl}/server`,
          bundle: `${baseDownloadUrl}/bundle`,
          claudeConfig: `${baseDownloadUrl}/claude`,
          cursorConfig: `${baseDownloadUrl}/cursor`,
        },
        setupInstructions: {
          claude: [
            "1. Download the Claude config file",
            "2. Open Claude Desktop",
            "3. Go to Settings > MCP Servers",
            "4. Add a new server and provide the path to your MCP server folder",
            "5. Choose the downloaded MCP server file"
          ].join('\n'),
          cursor: [
            "1. Download the mcp.json file",
            "2. Create a .cursor directory in your project",
            "3. Save the mcp.json file to the .cursor directory",
            "4. Restart Cursor to pick up the new configuration"
          ].join('\n')
        }
      };
    } 
    // Handle cloud deployment
    else {
      // For real cloud deployment, we would have an actual deployment process
      // But for now, we'll simulate a successful deployment
      
      const deploymentId = `deploy-${mcpId}-${Date.now()}`;
      const deploymentUrl = `https://mcp-${mcpId}.example.com`;
      
      // Here we would have code to actually deploy the MCP to a server
      
      return {
        success: true,
        deploymentId,
        deploymentUrl,
        message: 'MCP server has been deployed to the cloud',
        status: 'Running',
        region: 'us-west-1',
        name: mcpData.name,
        apiKey: `mcp-${Math.random().toString(36).substring(2, 15)}`
      };
    }
  } catch (error) {
    console.error('Deployment error:', error);
    throw error;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    // Parse the request body for deployment options
    const { deployTarget = 'local' } = await request.json();
    
    console.log(`Starting deployment of MCP ${id} to ${deployTarget}`);
    
    if (!id) {
      console.error('Missing MCP ID');
      return NextResponse.json(
        { error: 'Missing MCP ID' },
        { status: 400 }
      );
    }
    
    // Trigger the deployment
    const deploymentResult = await triggerDeployment(id, deployTarget);
    
    // Return success response
    return NextResponse.json(deploymentResult);
    
  } catch (error) {
    console.error('Error in deployment endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown deployment error' },
      { status: 500 }
    );
  }
}
