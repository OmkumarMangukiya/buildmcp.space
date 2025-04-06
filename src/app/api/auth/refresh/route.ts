import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Get refresh token from cookies
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    
    // If no refresh token found, can't proceed with refresh
    if (!refreshToken) {
      console.log('No refresh token found');
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      );
    }
    
    // Create a Supabase client for token refresh
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
    
    // Explicitly refresh the session with the refresh token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    
    if (error) {
      console.error('Session refresh error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (!data.session) {
      console.error('No session returned after refresh');
      return NextResponse.json(
        { error: 'Failed to refresh session' },
        { status: 401 }
      );
    }
    
    // Set the new cookies with appropriate configuration
    const response = NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      },
      redirect: req.nextUrl.searchParams.get('redirect') || '/dashboard'
    });
    
    // Set access token cookie
    response.cookies.set({
      name: 'sb-access-token',
      value: data.session.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days
    });
    
    // Set refresh token cookie
    response.cookies.set({
      name: 'sb-refresh-token',
      value: data.session.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    // Also set non-httpOnly versions of the tokens for client-side access
    response.cookies.set({
      name: 'sb-access-token-client',
      value: data.session.access_token,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days
    });
    
    response.cookies.set({
      name: 'sb-refresh-token-client',
      value: data.session.refresh_token,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh authentication' },
      { status: 500 }
    );
  }
} 