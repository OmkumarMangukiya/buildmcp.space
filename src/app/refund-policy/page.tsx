import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Refund Policy | buildmcp.space",
  description: "Refund and cancellation policy for buildmcp.space subscriptions",
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
              Refund & Cancellation Policy
            </h1>
            <p className="text-white/60 mb-2">Last updated: April 4, 2023</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-8">
              <h2 className="text-xl text-indigo-400 mt-0">Summary</h2>
              <ul className="mt-4">
                <li>buildmcp.space is a subscription-based service</li>
                <li>All subscription payments are non-refundable</li>
                <li>You can cancel your subscription at any time to prevent future charges</li>
                <li>No refunds are provided for partial billing periods</li>
              </ul>
            </div>
            
            <h2>1. Subscription Model</h2>
            <p>
              buildmcp.space operates on a subscription-based model. We offer monthly and annual subscription plans, each providing specific features and usage limitations. By subscribing to our service, you agree to the recurring payment schedule based on your chosen plan.
            </p>
            
            <h2>2. No-Refund Policy</h2>
            <p>
              <strong>All payments made for buildmcp.space subscriptions are non-refundable.</strong> This includes both monthly and annual subscriptions. Once a payment has been processed, we do not offer refunds for:
            </p>
            <ul>
              <li>Unused portions of your subscription period</li>
              <li>Subscription fees after cancellation</li>
              <li>Charges for additional services or features</li>
              <li>Accidental purchases or subscription renewals</li>
              <li>Dissatisfaction with the service</li>
              <li>Changes in your business needs or circumstances</li>
            </ul>
            
            <h2>3. Cancellation Policy</h2>
            <p>
              You may cancel your subscription at any time through your account dashboard. Once you cancel:
            </p>
            <ul>
              <li>Your subscription will remain active until the end of the current billing period</li>
              <li>You will not be charged for subsequent billing periods</li>
              <li>You will continue to have access to the service until the end of your current billing period</li>
              <li>No refund will be issued for the remaining time in your current billing period</li>
            </ul>
            
            <h2>4. How to Cancel Your Subscription</h2>
            <p>
              To cancel your subscription:
            </p>
            <ol>
              <li>Log in to your buildmcp.space account</li>
              <li>Navigate to "Account Settings"</li>
              <li>Select "Subscription"</li>
              <li>Click "Cancel Subscription"</li>
              <li>Follow the prompts to confirm cancellation</li>
            </ol>
            <p>
              After cancellation, you will receive a confirmation email. Please retain this for your records.
            </p>
            
            <h2>5. Exceptions to No-Refund Policy</h2>
            <p>
              We may consider refunds in the following limited circumstances:
            </p>
            <ul>
              <li>Technical issues that prevent access to our service for an extended period (over 24 hours) due to our fault</li>
              <li>Incorrect billing amount charged to your account</li>
              <li>Duplicate charges for the same subscription period</li>
            </ul>
            <p>
              To request a refund under these exceptions, please contact our support team at <a href="mailto:billing@buildmcp.space" className="text-indigo-400 hover:text-indigo-300">billing@buildmcp.space</a> within 7 days of the charge. All refund requests will be evaluated on a case-by-case basis.
            </p>
            
            <h2>6. Subscription Plan Changes</h2>
            <p>
              <strong>Upgrading:</strong> If you upgrade to a higher-tier subscription plan, the new rate will be charged immediately, and your subscription period will be reset starting from the upgrade date.
            </p>
            <p>
              <strong>Downgrading:</strong> If you downgrade to a lower-tier subscription plan, the change will take effect at the end of your current billing period. You will continue to have access to your current plan's features until that time.
            </p>
            
            <h2>7. Free Trial</h2>
            <p>
              If we offer a free trial period:
            </p>
            <ul>
              <li>You will not be charged during the trial period</li>
              <li>At the end of the trial period, you will be automatically charged for the subscription plan you selected</li>
              <li>You can cancel at any time during the trial period to avoid being charged</li>
              <li>Once the free trial period ends and your payment is processed, our standard no-refund policy applies</li>
            </ul>
            
            <h2>8. Pricing Changes</h2>
            <p>
              We reserve the right to change our subscription prices. If we change pricing:
            </p>
            <ul>
              <li>Existing subscribers will be notified at least 14 days before any price change takes effect</li>
              <li>Price changes will take effect at the beginning of the next billing cycle</li>
              <li>If you do not agree with the new pricing, you can cancel your subscription before the next billing cycle</li>
            </ul>
            
            <h2>9. Contact Information</h2>
            <p>
              If you have any questions about our Refund & Cancellation Policy, please contact us at:
            </p>
            <p>
              <a href="mailto:billing@buildmcp.space" className="text-indigo-400 hover:text-indigo-300">billing@buildmcp.space</a>
            </p>
            
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 mt-8">
              <p className="text-sm text-white/70 mb-0">
                This Refund & Cancellation Policy is part of our <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link>. By using our Services, you acknowledge that you have read, understood, and agree to be bound by both our Terms of Service and this Refund & Cancellation Policy.
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
              © 2023 MCP Builder. All rights reserved.
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