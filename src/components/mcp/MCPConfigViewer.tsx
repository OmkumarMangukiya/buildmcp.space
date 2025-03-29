'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Server, BookText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientConfig {
  name: string;
  configuration: Record<string, any>;
}

interface MCPConfig {
  description: string;
  serverCode: string;
  clientConfigs: Record<string, ClientConfig>;
  deploymentOptions: {
    local: string[];
    cloud: string[];
  };
  documentation: string;
  metadata: {
    generatedBy: string;
    timestamp: string;
    requirements: {
      serverDescription: string;
      targetClients: string[];
      authRequirements: string;
      deploymentPreference: string;
      languagePreference?: string;
    };
  };
}

interface MCPConfigViewerProps {
  configJson: string;
  onSave?: () => void;
  onDeploy?: () => void;
}

/**
 * Process documentation Markdown to HTML
 */
function processMarkdown(markdown: string): string {
  if (!markdown) return 'No documentation available.';
  
  // Replace headers
  let html = markdown
    .replace(/\n/g, '<br>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle code blocks (without using the 's' flag)
  let codeBlockRegex = /```([^`]*?)```/g;
  html = html.replace(codeBlockRegex, function(match, p1) {
    return `<pre><code>${p1}</code></pre>`;
  });
  
  return html;
}

export default function MCPConfigViewer({ configJson, onSave, onDeploy }: MCPConfigViewerProps) {
  const [activeTab, setActiveTab] = useState("server");
  
  let config: MCPConfig;
  try {
    config = JSON.parse(configJson);
  } catch (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Parsing Configuration</CardTitle>
          <CardDescription>The configuration could not be parsed.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-x-auto p-4 bg-black/5 rounded-md">
            {configJson}
          </pre>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MCP Server Configuration</CardTitle>
          <CardDescription>
            Review the generated server configuration for your MCP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="server" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="server" className="flex items-center gap-1">
                <Code className="h-4 w-4" /> Server Code
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-1">
                <Server className="h-4 w-4" /> Client Configs
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-1">
                <BookText className="h-4 w-4" /> Documentation
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-1">
                <Download className="h-4 w-4" /> Files
              </TabsTrigger>
            </TabsList>
            
            {/* Server Code Tab */}
            <TabsContent value="server" className="space-y-4">
              <pre className="text-xs overflow-x-auto p-4 bg-black/5 rounded-md max-h-96">
                {config.serverCode}
              </pre>
            </TabsContent>
            
            {/* Client Configs Tab */}
            <TabsContent value="clients" className="space-y-4">
              {Object.entries(config.clientConfigs).map(([clientName, clientConfig]) => (
                <div key={clientName} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{clientConfig.name} Configuration</h3>
                  <pre className="text-xs overflow-x-auto p-4 bg-black/5 rounded-md">
                    {JSON.stringify(clientConfig.configuration, null, 2)}
                  </pre>
                </div>
              ))}
              
              {Object.keys(config.clientConfigs).length === 0 && (
                <p className="text-muted-foreground">No client configurations available.</p>
              )}
            </TabsContent>
            
            {/* Documentation Tab */}
            <TabsContent value="docs" className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ 
                  __html: processMarkdown(config.documentation)
                }} />
              </div>
            </TabsContent>
            
            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local Deployment Files */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Local Deployment Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {config.deploymentOptions?.local?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {config.deploymentOptions.local.map((file) => (
                          <li key={file}>{file}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No local deployment files available.</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Cloud Deployment Files */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cloud Deployment Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {config.deploymentOptions?.cloud?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {config.deploymentOptions.cloud.map((file) => (
                          <li key={file}>{file}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No cloud deployment files available.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>These files will be available for download after deployment.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {onSave && (
          <Button onClick={onSave} variant="outline">
            Save Configuration
          </Button>
        )}
        {onDeploy && (
          <Button onClick={onDeploy}>
            Continue to Deployment
          </Button>
        )}
      </div>
    </div>
  );
} 