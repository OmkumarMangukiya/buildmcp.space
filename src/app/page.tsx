"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BrainCircuit, Terminal, Code, Users, ExternalLink, ArrowRight, Server, Database, Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import { RainbowButton } from "@/components/ui/rainbow-button";

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} 
                    backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                    after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  );
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tight group">
              <span className="text-white">buildmcp.space</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
              <Link href="#platforms" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Platforms</Link>
              <Link href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">About</Link>
              <Link href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</Link>
              <Link href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/signin" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Log in</Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-24 pb-32">
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-5 md:mb-8 mt-12"
            >
              <span className="text-sm text-white/60 tracking-wider font-medium">
                MODEL CONTEXT PROTOCOL BUILDER
              </span>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 md:mb-10 tracking-tight leading-[1.1]">
                <span className="text-white">
                  Build Model Context Protocols
                </span>
              </h1>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                Create, manage, and share MCPs across different AI platforms with a seamless experience.
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6 justify-center"
            >
              <Link href="/auth/signup">
                <RainbowButton className="font-medium text-base px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </RainbowButton>
              </Link>
              <Link href="#learn-more">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 font-medium text-base px-8 py-3">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mockup Image */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto mt-20 relative"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black" id="features">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Powerful Features for AI Developers
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to build, manage, and deploy Model Context Protocols
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-zinc-300/30 group h-full flex flex-col"
            >
              <div className="text-zinc-300 mb-6">
                <BrainCircuit className="w-12 h-12 group-hover:text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-zinc-100 transition-colors whitespace-nowrap">AI-Powered Creation</h3>
              <p className="text-white/70 text-base leading-relaxed mt-auto">Generate platform-specific MCPs with natural language prompts and custom feature integration.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-zinc-300/30 group h-full flex flex-col"
            >
              <div className="text-zinc-300 mb-6">
                <Terminal className="w-12 h-12 group-hover:text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-zinc-100 transition-colors whitespace-nowrap">Instant Downloads</h3>
              <p className="text-white/70 text-base leading-relaxed mt-auto">Download ready-to-use MCPs in multiple formats with cross-platform compatibility.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-zinc-300/30 group h-full flex flex-col"
            >
              <div className="text-zinc-300 mb-6">
                <Users className="w-12 h-12 group-hover:text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-zinc-100 transition-colors whitespace-nowrap">Interactive Dashboard</h3>
              <p className="text-white/70 text-base leading-relaxed mt-auto">View all your created MCPs and access MCP information from one place.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-32 bg-gradient-to-b from-black to-[#050505]" id="platforms">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Compatible with Popular AI Platforms
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Build MCPs for various platforms with a unified experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-zinc-300 font-semibold text-xl group-hover:text-white transition-colors duration-300">Cursor</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-zinc-300 font-semibold text-xl group-hover:text-white transition-colors duration-300">Claude Desktop</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-zinc-300 font-semibold text-xl group-hover:text-white transition-colors duration-300">VSCode</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-zinc-300 font-semibold text-xl group-hover:text-white transition-colors duration-300">ChatGPT</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-[#050505]" id="about">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              How MCP Builder Works
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              A simple process to create powerful AI integrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10 relative"
            >
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center text-black font-bold text-lg">1</div>
              <h3 className="text-2xl font-semibold mb-5 mt-2">Design Your MCP</h3>
              <p className="text-white/70 text-base mb-6 leading-relaxed">Describe what you want your MCP to do using natural language or configure detailed options.</p>
              <div className="text-zinc-300">
                <Server className="w-8 h-8" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10 relative"
            >
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center text-black font-bold text-lg">2</div>
              <h3 className="text-2xl font-semibold mb-5 mt-2">Generate MCP Code</h3>
              <p className="text-white/70 text-base mb-6 leading-relaxed">Our AI will create the necessary code and configurations for your MCP.</p>
              <div className="text-zinc-300">
                <Code className="w-8 h-8" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10 relative"
            >
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center text-black font-bold text-lg">3</div>
              <h3 className="text-2xl font-semibold mb-5 mt-2">Deploy & Use</h3>
              <p className="text-white/70 text-base mb-6 leading-relaxed">Deploy locally with one click and start using your MCP with your favorite AI platform.</p>
              <div className="text-zinc-300">
                <Zap className="w-8 h-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-black" id="pricing">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-white/10 relative"
            >
              <h3 className="text-2xl font-semibold mb-4">Basic</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$11.99</span>
                <span className="ml-2 text-white/60 text-lg">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Up to 120 MCP generations per month</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Access to all features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Email support</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button className="w-[95%] py-2 text-base font-medium bg-white text-black hover:bg-white/90 mx-auto block">Get Started</Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-zinc-300/50 relative shadow-lg shadow-zinc-300/20"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-zinc-300 text-black px-6 py-1.5 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-semibold mb-4">Premium</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold">$15.99</span>
                <span className="ml-2 text-white/60 text-lg">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Unlimited MCP generations</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Access to all features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">Priority email support</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <RainbowButton className="w-full py-3 text-base font-medium">Get Started</RainbowButton>
              </Link>
            </motion.div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-white/70">
              Save 20% with annual billing. Premium yearly plan available for $159.90/year.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-12">
            <Link href="/" className="font-bold text-2xl text-white">
              buildmcp.space
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-sm">
            <div>
              <h4 className="font-semibold mb-5 text-white text-base">Product</h4>
              <ul className="space-y-3 text-white/50">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#platforms" className="hover:text-white transition-colors">Platforms</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-5 text-white text-base">Legal</h4>
              <ul className="space-y-3 text-white/50">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-5 text-white text-base">Connect</h4>
              <ul className="space-y-3 text-white/50">
                <li><Link href="https://twitter.com/mcpbuilder" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="https://discord.gg/mcpbuilder" className="hover:text-white transition-colors">Discord</Link></li>
                <li><a href="mailto:support@buildmcp.space" className="hover:text-white transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>
          
          {/* Terms Summary */}
          <div className="border border-white/10 rounded-lg p-8 mb-12 bg-white/[0.03]">
            <h4 className="font-semibold mb-4 text-white text-lg">Subscription Terms Summary</h4>
            <ul className="space-y-3 text-white/70 text-base">
              <li className="flex items-start gap-3">
                <span className="text-zinc-300 mt-1 text-lg">•</span>
                <span>buildmcp.space is a <span className="text-white font-medium">subscription-based service</span> with monthly or annual billing options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-300 mt-1 text-lg">•</span>
                <span>Our service has <span className="text-white font-medium">usage limitations</span> for MCP generation based on your subscription plan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-300 mt-1 text-lg">•</span>
                <span>Subscriptions can be cancelled at any time through your account dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-300 mt-1 text-lg">•</span>
                <span><span className="text-white font-medium">No refunds are provided</span> for subscription payments or unused portions of subscriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-300 mt-1 text-lg">•</span>
                <span>By using our service, you agree to our <Link href="/terms" className="text-zinc-300 hover:text-zinc-100 underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-zinc-300 hover:text-zinc-100 underline">Privacy Policy</Link></span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-white/50 text-sm border-t border-white/10 pt-8">
            <div className="mb-4 md:mb-0">
              © 2023 buildmcp.space. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
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
