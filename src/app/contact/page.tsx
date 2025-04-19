'use client';

import { useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
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
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400 animate-gradient-slow">buildmcp.space</span>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
            Get in Touch
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Have questions about buildmcp.space or need help with your MCPs? We'd love to hear from you. 
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/8 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500/20 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-white/70 text-sm mb-2">Our team is here to help</p>
                  <a href="mailto:contact@buildmcp.space" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    contact@buildmcp.space
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/8 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-rose-500/20 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p className="text-white/70 text-sm mb-2">Mon-Fri from 9am to 5pm</p>
                  <a href="tel:+11234567890" className="text-rose-400 hover:text-rose-300 transition-colors">
                    
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/8 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/20 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Office</h3>
                  <p className="text-white/70 text-sm mb-2">Visit us at our headquarters</p>
                  <address className="not-italic text-amber-400">
                    buildmcp.space<br />
                  </address>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
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
                      className="bg-white/5 border-white/10"
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
                      className="bg-white/5 border-white/10"
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
                    className="bg-white/5 border-white/10"
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
                    className="bg-white/5 border-white/10 min-h-[150px]"
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
                  className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>For urgent matters, please email us directly at <a href="mailto:contact@buildmcp.space" className="text-indigo-400 hover:underline">contact@buildmcp.space</a></p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
            <div className="mb-4 md:mb-0">
              © 2023 MCP Builder. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 