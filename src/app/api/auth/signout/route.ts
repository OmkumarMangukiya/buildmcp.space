import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie to use for signout
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;
    
    // Create a response with cookie cleanup - we'll do this regardless of outcome
    const response = NextResponse.json({
      success: true,
      message: 'Successfully signed out',
    });

    // List of all possible Supabase auth cookies to clear
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'sb',
      'supabase-auth-token',
      'sb-access-token-client',
      'sb-refresh-token-client'
    ];

    // Clear all auth cookies with different path options - do this no matter what
    cookiesToClear.forEach(cookieName => {
      // Clear with path /
      response.cookies.set({
        name: cookieName,
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      
      // Also try without httpOnly for client-side cookies
      response.cookies.set({
        name: cookieName,
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
      });
    });

    // Also clear the CSRF token cookie if it exists
    response.cookies.set({
      name: 'csrf-token',
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
    });

    // If no tokens in cookies, user is already signed out, return early with cleared cookies
    if (!accessToken && !refreshToken) {
      console.log('No tokens found, user already signed out');
      return response;
    }

    // Create a fresh Supabase client instance for signout
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );

    // If we have an access token, try to set it for the signout request
    if (accessToken && refreshToken) {
      try {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
      } catch (setSessionError) {
        // Ignore errors when setting session, just continue with signout
        console.log('Error setting session for signout (ignoring):', setSessionError);
      }
    }

    // Try to refresh the session first, which helps in some cases
    try {
      await supabase.auth.refreshSession();
    } catch (refreshError) {
      // Ignore refresh errors, continue with signout
      console.log('Refresh session error (ignoring):', refreshError);
    }

    // Try to sign out with global scope
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (signOutError: any) {
      // Just log the error, but don't return an error response
      console.log('Sign out API error (handled):', signOutError);
      
      // Specific handling for the known 403 error
      if (signOutError.status === 403 || 
          (signOutError.message && signOutError.message.includes('session_not_found'))) {
        console.log('Got the known 403 "session_not_found" error, ignoring');
      }
    }

    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    
    // Even if there's an error, return success with cleared cookies
    const response = NextResponse.json({
      success: true,
      message: 'Signed out with cookie cleanup',
    });
    
    // Clear important cookies anyway
    response.cookies.set({
      name: 'sb-access-token',
      value: '',
      path: '/',
      maxAge: 0,
    });
    
    response.cookies.set({
      name: 'sb-refresh-token',
      value: '',
      path: '/',
      maxAge: 0,
    });
    
    return response;
  }
} 