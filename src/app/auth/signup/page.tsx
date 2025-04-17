'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import supabase from '@/lib/supaClient';

// Create a client component that uses useSearchParams
function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        // Don't redirect, just show the signup form
        setError('Authentication service is temporarily unavailable. Please try again later.');
      }
    };

    checkAuth();
  }, [redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message || 'Failed to sign up');
      }

      console.log('Sign up successful, redirecting to signin with redirect parameter');
      // On success, redirect to sign in with the redirect parameter
      router.push(`/auth/signin?registered=true&redirect=${encodeURIComponent(redirectPath)}`);
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      <Card className="w-full max-w-md bg-[var(--mcp-background-secondary)] border border-[var(--mcp-border)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[var(--mcp-text)]">Sign Up</CardTitle>
          <CardDescription className="text-[var(--mcp-text-muted)]">
            Create an account to start building MCPs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--mcp-text)]">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
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
              <Label htmlFor="password" className="text-[var(--mcp-text)]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)]"
              />
              <p className="text-xs text-[var(--mcp-text-faded)]">Password must be at least 8 characters long</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms} 
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="border-[var(--mcp-border)] data-[state=checked]:bg-[var(--mcp-primary)] data-[state=checked]:border-[var(--mcp-primary)]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--mcp-text-muted)]"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium" disabled={isLoading || !agreedToTerms}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center text-[var(--mcp-text-muted)]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// Main page component with Suspense
export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
