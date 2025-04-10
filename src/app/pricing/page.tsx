"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase, { getSessionWithRefresh } from '@/lib/supaClient';
import { handleAuthRedirect } from '@/lib/authRedirect';
import CardSubscriptionPlan from '@/components/CardSubscriptionPlan';

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const getInitialData = async () => {
      try {
        // Check auth status with token refresh
        const { data: { session }, error: sessionError } = await getSessionWithRefresh();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          // Use our new auth helper for redirection
          await handleAuthRedirect('/pricing');
          return;
        }
        
        setUser(session.user);
        
        // Get plans data
        const { data: plansData, error } = await supabase
          .from('plans')
          .select('*')
          .order('price', { ascending: true });
          
        if (error) {
          console.error('Error fetching plans:', error);
          return;
        }
        
        if (plansData) {
          setPlans(plansData);
        }
      } catch (error) {
        console.error('Error initializing pricing page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getInitialData();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-zinc-400">
          Select the right plan to unlock the full potential of MCP generation
        </p>
      </div>
      
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <CardSubscriptionPlan
            key={plan.id}
            id={plan.id}
            name={plan.name}
            description={plan.description}
            price={plan.price}
            currency={plan.currency}
            interval={plan.interval}
            mcpLimit={plan.mcp_limit}
            userId={user.id}
            isPopular={index === 1} // Make the second plan (Premium Monthly) the popular one
          />
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-zinc-100">Frequently Asked Questions</h2>
        <div className="mt-8 max-w-3xl mx-auto text-left space-y-6">
          <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100">What happens when I reach my MCP generation limit?</h3>
            <p className="mt-2 text-zinc-400">
              When you reach your monthly limit, you'll need to wait until your next billing cycle or upgrade to a Premium plan for unlimited generations.
            </p>
          </div>
          <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100">Can I change plans later?</h3>
            <p className="mt-2 text-zinc-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.
            </p>
          </div>
          <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100">How is "unlimited" defined?</h3>
            <p className="mt-2 text-zinc-400">
              Unlimited means you can create as many MCPs as you need, provided you're using the service fairly and not programmatically generating excessive amounts.
            </p>
          </div>
          <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100">How secure is my payment information?</h3>
            <p className="mt-2 text-zinc-400">
              All payments are processed through PayPal. We never store your payment information on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 