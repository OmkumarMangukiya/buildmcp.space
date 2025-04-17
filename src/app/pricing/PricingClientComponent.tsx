'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "@/lib/supaClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface PricingClientComponentProps {
  isMain?: boolean;
}

export default function PricingClientComponent({ isMain }: PricingClientComponentProps = { isMain: false }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const needsSubscription = searchParams.get('needSubscription') === 'true';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth status:', error);
          return;
        }
        
        if (data.session) {
          setIsLoggedIn(true);
          setUserId(data.session.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const handleSubscribe = (planId: string) => {
    if (!isLoggedIn) {
      // If not logged in, redirect to signup
      router.push('/auth/signup');
      return;
    }
    
    // If logged in, implement payment flow
    // For now, we'll redirect to a payment initiation page
    router.push(`/payment?planId=${planId}&userId=${userId}`);
  };

  // If not the main component, only render the auth buttons
  if (!isMain) {
    return (
      <>
        {isLoggedIn ? (
          <Link href="/dashboard">
            <div className="px-3.5 py-1.5 bg-[#252525] text-[#DEDDDC]/80 hover:text-white font-medium text-sm rounded-md border border-white/10 shadow-inner shadow-black/10">
              Dashboard
            </div>
          </Link>
        ) : (
          <>
            <Link href="/auth/signin">
              <div className="px-3.5 py-1.5 bg-[#252525] text-[#DEDDDC]/80 hover:text-white font-medium text-sm rounded-md border border-white/10 shadow-inner shadow-black/10">
                Log in
              </div>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="px-3.5 py-1 bg-[#C45736] text-white hover:bg-[#C45736]/90 font-medium text-sm">Sign up</Button>
            </Link>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {needsSubscription && (
        <div className="mb-12 max-w-3xl mx-auto bg-[#C45736]/10 border border-[#C45736]/30 rounded-lg p-4">
          <p className="text-center text-[#DEDDDC]">
            <span className="font-bold">You need a subscription to continue.</span> Please select a plan below to access all features of buildmcp.space.
          </p>
        </div>
      )}
      
      {/* Toggle Switch */}
      <div className="flex items-center justify-center mt-8 mb-16 space-x-3">
        <span className={`font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
          />
          <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#C45736]"></div>
        </label>
        <span className={`font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>Annual <span className="text-[#C45736] text-xs font-bold">Save 15%</span></span>
      </div>

      {/* Plans */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full`}>
        {/* Basic Plan */}
        <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
          <h3 className="text-2xl font-semibold mb-2 text-white">Basic {isYearly ? 'Yearly' : 'Monthly'}</h3>
          <p className="text-[#DEDDDC]/70 text-sm mb-4">
            Up to 120 MCP generations per month{isYearly ? ', billed yearly' : ''}
          </p>
          
          <div className="flex items-end mb-6">
            <span className="text-4xl font-bold text-white">${isYearly ? '119.99' : '11.99'}</span>
            <span className="text-[#DEDDDC]/70 ml-2 mb-1">/{isYearly ? 'yearly' : 'monthly'}</span>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-[#DEDDDC]/70">
              <span className="w-5 h-5 rounded-full bg-[#C45736]/20 text-[#C45736] flex items-center justify-center mr-3">✓</span>
              Up to 120 MCP generations
            </li>
            <li className="flex items-center text-[#DEDDDC]/70">
              <span className="w-5 h-5 rounded-full bg-[#C45736]/20 text-[#C45736] flex items-center justify-center mr-3">✓</span>
              Access to all features
            </li>
            <li className="flex items-center text-[#DEDDDC]/70">
              <span className="w-5 h-5 rounded-full bg-[#C45736]/20 text-[#C45736] flex items-center justify-center mr-3">✓</span>
              Email support
            </li>
          </ul>
          
          <Button 
            className="w-full py-3 text-base font-medium bg-[#252525] text-white hover:bg-[#303030] border border-white/10"
            onClick={() => handleSubscribe(isYearly ? 'basic-yearly' : 'basic-monthly')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Subscribe Now'}
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative shadow-lg ring-2 ring-[#C45736]">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C45736] text-white px-6 py-1.5 rounded-full text-sm font-bold">
            {isYearly ? 'BEST VALUE' : 'MOST POPULAR'}
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-white">Premium {isYearly ? 'Yearly' : 'Monthly'}</h3>
          <p className="text-[#DEDDDC]/70 text-sm mb-4">
            Unlimited MCP generations{isYearly ? ', billed yearly' : ''}
          </p>
          
          <div className="flex items-end mb-6">
            <span className="text-4xl font-bold text-white">${isYearly ? '159.9' : '15.99'}</span>
            <span className="text-[#DEDDDC]/70 ml-2 mb-1">/{isYearly ? 'yearly' : 'monthly'}</span>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-[#DEDDDC]/70">
              <span className="w-5 h-5 rounded-full bg-[#C45736]/20 text-[#C45736] flex items-center justify-center mr-3">✓</span>
              Unlimited MCP generations
            </li>
            <li className="flex items-center text-[#DEDDDC]/70">
              <span className="w-5 h-5 rounded-full bg-[#C45736]/20 text-[#C45736] flex items-center justify-center mr-3">✓</span>
              Access to all features
            </li>
            <li className="flex items-center text-[#DEDDDC]/70">
              <span className="w-5 h-5 rounded-full bg-[#C45736]/20 text-[#C45736] flex items-center justify-center mr-3">✓</span>
              Email support
            </li>
          </ul>
          
          <Button 
            className="w-full py-3 text-base font-medium bg-[#C45736] text-white hover:bg-[#C45736]/90"
            onClick={() => handleSubscribe(isYearly ? 'premium-yearly' : 'premium-monthly')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Subscribe Now'}
          </Button>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-32 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-[#252525] rounded-lg p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-3">What happens when I reach my MCP generation limit?</h3>
            <p className="text-[#DEDDDC]/70">
              When you reach your monthly limit, you'll need to wait until your next billing cycle or upgrade to a Premium plan for unlimited generations.
            </p>
          </div>
          <div className="bg-[#252525] rounded-lg p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-3">Can I change plans later?</h3>
            <p className="text-[#DEDDDC]/70">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.
            </p>
          </div>
          <div className="bg-[#252525] rounded-lg p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-3">How is "unlimited" defined?</h3>
            <p className="text-[#DEDDDC]/70">
              Unlimited means you can create as many MCPs as you need, provided you're using the service fairly and not programmatically generating excessive amounts.
            </p>
          </div>
          <div className="bg-[#252525] rounded-lg p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-3">How secure is my payment information?</h3>
            <p className="text-[#DEDDDC]/70">
              All payments are processed through secure payment processors. We never store your payment information on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] py-16 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <Link href="/" className="font-bold text-xl tracking-tight mb-6 block">
                <span className="text-[#E1623D]">buildmcp.space</span>
              </Link>
              <p className="text-[#DEDDDC]/60 text-sm leading-relaxed">
                Create, manage, and share MCPs across different AI platforms with a seamless experience.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4 text-white">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/#features" className="text-[#DEDDDC]/60 hover:text-white text-sm">Features</Link></li>
                <li><Link href="/#platforms" className="text-[#DEDDDC]/60 hover:text-white text-sm">Platforms</Link></li>
                <li><Link href="/#pricing" className="text-[#DEDDDC]/60 hover:text-white text-sm">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4 text-white">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-[#DEDDDC]/60 hover:text-white text-sm">About</Link></li>
                <li><Link href="/contact" className="text-[#DEDDDC]/60 hover:text-white text-sm">Contact</Link></li>
                <li><Link href="/privacy" className="text-[#DEDDDC]/60 hover:text-white text-sm">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4 text-white">Connect</h4>
              <ul className="space-y-3">
                <li><a href="https://github.com/buildmcpspace" target="_blank" rel="noopener noreferrer" className="text-[#DEDDDC]/60 hover:text-white text-sm flex items-center"><Github className="w-4 h-4 mr-2" /> GitHub</a></li>
                <li><a href="https://discord.gg/buildmcpspace" target="_blank" rel="noopener noreferrer" className="text-[#DEDDDC]/60 hover:text-white text-sm">Discord</a></li>
                <li><a href="https://twitter.com/buildmcpspace" target="_blank" rel="noopener noreferrer" className="text-[#DEDDDC]/60 hover:text-white text-sm">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#DEDDDC]/40 text-sm mb-4 md:mb-0">© 2023 buildmcp.space. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-[#DEDDDC]/40 hover:text-white text-sm">Terms</Link>
              <Link href="/privacy" className="text-[#DEDDDC]/40 hover:text-white text-sm">Privacy</Link>
              <Link href="/cookies" className="text-[#DEDDDC]/40 hover:text-white text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 