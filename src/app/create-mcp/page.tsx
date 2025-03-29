'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, Server, Zap, Info, Code, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MCPConfigViewer from '@/components/mcp/MCPConfigViewer';
import DeployMCPButton from '@/components/mcp/DeployMCPButton';
import DeploymentResult from '@/components/mcp/DeploymentResult';

// Import the planned components (will be created next)
// import MCPForm from '@/components/mcp/MCPForm';
// import DeployMCPButton from '@/components/mcp/DeployMCPButton';

export default function CreateMcpPage() {
  const [description, setDescription] = useState('');
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [mcpId, setMcpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [deployTarget, setDeployTarget] = useState("local");
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentDetails, setDeploymentDetails] = useState<any>(null);

  // Templates for common MCP server types
  const templates = [
    {
      id: "file-system",
      name: "File System Server",
      description: "Expose files and directories as resources, with tools for file operations",
      example: "Create an MCP server that exposes my project files as resources and provides tools for searching, reading, and analyzing code files. It should work with both Claude Desktop and Cursor AI clients."
    },
    {
      id: "database",
      name: "Database Connector",
      description: "Connect to databases, expose schemas, and provide query tools",
      example: "Build an MCP server that connects to a PostgreSQL database, exposes table schemas as resources, and provides tools for running read-only SQL queries. Include prompts for common data analysis tasks."
    },
    {
      id: "api-wrapper",
      name: "API Wrapper",
      description: "Wrap external APIs as MCP tools and resources",
      example: "Create an MCP server that wraps the GitHub API. It should provide tools for creating issues, searching repositories, and accessing repository content. The server should handle authentication and expose repository structure as resources."
    },
    {
      id: "llm-agent",
      name: "LLM-powered Agent",
      description: "Build an autonomous agent with LLM-based reasoning",
      example: "Build an MCP server that acts as a research assistant. It should provide tools for web searching, summarizing content, and saving research notes. Include prompts for initiating different types of research tasks."
    }
  ];

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setDescription(template.example);
    }
  };

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
      setActiveTab("config");
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save/Edit functionality
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

  // Deploy functionality
  const handleDeploy = async () => {
    if (!mcpId) return;
    setDeploymentStatus('Deploying...');
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
      setDeploymentStatus(`Deployment successful: ${result.deploymentUrl}`);
      setActiveTab("deploy");
    } catch (err: any) {
      setError(err.message || 'An unknown deployment error occurred');
      setDeploymentStatus(null);
    } 
  };

  const handleDeploySuccess = (url: string, details: any) => {
    setDeploymentUrl(url);
    setDeploymentDetails(details);
    setDeploymentStatus('success');
  };
  
  const handleDeployFailure = (errorMessage: string) => {
    setError(errorMessage);
    setDeploymentStatus(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">MCP Server Builder</h1>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create AI-Powered MCP Server</CardTitle>
          <CardDescription>
            Design and deploy MCP servers powered by AI models. MCP (Model Context Protocol) servers 
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
              <TabsTrigger value="deploy" disabled={!generatedConfig} className="flex items-center gap-1">
                <Server className="h-4 w-4" /> Deployment
              </TabsTrigger>
            </TabsList>
            
            {/* Step 1: Description */}
            <TabsContent value="description" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Start with a Template</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose a template or create your own custom MCP server
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templates.map(template => (
                      <div 
                        key={template.id}
                        className={`border rounded-lg p-3 cursor-pointer hover:border-primary transition-all
                          ${selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'border-muted'}`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <h4 className="font-medium flex items-center gap-2">
                          {selectedTemplate === template.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          {template.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Describe Your MCP Server</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Provide a natural language description of the MCP server you want to build.
                    Include details about resources, tools, and prompts.
                  </p>
                  <Textarea
                    placeholder="e.g., Create an MCP that exposes my project's README.md as a resource and provides a tool to summarize it..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    disabled={isLoading}
                    className="mb-2"
                  />
                  
                  <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="guidance">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-1">
                          <Info className="h-4 w-4" /> 
                          Tips for better results
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Be specific about what resources your server should expose</li>
                          <li>Describe the tools your server should provide</li>
                          <li>Mention any prompts it should offer</li>
                          <li>Specify external systems it needs to interact with</li>
                          <li>Indicate which clients will use this MCP (Claude Desktop, Cursor AI, etc.)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !description}
                  className="w-full"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Generate MCP Configuration
                </Button>
              </div>
            </TabsContent>
            
            {/* Step 2: Configuration */}
            <TabsContent value="config" className="space-y-4">
              {generatedConfig ? (
                <MCPConfigViewer 
                  configJson={generatedConfig} 
                  onSave={handleSave}
                  onDeploy={() => setActiveTab("deploy")}
                />
              ) : (
                <div className="flex justify-center items-center h-48">
                  <p className="text-muted-foreground">No configuration generated yet.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Step 3: Deployment */}
            <TabsContent value="deploy" className="space-y-4">
              <div className="grid gap-4 py-4">
                <h3 className="text-lg font-medium">Deploy Your MCP Server</h3>
                <p className="text-sm text-muted-foreground">
                  Choose where to deploy your MCP server
                </p>
                
                <RadioGroup 
                  value={deployTarget} 
                  onValueChange={setDeployTarget}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="local" id="local" />
                      <div>
                        <Label htmlFor="local" className="font-medium">Local Deployment</Label>
                        <p className="text-sm text-muted-foreground">
                          Deploy for local use with Claude Desktop or Cursor AI.
                          Files will be generated for you to download.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="cloud" id="cloud" />
                      <div>
                        <Label htmlFor="cloud" className="font-medium">Cloud Deployment</Label>
                        <p className="text-sm text-muted-foreground">
                          Deploy to our cloud hosting for remote access.
                          Get a URL to configure in Claude Desktop or Cursor AI.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
                
                {deploymentStatus === 'success' && deploymentUrl ? (
                  <DeploymentResult 
                    deploymentUrl={deploymentUrl}
                    deployTarget={deployTarget as 'local' | 'cloud'}
                    details={deploymentDetails}
                  />
                ) : (
                  <DeployMCPButton 
                    mcpId={mcpId || ''}
                    deployTarget={deployTarget as 'local' | 'cloud'}
                    onDeploySuccess={handleDeploySuccess}
                    onDeployFailure={handleDeployFailure}
                  />
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
