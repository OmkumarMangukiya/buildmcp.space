import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | buildmcp.space",
  description: "Privacy policy for buildmcp.space users",
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-[#DEDDDC]/60 text-sm">Last updated: April 7, 2025</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">1. Introduction</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  At buildmcp.space, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services, including our website, applications, APIs, and all offered services (collectively, the "Services"). Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">2. Information We Collect</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-4">2.1 Personal Information</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                      We may collect personal information that you voluntarily provide to us when you:
                    </p>
                    <ul className="space-y-3 pl-5">
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Register for an account</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Subscribe to our services</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Contact our customer support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Participate in surveys or promotions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Communicate with us via third-party social media sites</span>
                      </li>
                    </ul>
                    
                    <p className="text-[#DEDDDC]/90 leading-relaxed mt-6 mb-4">
                      The personal information we may collect includes:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-[#252525] p-3 rounded-lg border border-white/10 flex items-center">
                        <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">•</span>
                        <span>Name</span>
                      </div>
                      <div className="bg-[#252525] p-3 rounded-lg border border-white/10 flex items-center">
                        <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">•</span>
                        <span>Email address</span>
                      </div>
                      <div className="bg-[#252525] p-3 rounded-lg border border-white/10 flex items-center">
                        <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">•</span>
                        <span>Billing information</span>
                      </div>
                      <div className="bg-[#252525] p-3 rounded-lg border border-white/10 flex items-center">
                        <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">•</span>
                        <span>Username and password</span>
                      </div>
                      <div className="bg-[#252525] p-3 rounded-lg border border-white/10 flex items-center">
                        <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">•</span>
                        <span>Company name (if applicable)</span>
                      </div>
                      <div className="bg-[#252525] p-3 rounded-lg border border-white/10 flex items-center">
                        <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">•</span>
                        <span>Profile information</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-4">2.2 Usage Information</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                      We automatically collect certain information about your use of our Services, including:
                    </p>
                    <ul className="space-y-3 pl-5">
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>MCP generation and deployment activity</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#252525] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>User interactions with the platform</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-4">2.3 Cookies and Similar Technologies</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      We use cookies and similar tracking technologies to collect information about your interactions with our Services. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our Services may not function properly.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">3. How We Use Your Information</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                  We may use the information we collect for various purposes, including to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">01</span>
                      <span>Provide, maintain, and improve our Services</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">02</span>
                      <span>Process transactions and manage your account</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">03</span>
                      <span>Send you technical notices, updates, security alerts, and administrative messages</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">04</span>
                      <span>Respond to your comments, questions, and requests</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">05</span>
                      <span>Communicate with you about products, services, offers, promotions, and events</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">06</span>
                      <span>Monitor and analyze trends, usage, and activities in connection with our Services</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">07</span>
                      <span>Detect, investigate, and prevent fraudulent transactions and other illegal activities</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">08</span>
                      <span>Personalize and improve your experience</span>
                    </div>
                  </div>
                  <div className="bg-[#252525] p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <span className="bg-[#E1623D]/10 text-[#E1623D] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-1">09</span>
                      <span>Develop new products and services</span>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">4. How We Share Your Information</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed mb-6">
                  We may share the information we collect in various ways, including:
                </p>
                
                <div className="space-y-6">
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.1 With Service Providers</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.2 For Business Transfers</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.3 With Your Consent</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      We may share your information with your consent or at your direction.
                    </p>
                  </div>
                  
                  <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                    <h3 className="text-xl text-[#E1623D] mb-3">4.4 For Legal Purposes</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                      We may share your information if we believe disclosure is necessary or appropriate to:
                    </p>
                    <ul className="space-y-3 pl-5">
                      <li className="flex items-start">
                        <span className="bg-[#1F1F1F] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Comply with applicable laws, regulations, legal processes, or governmental requests</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#1F1F1F] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Enforce our agreements, policies, and terms of service</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#1F1F1F] w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs mt-0.5">•</span>
                        <span>Protect the rights, property, and safety of buildmcp.space, our users, or others</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">5. Data Retention</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">6. Data Security</h2>
                <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">7. Your Privacy Rights</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">7.1 Account Information</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      You can review and change your personal information by logging into your account settings. You may also send us an email to request access to, correct, or delete any personal information that you have provided to us.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">7.2 Marketing Communications</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      You can opt out of receiving promotional emails from us by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">7.3 Cookies</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed">
                      Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl text-[#E1623D] mb-3">7.4 Your Rights Under Specific Laws</h3>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                      Depending on your location, you may have certain rights regarding your personal information under applicable laws (such as the General Data Protection Regulation (GDPR) in the European Union or the California Consumer Privacy Act (CCPA) in California).
                    </p>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mb-4">
                      These rights may include:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-lg">
                        <div className="flex">
                          <span className="bg-[#E1623D]/10 text-[#E1623D] px-1.5 py-0.5 rounded text-xs mr-2">01</span>
                          <span>The right to access and receive a copy of your personal information</span>
                        </div>
                      </div>
                      <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-lg">
                        <div className="flex">
                          <span className="bg-[#E1623D]/10 text-[#E1623D] px-1.5 py-0.5 rounded text-xs mr-2">02</span>
                          <span>The right to rectify or update your personal information</span>
                        </div>
                      </div>
                      <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-lg">
                        <div className="flex">
                          <span className="bg-[#E1623D]/10 text-[#E1623D] px-1.5 py-0.5 rounded text-xs mr-2">03</span>
                          <span>The right to delete your personal information</span>
                        </div>
                      </div>
                      <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-lg">
                        <div className="flex">
                          <span className="bg-[#E1623D]/10 text-[#E1623D] px-1.5 py-0.5 rounded text-xs mr-2">04</span>
                          <span>The right to restrict or object to the processing of your personal information</span>
                        </div>
                      </div>
                      <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-lg">
                        <div className="flex">
                          <span className="bg-[#E1623D]/10 text-[#E1623D] px-1.5 py-0.5 rounded text-xs mr-2">05</span>
                          <span>The right to data portability</span>
                        </div>
                      </div>
                      <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-lg">
                        <div className="flex">
                          <span className="bg-[#E1623D]/10 text-[#E1623D] px-1.5 py-0.5 rounded text-xs mr-2">06</span>
                          <span>The right to withdraw consent</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[#DEDDDC]/90 leading-relaxed mt-4">
                      To exercise these rights, please contact us using the information provided in the "Contact Information" section below.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">8. Children's Privacy</h2>
                <div className="bg-[#252525] p-6 rounded-lg border border-white/10">
                  <p className="text-[#DEDDDC]/90 leading-relaxed">
                    Our Services are not intended for children under the age of 18. We do not knowingly collect or solicit personal information from children under 18. If you are under 18, please do not provide any information on our Services. If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">9. International Data Transfers</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we may transfer the information, including personal information, to the United States and process it there.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">10. Third-Party Links and Services</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  Our Services may contain links to other websites, products, or services that we do not own or operate. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of these third parties before providing any information to them.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">11. Changes to This Privacy Policy</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2 mb-6">12. Contact Information</h2>
                <p className="text-[#DEDDDC]/90 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4 bg-[#252525] p-4 rounded-lg inline-block">
                  <a href="mailto:contact@buildmcp.space" className="text-[#E1623D] hover:text-[#E1623D]/80 font-medium">contact@buildmcp.space</a>
                </div>
              </section>
              
              <div className="bg-gradient-to-r from-[#252525] to-[#2A2A2A] p-6 rounded-xl border border-white/10 mt-12 shadow-md">
                <p className="text-sm text-[#DEDDDC]/70 mb-0">
                  By using our Services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                </p>
              </div>
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
              <Link href="/privacy" className="text-[#E1623D] hover:text-[#E1623D]/80 transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="hover:text-[#DEDDDC] transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 