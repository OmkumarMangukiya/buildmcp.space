'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import DeploymentResult from './DeploymentResult';
import { useToast } from "@/components/ui/use-toast";

interface DeployMCPButtonProps {
  mcpId: string;
  deployTarget?: 'local' | 'cloud';
  className?: string;
}

export default function DeployMCPButton({ 
  mcpId, 
  deployTarget = 'local',
  className
}: DeployMCPButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentDetails, setDeploymentDetails] = useState<any | null>(null);
  const { toast } = useToast();

  const handleDeploy = async () => {
    console.log(`Deploying MCP: ${mcpId} (Target: ${deployTarget})`);
    
    setIsDeploying(true);
    
    try {
      // Log the request details
      console.log(`Starting deployment for MCP ID: ${mcpId}...`);
      console.log(`Deployment target: ${deployTarget}`);
      
      // Call the deploy API
      const response = await fetch(`/api/mcp/deploy/${mcpId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deployTarget }),
      });
      
      // Log the response status
      console.log(`Deployment API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Deployment failed with status ${response.status}:`, errorText);
        
        toast({
          variant: "destructive",
          title: "Deployment Failed",
          description: `Error: ${response.status} - ${errorText || 'Unknown error'}`,
        });
        
        throw new Error(`Deployment failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Deployment successful:', result);
      
      // Set deployment details for local or cloud deployment
      if (deployTarget === 'local') {
        // For local deployment
        setDeploymentUrl(`/api/mcp/download/${mcpId}/bundle`);
        setDeploymentDetails({
          downloadLinks: {
            bundle: `/api/mcp/download/${mcpId}/bundle`,
            server: `/api/mcp/download/${mcpId}/server`,
            claudeConfig: `/api/mcp/download/${mcpId}/claude`,
            cursorConfig: `/api/mcp/download/${mcpId}/cursor`,
          },
          setupInstructions: {
            claude: result.setupInstructions?.claude || 
              '1. Download the Claude config file\n2. Open Claude Desktop\n3. Go to Settings > MCP Servers\n4. Add the configuration file',
            cursor: result.setupInstructions?.cursor || 
              '1. Download the mcp.json file\n2. Place it in the .cursor directory\n3. Restart Cursor',
          },
          installationGuide: {
            windows: {
              node: "1. Install Node.js from https://nodejs.org/\n2. Extract the downloaded zip\n3. Open Command Prompt in that folder\n4. Run: npm install\n5. Run: npm start"
            },
            mac: {
              node: "1. Install Node.js from https://nodejs.org/\n2. Extract the downloaded zip\n3. Open Terminal in that folder\n4. Run: npm install\n5. Run: npm start"
            },
            linux: {
              node: "1. Install Node.js using your package manager\n2. Extract the downloaded zip\n3. Open Terminal in that folder\n4. Run: npm install\n5. Run: npm start"
            }
          }
        });
      } else {
        // For cloud deployment
        setDeploymentUrl(result.deploymentUrl || 'https://cloud.mcp-server.com');
        setDeploymentDetails({
          status: result.status || 'Running',
          region: result.region,
          serverType: result.serverType || 'Standard',
          created: new Date().toISOString(),
          accessInstructions: {
            claude: 'Add this server in Claude Desktop settings under MCP Servers.',
            cursor: 'Add this configuration to your .cursor/mcp.json file.',
          },
          connectionConfigs: {
            claude: {
              serverUrl: result.deploymentUrl || 'https://cloud.mcp-server.com',
              apiKey: result.apiKey,
            },
            cursor: {
              mcpServers: {
                [result.name || 'mcp-server']: {
                  url: result.deploymentUrl || 'https://cloud.mcp-server.com',
                  apiKey: result.apiKey,
                }
              }
            }
          }
        });
      }
      
      toast({
        title: "Deployment Successful",
        description: deployTarget === 'local' 
          ? "Your MCP server is ready for download" 
          : "Your MCP server is now running in the cloud",
      });
      
    } catch (error) {
      console.error('Error deploying MCP:', error);
      
      toast({
        variant: "destructive",
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      
    } finally {
      setIsDeploying(false);
    }
  };
  
  // If we have a deployment URL, show the deployment result
  if (deploymentUrl) {
    return (
      <DeploymentResult 
        deploymentUrl={deploymentUrl}
        deployTarget={deployTarget}
        details={deploymentDetails}
      />
    );
  }
  
  // Otherwise, show the deploy button
  return (
    <Button 
      onClick={handleDeploy} 
      disabled={isDeploying}
      className={className}
    >
      {isDeploying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-4 w-4" />
          {deployTarget === 'local' ? 'Download' : 'Deploy'} MCP Server
        </>
      )}
    </Button>
  );
} 