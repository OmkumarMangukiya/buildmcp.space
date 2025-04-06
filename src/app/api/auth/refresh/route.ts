import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Get tokens from cookies
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    const accessToken = cookieStore.get('sb-access-token')?.value;
    
    if (!refreshToken || !accessToken) {
      return NextResponse.json(
        { error: 'No authentication tokens found' },
        { status: 401 }
      );
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
    
    // Explicitly refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (!data.session) {
      return NextResponse.json(
        { error: 'Failed to refresh session' },
        { status: 401 }
      );
    }
    
    // Update cookies with new tokens
    cookieStore.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800, // 7 days
    });
    
    cookieStore.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    // Return successful response with redirect parameter
    const redirectTo = req.nextUrl.searchParams.get('redirect') || '/dashboard';
    
    return NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      redirect: redirectTo
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh authentication' },
      { status: 500 }
    );
  }
} 