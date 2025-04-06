import { createClient } from '@supabase/supabase-js'

// For client-side usage in Next.js, we need to use NEXT_PUBLIC_ prefixed variables
// or use a different strategy for client components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only log warnings in development, not in production
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Supabase URL or anonymous key not provided. Authentication features will not work properly.');
  }
}

// Regular client for authenticated operations
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb',
    flowType: 'pkce',
  }
});

// Add an event listener to handle auth state changes and token refreshing
if (typeof window !== 'undefined') {
  // Only run this on the client side
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token has been refreshed');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in');
    } else if (event === 'USER_UPDATED') {
      console.log('User updated');
    }
  });
}

// Service role client for admin operations (bypasses RLS)
// This should only be used in server components
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper to get session with auto-refresh attempt
export async function getSessionWithRefresh() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    console.error('Error getting session or no session found:', error);
    return { data: { session: null }, error };
  }
  
  // If session exists but access token is expired or about to expire
  const expiresAt = data.session.expires_at;
  const isExpiringSoon = expiresAt && (expiresAt - Math.floor(Date.now() / 1000)) < 300; // 5 minutes
  
  if (isExpiringSoon) {
    console.log('Token is expiring soon, attempting refresh');
    try {
      // Try to refresh the token
      const refreshResult = await supabase.auth.refreshSession();
      
      if (refreshResult.error) {
        console.error('Failed to refresh token:', refreshResult.error);
      } else {
        console.log('Token refreshed successfully');
      }
      
      // Return the latest session state
      return await supabase.auth.getSession();
    } catch (refreshError) {
      console.error('Error during token refresh:', refreshError);
      return { data: { session: null }, error: refreshError as Error };
    }
  }
  
  return { data, error };
}

export default supabase;