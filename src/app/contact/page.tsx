'use client';

import { useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real implementation, you would send this data to your backend
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, subject, message }),
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm">
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

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-[#DEDDDC]/60 max-w-2xl mx-auto">
            Have questions about buildmcp.space or need help with your MCPs? We'd love to hear from you. 
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-8">
            <div className="bg-[#1F1F1F] backdrop-blur-md rounded-lg p-6 hover:bg-[#252525] transition-colors border border-white/10">
              <div className="flex items-start gap-4">
                <div className="bg-[#C45736]/20 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-[#E1623D]" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-[#DEDDDC]/70 text-sm mb-2">Our team is here to help</p>
                  <a href="mailto:contact@buildmcp.space" className="text-[#E1623D] hover:text-[#E1623D]/80 transition-colors">
                    contact@buildmcp.space
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Card className="bg-[#1F1F1F] border-white/10 backdrop-blur-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#252525] border-white/10"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Your Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#252525] border-white/10"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-[#252525] border-white/10"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-[#252525] border-white/10 min-h-[150px]"
                    placeholder="Tell us how we can assist you..."
                    required
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded text-sm">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-sm">
                    There was an error sending your message. Please try again.
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#C45736] hover:bg-[#C45736]/90 text-white"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-[#DEDDDC]/60 text-sm">
          <p>For urgent matters, please email us directly at <a href="mailto:contact@buildmcp.space" className="text-[#E1623D] hover:text-[#E1623D]/80">contact@buildmcp.space</a></p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#0F0F0F] mt-12">
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
    </div>
  );
} 