'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Server, BookText, Download } from 'lucide-react';

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

export default function MCPConfigViewer({ configJson, onSave }: MCPConfigViewerProps) {
  const [activeTab, setActiveTab] = useState("server");
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    try {
      const parsedConfig = JSON.parse(configJson);
      setConfig(parsedConfig);
    } catch (error) {
      console.error('Error parsing config:', error);
    }
  }, [configJson]);

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="server" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="server">Server Code</TabsTrigger>
          <TabsTrigger value="client">Client Config</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>Server Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[400px]">
                {config.serverCode || 'No server code available'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>Client Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[400px]">
                {JSON.stringify(config.clientConfigs || {}, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[400px]">
                {JSON.stringify(config.tools || [], null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {onSave && (
          <Button onClick={onSave} variant="outline">
            Save Configuration
          </Button>
        )}
      </div>
    </div>
  );
} 