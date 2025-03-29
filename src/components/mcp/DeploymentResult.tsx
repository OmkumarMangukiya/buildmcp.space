'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Download, Server, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DownloadLink {
  server: string;
  claudeConfig?: string;
  cursorConfig?: string;
  [key: string]: string | undefined;
}

interface DeploymentDetails {
  downloadLinks?: DownloadLink;
  instructions?: {
    claude?: string;
    cursor?: string;
    [key: string]: string | undefined;
  };
  status?: string;
  region?: string;
  serverType?: string;
  created?: string;
}

interface DeploymentResultProps {
  deploymentUrl: string;
  deployTarget: 'local' | 'cloud';
  details?: DeploymentDetails;
}

export default function DeploymentResult({ 
  deploymentUrl, 
  deployTarget, 
  details 
}: DeploymentResultProps) {
  
  const getDownloadLinks = () => {
    if (!details?.downloadLinks) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Download Files</h3>
        <div className="grid gap-2">
          {Object.entries(details.downloadLinks).map(([key, url]) => (
            <Button key={key} variant="outline" className="justify-start" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {key === 'server' ? 'Server Files' : 
                 key === 'claudeConfig' ? 'Claude Desktop Config' : 
                 key === 'cursorConfig' ? 'Cursor Config' : key}
              </a>
            </Button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950/10 dark:border-green-500/30">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Deployment Successful</AlertTitle>
        <AlertDescription>
          Your MCP server has been {deployTarget === 'local' ? 'prepared for local use' : 'deployed to the cloud'}
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Deployment Details</CardTitle>
          <CardDescription>
            {deployTarget === 'local' 
              ? 'Access your MCP server files for local installation'
              : 'Access your cloud-hosted MCP server'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Deployment URL</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted p-2 rounded text-sm truncate">
                {deploymentUrl}
              </div>
              <Button variant="outline" size="icon" asChild>
                <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {deployTarget === 'cloud' && details?.status && (
            <div className="space-y-2">
              <h3 className="font-medium">Cloud Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted p-2 rounded">Status: {details.status}</div>
                {details.region && <div className="bg-muted p-2 rounded">Region: {details.region}</div>}
                {details.serverType && <div className="bg-muted p-2 rounded">Type: {details.serverType}</div>}
                {details.created && <div className="bg-muted p-2 rounded">Created: {new Date(details.created).toLocaleString()}</div>}
              </div>
            </div>
          )}
          
          {getDownloadLinks()}
          
          {details?.instructions && (
            <div className="space-y-2">
              <h3 className="font-medium">Configuration Instructions</h3>
              <Accordion type="single" collapsible className="w-full">
                {details.instructions.claude && (
                  <AccordionItem value="claude">
                    <AccordionTrigger className="text-sm">Claude Desktop</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-5 text-sm space-y-1">
                        <li>Download the MCP server files</li>
                        <li>Extract the files to a directory on your computer</li>
                        <li>Open Claude Desktop and go to Settings</li>
                        <li>Navigate to the "Servers" section</li>
                        <li>Add a new server with the path to the executable</li>
                        <li>Save the configuration</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {details.instructions.cursor && (
                  <AccordionItem value="cursor">
                    <AccordionTrigger className="text-sm">Cursor AI</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-5 text-sm space-y-1">
                        <li>Download the MCP server files</li>
                        <li>Extract the files to your project directory</li>
                        <li>Create a .cursor directory in your project root if it doesn't exist</li>
                        <li>Copy the mcp.json file to the .cursor directory</li>
                        <li>Restart Cursor AI to pick up the new configuration</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {deployTarget === 'local' 
              ? 'Files will be available for download for 24 hours'
              : 'Server will remain active according to your subscription plan'}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard">View All MCPs</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 