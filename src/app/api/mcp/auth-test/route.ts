import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

interface AuthInfo {
  headerToken: string | null;
  cookieTokens: Record<string, string>;
  user: {
    id: string;
    email: string | null;
    role: string | null;
  } | null;
  sessionValid: boolean;
  error: string | null;
}

// Helper function to extract auth token from request
async function getAuthInfo(request: Request): Promise<AuthInfo> {
  const authInfo: AuthInfo = {
    headerToken: null,
    cookieTokens: {},
    user: null,
    sessionValid: false,
    error: null
  };
  
  try {
    // Check auth header
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      authInfo.headerToken = authHeader.replace('Bearer ', '').substring(0, 15) + '...';
      
      // Try to validate the token
      const { data, error } = await supabaseAdmin!.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!error && data.user) {
        authInfo.user = {
          id: data.user.id,
          email: data.user.email || null,
          role: data.user.role || null
        };
        authInfo.sessionValid = true;
      } else if (error) {
        authInfo.error = error.message;
      }
    }
    
    // Check cookies
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      // Try different possible cookie names
      const cookiePatterns = [
        /sb-access-token=([^;]+)/,
        /sb-access-token-client=([^;]+)/,
        /access_token=([^;]+)/
      ];
      
      for (const [index, pattern] of cookiePatterns.entries()) {
        const match = cookieHeader.match(pattern);
        if (match && match[1]) {
          const tokenPreview = match[1].substring(0, 15) + '...';
          const cookieKey = `cookie${index + 1}` as string;
          authInfo.cookieTokens[cookieKey] = tokenPreview;
          
          // Only validate if we don't already have a valid user
          if (!authInfo.sessionValid) {
            const { data, error } = await supabaseAdmin!.auth.getUser(match[1]);
            if (!error && data.user) {
              authInfo.user = {
                id: data.user.id,
                email: data.user.email || null,
                role: data.user.role || null
              };
              authInfo.sessionValid = true;
            }
          }
        }
      }
    }
    
    return authInfo;
  } catch (error) {
    return {
      ...authInfo,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET(request: Request) {
  const authInfo = await getAuthInfo(request);
  
  return NextResponse.json({
    authenticated: authInfo.sessionValid,
    authInfo,
    requestHeaders: {
      authorization: request.headers.has('authorization'),
      cookie: !!request.headers.get('cookie'),
      method: request.method,
      url: request.url
    }
  });
} 