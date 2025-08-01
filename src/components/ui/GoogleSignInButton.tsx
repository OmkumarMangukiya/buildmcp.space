'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supaClient'
import { useState } from 'react'

interface GoogleSignInButtonProps {
  mode: 'signin' | 'signup'
  className?: string
}

export default function GoogleSignInButton({ mode, className = '' }: GoogleSignInButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Get current URL for consistent redirect
      const origin = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      // Clear any existing cookies/session before starting new auth flow
      if (typeof document !== 'undefined') {
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // Make sure to include full origin in the redirectTo
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            signup: mode === 'signup' ? 'true' : 'false'
          }
        }
      })
      
      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
      
      console.log('OAuth redirect initiated successfully');
      
      // The user will be redirected to Google for authentication
    } catch (error) {
      console.error('Error with Google sign in:', error)
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 ${className}`}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
      </svg>
      
      {isLoading ? 'Loading...' : mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
    </Button>
  )
} 