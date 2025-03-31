"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Plus, Settings, Globe, Share2, Server, Download, Laptop, Cloud, Terminal, Code, GitFork, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import supabase from "@/lib/supaClient";
import { useEffect, useState } from "react";

// Types for our data
interface MCP {
  id: string;
  name: string;
  platform: string;
  status: string;
  updated_at: string;
  client_type?: string;
  description?: string;
}

interface User {
  name: string;
  avatar_url?: string;
}

export default function Dashboard() {
  const [mcps, setMcps] = useState<MCP[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = '/auth/signin?redirect=/dashboard';
          return;
        }

        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
        } else if (userData) {
          setUser(userData);
        }

        // Get user's MCPs - using the correct table name 'mcp_projects'
        const { data: mcpData, error: mcpError } = await supabase
          .from('mcp_projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false });

        if (mcpError) {
          console.error('Error fetching MCPs:', mcpError);
        } else if (mcpData) {
          setMcps(mcpData.map(mcp => ({
            id: mcp.id,
            name: mcp.name || 'Untitled MCP',
            platform: mcp.client_type || 'Custom',
            status: mcp.status || 'offline',
            updated_at: mcp.updated_at,
            description: mcp.description
          })));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to format the last updated time
  function formatLastUpdated(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r border-border bg-card hidden lg:block animate-fade-in">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-xl font-bold text-primary">MCP Builder</h1>
        </div>
        <nav className="space-y-1 p-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Code className="h-4 w-4" />
            My MCPs
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Globe className="h-4 w-4" />
            Marketplace
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Server className="h-4 w-4" />
            Deployments
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <div className="absolute bottom-4 w-full px-4">
          <Link href="/create-mcp" className="w-full">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create New MCP
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4 animate-fade-in">
          <Button variant="ghost" size="icon" className="mr-4 lg:hidden">
            <LayoutDashboard className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <h1 className="text-lg font-semibold">Dashboard</h1>
          
          <div className="ml-auto flex items-center gap-4">
            <Link href="/create-mcp">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create MCP
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {user?.name && (
                <span className="text-sm text-muted-foreground">{user.name}</span>
              )}
              <Avatar>
                <AvatarImage src={user?.avatar_url || "https://avatar.vercel.sh/user.png"} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 animate-slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
            <p className="text-muted-foreground">Your MCP dashboard overview</p>
          </div>

          {/* My MCPs */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">My MCPs</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Code className="h-4 w-4" />
                View All
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading your MCPs...</div>
            ) : mcps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                You haven't created any MCPs yet.
                <br />
                <Link href="/create-mcp">
                  <Button variant="link" className="mt-2">Create your first MCP</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {mcps.map((mcp) => (
                  <Link href={`/mcp/${mcp.id}`} key={mcp.id}>
                    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-medium">{mcp.name}</CardTitle>
                          <div className={`w-2 h-2 rounded-full ${mcp.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <CardDescription>{mcp.description || mcp.platform}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Last updated</span>
                          <span className="text-muted-foreground">{formatLastUpdated(mcp.updated_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Marketplace</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Browse All
                  </Button>
                </div>
                <CardDescription>Discover and use MCPs from the community</CardDescription>
              </CardHeader>
              <CardFooter className="border-t p-3">
                <Button variant="ghost" size="sm" className="gap-2 w-full">
                  <GitFork className="h-4 w-4" />
                  Explore Marketplace
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}