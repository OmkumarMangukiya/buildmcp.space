'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import supabase from '@/lib/supaClient'
import { syncCookiesWithSession } from '@/lib/supaClient'
import Cookies from 'js-cookie'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const isSignup = searchParams.get('signup') === 'true'

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the auth code from the URL
        const code = searchParams.get('code')
        
        if (!code) {
          console.error('No code in callback URL')
          setError('No authentication code received')
          setIsProcessing(false)
          setTimeout(() => {
            router.push('/auth/signin?error=no_code')
          }, 2000)
          return
        }
        
        console.log("Auth code received, exchanging for session...")
        
        // Exchange the code for a session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (sessionError) {
          console.error('Error exchanging code for session:', sessionError)
          setError(sessionError.message)
          setIsProcessing(false)
          setTimeout(() => {
            router.push('/auth/signin?error=auth')
          }, 2000)
          return
        }
        
        // Check if session exists
        if (!data.session) {
          console.error('No session data returned')
          setError('Authentication failed: No session data')
          setIsProcessing(false)
          router.push('/auth/signin?error=no_session')
          return
        }
        
        console.log("Session received successfully, setting cookies...")
        
        // Use setCookie utility from js-cookie for better cross-browser compatibility
        Cookies.set('sb-access-token', data.session.access_token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          expires: new Date((data.session.expires_at || Math.floor(Date.now()/1000) + 3600) * 1000)
        })
        
        Cookies.set('sb-refresh-token', data.session.refresh_token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        })
        
        // Additionally set the same cookies as regular cookies for middleware
        syncCookiesWithSession(data.session)
        
        // Store session data in local storage as well (belt and suspenders approach)
        if (typeof window !== 'undefined') {
          localStorage.setItem('sb-auth-token', JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
          }))
        }
        
        console.log('Auth complete, cookies set:', {
          access: Cookies.get('sb-access-token') ? 'present' : 'missing',
          refresh: Cookies.get('sb-refresh-token') ? 'present' : 'missing'
        });
          
        // Set the Supabase session to ensure it's in sync with the cookies
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })
        
        setIsProcessing(false)
        
        // Add a short delay to ensure all cookies are properly set before redirecting
        setTimeout(() => {
          if (isSignup) {
            // Redirect to welcome or onboarding page for new users
            router.push('/dashboard?new_user=true')
          } else {
            // Redirect to dashboard for regular sign in
            router.push('/dashboard')
          }
        }, 500)
      } catch (err) {
        console.error('Callback processing error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setIsProcessing(false)
        router.push('/auth/signin?error=unknown')
      }
    }

    handleCallback()
  }, [router, searchParams, isSignup])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--mcp-background-primary)]">
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--mcp-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--mcp-text)]">
              {error ? 'Processing your request...' : 'Completing authentication...'}
            </p>
          </>
        ) :  (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 font-medium">Authentication Successful</p>
            <p className="text-sm">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[var(--mcp-background-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--mcp-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--mcp-text)]">Loading authentication...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 