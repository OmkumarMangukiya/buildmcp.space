import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Extract the pathname and search params from the request URL
  const { pathname, searchParams } = req.nextUrl;
  
  // Skip auth check if this is a signout redirect
  const isSignoutRedirect = searchParams.has('t') || 
                          searchParams.has('signedout') || 
                          searchParams.has('error');
  if (pathname === '/auth/signin' && isSignoutRedirect) {
    console.log('Detected signout redirect, skipping auth check');
    return res;
  }
  
  // Define protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/create-mcp',
    '/mcp/',
    '/pricing',
    '/api/payments'
  ];
  
  // Check if the current path requires authentication
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  
  // Skip auth check for API routes (they'll handle their own auth)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    return res;
  }
  
  // Skip authentication check for non-protected routes
  if (!isProtectedRoute) {
    return res;
  }
  
  // Get cookies from the request
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  
  // Debug cookie presence
  console.log('Cookies in middleware:', {
    accessTokenPresent: !!accessToken,
    refreshTokenPresent: !!refreshToken,
    requestUrl: pathname,
  });
  
  // Basic validation - if there are no tokens, redirect to sign in
  if (!accessToken || !refreshToken) {
    console.log('No tokens found in cookies, redirecting to login');
    return redirectToLogin(req);
  }
  
  try {
    // Check if the token is valid by decoding and checking expiry
    if (isTokenExpired(accessToken)) {
      console.log('Access token is expired, redirecting to login');
      return redirectToLogin(req);
    }
    
    // Token is valid, proceed with the request
    return res;
  } catch (err) {
    console.error('Middleware auth error:', err);
    return redirectToLogin(req);
  }
}

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    // Split the token and get the payload part (middle)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }
    
    // Decode the base64 payload
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString()
    );
    
    // Check if the token has an expiry
    if (!payload.exp) {
      return false; // No expiry means it doesn't expire
    }
    
    // Compare expiry timestamp (in seconds) with current time
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Consider expired on error
  }
}

// Helper function to redirect to login page
function redirectToLogin(req: NextRequest): NextResponse {
  const redirectUrl = new URL('/auth/signin', req.url);
  redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-mcp/:path*',
    '/mcp/:path*',
    '/pricing/:path*',
    '/api/payments/:path*',
  ]
}; 