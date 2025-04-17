'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import supabase from '@/lib/supaClient';
import Link from 'next/link';

// PayPal script loader
const loadPayPalScript = (clientId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[data-paypal-script]')) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.dataset.paypalScript = 'true';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PayPal script'));
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const userId = searchParams.get('userId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Helper to format plan names and prices for display
  const getPlanDetails = (id: string) => {
    switch(id) {
      case 'basic-monthly':
        return { name: 'Basic Monthly', price: 11.99, interval: 'monthly', dbId: '1' };
      case 'premium-monthly':
        return { name: 'Premium Monthly', price: 15.99, interval: 'monthly', dbId: '2' };
      case 'basic-yearly':
        return { name: 'Basic Yearly', price: 119.99, interval: 'yearly', dbId: '3' };
      case 'premium-yearly':
        return { name: 'Premium Yearly', price: 159.9, interval: 'yearly', dbId: '4' };
      default:
        return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          router.push('/auth/signin?redirect=/pricing');
          return;
        }
        
        setUser(sessionData.session.user);
        
        // Check if plan ID is valid
        if (!planId) {
          setError('Invalid plan selected. Please try again.');
          return;
        }
        
        const details = getPlanDetails(planId);
        if (!details) {
          setError('Selected plan not found. Please try again.');
          return;
        }
        
        setPlanDetails(details);
        
        // Load PayPal script
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        if (!clientId) {
          setError('Payment configuration error. Please try again later.');
          return;
        }
        
        try {
          await loadPayPalScript(clientId);
          setPaypalLoaded(true);
        } catch (err) {
          console.error('PayPal script loading error:', err);
          setError('Failed to load payment system. Please try again later.');
        }
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError('An error occurred while initializing the payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [planId, router]);
  
  // Initialize PayPal buttons when script is loaded
  useEffect(() => {
    if (!paypalLoaded || !planDetails || !window.paypal || !user) return;
    
    const paypalButtonsContainer = document.getElementById('paypal-button-container');
    if (!paypalButtonsContainer) return;
    
    // Clear previous buttons
    paypalButtonsContainer.innerHTML = '';
    
    // Render PayPal buttons
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay'
      },
      
      createOrder: function(data: any, actions: any) {
        return actions.order.create({
          purchase_units: [{
            description: `${planDetails.name} Subscription`,
            amount: {
              value: planDetails.price.toString()
            }
          }]
        });
      },
      
      onApprove: async function(data: any, actions: any) {
        try {
          setProcessing(true);
          
          // Complete the order
          const orderDetails = await actions.order.capture();
          console.log('Order completed:', orderDetails);
          
          // Verify payment with our backend
          const response = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderId: orderDetails.id,
              planId: planDetails.dbId,
              userId: user.id
            })
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            // If the error contains "ORDER_ALREADY_CAPTURED", try again with the same order ID
            if (result.error && result.error.includes('ORDER_ALREADY_CAPTURED')) {
              console.log('Order already captured, retrying verification...');
              
              // Retry verification
              const retryResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  orderId: orderDetails.id,
                  planId: planDetails.dbId,
                  userId: user.id
                })
              });
              
              const retryResult = await retryResponse.json();
              
              if (!retryResponse.ok) {
                throw new Error(retryResult.error || 'Payment verification failed after retry');
              }
              
              setSuccess(true);
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
              return;
            }
            
            throw new Error(result.error || 'Payment verification failed');
          }
          
          console.log('Payment verified:', result);
          setSuccess(true);
          
          // Handle case where payment was already processed
          if (result.alreadyProcessed) {
            console.log('Payment was already processed');
          }
          
          // Redirect to dashboard after successful payment
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
          
        } catch (err: any) {
          console.error('Payment processing error:', err);
          
          // Check if there's a connection issue but payment might have gone through
          const errorMessage = err.message || '';
          if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            setError('Connection issue during payment. If you were charged, please wait a moment and check your dashboard before trying again.');
          } else {
            setError(errorMessage || 'An error occurred while processing your payment. Please try again.');
          }
        } finally {
          setProcessing(false);
        }
      },
      
      onError: function(err: any) {
        console.error('PayPal error:', err);
        setError('Payment gateway error. Please try again later.');
      }
    }).render('#paypal-button-container');
    
  }, [paypalLoaded, planDetails, user, router]);

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#DEDDDC] flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-[#252525] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white mb-2">Complete Your Subscription</CardTitle>
          <CardDescription className="text-[#DEDDDC]/70">
            {planDetails ? `You're subscribing to the ${planDetails.name} plan` : 'Loading plan details...'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
              <AlertDescription>Payment successful! Redirecting to dashboard...</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="py-6 text-center text-[#DEDDDC]/70">
              Loading payment options...
            </div>
          ) : (
            <>
              {planDetails && !success && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-[#1F1F1F] border border-white/5">
                    <div className="flex justify-between mb-4">
                      <span className="text-[#DEDDDC]/70">Plan:</span>
                      <span className="text-white font-medium">{planDetails.name}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-[#DEDDDC]/70">Price:</span>
                      <span className="text-white font-medium">${planDetails.price} / {planDetails.interval}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#DEDDDC]/70">Billing Cycle:</span>
                      <span className="text-white font-medium capitalize">{planDetails.interval}</span>
                    </div>
                  </div>
                  
                  <div id="paypal-button-container" className={`${processing ? 'opacity-50 pointer-events-none' : ''}`}></div>
                </div>
              )}
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-[#DEDDDC]/50 text-center">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          </div>
          
          <Link href="/pricing" className="text-sm text-[#E1623D] hover:text-[#E1623D]/80 text-center w-full">
            ← Back to plans
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

// Add TypeScript interface for PayPal
declare global {
  interface Window {
    paypal: any;
  }
} 