import { getSessionWithRefresh } from './supaClient';

/**
 * Helper function to redirect unauthorized users to login
 * @param redirectPath The path to redirect to after successful auth
 */
export async function handleAuthRedirect(redirectPath = '/dashboard') {
  try {
    // Get the current session with refresh attempt
    const { data: { session }, error } = await getSessionWithRefresh();
    
    if (error || !session) {
      console.log('No active session, redirecting to login page');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = `/auth/signin?redirect=${encodeURIComponent(redirectPath)}`;
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth redirect error:', error);
    
    // On error, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(redirectPath)}`;
    }
    return false;
  }
}

/**
 * Check if the error is a JWT expiration error
 * @param error Error object or message
 */
export function isJwtExpiredError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || error.error || JSON.stringify(error);
  
  return errorMessage.includes('JWT expired') || 
         errorMessage.includes('token expired') ||
         errorMessage.includes('PGRST301') || 
         errorMessage.includes('token is expired');
} 