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
      // Clear any remaining session data
      localStorage.removeItem('sb');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
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
  try {
    // First check if we have a session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return { data: { session: null }, error };
    }
    
    if (!data.session) {
      console.log('No session found');
      return { data: { session: null }, error: new Error('No session found') };
    }
    
    // If session exists but access token is expired or about to expire
    const expiresAt = data.session.expires_at;
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = expiresAt && expiresAt < currentTime;
    const isExpiringSoon = expiresAt && (expiresAt - currentTime) < 300; // 5 minutes
    
    if (isExpired || isExpiringSoon) {
      console.log(`Token is ${isExpired ? 'expired' : 'expiring soon'}, attempting refresh`);
      
      // Try to refresh the token
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        return { data: { session: null }, error: refreshError };
      }
      
      if (!refreshData.session) {
        console.error('Refresh succeeded but no session returned');
        return { data: { session: null }, error: new Error('No session after refresh') };
      }
      
      console.log('Token refreshed successfully');
      return { data: refreshData, error: null };
    }
    
    return { data, error };
  } catch (refreshError) {
    console.error('Error during session check/refresh:', refreshError);
    return { data: { session: null }, error: refreshError as Error };
  }
}

export default supabase;