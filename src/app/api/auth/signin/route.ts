import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supaClient';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, redirect } = await request.json();
    const redirectUrl = redirect || '/dashboard';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Set auth cookies
    if (data.session) {
      const cookieStore = cookies();
      
      // Set access token cookie with extended duration
      cookieStore.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 604800, // 7 days in seconds
      });
      
      // Set refresh token cookie with extended duration
      cookieStore.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      redirect: redirectUrl
    });
    
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
