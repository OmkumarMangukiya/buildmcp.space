'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import supabase from '@/lib/supaClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    // Log base URL and environment variables for debugging
    console.log('Environment check:', {
      baseUrl: typeof window !== 'undefined' ? window.location.origin : 'unknown',
      publicBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set'
    });

    try {
      // Call our API route instead of directly using Supabase client
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle case for Google OAuth users
        if (data.error && data.error.includes('Google for authentication')) {
          setError('This account uses Google Sign-in. Please sign in with Google instead of using password reset.');
        } else {
          throw new Error(data.error || 'Failed to send reset link');
        }
      } else {
        // Display success message
        setSuccessMessage('If your email is registered, you will receive a password reset link shortly. Please check your inbox and spam folders.');
        // Clear the form
        setEmail('');
      }
    } catch (err: any) {
      console.error("Password reset request error:", err);
      setError(err.message || 'An error occurred while requesting a password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      <Card className="w-full max-w-md bg-[var(--mcp-background-secondary)] border border-[var(--mcp-border)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[var(--mcp-text)]">Forgot Password</CardTitle>
          <CardDescription className="text-[var(--mcp-text-muted)]">
            Enter your email address and we'll send you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="bg-green-500/10 border-green-500/20 text-green-400">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--mcp-text)]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium" 
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center text-[var(--mcp-text-muted)]">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 