import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | buildmcp.space",
  description: "Privacy policy for buildmcp.space users",
};

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-rose-400">
              Privacy Policy
            </h1>
            <p className="text-white/60 mb-2">Last updated: April 4, 2023</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              At buildmcp.space, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services, including our website, applications, APIs, and all offered services (collectively, the "Services"). Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
            
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Register for an account</li>
              <li>Subscribe to our services</li>
              <li>Contact our customer support</li>
              <li>Participate in surveys or promotions</li>
              <li>Communicate with us via third-party social media sites</li>
            </ul>
            <p>
              The personal information we may collect includes:
            </p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Billing information</li>
              <li>Username and password</li>
              <li>Company name (if applicable)</li>
              <li>Profile information</li>
            </ul>
            
            <h3>2.2 Usage Information</h3>
            <p>
              We automatically collect certain information about your use of our Services, including:
            </p>
            <ul>
              <li>MCP generation and deployment activity</li>
              <li>User interactions with the platform</li>
            </ul>
            
            <h3>2.3 Cookies and Similar Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to collect information about your interactions with our Services. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our Services may not function properly.
            </p>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and manage your account</li>
              <li>Send you technical notices, updates, security alerts, and administrative messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, offers, promotions, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize and improve your experience</li>
              <li>Develop new products and services</li>
            </ul>
            
            <h2>4. How We Share Your Information</h2>
            <p>
              We may share the information we collect in various ways, including:
            </p>
            
            <h3>4.1 With Service Providers</h3>
            <p>
              We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>
            
            <h3>4.2 For Business Transfers</h3>
            <p>
              We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </p>
            
            <h3>4.3 With Your Consent</h3>
            <p>
              We may share your information with your consent or at your direction.
            </p>
            
            <h3>4.4 For Legal Purposes</h3>
            <p>
              We may share your information if we believe disclosure is necessary or appropriate to:
            </p>
            <ul>
              <li>Comply with applicable laws, regulations, legal processes, or governmental requests</li>
              <li>Enforce our agreements, policies, and terms of service</li>
              <li>Protect the rights, property, and safety of buildmcp.space, our users, or others</li>
            </ul>
            
            <h2>5. Data Retention</h2>
            <p>
              We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            
            <h2>6. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            
            <h2>7. Your Privacy Rights</h2>
            
            <h3>7.1 Account Information</h3>
            <p>
              You can review and change your personal information by logging into your account settings. You may also send us an email to request access to, correct, or delete any personal information that you have provided to us.
            </p>
            
            <h3>7.2 Marketing Communications</h3>
            <p>
              You can opt out of receiving promotional emails from us by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
            </p>
            
            <h3>7.3 Cookies</h3>
            <p>
              Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.
            </p>
            
            <h3>7.4 Your Rights Under Specific Laws</h3>
            <p>
              Depending on your location, you may have certain rights regarding your personal information under applicable laws (such as the General Data Protection Regulation (GDPR) in the European Union or the California Consumer Privacy Act (CCPA) in California).
            </p>
            <p>
              These rights may include:
            </p>
            <ul>
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to rectify or update your personal information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to the processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Information" section below.
            </p>
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our Services are not intended for children under the age of 18. We do not knowingly collect or solicit personal information from children under 18. If you are under 18, please do not provide any information on our Services. If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>
            
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we may transfer the information, including personal information, to the United States and process it there.
            </p>
            
            <h2>10. Third-Party Links and Services</h2>
            <p>
              Our Services may contain links to other websites, products, or services that we do not own or operate. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of these third parties before providing any information to them.
            </p>
            
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            
            <h2>12. Contact Information</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p>
              <a href="mailto:contact@buildmcp.space" className="text-rose-400 hover:text-rose-300">contact@buildmcp.space</a>
            </p>
            
            <p className="mt-8 border-t border-white/10 pt-8 text-sm text-white/50">
              By using our Services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-rose-400 hover:text-rose-300 transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 