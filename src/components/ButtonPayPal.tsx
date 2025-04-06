"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { fetchWithAuth } from '@/lib/apiUtils';

interface ButtonPayPalProps {
  planId: string;
  userId: string;
  planName: string;
  planPrice: number;
  planCurrency: string;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function ButtonPayPal({ planId, userId, planName, planPrice, planCurrency }: ButtonPayPalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const paypalButtonsInstance = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initializePayPal = async () => {
      if (!paypalButtonRef.current || !window.paypal) {
        return;
      }

      try {
        // Clean up previous instance if it exists
        if (paypalButtonsInstance.current) {
          paypalButtonsInstance.current.close();
        }

        // Clear the container
        paypalButtonRef.current.innerHTML = '';

        // Create new PayPal buttons instance
        paypalButtonsInstance.current = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: async () => {
            if (!isMounted) return;
            setIsLoading(true);
            setError(null);
            
            try {
              const orderData = await fetchWithAuth('/api/payments', {
                method: 'POST',
                body: JSON.stringify({
                  planId,
                  userId
                }),
              });
              
              return orderData.id;
            } catch (err) {
              if (isMounted) {
                setError('Failed to create order');
              }
              throw err;
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          },
          onApprove: async (data: any) => {
            setIsLoading(true);
            try {
              const result = await fetchWithAuth('/api/payments/verify', {
                method: 'POST',
                body: JSON.stringify({
                  orderId: data.orderID,
                  planId,
                  userId
                }),
              });

              if (isMounted) {
                router.push('/dashboard');
              }
            } catch (err) {
              if (isMounted) {
                setError('Payment verification failed');
                console.error('Error processing payment:', err);
              }
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          },
          onError: (err: any) => {
            if (isMounted) {
              console.error('PayPal Error:', err);
              setError('Payment failed. Please try again.');
              setIsLoading(false);
            }
          },
          onCancel: () => {
            if (isMounted) {
              setError(null);
              setIsLoading(false);
            }
          }
        });

        // Render the buttons
        if (paypalButtonRef.current && isMounted) {
          await paypalButtonsInstance.current.render(paypalButtonRef.current);
        }

      } catch (err) {
        if (isMounted) {
          console.error('PayPal initialization error:', err);
          setError('Failed to initialize payment system');
          setIsLoading(false);
        }
      }
    };

    // Initialize when PayPal SDK is loaded
    const checkPayPalAndInitialize = () => {
      if (window.paypal) {
        initializePayPal();
      } else {
        // Wait for PayPal SDK to load
        const waitForPayPal = setInterval(() => {
          if (window.paypal) {
            clearInterval(waitForPayPal);
            initializePayPal();
          }
        }, 100);

        // Clear interval after 10 seconds if PayPal doesn't load
        setTimeout(() => {
          clearInterval(waitForPayPal);
          if (isMounted && !window.paypal) {
            setError('PayPal failed to load. Please refresh the page.');
          }
        }, 10000);
      }
    };

    checkPayPalAndInitialize();

    // Cleanup function
    return () => {
      isMounted = false;
      if (paypalButtonsInstance.current) {
        try {
          paypalButtonsInstance.current.close();
        } catch (err) {
          console.error('Error cleaning up PayPal buttons:', err);
        }
      }
    };
  }, [planId, userId, router]);

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Processing payment...</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div ref={paypalButtonRef} className="min-h-[150px]" />
    </div>
  );
} 