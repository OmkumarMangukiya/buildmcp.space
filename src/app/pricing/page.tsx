"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "@/lib/supaClient";

export default function PricingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const needsSubscription = searchParams.get('needSubscription') === 'true';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#DEDDDC] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#1F1F1F]/90 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tight group">
              <span className="text-[#E1623D]">buildmcp.space</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link href="/#features" className="text-sm font-medium text-[#DEDDDC]/80 hover:text-white">Features</Link>
              <Link href="/#pricing" className="text-sm font-medium text-[#DEDDDC]/80 hover:text-white">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {needsSubscription && (
            <div className="mb-12 max-w-3xl mx-auto bg-[#C45736]/10 border border-[#C45736]/30 rounded-lg p-4">
              <p className="text-center text-[#DEDDDC]">
                <span className="font-bold">You need a subscription to continue.</span> Please select a plan below to access all features of buildmcp.space.
              </p>
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-center text-white mb-5">Choose Your Plan</h1>
          <p className="text-center text-[#DEDDDC]/70 text-lg max-w-3xl mx-auto mb-12">
            Select the plan that best fits your needs. All plans include access to our core features and updates.
          </p>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center mt-8 mb-16 space-x-3">
            <span id="monthly-label" className="text-white font-medium">Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                onChange={(e) => {
                  const monthlyPlans = document.getElementById('monthly-plans');
                  const annualPlans = document.getElementById('annual-plans');
                  const monthlyLabel = document.getElementById('monthly-label');
                  const annualLabel = document.getElementById('annual-label');
                  
                  if (e.target.checked && monthlyPlans && annualPlans && monthlyLabel && annualLabel) {
                    monthlyPlans.classList.add('hidden');
                    annualPlans.classList.remove('hidden');
                    monthlyLabel.classList.remove('text-white');
                    monthlyLabel.classList.add('text-gray-400');
                    annualLabel.classList.add('text-white');
                    annualLabel.classList.remove('text-gray-400');
                  } else if (monthlyPlans && annualPlans && monthlyLabel && annualLabel) {
                    monthlyPlans.classList.remove('hidden');
                    annualPlans.classList.add('hidden');
                    monthlyLabel.classList.add('text-white');
                    monthlyLabel.classList.remove('text-gray-400');
                    annualLabel.classList.remove('text-white');
                    annualLabel.classList.add('text-gray-400');
                  }
                }}
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#C45736]"></div>
            </label>
            <span id="annual-label" className="text-gray-400 font-medium">Annual <span className="text-[#C45736] text-xs font-bold">Save 15%</span></span>
          </div>

          {/* Monthly Plans */}
          <div id="monthly-plans" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
            {/* Basic Monthly */}
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
              <h3 className="text-2xl font-semibold mb-2 text-white">Basic Monthly</h3>
              <p className="text-[#DEDDDC]/70 text-sm mb-4">Up to 120 MCP generations per month</p>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$11.99</span>
                <span className="text-[#DEDDDC]/70 ml-2 mb-1">/monthly</span>
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
                onClick={() => handleSubscribe('basic-monthly')}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Subscribe Now'}
              </Button>
            </div>

            {/* Premium Monthly */}
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative shadow-lg ring-2 ring-[#C45736]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C45736] text-white px-6 py-1.5 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Premium Monthly</h3>
              <p className="text-[#DEDDDC]/70 text-sm mb-4">Unlimited MCP generations</p>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$15.99</span>
                <span className="text-[#DEDDDC]/70 ml-2 mb-1">/monthly</span>
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
                onClick={() => handleSubscribe('premium-monthly')}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Subscribe Now'}
              </Button>
            </div>
          </div>

          {/* Annual Plans */}
          <div id="annual-plans" className="hidden grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
            {/* Basic Yearly */}
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
              <h3 className="text-2xl font-semibold mb-2 text-white">Basic Yearly</h3>
              <p className="text-[#DEDDDC]/70 text-sm mb-4">Up to 120 MCP generations per month, billed yearly</p>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$119.99</span>
                <span className="text-[#DEDDDC]/70 ml-2 mb-1">/yearly</span>
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
                onClick={() => handleSubscribe('basic-yearly')}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Subscribe Now'}
              </Button>
            </div>

            {/* Premium Yearly */}
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative shadow-lg ring-2 ring-[#C45736]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C45736] text-white px-6 py-1.5 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Premium Yearly</h3>
              <p className="text-[#DEDDDC]/70 text-sm mb-4">Unlimited MCP generations, billed yearly</p>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$159.9</span>
                <span className="text-[#DEDDDC]/70 ml-2 mb-1">/yearly</span>
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
                onClick={() => handleSubscribe('premium-yearly')}
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] py-16 border-t border-white/5">
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
    </div>
  );
} 