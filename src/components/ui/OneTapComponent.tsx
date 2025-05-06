'use client'

import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supaClient'
import { syncCookiesWithSession } from '@/lib/supaClient'
import Cookies from 'js-cookie'

// Add TypeScript interface for Google One Tap response
interface CredentialResponse {
  credential: string;
  select_by: string;
}

// Declare global Google object for TypeScript
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const OneTapComponent = () => {
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Generate nonce to use for Google ID token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return [nonce, hashedNonce]
  }

  useEffect(() => {
    // Don't initialize if we've already done so
    if (isInitialized) return;

    const initializeGoogleOneTap = async () => {
      setIsLoading(true)
      console.log('Initializing Google One Tap')
      
      try {
        const [nonce, hashedNonce] = await generateNonce()
        console.log('Nonce generated')
  
        // Check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session', error)
          setError('Error checking session: ' + error.message)
        }
        if (data.session) {
          // User is already logged in, no need to show One Tap
          console.log('User already has a session, skipping One Tap initialization')
          setIsLoading(false)
          return
        }
  
        // Initialize Google One Tap
        if (window.google && window.google.accounts) {
          setIsInitialized(true)
          
          try {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: async (response: CredentialResponse) => {
                try {
                  setIsLoading(true)
                  console.log('Google One Tap response received')
                  
                  // Send ID token to our API endpoint
                  const result = await fetch('/api/auth/google-one-tap', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      credential: response.credential,
                      nonce
                    })
                  });
  
                  if (!result.ok) {
                    const errorData = await result.json();
                    console.error('Error signing in with Google One Tap:', errorData.error);
                    setError('Login failed: ' + (errorData.message || 'Unknown error'));
                    setIsLoading(false)
                    return;
                  }
  
                  const data = await result.json();
                  
                  // Ensure session is set in the browser
                  if (data.session && data.session.access_token && data.session.refresh_token) {
                    // Set session in Supabase
                    const { error: sessionError } = await supabase.auth.setSession({
                      access_token: data.session.access_token,
                      refresh_token: data.session.refresh_token,
                    });
                    
                    if (sessionError) {
                      console.error('Error setting session:', sessionError);
                      setError('Session error: ' + sessionError.message);
                      setIsLoading(false)
                      return;
                    }
                    
                    // Also set the cookies directly to ensure middleware can access them
                    syncCookiesWithSession(data.session)
                    
                    console.log('Successfully logged in with Google One Tap');
                    setIsLoading(false)
                    // Redirect to dashboard page
                    router.push(data.redirect || '/dashboard');
                  } else {
                    console.error('No session data in response');
                    setError('Login successful but no session data received');
                    setIsLoading(false)
                  }
                } catch (error) {
                  console.error('Error logging in with Google One Tap', error);
                  setError('Login error: ' + (error instanceof Error ? error.message : 'Unknown error'));
                  setIsLoading(false)
                }
              },
              nonce: hashedNonce,
              // With Chrome's removal of third-party cookies, we need to use FedCM instead
              use_fedcm_for_prompt: true,
            });
            
            // Display the One Tap UI with error handling
            window.google.accounts.id.prompt((notification) => {
              if (notification.isNotDisplayed()) {
                const reason = notification.getNotDisplayedReason();
                console.log('One Tap not displayed, reason:', reason);
                
                // Don't show any One Tap errors to users, just log them
                // setError(`One Tap not displayed: ${reason}`);
              } else if (notification.isSkippedMoment()) {
                console.log('One Tap skipped:', notification.getSkippedReason());
              } else if (notification.isDismissedMoment()) {
                console.log('One Tap dismissed:', notification.getDismissedReason());
              }
              setIsLoading(false)
            });
          } catch (err) {
            console.error('Error initializing Google One Tap', err);
            setError('Failed to initialize Google One Tap: ' + (err instanceof Error ? err.message : 'Unknown error'));
            setIsLoading(false)
          }
        } else {
          console.error('Google accounts API not loaded properly');
          setError('Google authentication not available');
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error during Google One Tap initialization:', error)
        setError('One Tap initialization failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
        setIsLoading(false)
      }
    };

    // Add a small delay to ensure the Google script is loaded
    const timer = setTimeout(() => {
      initializeGoogleOneTap();
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, isInitialized]);

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={() => console.log('Google One Tap script loaded')}
      />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
      {isLoading && (
        <div className="fixed top-4 right-4 flex items-center bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-[101]">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-700 mr-2"></div>
          Loading...
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[101]">
          {error}
          <button 
            className="ml-2 text-sm underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
};

export default OneTapComponent; 