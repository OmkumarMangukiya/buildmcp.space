'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, Code, CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MCPConfigViewer from '@/components/mcp/MCPConfigViewer';
import supabase from '@/lib/supaClient';
import Link from 'next/link';

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
      // Get the current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication required to download MCP. Please sign in again.');
      }
      
      const token = session.access_token;
      
      // Get CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1];
      
      if (!csrfToken) {
        console.warn('CSRF token not found in cookies');
      }
      
      // First ensure the MCP is saved
      if (generatedConfig) {
        const saveResponse = await fetch(`/api/mcp/${mcpId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-Token': csrfToken || ''
          },
          body: JSON.stringify({ config: generatedConfig }),
          credentials: 'include'
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || 'Failed to save MCP before download');
        }
      }

      // Parse the config to get the MCP name
      let mcpName = 'mcp';
      if (generatedConfig) {
        try {
          const config = JSON.parse(generatedConfig);
          if (config.metadata && config.metadata.name) {
            // Normalize the name to remove spaces and special characters
            mcpName = config.metadata.name.replace(/[^a-zA-Z0-9-_]/g, '');
          }
        } catch (err) {
          console.warn('Could not parse config for MCP name:', err);
        }
      }

      // Set up fetch request with authentication
      const downloadResponse = await fetch(`/api/mcp/download/${mcpId}/${type}?userId=${session.user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/zip'
        },
        credentials: 'include'
      });
      
      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json();
        throw new Error(errorData.error || `Failed to download MCP (${downloadResponse.status})`);
      }
      
      const blob = await downloadResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create download element with the normalized MCP name
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.setAttribute('download', `${mcpName}-${type}.zip`);
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setError(error instanceof Error ? error.message : 'Failed to download MCP files. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">MCP Server Builder</h1>
          <Link href="/dashboard">
            <Button className="flex items-center gap-2 px-4 py-2 bg-[#252525] text-[#DEDDDC]/80 hover:text-white font-medium text-sm rounded-md border border-white/10 shadow-inner shadow-black/10">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card className="max-w-4xl mx-auto bg-[var(--mcp-background-secondary)] border border-[var(--mcp-border)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[var(--mcp-text)]">Create AI-Powered MCP Server</CardTitle>
            <CardDescription className="text-[var(--mcp-text-muted)]">
              Design and download MCP servers powered by AI models. MCP (Model Context Protocol) servers 
              enable AI models to interact with external systems, access data, and perform actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-[#1F1F1F]">
                <TabsTrigger 
                  value="description" 
                  className="flex items-center gap-1 data-[state=active]:bg-[#C45736] data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" /> Description
                </TabsTrigger>
                <TabsTrigger 
                  value="config" 
                  disabled={!generatedConfig} 
                  className="flex items-center gap-1 data-[state=active]:bg-[#C45736] data-[state=active]:text-white"
                >
                  <Code className="h-4 w-4" /> Configuration
                </TabsTrigger>
              </TabsList>
              
              {/* Step 1: Description */}
              <TabsContent value="description" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className="text-sm font-medium text-[var(--mcp-text)]">
                      Describe your MCP Server
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your MCP server should do..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[200px] bg-[#1F1F1F] border-white/10 text-[#DEDDDC] focus:border-[#C45736] placeholder:text-[#DEDDDC]/40"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !description.trim()}
                    className="w-full bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium"
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
                      <div className="text-sm text-[var(--mcp-text-muted)] mt-2 mb-1">
                        Download your MCP server files:
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleDownload('bundle')}
                          disabled={isDownloading}
                          className="bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download Bundle
                            </>
                          )}
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
    </div>
  );
}
