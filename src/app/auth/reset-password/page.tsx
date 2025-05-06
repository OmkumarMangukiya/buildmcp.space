'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import supabase from '@/lib/supaClient';

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      <Card className="w-full max-w-md bg-[var(--mcp-background-secondary)] border border-[var(--mcp-border)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[var(--mcp-text)]">Reset Password</CardTitle>
          <CardDescription className="text-[var(--mcp-text-muted)]">
            Loading...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse h-8 w-8 rounded-full bg-[var(--mcp-primary)]"></div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main component content
function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Extract token from URL hash fragment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get complete hash fragment
      const hashFragment = window.location.hash.substring(1);
      
      // Check for error parameters first
      const params = new URLSearchParams(hashFragment);
      
      const error = params.get('error');
      const errorCode = params.get('error_code');
      const errorDescription = params.get('error_description');
      
      if (error) {
        if (errorCode === 'otp_expired') {
          setError('Your password reset link has expired. Please request a new password reset link.');
        } else {
          setError(errorDescription || 'Invalid reset link. Please request a new password reset link.');
        }
        return;
      }
      
      // Continue with token extraction...
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        setToken(accessToken);
      } else {
        setError('No access token found in URL');
      }
    }
  }, []);

  // Validate token exists
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Get the refresh token from the URL hash
      const refreshToken = new URLSearchParams(window.location.hash.substring(1)).get('refresh_token');
      
      // Create a fresh Supabase client to avoid auth session conflicts
      const { createClient } = await import('@supabase/supabase-js');
      const freshSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      // Use the token to directly update the password through Supabase
      const { data, error } = await freshSupabase.auth.updateUser(
        { password },
        // Use type assertion to avoid TypeScript errors
        { accessToken: token } as any
      );
      
      if (error) {
        throw error;
      }

      setSuccessMessage('Your password has been successfully reset!');
      
      // Wait a bit to show success message before redirecting
      setTimeout(() => {
        router.push('/auth/signin?resetSuccess=true');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password');
      
      // Try server-side approach as fallback
      try {
        const response = await fetch('/api/auth/update-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to reset password');
        }
        
        setSuccessMessage('Your password has been successfully reset!');
        setTimeout(() => {
          router.push('/auth/signin?resetSuccess=true');
        }, 2000);
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || 'Failed to reset your password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      <Card className="w-full max-w-md bg-[var(--mcp-background-secondary)] border border-[var(--mcp-border)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[var(--mcp-text)]">Reset Password</CardTitle>
          <CardDescription className="text-[var(--mcp-text-muted)]">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <Alert variant="default" className="bg-green-500/10 border-green-500/20 text-green-400">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--mcp-text)]">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[var(--mcp-text)]">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium" 
              disabled={isLoading || !token}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
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

// Main export that wraps the component in Suspense
export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 