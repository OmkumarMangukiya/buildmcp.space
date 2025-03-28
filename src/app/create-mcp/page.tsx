'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Import the planned components (will be created next)
// import MCPForm from '@/components/mcp/MCPForm';
// import MCPConfigViewer from '@/components/mcp/MCPConfigViewer';
// import DeployMCPButton from '@/components/mcp/DeployMCPButton';

export default function CreateMcpPage() {
  const [description, setDescription] = useState('');
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [mcpId, setMcpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedConfig(null);
    setMcpId(null);
    setDeploymentStatus(null);

    try {
      // Replace with actual user ID from auth
      const userId = 'mock-user-1'; 
      const response = await fetch('/api/mcp/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, input: description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate MCP');
      }

      const data = await response.json();
      setGeneratedConfig(data.config);
      setMcpId(data.mcpId);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Placeholder for Save/Edit functionality (would likely involve PUT /api/mcp/[id])
  const handleSave = async () => {
    if (!mcpId || !generatedConfig) return;
    console.log("Saving MCP:", mcpId);
    // Implement save logic, e.g., call PUT /api/mcp/[id]
    alert("Save functionality not fully implemented yet.");
  };

  // Placeholder for Deploy functionality
  const handleDeploy = async () => {
    if (!mcpId) return;
    setDeploymentStatus('Deploying...');
    setError(null);
    try {
      const response = await fetch(`/api/mcp/deploy/${mcpId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Deployment failed');
      }
      const result = await response.json();
      setDeploymentStatus(`Deployment successful: ${result.deploymentUrl}`);
    } catch (err: any) {
      setError(err.message || 'An unknown deployment error occurred');
      setDeploymentStatus(null);
    } 
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create AI-Powered MCP</CardTitle>
          <CardDescription>Describe the MCP configuration you want to generate using natural language.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* MCPForm equivalent */}
          <Textarea
            placeholder="e.g., Create an MCP that exposes my project's README.md as a resource and provides a tool to summarize it..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} disabled={isLoading || !description}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate MCP Configuration
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* MCPConfigViewer equivalent */}
          {generatedConfig && (
            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-semibold">Generated Configuration:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{generatedConfig}</code>
              </pre>
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleSave}>Save</Button> {/* Add Edit functionality later */} 
                {/* DeployMCPButton equivalent */} 
                <Button onClick={handleDeploy} disabled={!!deploymentStatus && !error}>
                  {deploymentStatus === 'Deploying...' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Deploy
                </Button>
              </div>
            </div>
          )}

          {deploymentStatus && deploymentStatus !== 'Deploying...' && (
             <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950/10 dark:border-green-500/30">
              <AlertTitle>Deployment Status</AlertTitle>
              <AlertDescription>{deploymentStatus}</AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
