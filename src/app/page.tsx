"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, Terminal, Code, Users, ExternalLink, ArrowRight, Server, Database, Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Home() {
  useEffect(() => {
    // Add popup/enlarge animation to Get Started button after a delay
    const timer = setTimeout(() => {
      const getStartedBtn = document.querySelector(".get-started-btn");
      if (getStartedBtn) {
        getStartedBtn.classList.add("btn-popup");
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
              <Link href="#features" className="text-sm font-medium text-[#DEDDDC]/80 hover:text-white">Features</Link>
              <Link href="#pricing" className="text-sm font-medium text-[#DEDDDC]/80 hover:text-white">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/signin">
              <div className="px-3.5 py-1.5 bg-[#252525] text-[#DEDDDC]/80 hover:text-white font-medium text-sm rounded-md border border-white/10 shadow-inner shadow-black/10">
                Log in
              </div>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="px-3.5 py-1 bg-[#C45736] text-white hover:bg-[#C45736]/90 font-medium text-sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1F1F1F] pt-24 pb-32">
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-5 md:mb-8 mt-12">
              <span className="text-sm text-[#E1623D] tracking-wider font-medium">
                MODEL CONTEXT PROTOCOL BUILDER
              </span>
            </div>

            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 md:mb-10 tracking-tight leading-[1.1]">
                <span className="text-white">
                  Build Model Context Protocols
                </span>
              </h1>
            </div>

            <div>
              <p className="text-lg sm:text-xl md:text-2xl text-[#DEDDDC]/70 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                Create, manage, and share MCPs across different AI platforms with a seamless experience.
              </p>
            </div>

            <div className="flex justify-center">
              <Link href="/auth/signup">
                <Button className="get-started-btn font-medium text-base px-8 py-4 bg-[#E1623D] text-white hover:bg-[#E1623D]/90 border-l-2 border-b-2 border-[#B2512F] transform scale-100 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mockup Image */}
          <div className="max-w-5xl mx-auto mt-20 relative">
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl filter grayscale hover:grayscale-0 transition-all duration-300">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-[#0F0F0F]" id="features">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Powerful Features for AI Developers
            </h2>
            <p className="text-xl text-[#DEDDDC]/70 max-w-2xl mx-auto">
              Everything you need to build, manage, and deploy Model Context Protocols
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 group h-full flex flex-col">
              <div className="text-[#C45736] mb-6">
                <BrainCircuit className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white whitespace-nowrap">AI-Powered Creation</h3>
              <p className="text-[#DEDDDC]/70 text-base leading-relaxed mt-auto">Generate platform-specific MCPs with natural language prompts and custom feature integration.</p>
            </div>

            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 group h-full flex flex-col">
              <div className="text-[#C45736] mb-6">
                <Terminal className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white whitespace-nowrap">Instant Downloads</h3>
              <p className="text-[#DEDDDC]/70 text-base leading-relaxed mt-auto">Download ready-to-use MCPs in multiple formats with cross-platform compatibility.</p>
            </div>

            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 group h-full flex flex-col">
              <div className="text-[#C45736] mb-6">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white whitespace-nowrap">Interactive Dashboard</h3>
              <p className="text-[#DEDDDC]/70 text-base leading-relaxed mt-auto">View all your created MCPs and access MCP information from one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-32 bg-[#1F1F1F]" id="platforms">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Compatible with Popular AI Platforms
            </h2>
            <p className="text-xl text-[#DEDDDC]/70 max-w-2xl mx-auto">
              Build MCPs for various platforms with a unified experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            <div className="p-6 flex flex-col items-center justify-center aspect-square gap-4">
              <Image
                src="/cursor.svg"
                alt=""
                width={80}
                height={80}
                className="h-14 w-auto"
              />
              <span className="text-[#C45736] font-semibold text-base mt-2"></span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center aspect-square gap-4">
              <Image
                src="/claude.svg"
                alt=""
                width={80}
                height={80}
                className="h-14 w-auto"
              />
              <span className="text-[#C45736] font-semibold text-base mt-2"></span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center aspect-square gap-4">
              <Image
                src="/vscode.svg"
                alt=""
                width={80}
                height={80}
                className="h-14 w-auto"
              />
              <span className="text-[#C45736] font-semibold text-base mt-2"></span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center aspect-square gap-4">
              <Image
                src="/openai.svg"
                alt=""
                width={80}
                height={80}
                className="h-14 w-auto"
              />
              <span className="text-[#C45736] font-semibold text-base mt-2"></span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-[#0F0F0F]" id="about">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              How MCP Builder Works
            </h2>
            <p className="text-xl text-[#DEDDDC]/70 max-w-2xl mx-auto">
              A simple process to create powerful AI integrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-[#C45736] flex items-center justify-center text-white font-bold text-lg">1</div>
              <h3 className="text-2xl font-semibold mb-5 mt-2">Design Your MCP</h3>
              <p className="text-[#DEDDDC]/70 text-base mb-6 leading-relaxed">Describe what you want your MCP to do using natural language or configure detailed options.</p>
              <div className="text-[#C45736]">
                <Server className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-[#C45736] flex items-center justify-center text-white font-bold text-lg">2</div>
              <h3 className="text-2xl font-semibold mb-5 mt-2">Generate MCP Code</h3>
              <p className="text-[#DEDDDC]/70 text-base mb-6 leading-relaxed">Our AI will create the necessary code and configurations for your MCP.</p>
              <div className="text-[#C45736]">
                <Code className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-[#C45736] flex items-center justify-center text-white font-bold text-lg">3</div>
              <h3 className="text-2xl font-semibold mb-5 mt-2">Deploy & Use</h3>
              <p className="text-[#DEDDDC]/70 text-base mb-6 leading-relaxed">Deploy locally with one click and start using your MCP with your favorite AI platform.</p>
              <div className="text-[#C45736]">
                <Zap className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-[#1F1F1F]" id="pricing">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-[#DEDDDC]/70 max-w-2xl mx-auto mb-10">
              Choose the plan that fits your needs
            </p>
            
            {/* Price Toggle Switch */}
            <div className="flex items-center justify-center space-x-3">
              <span id="home-monthly-label" className="text-white font-medium">Monthly</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="pricing-toggle" 
                  className="sr-only peer" 
                  onChange={(e) => {
                    const annualPlans = document.getElementById('annual-plans');
                    const monthlyPlans = document.getElementById('monthly-plans');
                    const monthlyLabel = document.getElementById('home-monthly-label');
                    const annualLabel = document.getElementById('home-annual-label');
                    
                    if (e.target.checked && monthlyPlans && annualPlans && monthlyLabel && annualLabel) {
                      monthlyPlans.classList.add('hidden');
                      annualPlans.classList.remove('hidden');
                      monthlyLabel.classList.remove('text-white');
                      monthlyLabel.classList.add('text-[#DEDDDC]/70');
                      annualLabel.classList.add('text-white');
                      annualLabel.classList.remove('text-[#DEDDDC]/70');
                    } else if (monthlyPlans && annualPlans && monthlyLabel && annualLabel) {
                      monthlyPlans.classList.remove('hidden');
                      annualPlans.classList.add('hidden');
                      monthlyLabel.classList.add('text-white');
                      monthlyLabel.classList.remove('text-[#DEDDDC]/70');
                      annualLabel.classList.remove('text-white');
                      annualLabel.classList.add('text-[#DEDDDC]/70');
                    }
                  }}
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#C45736]"></div>
              </label>
              <span id="home-annual-label" className="text-[#DEDDDC]/70 font-medium">Annually <span className="text-[#C45736] text-xs font-bold">Save 42%</span></span>
            </div>
          </div>

          {/* Monthly Plans */}
          <div id="monthly-plans" className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
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
              
              <Link href="/auth/signup">
                <Button className="w-full py-3 text-base font-medium bg-[#252525] text-white hover:bg-[#303030] border border-white/10">
                  Subscribe Now
                </Button>
              </Link>
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
              
              <Link href="/auth/signup">
                <Button className="w-full py-3 text-base font-medium bg-[#C45736] text-white hover:bg-[#C45736]/90">
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Annual Plans */}
          <div id="annual-plans" className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto hidden">
            {/* Basic Yearly */}
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative">
              <h3 className="text-2xl font-semibold mb-2 text-white">Basic Yearly</h3>
              <p className="text-[#DEDDDC]/70 text-sm mb-4">Up to 120 MCP generations per month, billed yearly</p>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$83.49</span>
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
              
              <Link href="/auth/signup">
                <Button className="w-full py-3 text-base font-medium bg-[#252525] text-white hover:bg-[#303030] border border-white/10">
                  Subscribe Now
                </Button>
              </Link>
            </div>

            {/* Premium Yearly */}
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-8 border border-white/10 relative shadow-lg ring-2 ring-[#C45736]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C45736] text-white px-6 py-1.5 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Premium Yearly</h3>
              <p className="text-[#DEDDDC]/70 text-sm mb-4">Unlimited MCP generations, billed yearly</p>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$111.39</span>
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
              
              <Link href="/auth/signup">
                <Button className="w-full py-3 text-base font-medium bg-[#C45736] text-white hover:bg-[#C45736]/90">
                  Subscribe Now
                </Button>
              </Link>
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
                <li><Link href="#features" className="text-[#DEDDDC]/60 hover:text-white text-sm">Features</Link></li>
                <li><Link href="#platforms" className="text-[#DEDDDC]/60 hover:text-white text-sm">Platforms</Link></li>
                <li><Link href="#pricing" className="text-[#DEDDDC]/60 hover:text-white text-sm">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4 text-white">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-[#DEDDDC]/60 hover:text-white text-sm">Contact</Link></li>
                <li><Link href="/privacy" className="text-[#DEDDDC]/60 hover:text-white text-sm">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4 text-white">Connect</h4>
              <ul className="space-y-3">
                <li><a href="https://x.com/ommaniscoding" target="_blank" rel="noopener noreferrer" className="text-[#DEDDDC]/60 hover:text-white text-sm">X</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#DEDDDC]/40 text-sm mb-4 md:mb-0">© 2025 buildmcp.space. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-[#DEDDDC]/40 hover:text-white text-sm">Terms</Link>
              <Link href="/privacy" className="text-[#DEDDDC]/40 hover:text-white text-sm">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx global>{`
        .btn-popup {
          animation: popUp 0.3s ease forwards;
        }
        
        @keyframes popUp {
          0% {
            transform: scale(0.98);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.03);
            filter: brightness(1.1);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
}
