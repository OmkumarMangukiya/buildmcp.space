'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Server, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeployMCPButtonProps {
  mcpId: string;
  deployTarget: 'local' | 'cloud';
  onDeploySuccess?: (deploymentUrl: string, details: any) => void;
  onDeployFailure?: (error: string) => void;
}

export default function DeployMCPButton({ 
  mcpId, 
  deployTarget,
  onDeploySuccess,
  onDeployFailure
}: DeployMCPButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDeploy = async () => {
    if (!mcpId) {
      const errorMessage = "Cannot deploy: MCP ID is missing";
      console.error(errorMessage);
      setError(errorMessage);
      if (onDeployFailure) onDeployFailure(errorMessage);
      return;
    }
    
    console.log(`Starting deployment of MCP ${mcpId} to ${deployTarget}`);
    setIsDeploying(true);
    setError(null);
    
    try {
      const url = `/api/mcp/deploy/${mcpId}`;
      console.log(`Sending POST request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deployTarget }),
      });
      
      console.log(`Deployment response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `Deployment failed with status: ${response.status}`;
        console.error(`Deployment error:`, errorData);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log(`Deployment successful, result:`, result);
      
      if (onDeploySuccess) {
        onDeploySuccess(result.deploymentUrl, result.details);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown deployment error occurred';
      console.error(`Deployment failed:`, err);
      setError(errorMessage);
      
      if (onDeployFailure) {
        onDeployFailure(errorMessage);
      }
    } finally {
      setIsDeploying(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Button 
        onClick={handleDeploy}
        disabled={isDeploying || !mcpId}
        className="w-full"
      >
        {isDeploying ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : deployTarget === 'local' ? (
          <Download className="mr-2 h-4 w-4" />
        ) : (
          <Server className="mr-2 h-4 w-4" />
        )}
        {isDeploying ? 'Deploying...' : deployTarget === 'local' ? 'Download for Local Use' : 'Deploy to Cloud'}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Deployment Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!mcpId && (
        <Alert variant="default">
          <AlertTitle>Missing MCP ID</AlertTitle>
          <AlertDescription>
            MCP ID is required for deployment. Please make sure the MCP was successfully generated.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 