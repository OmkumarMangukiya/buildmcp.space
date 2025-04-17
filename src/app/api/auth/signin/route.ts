import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { csrf } from '@/lib/csrf';
import { rateLimit } from '@/lib/rateLimit';
import supabase, { supabaseAdmin } from '@/lib/supaClient';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent brute force attacks
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 login attempts per 15 minutes
      keyGenerator: (req) => {
        // Use IP as the limiting key
        return `signin:${req.ip || 'unknown'}`;
      },
    });

    const rateLimitResult = await limiter.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' }, 
        { status: 429 }
      );
    }

    const { email, password, redirect } = await request.json();
    const redirectUrl = redirect || '/dashboard';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create a fresh Supabase client instance for authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Use signInWithPassword to authenticate
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Add specific handling for unverified email error
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Please verify your email before signing in. Check your inbox for a verification link.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Check if email is confirmed by looking at user's email_confirmed_at field
    if (data.user && !data.user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Please verify your email before signing in. Check your inbox for a verification link.' },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 401 }
      );
    }

    // Update user profile in the database
    if (data.user) {
      // Check if supabaseAdmin is available
      if (!supabaseAdmin) {
        console.error('Service role client not available. User profile update may fail.');
        // Try with regular client as fallback
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name || 'User',
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error updating user profile:', profileError);
        }
      } else {
        // Use admin client to bypass RLS
        const { error: profileError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name || 'User',
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error updating user profile with admin client:', profileError);
        }
      }
    }

    // Generate a CSRF token for the session
    const csrfToken = csrf.generate(data.session.user.id);

    // Create a response with the session data
    const response = NextResponse.json({
      success: true,
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      },
      csrfToken, // Include CSRF token in response
      redirect: redirectUrl
    });
    
    // Set the cookies required by Supabase Auth
    response.cookies.set({
      name: 'sb-access-token',
      value: data.session.access_token,
      path: '/',
      maxAge: 3600 * 8, // 8 hours
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    
    response.cookies.set({
      name: 'sb-refresh-token',
      value: data.session.refresh_token,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // Set CSRF cookie (not httpOnly so it can be read by JS)
    response.cookies.set({
      name: 'csrf-token',
      value: csrfToken,
      path: '/',
      maxAge: 3600 * 8, // 8 hours
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
    });
    
    return response;
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
