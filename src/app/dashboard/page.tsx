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
            // Redirect users without a subscription to the pricing page
            window.location.href = '/pricing?needSubscription=true';
            return;
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
    <div className="min-h-screen bg-[#0F0F0F] text-gray-400">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0F0F0F]/90 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tight group">
              <span className="text-[#E1623D]">buildmcp.space</span>
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={handleSignOut} className="text-gray-500 font-medium hover:text-white transition-colors">Sign out</button>
            <div className="text-white font-medium">{user?.name || 'User'}</div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-6 py-20">
        <div className="mt-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5 relative">
            <div>
              <h1 className="text-2xl font-semibold mb-1 text-white">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-gray-500 text-sm">Your MCP dashboard overview</p>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/create-mcp">
                <Button className="flex items-center gap-2 bg-[#E1623D] text-white px-5 py-2.5 rounded-md font-medium">
                  <span>+</span> Create MCP
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Subscription Status */}
          <div className="mb-10 bg-[#1A1A1A] rounded-lg p-8 border-l-4 border-[#E1623D] border-t border-r border-b border-white/5 shadow-lg">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[#E1623D]" />
                <span className="font-semibold text-lg text-white">
                  {subscription?.plan_name || 'Basic'} {subscription?.plan_interval || 'Monthly'}
                </span>
              </div>
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="text-sm text-gray-500 font-medium hover:text-white">
                  Change Plan
                </Button>
              </Link>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              {subscription ? `Active until ${formatExpirationDate(subscription.expires_at)}` : 'Active until May 6, 2025'}
            </p>
            
            <div className="space-y-3">
              {subscription?.mcp_limit && (
                <>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">MCP Generations Remaining</span>
                    <span className="text-[#E1623D] font-medium">
                      {subscription.mcp_remaining || 0} / {subscription.mcp_limit}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#E1623D] rounded-full"
                      style={{ 
                        width: `${subscription.mcp_limit ? (subscription.mcp_remaining || 0) / subscription.mcp_limit * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">This count decreases each time you generate a new MCP.</p>
                </>
              )}
              {!subscription?.mcp_limit && subscription?.plan_name?.toLowerCase().includes('premium') && (
                <div className="flex items-center text-sm mb-2">
                  <span className="text-gray-400">Unlimited MCP generations available</span>
                </div>
              )}
            </div>
          </div>
          
          {/* MCPs */}
          <div className="relative">
            <h2 className="text-xl font-semibold mb-6 text-white">My MCPs</h2>
            
            {mcps.length === 0 && !loading ? (
              <div className="text-center py-16 bg-[#1A1A1A] rounded-lg border border-white/5">
                <p className="text-gray-500 mb-4">You haven't created any MCPs yet</p>
                <Link href="/create-mcp">
                  <Button className="bg-[#E1623D] text-white hover:bg-[#E1623D]/90">
                    Create your first MCP
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-lg p-6 border-l-2 border-l-[#E1623D] border-t border-r border-b border-white/5 animate-pulse">
                      <div className="h-7 bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="h-16 bg-gray-700 rounded w-full mb-5 opacity-50"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  mcps.map(mcp => (
                    <Link href={`/mcp/${mcp.id}`} key={mcp.id}>
                      <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-2 border-l-[#E1623D] border-t border-r border-b border-white/5 cursor-pointer hover:bg-[#222] transition-colors">
                        <h3 className="font-medium text-lg mb-3 truncate text-white">{mcp.name}</h3>
                        <p className="text-sm text-gray-500 mb-5 line-clamp-3 leading-relaxed">
                          {mcp.description || `MCP for ${mcp.platform} with custom configurations and integrations.`}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Last updated</span>
                          <span>{formatLastUpdated(mcp.updated_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}