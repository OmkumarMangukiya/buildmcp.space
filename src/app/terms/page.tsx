import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | buildmcp.space",
  description: "Terms and conditions for using the buildmcp.space platform",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-white/60 mb-2">Last updated: April 4, 2023</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to buildmcp.space. These Terms of Service ("Terms") govern your access to and use of the buildmcp.space platform and services, including our website, applications, APIs, and all offered services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
            </p>
            
            <h2>2. Definitions</h2>
            <p>
              <strong>"buildmcp.space"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, and <strong>"our"</strong> refer to the buildmcp.space platform, its owners, operators, and affiliates.
            </p>
            <p>
              <strong>"User"</strong>, <strong>"you"</strong>, and <strong>"your"</strong> refer to any individual or entity that accesses or uses our Services.
            </p>
            <p>
              <strong>"Model Context Protocol (MCP)"</strong> refers to the custom AI context protocols created, managed, or deployed through our Services.
            </p>
            
            <h2>3. Account Registration and Requirements</h2>
            <p>
              To use certain features of our Services, you may need to register for an account. When registering, you agree to provide accurate, current, and complete information and to update your information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p>
              By creating an account, you represent that you are at least 18 years old or have the legal capacity to enter into these Terms in your jurisdiction.
            </p>
            
            <h2>4. Subscription and Payment Terms</h2>
            <p>
              <strong>4.1 Subscription Model</strong>: buildmcp.space operates on a subscription basis. We offer various subscription plans, each with different features, limitations, and pricing.
            </p>
            <p>
              <strong>4.2 Payment</strong>: When you subscribe to our paid services, you agree to pay all fees in accordance with the pricing and payment terms presented to you. All payments are non-refundable except as expressly stated in these Terms or as required by applicable law.
            </p>
            <p>
              <strong>4.3 Subscription Term and Renewal</strong>: Subscriptions automatically renew at the end of each billing period unless canceled before the renewal date. You may cancel your subscription at any time through your account dashboard.
            </p>
            <p>
              <strong>4.4 No Refunds</strong>: Payments for subscriptions are non-refundable. No refunds or credits will be provided for partially used subscription periods or for unused portions following cancellation.
            </p>
            <p>
              <strong>4.5 Price Changes</strong>: We reserve the right to change our subscription prices. Any price changes will be communicated to you in advance and will take effect at the next billing cycle.
            </p>
            
            <h2>5. Usage Limitations</h2>
            <p>
              Depending on your subscription plan, there may be limitations on the number of MCPs you can generate, edit, or deploy. Exceeding these limitations may require upgrading to a higher-tier subscription plan.
            </p>
            
            <h2>6. User Content and Conduct</h2>
            <p>
              <strong>6.1 User Content</strong>: You retain ownership of any content you submit, post, or display on or through our Services ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such User Content for the purpose of providing and improving our Services.
            </p>
            <p>
              <strong>6.2 Prohibited Content and Conduct</strong>: You agree not to use our Services to:
            </p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Harass, abuse, or harm others</li>
              <li>Upload or distribute malware or other harmful content</li>
              <li>Interfere with or disrupt the integrity or performance of our Services</li>
              <li>Attempt to gain unauthorized access to our Services or systems</li>
            </ul>
            
            <h2>7. Intellectual Property Rights</h2>
            <p>
              <strong>7.1 Our Intellectual Property</strong>: Our Services, including all content, features, and functionality, are owned by buildmcp.space and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or use our intellectual property without our explicit permission.
            </p>
            <p>
              <strong>7.2 MCPs</strong>: While you retain ownership of your User Content, the MCPs generated through our Services are subject to the specific licensing terms associated with your subscription plan.
            </p>
            
            <h2>8. Termination</h2>
            <p>
              <strong>8.1 Termination by You</strong>: You may terminate your account at any time. Cancellation of your subscription will take effect at the end of the current billing period.
            </p>
            <p>
              <strong>8.2 Termination by Us</strong>: We reserve the right to suspend or terminate your account and access to our Services at our discretion, with or without notice, for any reason, including but not limited to a violation of these Terms.
            </p>
            <p>
              <strong>8.3 Effect of Termination</strong>: Upon termination, your right to use our Services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
            
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            
            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL BUILDMCP.SPACE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE OUR SERVICES.
            </p>
            
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless buildmcp.space and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of our Services or your violation of these Terms.
            </p>
            
            <h2>12. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will provide notice to you, such as by sending an email, displaying a prominent notice on our website, or updating the "Last Updated" date at the top of these Terms. Your continued use of our Services after such notification constitutes your acceptance of the modified Terms.
            </p>
            
            <h2>13. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which buildmcp.space is registered, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of our Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
            
            <h2>14. Miscellaneous</h2>
            <p>
              <strong>14.1 Entire Agreement</strong>: These Terms constitute the entire agreement between you and buildmcp.space regarding your use of our Services and supersede all prior agreements and understandings.
            </p>
            <p>
              <strong>14.2 Severability</strong>: If any provision of these Terms is found to be unenforceable, that provision shall be enforced to the maximum extent possible, and the remaining provisions shall remain in full force and effect.
            </p>
            <p>
              <strong>14.3 No Waiver</strong>: Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
            <p>
              <strong>14.4 Assignment</strong>: You may not assign or transfer these Terms or your rights under these Terms without our prior written consent. We may assign our rights and obligations under these Terms without restriction.
            </p>
            
            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@buildmcp.space" className="text-indigo-400 hover:text-indigo-300">legal@buildmcp.space</a>.
            </p>
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
              <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 