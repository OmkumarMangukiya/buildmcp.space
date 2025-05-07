import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | buildmcp.space",
  description: "Terms and conditions for using the buildmcp.space platform",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-[#DEDDDC]/60 text-sm">Last updated: April 7, 2025</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">1. Introduction</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  Welcome to buildmcp.space. These Terms of Service ("Terms") govern your access to and use of the buildmcp.space platform and services, including our website, applications, APIs, and all offered services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">2. Definitions</h2>
                <div className="space-y-4">
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    <span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">buildmcp.space</span><span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">we</span><span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">us</span> and <span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">our</span> refer to the buildmcp.space platform, its owners, operators, and affiliates.
                  </p>
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    <span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">User</span><span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">you</span> and <span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">your</span> refer to any individual or entity that accesses or uses our Services.
                  </p>
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    <span className="bg-[#E1623D]/10 text-[#E1623D] px-2 py-0.5 rounded mr-2 font-medium">Model Context Protocol (MCP)</span> refers to the custom AI context protocols created, managed, or deployed through our Services.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">3. Account Registration and Requirements</h2>
                <div className="space-y-4">
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    To use certain features of our Services, you may need to register for an account. When registering, you agree to provide accurate, current, and complete information and to update your information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    By creating an account, you represent that you are at least 18 years old or have the legal capacity to enter into these Terms in your jurisdiction.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">4. Subscription and Payment Terms</h2>
                <div className="space-y-6">
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.1 Subscription Model</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      buildmcp.space operates on a subscription basis. We offer various subscription plans, each with different features, limitations, and pricing.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.2 Payment</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      When you subscribe to our paid services, you agree to pay all fees in accordance with the pricing and payment terms presented to you. All payments are non-refundable except as expressly stated in these Terms or as required by applicable law.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.3 Subscription Term and Renewal</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      Subscriptions automatically renew at the end of each billing period unless canceled before the renewal date. You may cancel your subscription at any time through your account dashboard.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.4 No Refunds</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      Payments for subscriptions are non-refundable. No refunds or credits will be provided for partially used subscription periods or for unused portions following cancellation.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.5 Price Changes</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      We reserve the right to change our subscription prices. Any price changes will be communicated to you in advance and will take effect at the next billing cycle.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">5. Usage Limitations</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  Depending on your subscription plan, there may be limitations on the number of MCPs you can generate, edit, or deploy. Exceeding these limitations may require upgrading to a higher-tier subscription plan.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">6. User Content and Conduct</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">6.1 User Content</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      You retain ownership of any content you submit, post, or display on or through our Services ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such User Content for the purpose of providing and improving our Services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">6.2 Prohibited Content and Conduct</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                      You agree not to use our Services to:
                    </p>
                    <ul className="space-y-3 pl-5">
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Violate any applicable law or regulation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Infringe upon the intellectual property rights of others</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Harass, abuse, or harm others</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Upload or distribute malware or other harmful content</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Interfere with or disrupt the integrity or performance of our Services</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Attempt to gain unauthorized access to our Services or systems</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">7. Intellectual Property Rights</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">7.1 Our Intellectual Property</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      Our Services, including all content, features, and functionality, are owned by buildmcp.space and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or use our intellectual property without our explicit permission.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">7.2 MCPs</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      While you retain ownership of your User Content, the MCPs generated through our Services are subject to the specific licensing terms associated with your subscription plan.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">8. Termination</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">8.1 Termination by You</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      You may terminate your account at any time. Cancellation of your subscription will take effect at the end of the current billing period.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">8.2 Termination by Us</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      We reserve the right to suspend or terminate your account and access to our Services at our discretion, with or without notice, for any reason, including but not limited to a violation of these Terms.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">8.3 Effect of Termination</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      Upon termination, your right to use our Services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">9. Disclaimer of Warranties</h2>
                <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">10. Limitation of Liability</h2>
                <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL BUILDMCP.SPACE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE OUR SERVICES.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">11. Indemnification</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless buildmcp.space and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of our Services or your violation of these Terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">12. Modifications to Terms</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will provide notice to you, such as by sending an email, displaying a prominent notice on our website, or updating the "Last Updated" date at the top of these Terms. Your continued use of our Services after such notification constitutes your acceptance of the modified Terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">13. Governing Law and Dispute Resolution</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which buildmcp.space is registered, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of our Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">14. Miscellaneous</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">14.1 Entire Agreement</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      These Terms constitute the entire agreement between you and buildmcp.space regarding your use of our Services and supersede all prior agreements and understandings.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">14.2 Severability</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      If any provision of these Terms is found to be unenforceable, that provision shall be enforced to the maximum extent possible, and the remaining provisions shall remain in full force and effect.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">14.3 No Waiver</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">14.4 Assignment</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      You may not assign or transfer these Terms or your rights under these Terms without our prior written consent. We may assign our rights and obligations under these Terms without restriction.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">15. Contact Information</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 bg-[#252525] p-4 rounded-lg inline-block">
                  <a href="mailto:contact@buildmcp.space" className="text-[#E1623D] hover:text-[#E1623D]/80 font-medium">contact@buildmcp.space</a>
                </div>
              </section>
            </div>
            
            <div className="bg-gradient-to-r from-[#252525] to-[#2A2A2A] p-6 rounded-xl border border-white/10 mt-12 shadow-md">
              <p className="text-sm text-[#DEDDDC]/70 mb-0">
                By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
              <Link href="/terms" className="text-[#E1623D] hover:text-[#E1623D]/80 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#DEDDDC] transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="hover:text-[#DEDDDC] transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 