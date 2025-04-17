import Link from "next/link";
import { ArrowRight, CheckCircle2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingClientComponent from "./PricingClientComponent";
import { Suspense } from "react";

export default function PricingPage() {
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
            <Suspense fallback={<div className="px-3.5 py-1.5 bg-[#252525] text-[#DEDDDC]/80 font-medium text-sm rounded-md border border-white/10 shadow-inner shadow-black/10">Loading...</div>}>
              <PricingClientComponent />
            </Suspense>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center text-white mb-5">Choose Your Plan</h1>
          <p className="text-center text-[#DEDDDC]/70 text-lg max-w-3xl mx-auto mb-12">
            Select the plan that best fits your needs. All plans include access to our core features and updates.
          </p>
          
          {/* Client component for pricing plans */}
          <Suspense fallback={<div className="py-12 text-center text-[#DEDDDC]/70">Loading pricing plans...</div>}>
            <PricingClientComponent isMain={true} />
          </Suspense>
        </div>
      </section>
    </div>
  );
} 