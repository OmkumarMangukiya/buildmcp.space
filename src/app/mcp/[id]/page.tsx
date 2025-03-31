"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Cloud, Terminal, Settings, Share2, GitFork } from "lucide-react";
import Link from "next/link";
import supabase from "@/lib/supaClient";

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
}

export default function McpDetailsPage() {
  const params = useParams();
  const [mcp, setMcp] = useState<MCP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Function to format date
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{mcp.name}</h1>
            <div className={`w-2 h-2 rounded-full ${mcp.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <p className="text-muted-foreground">{mcp.description}</p>
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Client Type</div>
                  <div className="text-sm text-muted-foreground">{mcp.client_type || 'Custom'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm text-muted-foreground capitalize">{mcp.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground">{formatDate(mcp.created_at)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">{formatDate(mcp.updated_at)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>MCP server configuration and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                  {JSON.stringify(mcp.config, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage your MCP server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gap-2">
                  <Terminal className="h-4 w-4" />
                  Deploy Locally
                </Button>
                <Button className="w-full gap-2" variant="outline">
                  <Cloud className="h-4 w-4" />
                  Deploy to Cloud
                </Button>
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download Files
                </Button>
                <Button className="w-full gap-2" variant="outline">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your MCP server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gap-2" variant="outline">
                  <Settings className="h-4 w-4" />
                  Edit Settings
                </Button>
                {!mcp.is_public && (
                  <Button className="w-full gap-2" variant="outline">
                    <GitFork className="h-4 w-4" />
                    Make Public
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 