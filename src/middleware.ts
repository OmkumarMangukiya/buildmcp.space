import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Only run this middleware for authenticated routes
  const protectedPaths = ['/dashboard', '/create-mcp', '/mcp/', '/pricing', '/api/payments'];
  const isProtectedRoute = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
  
  if (!isProtectedRoute) {
    return res;
  }

  // Skip for API routes (they'll handle their own auth)
  if (req.nextUrl.pathname.startsWith('/api/') && !req.nextUrl.pathname.startsWith('/api/auth')) {
    return res;
  }

  // Get the refresh token from the cookies
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  const accessToken = req.cookies.get('sb-access-token')?.value;
  
  // If there's no refresh token, redirect to login
  if (!refreshToken || !accessToken) {
    return redirectToLogin(req);
  }

  // Create a Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // Try to refresh the session
    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    if (error) {
      console.error('Error refreshing session:', error);
      return redirectToLogin(req);
    }

    // Set the new tokens in cookies
    res.cookies.set('sb-access-token', data.session?.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days in seconds
    });

    res.cookies.set('sb-refresh-token', data.session?.refresh_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return res;
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/auth/signin';
  redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

// Add paths where this middleware should run
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-mcp/:path*',
    '/mcp/:path*',
    '/pricing/:path*',
    '/api/payments/:path*',
  ],
}; 