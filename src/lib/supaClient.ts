import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

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

// Use createBrowserClient for better cookie management in browser environments
const createBrowserSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return null; // Return null if running on server
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'sb-auth-token',
    },
    cookies: {
      // Use a custom function for setting cookies to avoid errors with package's cookie format
      get(name) {
        const cookies = document.cookie.split(';').map(c => c.trim());
        const cookie = cookies.find(c => c.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : undefined;
      },
      set(name, value, options) {
        let cookie = `${name}=${value}`;
        if (options.path) cookie += `; path=${options.path}`;
        if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
        if (options.domain) cookie += `; domain=${options.domain}`;
        if (options.sameSite) {
          // Handle sameSite option correctly based on its type
          if (typeof options.sameSite === 'string') {
            cookie += `; samesite=${options.sameSite.toLowerCase()}`;
          } else if (options.sameSite === true) {
            cookie += '; samesite=strict';
          }
        }
        if (options.secure) cookie += '; secure';
        if (options.httpOnly) cookie += '; httponly';
        document.cookie = cookie;
      },
      remove(name, options) {
        const cookie = `${name}=; max-age=0`;
        document.cookie = cookie;
      }
    }
  });
};

// Regular client for authenticated operations - fall back to regular client when not in browser
const supabase = typeof window !== 'undefined'
  ? (createBrowserSupabaseClient() || createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-auth-token',
      }
    }))
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-auth-token',
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
      localStorage.removeItem('sb-auth-token');
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in');
      // Force middleware to detect the session by setting cookies
      document.cookie = `sb-access-token=${session?.access_token}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
      document.cookie = `sb-refresh-token=${session?.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
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

// Export a function to synchronize cookies with session
export function syncCookiesWithSession(session: any) {
  if (typeof document === 'undefined' || !session) return;
  
  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;
  const expiresAt = session.expires_at || Math.floor(Date.now()/1000) + 3600;
  
  // Set cookies at document level for middleware detection
  document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
  document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  
  // Also save to localStorage as backup
  localStorage.setItem('sb-auth-token', JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  }));
  
  console.log('Cookies and localStorage synchronized with session');
}

export default supabase;