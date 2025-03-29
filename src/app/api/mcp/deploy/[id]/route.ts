import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import JSZip from 'jszip';

// Placeholder for database interaction (shared or imported)
const mockDatabase: Record<string, { config: string; createdAt: Date; userId?: string }> = {
  'test-uuid-123': {
    config: JSON.stringify({ description: 'Initial test MCP', resources: [], tools: [], prompts: [] }, null, 2),
    createdAt: new Date(),
    userId: 'mock-user-1'
  }
};

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

// Placeholder for external deployment service interaction
async function triggerDeployment(mcpId: string, config: string, deployTarget: string): Promise<{ deploymentUrl: string; details?: any }> {
  console.log(`Triggering ${deployTarget} deployment for MCP: ${mcpId}`);
  console.log(`Config: ${config}`);
  
  // Simulate deployment process time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Prepare the server files
    const { files, downloadLinks } = await prepareServerFiles(config, deployTarget);
    
    if (deployTarget === 'local') {
      // For local deployment, return download links to the generated files
      return {
        deploymentUrl: downloadLinks.server,
        details: {
          downloadLinks,
          instructions: {
            claude: "Add the server to Claude Desktop via Settings > Servers",
            cursor: "Place mcp.json in your project's .cursor directory"
          }
        }
      };
    } else {
      // For cloud deployment, return the hosted server URL
      const deploymentUrl = `https://mcp.example.com/api/servers/${mcpId}-${Date.now()}`;
      return {
        deploymentUrl,
        details: {
          status: 'running',
          region: 'us-west-1',
          serverType: 'standard',
          created: new Date().toISOString(),
          downloadLinks // Include download links for the cloud deployment as well
        }
      };
    }
  } catch (error) {
    console.error('Error during deployment:', error);
    throw new Error('Deployment failed');
  }
}

// POST /api/mcp/deploy/[id]
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // TODO: Add user validation to ensure user owns this MCP
    
    // Get the deployment target from request body
    const body = await request.json();
    const deployTarget = body.deployTarget || 'local'; // Default to local if not specified
    
    // Validate deployTarget
    if (deployTarget !== 'local' && deployTarget !== 'cloud') {
      return NextResponse.json({ error: 'Invalid deployment target' }, { status: 400 });
    }

    const mcpData = mockDatabase[id];

    if (!mcpData) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 });
    }

    // Trigger the deployment process
    const deploymentResult = await triggerDeployment(id, mcpData.config, deployTarget);

    return NextResponse.json({ 
      status: 'success', 
      deploymentUrl: deploymentResult.deploymentUrl,
      deployTarget,
      details: deploymentResult.details
    });

  } catch (error) {
    console.error(`Error deploying MCP ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to deploy MCP configuration' }, { status: 500 });
  }
}
