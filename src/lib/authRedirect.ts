import { getSessionWithRefresh } from './supaClient';

/**
 * Helper function to handle auth redirection with explicit token refresh
 * @param redirectPath The path to redirect to after successful auth
 */
export async function handleAuthRedirect(redirectPath = '/dashboard') {
  try {
    // First try to get a valid session using our custom refresh helper
    const { data: { session }, error: sessionError } = await getSessionWithRefresh();
    
    if (sessionError || !session) {
      // If normal refresh fails, try explicit refresh
      const refreshResponse = await fetch(`/api/auth/refresh?redirect=${encodeURIComponent(redirectPath)}`);
      const refreshData = await refreshResponse.json();
      
      if (!refreshResponse.ok) {
        // If explicit refresh fails, redirect to sign in
        window.location.href = `/auth/signin?redirect=${encodeURIComponent(redirectPath)}`;
        return false;
      }
      
      // If explicit refresh succeeds, redirect to the requested page
      window.location.href = refreshData.redirect || redirectPath;
      return true;
    }
    
    // If we already have a valid session, we're good
    return true;
  } catch (error) {
    console.error('Authentication redirect error:', error);
    // On any error, redirect to sign in
    window.location.href = `/auth/signin?redirect=${encodeURIComponent(redirectPath)}`;
    return false;
  }
}

/**
 * Simple function to check if the error is a JWT expiration error
 * @param error Error object or message
 */
export function isJwtExpiredError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || error.error || JSON.stringify(error);
  
  return errorMessage.includes('JWT expired') || 
         errorMessage.includes('PGRST301') || 
         errorMessage.includes('token is expired');
} 