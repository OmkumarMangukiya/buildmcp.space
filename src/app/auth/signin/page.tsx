'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import supabase from '@/lib/supaClient';
import OneTapComponent from '@/components/ui/OneTapComponent';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import { Separator } from '@/components/ui/separator';

// Create a client component that uses useSearchParams
function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const isRegistered = searchParams.get('registered') === 'true';
  const isVerified = searchParams.get('verified') === 'true';
  const needsVerificationParam = searchParams.get('verify') === 'true';
  const verificationEmail = searchParams.get('email') || '';

  useEffect(() => {
    // Show success message if the user just registered
    if (isRegistered && needsVerificationParam) {
      setSuccessMessage(`Please check your email (${verificationEmail}) to verify your account. You'll need to verify your email before signing in.`);
      setNeedsVerification(true);
      setEmail(verificationEmail);
    } else if (isVerified) {
      setSuccessMessage('Your email has been verified! You can now sign in.');
    }
  }, [isRegistered, isVerified, needsVerificationParam, verificationEmail]);

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address to resend verification');
      return;
    }
    
    setResendingEmail(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin?verified=true&redirect=/pricing`,
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccessMessage(`Verification email resent to ${email}. Please check your inbox.`);
      setError('');
      setNeedsVerification(true);
    } catch (err: any) {
      console.error("Resend verification error:", err);
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      // Call our API route instead of directly using Supabase client
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          redirect: redirectPath
        }),
        credentials: 'include', // Important for cookies to be set
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes('verify your email')) {
          setNeedsVerification(true);
        }
        throw new Error(data.error || 'Failed to sign in');
      }
      
      // Use the returned session data to set the session
      if (data.session && data.session.access_token && data.session.refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        
        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw new Error('Failed to initialize session. Please try again.');
        }
      }
      
      // Verify the session was set correctly
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('Session not set after login');
        throw new Error('Failed to establish a session. Please try again.');
      }
      
      console.log('Sign in successful, redirecting to:', data.redirect || '/dashboard');
      // Redirect to dashboard or the specified redirect path
      router.push(data.redirect || '/dashboard');
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Already logged in, redirect
          router.push(redirectPath);
        }
      } catch (authError) {
        console.error("Auth check error:", authError);
        // Don't redirect, just show the login form
        setError('Authentication service is temporarily unavailable. Please try again later.');
      }
    };

    checkAuth();
  }, [redirectPath, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      <Card className="w-full max-w-md bg-[var(--mcp-background-secondary)] border border-[var(--mcp-border)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[var(--mcp-text)]">Sign In</CardTitle>
          <CardDescription className="text-[var(--mcp-text-muted)]">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
                {needsVerification && (
                  <div className="mt-3">
                    <Button 
                      onClick={handleResendVerification} 
                      disabled={resendingEmail}
                      className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20"
                    >
                      {resendingEmail ? 'Sending...' : 'Resend verification email'}
                    </Button>
                  </div>
                )}
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="bg-green-500/10 border-green-500/20 text-green-400">
                <AlertDescription>{successMessage}</AlertDescription>
                {needsVerification && (
                  <div className="mt-3">
                    <Button 
                      onClick={handleResendVerification} 
                      disabled={resendingEmail}
                      className="text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20"
                    >
                      {resendingEmail ? 'Sending...' : 'Resend verification email'}
                    </Button>
                  </div>
                )}
              </Alert>
            )}

            {/* Google Sign In Button */}
            <GoogleSignInButton mode="signin" />
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-[var(--mcp-border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--mcp-background-secondary)] px-2 text-[var(--mcp-text-muted)]">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--mcp-text)]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[var(--mcp-text)]">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
            </div>
            <Button type="submit" className="w-full bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center text-[var(--mcp-text-muted)]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// Main page component with Suspense
export default function SignIn() {
  return (
    <>
      <OneTapComponent />
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </>
  );
}
