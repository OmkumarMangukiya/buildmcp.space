"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, GitFork, MoreHorizontal, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import supabase from "@/lib/supaClient";
import { useToast } from "@/components/ui/use-toast";

interface MCP {
  id: string;
  name: string;
  description?: string;
  client_type?: string;
  status: string;
  updated_at: string;
  created_at: string;
  config?: any;
  is_public: boolean;
  code?: string;
}

export default function McpDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [mcp, setMcp] = useState<MCP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMakingPublic, setIsMakingPublic] = useState(false);
  const [isMakingPrivate, setIsMakingPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMcpDetails() {
      try {
        const mcpId = params.id;
        
        // First check if MCP is public without using RLS
        const { data: publicCheck, error: publicCheckError } = await supabase
          .from('mcp_projects')
          .select('is_public')
          .eq('id', mcpId)
          .maybeSingle();
          
        // If the MCP exists but we get a permission error (PGRST116)
        if (publicCheckError && publicCheckError.code === 'PGRST116') {
          // Get current user session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            setError('This MCP is private. You must be signed in and have permission to view it.');
            setLoading(false);
            return;
          }
          
          // Try the request again, this time it will use the authenticated user's permissions
          const { data: mcpData, error: mcpError } = await supabase
            .from('mcp_projects')
            .select('*')
            .eq('id', mcpId)
            .single();
            
          if (mcpError) {
            // Still getting an error means the user doesn't have permission
            setError('This MCP is private. You do not have permission to view it.');
            setLoading(false);
            return;
          }
          
          setMcp(mcpData);
          setLoading(false);
          return;
        }
        
        // If the MCP doesn't exist at all
        if (!publicCheck && publicCheckError) {
          setError('MCP not found');
          setLoading(false);
          return;
        }
        
        // MCP exists and is public - or we have permission to view it
        const { data: mcpData, error: mcpError } = await supabase
          .from('mcp_projects')
          .select('*')
          .eq('id', mcpId)
          .single();
          
        if (mcpError) {
          // Check if it's a permission error
          if (mcpError.code === 'PGRST116') {
            // Get current user session
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
              setError('This MCP is private. You must be signed in and have permission to view it.');
            } else {
              setError('This MCP is private. You do not have permission to view it.');
            }
          } else {
            console.error('Error fetching MCP:', mcpError);
            setError('Failed to load MCP details');
          }
          return;
        }
        
        if (!mcpData) {
          setError('MCP not found');
          return;
        }
        
        setMcp(mcpData);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchMcpDetails();
    }
  }, [params.id]);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      // Get the current session token
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        throw new Error('Authentication required to download MCP');
      }

      console.log('Downloading with token:', token.substring(0, 10) + '...');

      // Create a blob URL for the file with the auth token in the headers
      const response = await fetch(`/api/mcp/download/${params.id}/bundle`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // Include cookies in the request
      });

      // Log the response status for debugging
      console.log('Download response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Download error data:', errorData);
        throw new Error(errorData.error || 'Failed to download MCP');
      }

      // Get the file as a blob
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Ensure params.id is treated as a string
      const mcpId = typeof params.id === 'string' ? params.id : params.id[0];
      a.download = `mcp-${mcpId.substring(0, 6)}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download MCP files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePublic = async () => {
    try {
      setIsMakingPublic(true);
      const { error } = await supabase
        .from('mcp_projects')
        .update({ is_public: true })
        .eq('id', params.id);

      if (error) {
        throw error;
      }

      setMcp(prev => prev ? { ...prev, is_public: true } : null);
      toast({
        title: "Success",
        description: "MCP is now public",
      });
    } catch (error) {
      console.error('Error making MCP public:', error);
      toast({
        title: "Failed to Make Public",
        description: "Failed to make MCP public. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMakingPublic(false);
    }
  };

  const handleMakePrivate = async () => {
    try {
      setIsMakingPrivate(true);
      const { error } = await supabase
        .from('mcp_projects')
        .update({ is_public: false })
        .eq('id', params.id);

      if (error) {
        throw error;
      }

      setMcp(prev => prev ? { ...prev, is_public: false } : null);
      toast({
        title: "Success",
        description: "MCP is now private",
      });
    } catch (error) {
      console.error('Error making MCP private:', error);
      toast({
        title: "Failed to Make Private",
        description: "Failed to make MCP private. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMakingPrivate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Loading MCP details...</div>
        </div>
      </div>
    );
  }

  if (error || !mcp) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">{error || 'MCP not found'}</h2>
            
            {error && error.includes('private') ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This MCP is set to private by its owner. You need to be signed in with an account that has permission to view it.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <Link href="/auth/signin">
                    <Button>Sign In</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/dashboard">
                <Button variant="link">Return to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {mcp.name}
              </h1>
              <p className="text-sm text-muted-foreground">{mcp.client_type || 'Custom'} MCP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              className="gap-2" 
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download Files
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                {!mcp.is_public ? (
                  <DropdownMenuItem 
                    onClick={handleMakePublic}
                    disabled={isMakingPublic}
                  >
                    <GitFork className="h-4 w-4 mr-2" />
                    {isMakingPublic ? 'Making Public...' : 'Make Public'}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={handleMakePrivate}
                    disabled={isMakingPrivate}
                  >
                    <GitFork className="h-4 w-4 mr-2" />
                    {isMakingPrivate ? 'Making Private...' : 'Make Private'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content - Code */}
        <Card>
          <CardHeader>
            <CardTitle>Server Implementation</CardTitle>
            <CardDescription>Generated MCP server code</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[calc(100vh-300px)]">
              {mcp.code || 'No code available'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 