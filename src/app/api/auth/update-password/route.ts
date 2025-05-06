import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supaClient';

export async function POST(request: NextRequest) {
  try {
    console.log('Update password request received');
    
    // Apply rate limiting to prevent abuse
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 reset attempts per 15 minutes
      keyGenerator: (req) => {
        // Use IP as the limiting key
        return `update-password:${req.ip || 'unknown'}`;
      },
    });

    const rateLimitResult = await limiter.check(request);
    if (!rateLimitResult.success) {
      console.log('Rate limit exceeded');
      return NextResponse.json(
        { error: 'Too many password update attempts. Please try again later.' }, 
        { status: 429 }
      );
    }

    const reqBody = await request.json();
    const { token, password } = reqBody;
    
    console.log('Request body received:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPrefix: token ? token.substring(0, 15) + '...' : 'missing',
      hasPassword: !!password,
      passwordLength: password?.length
    });

    if (!token) {
      console.log('Token is missing');
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!password) {
      console.log('Password is missing');
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.log('Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    try {
      // Validate token format (should be a JWT)
      if (!token.includes('.') || token.split('.').length !== 3) {
        console.log('Invalid token format (not a JWT)');
        return NextResponse.json(
          { error: 'Invalid reset token format' },
          { status: 400 }
        );
      }
    } catch (tokenValidationError) {
      console.error('Token validation error:', tokenValidationError);
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Create a fresh Supabase client instance
    console.log('Creating supabase client');
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

    // Update the user's password with the token directly
    // This is the correct way to handle password reset with tokens in Supabase
    try {
      console.log('Updating user password with token');
      const { data, error } = await supabase.auth.updateUser(
        { password },
        { accessToken: token } as any
      );

      console.log('Update result:', { success: !error, hasData: !!data, errorMessage: error?.message });

      if (error) {
        console.error('Password update error:', error);
        
        // Check for specific error types
        if (error.message.includes('token is invalid or has expired')) {
          return NextResponse.json(
            { error: 'Password reset link has expired. Please request a new password reset link.' },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      console.log('Password updated successfully');
      return NextResponse.json({
        message: 'Password has been successfully updated'
      });
    } catch (updateError: any) {
      console.error('Error during password update:', updateError);
      
      return NextResponse.json(
        { error: updateError.message || 'Failed to update password' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Failed to update password. Please try again later.' },
      { status: 500 }
    );
  }
} 