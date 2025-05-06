import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supaClient';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent abuse
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // 3 reset attempts per 15 minutes
      keyGenerator: (req) => {
        // Use IP as the limiting key
        return `reset-password:${req.ip || 'unknown'}`;
      },
    });

    const rateLimitResult = await limiter.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' }, 
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists and is using OAuth
    try {
      if (supabaseAdmin) {
        // Use the correct parameter structure for listUsers
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        
        if (error) {
          console.error('Error listing users:', error);
        } else if (data && data.users) {
          // Filter users by email manually
          const matchingUsers = data.users.filter(user => user.email === email);
          
          if (matchingUsers.length > 0) {
            const user = matchingUsers[0];
            
            console.log('User metadata:', JSON.stringify(user.app_metadata));
            
            // Check if the user is ONLY using OAuth (and has no email provider)
            // A user with both email and OAuth should be able to reset their password
            const isOAuthOnlyUser = 
              // Has a provider in metadata
              user.app_metadata && 
              user.app_metadata.provider && 
              user.app_metadata.provider !== 'email' &&
              // Check the identity providers array to see if email is one of them
              Array.isArray(user.identities) && 
              !user.identities.some(identity => identity.provider === 'email');
            
            console.log('Is OAuth only user:', isOAuthOnlyUser);
            
            if (isOAuthOnlyUser) {
              // User only has OAuth providers
              return NextResponse.json(
                { error: `This account uses ${user.app_metadata.provider} for authentication. Please sign in with ${user.app_metadata.provider} instead.` },
                { status: 400 }
              );
            }
          }
        }
      }
    } catch (checkError) {
      console.error('Error checking OAuth status:', checkError);
      // Continue with password reset flow
    }

    // Create a fresh Supabase client instance
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

    // Log environment variables for debugging (sensitive parts masked)
    console.log('Environment variables:', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
      ANON_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'not set',
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    // Even if the user doesn't exist, still call resetPasswordForEmail
    // to prevent email enumeration attacks
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    if (error) {
      console.log('Supabase resetPasswordForEmail error:', error);
      // Don't expose error details to the client
    }

    // Don't leak information about whether the email exists or not
    return NextResponse.json({
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to send password reset email. Please try again later.' },
      { status: 500 }
    );
  }
} 