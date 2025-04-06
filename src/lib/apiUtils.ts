import supabase, { getSessionWithRefresh } from './supaClient';

/**
 * Makes an authenticated API request with token refresh
 * @param url API endpoint URL
 * @param options Fetch options
 * @returns Response data
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Get session with refresh if needed
    const { data: { session }, error: sessionError } = await getSessionWithRefresh();
    
    if (sessionError || !session) {
      throw new Error('Authentication required');
    }
    
    // Add auth headers
    const authHeaders = {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Make the API request
    const response = await fetch(url, {
      ...options,
      headers: authHeaders,
    });
    
    // Handle 401 Unauthorized (possibly expired token even after refresh)
    if (response.status === 401) {
      // Force sign out if still unauthorized after refresh
      await supabase.auth.signOut();
      throw new Error('Session expired. Please sign in again.');
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    
    // Rethrow for caller to handle
    throw error;
  }
}

/**
 * Checks if the user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated() {
  try {
    const { data: { session } } = await getSessionWithRefresh();
    return !!session;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
} 