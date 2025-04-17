import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentClientComponent from './PaymentClientComponent';
import { Suspense } from 'react';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#DEDDDC] flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-[#252525] border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white mb-2">Complete Your Subscription</CardTitle>
          <CardDescription className="text-[#DEDDDC]/70">
            Secure payment processing
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Suspense fallback={<div className="py-6 text-center text-[#DEDDDC]/70">Loading payment options...</div>}>
            <PaymentClientComponent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
} 