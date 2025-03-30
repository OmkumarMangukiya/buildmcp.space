'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Download, Server, CheckCircle, Terminal, Laptop, Check, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "@/components/ui/code";
import { Copy } from 'lucide-react';

interface DownloadLink {
  label: string;
  url: string;
}

interface DeploymentDetails {
  status?: string;
  region?: string;
  serverType?: string;
  created?: string;
  downloadLinks?: {
    server?: string;
    claude?: string;
    cursor?: string;
    bundle?: string;
    claudeConfig?: string;
    cursorConfig?: string;
  };
  instructions?: {
    claude?: string;
    cursor?: string;
  };
  setupInstructions?: {
    claude?: string;
    cursor?: string;
  };
  installationGuide?: {
    windows?: {
      node?: string;
    };
    mac?: {
      node?: string;
    };
    linux?: {
      node?: string;
    };
    unknown?: {
      node?: string;
    };
  };
  accessInstructions?: {
    claude?: string;
    cursor?: string;
  };
  connectionConfigs?: {
    claude?: {
      serverUrl: string;
      apiKey?: string;
    };
    cursor?: any;
  };
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
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeDownloadTab, setActiveDownloadTab] = useState<string>("bundle");
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getOperatingSystem = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) return "windows";
    if (userAgent.indexOf("Mac") !== -1) return "mac";
    if (userAgent.indexOf("Linux") !== -1) return "linux";
    return "unknown";
  };
  
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
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {deployTarget === 'local' ? 'Local Deployment' : 'Cloud Deployment'}
              </CardTitle>
              <CardDescription>
                {deployTarget === 'local' 
                  ? 'Download and run your MCP server locally'
                  : 'Your MCP server is now running in the cloud'}
              </CardDescription>
            </div>
            <Badge variant={deployTarget === 'local' ? 'outline' : 'default'}>
              {deployTarget === 'local' ? 'Local' : 'Cloud'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {deployTarget === 'local' ? (
            <>
              <div className="text-center py-2">
                <h3 className="text-lg font-medium mb-2">Download Your MCP Server</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose what to download based on your needs
                </p>
                
                <Tabs value={activeDownloadTab} onValueChange={setActiveDownloadTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="bundle">Complete Bundle</TabsTrigger>
                    <TabsTrigger value="server">Server Only</TabsTrigger>
                    <TabsTrigger value="claude">Claude Config</TabsTrigger>
                    <TabsTrigger value="cursor">Cursor Config</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bundle" className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Download everything you need to run your MCP server
                      </p>
                      <Button 
                        onClick={() => window.location.href = details?.downloadLinks?.bundle || '#'}
                        disabled={!details?.downloadLinks?.bundle}
                        className="mx-auto"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Complete Package
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="server" className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Download only the server files
                      </p>
                      <Button 
                        onClick={() => window.location.href = details?.downloadLinks?.server || '#'}
                        disabled={!details?.downloadLinks?.server}
                        className="mx-auto"
                      >
                        <Server className="mr-2 h-4 w-4" />
                        Download Server Files
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="claude" className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Download Claude Desktop configuration
                      </p>
                      <Button 
                        onClick={() => window.location.href = details?.downloadLinks?.claudeConfig || '#'}
                        disabled={!details?.downloadLinks?.claudeConfig}
                        className="mx-auto"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Claude Config
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cursor" className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Download Cursor configuration file
                      </p>
                      <Button 
                        onClick={() => window.location.href = details?.downloadLinks?.cursorConfig || '#'}
                        disabled={!details?.downloadLinks?.cursorConfig}
                        className="mx-auto"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download mcp.json
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="installation">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Installation Instructions
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Step 1: Download and Extract</h4>
                        <p className="text-sm text-muted-foreground">
                          Download the package and extract it to a folder on your computer.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Step 2: Install Dependencies</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Install Node.js and the required dependencies:
                        </p>
                        <Alert>
                          <Terminal className="h-4 w-4" />
                          <AlertDescription className="font-mono text-xs mt-2">
                            {details?.installationGuide?.[getOperatingSystem()]?.node || 
                              "1. Install Node.js from https://nodejs.org/\n2. Run npm install in the extracted folder"}
                          </AlertDescription>
                        </Alert>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Step 3: Run the Server</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Start the MCP server:
                        </p>
                        <Alert>
                          <Terminal className="h-4 w-4" />
                          <AlertDescription className="font-mono text-xs mt-2">
                            npm start
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="claude">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      Claude Desktop Setup
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        To connect Claude Desktop to your MCP server:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {details?.setupInstructions?.claude?.split('\n').map((line: string, i: number) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ol>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Configuration Example:</h4>
                        <div className="relative">
                          <Code className="text-xs p-4 bg-muted">
                            {`{
  "mcpServers": {
    "your-mcp-server": {
      "command": "node",
      "args": [
        "path/to/mcp_server.js"
      ]
    }
  }
}`}
                          </Code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2"
                            onClick={() => handleCopy(`{
  "mcpServers": {
    "your-mcp-server": {
      "command": "node",
      "args": [
        "path/to/mcp_server.js"
      ]
    }
  }
}`, "Claude config")}
                          >
                            {copiedText === "Claude config" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cursor">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Cursor Setup
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        To connect Cursor to your MCP server:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {details?.setupInstructions?.cursor?.split('\n').map((line: string, i: number) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ol>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Configuration Example:</h4>
                        <div className="relative">
                          <Code className="text-xs p-4 bg-muted">
                            {`{
  "mcpServers": {
    "your-mcp-server": {
      "command": "node",
      "args": [
        "path/to/mcp_server.js"
      ]
    }
  }
}`}
                          </Code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2"
                            onClick={() => handleCopy(`{
  "mcpServers": {
    "your-mcp-server": {
      "command": "node",
      "args": [
        "path/to/mcp_server.js"
      ]
    }
  }
}`, "Cursor config")}
                          >
                            {copiedText === "Cursor config" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            // Cloud deployment UI
            <div className="space-y-4">
              <Alert>
                <div className="flex items-start">
                  <Server className="h-4 w-4 mt-0.5 mr-2" />
                  <div>
                    <AlertTitle>Server Deployed Successfully</AlertTitle>
                    <AlertDescription>
                      Your MCP server is now running at:
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <code className="text-sm">{deploymentUrl}</code>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleCopy(deploymentUrl, "URL")}
                  >
                    {copiedText === "URL" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => window.open(deploymentUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="claude" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="claude">Claude Desktop</TabsTrigger>
                  <TabsTrigger value="cursor">Cursor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="claude" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {details?.accessInstructions?.claude || "Add this server in Claude Desktop settings"}
                  </p>
                  
                  {details?.connectionConfigs?.claude && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Server URL:</p>
                        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <code className="text-xs">{details.connectionConfigs.claude.serverUrl}</code>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCopy(details.connectionConfigs.claude.serverUrl, "Claude URL")}
                          >
                            {copiedText === "Claude URL" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      {details.connectionConfigs.claude.apiKey && (
                        <div>
                          <p className="text-sm font-medium mb-2">API Key (if required):</p>
                          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <code className="text-xs">{details.connectionConfigs.claude.apiKey}</code>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleCopy(details.connectionConfigs.claude.apiKey, "Claude API Key")}
                            >
                              {copiedText === "Claude API Key" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cursor" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {details?.accessInstructions?.cursor || "Add the following to your .cursor/mcp.json file"}
                  </p>
                  
                  {details?.connectionConfigs?.cursor && (
                    <div className="relative">
                      <Code className="text-xs p-4 bg-muted">
                        {JSON.stringify(details.connectionConfigs.cursor, null, 2)}
                      </Code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(JSON.stringify(details.connectionConfigs.cursor, null, 2), "Cursor config")}
                      >
                        {copiedText === "Cursor config" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Create Another MCP
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 