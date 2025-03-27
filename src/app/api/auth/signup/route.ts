import { NextRequest, NextResponse } from 'next/server';
import supabase, { supabaseAdmin } from '@/lib/supaClient';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Register user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create user record in our database using service role client
    if (authData.user) {
      // Check if supabaseAdmin is available
      if (!supabaseAdmin) {
        console.error('Service role client not available. User profile creation may fail.');
        // Try with regular client as fallback
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            name: name,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      } else {
        // Use admin client to bypass RLS
        const { error: profileError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            name: name,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating user profile with admin client:', profileError);
        }
      }
    }

    return NextResponse.json({
      user: authData.user,
      message: 'User created successfully',
    });
    
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
