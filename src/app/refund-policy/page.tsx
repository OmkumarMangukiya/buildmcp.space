import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Refund Policy | buildmcp.space",
  description: "Refund policy for buildmcp.space payments",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#DEDDDC]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1F1F1F]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="font-bold text-xl group">
                <span className="text-[#E1623D]">buildmcp.space</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-[#DEDDDC]/70 hover:text-[#DEDDDC] group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-10">
          <div className="bg-gradient-to-r from-[#252525] to-[#2A2A2A] p-8 rounded-xl border border-white/10 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Refund Policy
            </h1>
            <p className="text-[#DEDDDC]/60 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            {/* Summary Card */}
            <div className="bg-[#252525] p-8 rounded-xl border border-white/10 mb-10 shadow-md">
              <h2 className="text-xl text-[#E1623D] mt-0 flex items-center">
                <span className="bg-[#E1623D]/20 text-[#E1623D] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 11V6m0 8h.01"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/></svg>
                </span>
                Summary
              </h2>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <span className="bg-[#E1623D]/10 text-[#E1623D] w-5 h-5 rounded-full flex items-center justify-center mr-3 text-xs mt-1">✓</span>
                  <span>buildmcp.space offers monthly and yearly payment options</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#E1623D]/10 text-[#E1623D] w-5 h-5 rounded-full flex items-center justify-center mr-3 text-xs mt-1">✓</span>
                  <span><strong>All payments are strictly non-refundable</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#E1623D]/10 text-[#E1623D] w-5 h-5 rounded-full flex items-center justify-center mr-3 text-xs mt-1">✓</span>
                  <span>No refunds are provided under any circumstances</span>
                </li>
              </ul>
            </div>
            
            {/* Policy Sections */}
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">1. Payment Model</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  buildmcp.space offers monthly and yearly payment options. Each payment provides access to specific features and usage for the duration of the paid period. By making a payment for our service, you agree to the terms outlined in this refund policy.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">2. Strict No-Refund Policy</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                  <strong className="text-[#E1623D]">All payments made for buildmcp.space are strictly non-refundable.</strong> This includes both monthly and yearly payments. Once a payment has been processed, we do not offer refunds under any circumstances, including but not limited to:
                </p>
                <ul className="space-y-3 pl-5">
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Unused portions of your paid period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Charges for additional services or features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Accidental purchases or payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Dissatisfaction with the service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Changes in your business needs or circumstances</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Non-usage of the service during the paid period</span>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">3. Payment Terms</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                  When you make a payment:
                </p>
                <ul className="space-y-3 pl-5">
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Your access to the service will be active for the duration of the paid period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Each payment is a separate transaction for the specified time period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>You must make a new payment to continue access after your paid period expires</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>No refund will be issued under any circumstances</span>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">4. Exceptions</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                  There are <strong className="text-[#E1623D]">no exceptions</strong> to our no-refund policy. We do not provide refunds for any reason, including:
                </p>
                <ul className="space-y-3 pl-5">
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Technical issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Service interruptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Changes to service features or capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>User errors or misunderstandings</span>
                  </li>
                </ul>
                <p className="text-[#DEDDDC]/90 leading-relaxed mt-4">
                  If you have questions about our service before making a payment, please contact our support team at <a href="mailto:contact@buildmcp.space" className="text-[#E1623D] hover:text-[#E1623D]/80 underline">contact@buildmcp.space</a>.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">5. Pricing Changes</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                  We reserve the right to change our prices at any time. If we change pricing:
                </p>
                <ul className="space-y-3 pl-5">
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Existing customers will be notified before any price change takes effect</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>Price changes will apply to your next payment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                    <span>If you do not agree with the new pricing, you may choose not to make future payments</span>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">6. Contact Information</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  If you have any questions about our Refund Policy, please contact us at:
                </p>
                <div className="mt-4 bg-[#252525] p-4 rounded-lg inline-block">
                  <a href="mailto:contact@buildmcp.space" className="text-[#E1623D] hover:text-[#E1623D]/80 font-medium">contact@buildmcp.space</a>
                </div>
              </section>
            </div>
            
            <div className="bg-gradient-to-r from-[#252525] to-[#2A2A2A] p-6 rounded-xl border border-white/10 mt-12 shadow-md">
              <p className="text-sm text-[#DEDDDC]/70 mb-0">
                This Refund Policy is part of our <Link href="/terms" className="text-[#E1623D] hover:text-[#E1623D]/80 underline">Terms of Service</Link>. By using our Services, you acknowledge that you have read, understood, and agree to be bound by both our Terms of Service and this Refund Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-[#0F0F0F] mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-[#DEDDDC]/50 text-sm">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} MCP Builder. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-[#DEDDDC] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#DEDDDC] transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="text-[#E1623D] hover:text-[#E1623D]/80 transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 