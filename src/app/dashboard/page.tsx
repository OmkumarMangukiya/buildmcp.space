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
  const [authError, setAuthError] = useState<string | null>(null);

  // Function to ensure authentication is properly established
  async function ensureAuth() {
    try {
      // Get the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }
      
      if (!data.session) {
        console.log('No session found');
        return null;
      }
      
      return data.session;
    } catch (e) {
      console.error('Error in ensureAuth:', e);
      return null;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setAuthError(null);
        
        // Ensure we have a valid session
        const session = await ensureAuth();
        
        if (!session) {
          console.log('No valid session found, redirecting to login');
          setAuthError('Session expired. Please sign in again.');
          window.location.href = `/auth/signin?redirect=${encodeURIComponent('/dashboard')}`;
          return;
        }
        
        console.log('Session found, user ID:', session.user.id);
        
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
          
        if (subscriptionError) {
          if (subscriptionError.code !== 'PGRST116') { // PGRST116 is "Results Not Found"
            console.error('Error fetching subscription:', subscriptionError);
          } else {
            console.log('No active subscription found.');
          }
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
        
        // Get user's MCPs
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
        console.error('Error in dashboard:', error);
        setAuthError('An unexpected error occurred. Please try refreshing the page.');
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
  
  // Handle sign out with proper cleanup
  async function handleSignOut() {
    try {
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb');
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
        
        // Clear cookies by setting expiration in the past
        document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'sb-access-token-client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'sb-refresh-token-client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      // Redirect to sign in page
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error in sign out:', error);
    } finally {
      setLoading(false);
    }
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              disabled={loading}
            >
              Sign out
            </Button>
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

          {/* Authentication Error */}
          {authError && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                  <p className="text-sm text-red-700 mt-1">{authError}</p>
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mr-3"
                      onClick={() => window.location.reload()}
                    >
                      Refresh Page
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => window.location.href = "/auth/signin?redirect=/dashboard"}
                    >
                      Sign In Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                          <span className={`text-sm font-bold ${subscription.mcp_remaining! <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                            {subscription.mcp_remaining} / {subscription.mcp_limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              subscription.mcp_remaining! / subscription.mcp_limit! < 0.2 ? 'bg-red-600' : 
                              subscription.mcp_remaining! / subscription.mcp_limit! < 0.5 ? 'bg-orange-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.max(5, (subscription.mcp_remaining! / subscription.mcp_limit!) * 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          This count decreases each time you generate a new MCP.
                        </p>
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
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">My MCPs</h2>
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