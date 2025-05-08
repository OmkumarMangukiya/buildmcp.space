'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import supabase from '@/lib/supaClient';
import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle } from 'lucide-react';

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

// Helper to format plan names and prices for display
const getPlanDetails = (id: string) => {
  switch(id) {
    case 'basic-monthly':
      return { name: 'Basic Monthly', price: 11.99, interval: 'monthly', dbId: '1' };
    case 'premium-monthly':
      return { name: 'Premium Monthly', price: 15.99, interval: 'monthly', dbId: '2' };
    case 'basic-yearly':
      return { name: 'Basic Yearly', price: 83.49, interval: 'yearly', dbId: '3' };
    case 'premium-yearly':
      return { name: 'Premium Yearly', price: 111.39, interval: 'yearly', dbId: '4' };
    default:
      return null;
  }
};

// Promo code validator
const validatePromoCode = (code: string, planInterval: string) => {
  // Currently only supporting the ERBD21 code for monthly plans
  if (code === 'ERBD21' && planInterval === 'monthly') {
    return {
      valid: true,
      discountPercent: 21,
      code: 'ERBD21'
    };
  }
  return { valid: false, discountPercent: 0, code: null };
};

export default function PaymentClientComponent() {
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
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [discount, setDiscount] = useState<{percent: number, amount: number} | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

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
        setFinalPrice(details.price); // Set initial final price
        
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
  }, [planId, router, userId]);
  
  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode || !planDetails) return;
    
    setPromoCodeStatus('validating');
    
    // Simulate server validation with the local function
    setTimeout(() => {
      const validation = validatePromoCode(promoCode, planDetails.interval);
      
      if (validation.valid) {
        const discountAmount = (planDetails.price * validation.discountPercent / 100);
        const newFinalPrice = parseFloat((planDetails.price - discountAmount).toFixed(2));
        
        setDiscount({
          percent: validation.discountPercent,
          amount: discountAmount
        });
        setFinalPrice(newFinalPrice);
        setPromoCodeStatus('valid');
        setAppliedPromoCode(validation.code);
      } else {
        setPromoCodeStatus('invalid');
        // Reset any previous discounts
        setDiscount(null);
        setFinalPrice(planDetails.price);
        setAppliedPromoCode(null);
      }
    }, 500);
  };
  
  // Initialize PayPal buttons when script is loaded
  useEffect(() => {
    if (!paypalLoaded || !planDetails || !window.paypal || !user || !finalPrice) return;
    
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
              value: finalPrice.toString()
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
              userId: user.id,
              promoCode: appliedPromoCode,
              discountPercent: discount?.percent || 0,
              originalPrice: planDetails.price,
              finalPrice: finalPrice
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
                  userId: user.id,
                  promoCode: appliedPromoCode,
                  discountPercent: discount?.percent || 0,
                  originalPrice: planDetails.price,
                  finalPrice: finalPrice
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
    
  }, [paypalLoaded, planDetails, user, router, finalPrice, appliedPromoCode, discount]);

  return (
    <>
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
                  <span className="text-white font-medium">
                    {discount ? (
                      <span className="flex flex-col items-end">
                        <span className="line-through text-sm text-[#DEDDDC]/50">${planDetails.price}</span>
                        <span className="text-green-400">${finalPrice} / {planDetails.interval}</span>
                      </span>
                    ) : (
                      <span>${planDetails.price} / {planDetails.interval}</span>
                    )}
                  </span>
                </div>
                {discount && (
                  <div className="flex justify-between mb-4">
                    <span className="text-[#DEDDDC]/70">Discount:</span>
                    <span className="text-green-400">{discount.percent}% (${discount.amount.toFixed(2)})</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#DEDDDC]/70">Billing Cycle:</span>
                  <span className="text-white font-medium capitalize">{planDetails.interval}</span>
                </div>
              </div>
              
              {/* Promo code section */}
              <div className="space-y-3">
                <div className="text-sm text-[#DEDDDC]/70">Have a promo code?</div>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Input 
                      type="text" 
                      placeholder="Enter promo code" 
                      className="bg-[#1F1F1F] border-white/10 text-white w-full"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoCodeStatus('idle');
                      }}
                      disabled={promoCodeStatus === 'valid' || promoCodeStatus === 'validating'}
                    />
                    {promoCodeStatus === 'valid' && (
                      <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                    )}
                    {promoCodeStatus === 'invalid' && (
                      <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="bg-[#1F1F1F] border-white/10 hover:bg-[#252525] text-white"
                    onClick={applyPromoCode}
                    disabled={promoCodeStatus === 'valid' || promoCodeStatus === 'validating' || !promoCode}
                  >
                    {promoCodeStatus === 'validating' ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                {promoCodeStatus === 'valid' && (
                  <div className="text-xs text-green-400">
                    Promo code applied! You're saving ${discount?.amount.toFixed(2)}.
                  </div>
                )}
                {promoCodeStatus === 'invalid' && (
                  <div className="text-xs text-red-400">
                    Invalid promo code. Please try again.
                  </div>
                )}
              </div>
              
              <div id="paypal-button-container" className={`${processing ? 'opacity-50 pointer-events-none' : ''}`}></div>
            </div>
          )}
        </>
      )}

      <CardFooter className="flex flex-col space-y-4 mt-6 px-0">
        <div className="text-xs text-[#DEDDDC]/50 text-center">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
        </div>
        
        <Link href="/pricing" className="text-sm text-[#E1623D] hover:text-[#E1623D]/80 text-center w-full">
          ← Back to plans
        </Link>
      </CardFooter>
    </>
  );
}

// Add TypeScript interface for PayPal
declare global {
  interface Window {
    paypal: any;
  }
} 