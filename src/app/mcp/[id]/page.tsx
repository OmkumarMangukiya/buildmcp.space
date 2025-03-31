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

  useEffect(() => {
    async function fetchMcpDetails() {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = '/auth/signin?redirect=/mcp/' + params.id;
          return;
        }

        // Fetch MCP details
        const { data, error } = await supabase
          .from('mcp_projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Error fetching MCP:', error);
          setError('Failed to load MCP details');
          return;
        }

        if (!data) {
          setError('MCP not found');
          return;
        }

        setMcp(data);
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
      window.location.href = `/api/mcp/download/${params.id}/bundle`;
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download MCP files. Please try again.",
        variant: "destructive",
      });
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
            <h2 className="text-xl font-semibold mb-2">{error || 'MCP not found'}</h2>
            <Link href="/dashboard">
              <Button variant="link">Return to Dashboard</Button>
            </Link>
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
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {mcp.name}
                <div className={`w-2 h-2 rounded-full ${mcp.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
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
                {!mcp.is_public && (
                  <DropdownMenuItem 
                    onClick={handleMakePublic}
                    disabled={isMakingPublic}
                  >
                    <GitFork className="h-4 w-4 mr-2" />
                    {isMakingPublic ? 'Making Public...' : 'Make Public'}
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