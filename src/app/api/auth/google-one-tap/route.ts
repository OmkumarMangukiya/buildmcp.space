import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { credential, nonce } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'Google credential is required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Use Supabase Auth to verify and exchange the Google token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
      nonce,
    });

    if (error) {
      console.error('Google One Tap sign-in error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session data returned from authentication' },
        { status: 400 }
      );
    }

    // Calculate cookie expiry times
    const sessionExpiry = data.session.expires_at
      ? new Date(data.session.expires_at * 1000)
      : new Date(Date.now() + 3600 * 1000); // 1 hour

    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Set both cookies with consistent names and settings
    cookieStore.set('sb-access-token', data.session.access_token, {
      expires: sessionExpiry,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    cookieStore.set('sb-refresh-token', data.session.refresh_token, {
      expires: refreshExpiry,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Return the session data so it can be used client-side
    return NextResponse.json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        user: data.user
      },
      redirect: '/dashboard'
    });
  } catch (err) {
    console.error('Unexpected error in Google One Tap handler:', err);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 