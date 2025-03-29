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
    setIsDeploying(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/mcp/deploy/${mcpId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deployTarget }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Deployment failed');
      }
      
      const result = await response.json();
      
      if (onDeploySuccess) {
        onDeploySuccess(result.deploymentUrl, result.details);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown deployment error occurred';
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
        disabled={isDeploying}
        className="w-full"
      >
        {isDeploying ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : deployTarget === 'local' ? (
          <Download className="mr-2 h-4 w-4" />
        ) : (
          <Server className="mr-2 h-4 w-4" />
        )}
        {deployTarget === 'local' ? 'Download for Local Use' : 'Deploy to Cloud'}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Deployment Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 