"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Code, Star, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import supabase, { getSessionWithRefresh } from "@/lib/supaClient";
import { useEffect, useState } from "react";
import { handleAuthRedirect, isJwtExpiredError } from "@/lib/authRedirect";

// Types for our data
interface MCP {
  id: string;
  name: string;
  platform: string;
  updated_at: string;
  client_type?: string;
  description?: string;
}

interface User {
  name: string;
  avatar_url?: string;
}

interface Plan {
  id: string;
  name: string;
  interval: string;
  mcp_limit: number | null;
}

interface UserPlan {
  id: string;
  expires_at: string;
  plans: Plan;
}

interface Subscription {
  id: string;
  plan_name: string;
  plan_interval: string;
  mcp_limit: number | null;
  expires_at: string;
  mcp_remaining?: number;
  is_active: boolean;
}

export default function Dashboard() {
  const [mcps, setMcps] = useState<MCP[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user with token refresh
        const { data: { session }, error: sessionError } = await getSessionWithRefresh();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          // Use our new auth helper for redirection
          await handleAuthRedirect('/dashboard');
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

        // Get active subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_plans')
          .select(`
            id,
            expires_at,
            plans (
              id,
              name,
              interval,
              mcp_limit
            )
          `)
          .eq('user_id', session.user.id)
          .gte('expires_at', new Date().toISOString())
          .order('expires_at', { ascending: false })
          .limit(1)
          .single();

        if (subscriptionError && subscriptionError.code !== 'PGRST116') { // PGRST116 is "Results Not Found"
          console.error('Error fetching subscription:', subscriptionError);
        } else if (subscriptionData) {
          const userPlan = subscriptionData as unknown as UserPlan;
          // Get remaining MCPs if applicable
          let mcpRemaining;
          if (userPlan.plans && userPlan.plans.mcp_limit) {
            const { data: remaining } = await supabase.rpc('get_user_mcp_remaining', {
              user_uuid: session.user.id
            });
            mcpRemaining = remaining;
          }

          setSubscription({
            id: userPlan.id,
            plan_name: userPlan.plans.name,
            plan_interval: userPlan.plans.interval,
            mcp_limit: userPlan.plans.mcp_limit,
            expires_at: userPlan.expires_at,
            mcp_remaining: mcpRemaining,
            is_active: new Date(userPlan.expires_at) > new Date()
          });
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

  // Function to format expiration date
  function formatExpirationDate(timestamp: string) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <main>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4 animate-fade-in">
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

          {/* Subscription Status */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Subscription Status</h2>
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-4">Loading subscription details...</div>
                ) : subscription ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          {subscription.plan_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Active until {formatExpirationDate(subscription.expires_at)}
                        </p>
                      </div>
                      <Link href="/pricing">
                        <Button size="sm" variant="outline">Change Plan</Button>
                      </Link>
                    </div>

                    {subscription.mcp_limit !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">MCP Generations Remaining</span>
                          <span className="text-sm font-bold">{subscription.mcp_remaining} / {subscription.mcp_limit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(subscription.mcp_remaining! / subscription.mcp_limit!) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {subscription.mcp_limit === null && (
                      <div className="mt-4 flex items-center text-green-600">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="font-medium">Unlimited MCP generations</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="flex justify-center mb-4">
                      <AlertTriangle className="h-12 w-12 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-4">
                      Subscribe to a plan to unlock MCP generation capabilities.
                    </p>
                    <Link href="/pricing">
                      <Button>View Pricing Plans</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
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
        </div>
      </main>
    </div>
  );
}