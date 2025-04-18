import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Refund Policy | buildmcp.space",
  description: "Refund policy for buildmcp.space payments",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="font-bold text-xl group">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400 animate-gradient-slow">buildmcp.space</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
              Refund Policy
            </h1>
            <p className="text-white/60 mb-2">Last updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-8">
              <h2 className="text-xl text-indigo-400 mt-0">Summary</h2>
              <ul className="mt-4">
                <li>buildmcp.space offers monthly and yearly payment options</li>
                <li>All payments are strictly non-refundable</li>
                <li>No refunds are provided under any circumstances</li>
              </ul>
            </div>
            
            <h2>1. Payment Model</h2>
            <p>
              buildmcp.space offers monthly and yearly payment options. Each payment provides access to specific features and usage for the duration of the paid period. By making a payment for our service, you agree to the terms outlined in this refund policy.
            </p>
            
            <h2>2. Strict No-Refund Policy</h2>
            <p>
              <strong>All payments made for buildmcp.space are strictly non-refundable.</strong> This includes both monthly and yearly payments. Once a payment has been processed, we do not offer refunds under any circumstances, including but not limited to:
            </p>
            <ul>
              <li>Unused portions of your paid period</li>
              <li>Charges for additional services or features</li>
              <li>Accidental purchases or payments</li>
              <li>Dissatisfaction with the service</li>
              <li>Changes in your business needs or circumstances</li>
              <li>Non-usage of the service during the paid period</li>
            </ul>
            
            <h2>3. Payment Terms</h2>
            <p>
              When you make a payment:
            </p>
            <ul>
              <li>Your access to the service will be active for the duration of the paid period</li>
              <li>Each payment is a separate transaction for the specified time period</li>
              <li>You must make a new payment to continue access after your paid period expires</li>
              <li>No refund will be issued under any circumstances</li>
            </ul>
            
            <h2>4. Exceptions</h2>
            <p>
              There are <strong>no exceptions</strong> to our no-refund policy. We do not provide refunds for any reason, including:
            </p>
            <ul>
              <li>Technical issues</li>
              <li>Service interruptions</li>
              <li>Changes to service features or capabilities</li>
              <li>User errors or misunderstandings</li>
            </ul>
            <p>
              If you have questions about our service before making a payment, please contact our support team at <a href="mailto:billing@buildmcp.space" className="text-indigo-400 hover:text-indigo-300">billing@buildmcp.space</a>.
            </p>
            
            <h2>5. Pricing Changes</h2>
            <p>
              We reserve the right to change our prices at any time. If we change pricing:
            </p>
            <ul>
              <li>Existing customers will be notified before any price change takes effect</li>
              <li>Price changes will apply to your next payment</li>
              <li>If you do not agree with the new pricing, you may choose not to make future payments</li>
            </ul>
            
            <h2>6. Contact Information</h2>
            <p>
              If you have any questions about our Refund Policy, please contact us at:
            </p>
            <p>
              <a href="mailto:billing@buildmcp.space" className="text-indigo-400 hover:text-indigo-300">billing@buildmcp.space</a>
            </p>
            
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 mt-8">
              <p className="text-sm text-white/70 mb-0">
                This Refund Policy is part of our <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link>. By using our Services, you acknowledge that you have read, understood, and agree to be bound by both our Terms of Service and this Refund Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} MCP Builder. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 