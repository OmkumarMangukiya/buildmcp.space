'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, Code, CheckCircle2, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MCPConfigViewer from '@/components/mcp/MCPConfigViewer';
import supabase from '@/lib/supaClient';

export default function CreateMcpPage() {
  const [description, setDescription] = useState('');
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [mcpId, setMcpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please provide a description for your MCP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = '/auth/signin?redirect=/create-mcp';
        return;
      }

      const response = await fetch('/api/mcp/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: session.user.id,
          input: description 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate MCP');
      }

      const data = await response.json();
      console.log('MCP created successfully:', data);
      setMcpId(data.mcpId);
      setGeneratedConfig(data.config);
      setActiveTab("config");
    } catch (err: any) {
      console.error("MCP creation error:", err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save functionality
  const handleSave = async () => {
    if (!mcpId || !generatedConfig) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/mcp/${mcpId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: generatedConfig }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save MCP');
      }

      alert("MCP configuration saved successfully!");
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (type = 'bundle') => {
    if (!mcpId) {
      setError('MCP ID not found. Please try regenerating the MCP.');
      return;
    }
    
    setIsDownloading(true);
    setError(null);
    
    try {
      // First ensure the MCP is saved
      if (generatedConfig) {
        const saveResponse = await fetch(`/api/mcp/${mcpId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: generatedConfig }),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || 'Failed to save MCP before download');
        }
      }

      // Then trigger the download
      window.location.href = `/api/mcp/download/${mcpId}/${type}`;
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download MCP files. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">MCP Server Builder</h1>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create AI-Powered MCP Server</CardTitle>
          <CardDescription>
            Design and download MCP servers powered by AI models. MCP (Model Context Protocol) servers 
            enable AI models to interact with external systems, access data, and perform actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="description" className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Description
              </TabsTrigger>
              <TabsTrigger value="config" disabled={!generatedConfig} className="flex items-center gap-1">
                <Code className="h-4 w-4" /> Configuration
              </TabsTrigger>
            </TabsList>
            
            {/* Step 1: Description */}
            <TabsContent value="description" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="text-sm font-medium">
                    Describe your MCP Server
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your MCP server should do..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !description.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Code className="mr-2 h-4 w-4" />
                      Generate MCP Server
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {/* Step 2: Configuration */}
            <TabsContent value="config" className="space-y-4">
              {generatedConfig && (
                <>
                  <MCPConfigViewer 
                    configJson={generatedConfig}
                    onSave={handleSave}
                  />
                  <div className="flex flex-col gap-2 items-end">
                    <div className="text-sm text-muted-foreground mt-2 mb-1">
                      Download your MCP server files:
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handleDownload('server');
                        }}
                        variant="outline"
                        className="gap-2"
                        disabled={isDownloading}
                        size="sm"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Server Files
                      </Button>
                      <Button 
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handleDownload('claude');
                        }}
                        variant="outline"
                        className="gap-2"
                        disabled={isDownloading}
                        size="sm"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Claude Config
                      </Button>
                      <Button 
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handleDownload('cursor');
                        }}
                        variant="outline"
                        className="gap-2"
                        disabled={isDownloading}
                        size="sm"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Cursor Config
                      </Button>
                      <Button 
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handleDownload('bundle');
                        }}
                        variant="default"
                        className="gap-2"
                        disabled={isDownloading}
                        size="sm"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Complete Bundle
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
