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
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-rose-500/[0.02] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.08]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />

          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.08]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />

          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.08]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />

          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-amber-500/[0.08]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />

          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-cyan-500/[0.08]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-xl group">
                <span className="text-white">buildmcp.space</span>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</Link>
                <Link href="#platforms" className="text-sm text-white/70 hover:text-white transition-colors">Platforms</Link>
                <Link href="#about" className="text-sm text-white/70 hover:text-white transition-colors">About</Link>
                <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</Link>
                <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin" className="text-sm text-white/70 hover:text-white transition-colors">Log in</Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-white text-black hover:bg-white/90">Sign up</Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-4 md:px-6 mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4 md:mb-6 mt-12"
            >
              <span className="text-sm text-white/60 tracking-wide">
                MODEL CONTEXT PROTOCOL BUILDER
              </span>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
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
              <p className="text-base sm:text-lg md:text-xl text-white/60 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                Create, manage, and share MCPs across different AI platforms with a seamless experience.
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/auth/signup">
                <RainbowButton>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </RainbowButton>
              </Link>
              <Link href="#learn-more">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
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
            className="max-w-4xl mx-auto mt-16 relative"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <DashboardMockup />
            </div>
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-rose-500/10 rounded-full blur-xl"></div>
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black" id="features">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Powerful Features for AI Developers
            </h2>
            <p className="text-white/60">
              Everything you need to build, manage, and deploy Model Context Protocols
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-indigo-500/20 group"
            >
              <BrainCircuit className="w-10 h-10 text-indigo-400 mb-4 group-hover:text-indigo-300" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">AI-Powered Creation</h3>
              <p className="text-white/70 text-sm">Generate platform-specific MCPs with natural language prompts and custom feature integration.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-indigo-500/20 group"
            >
              <Terminal className="w-10 h-10 text-indigo-400 mb-4 group-hover:text-indigo-300" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">Instant Downloads</h3>
              <p className="text-white/70 text-sm">Download ready-to-use MCPs in multiple formats with cross-platform compatibility.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-indigo-500/20 group"
            >
              <Users className="w-10 h-10 text-indigo-400 mb-4 group-hover:text-indigo-300" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">Interactive Dashboard</h3>
              <p className="text-white/70 text-sm">View all your created MCPs and access comprehensive MCP information from one place.</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-20 relative"
          >
            <div className="bg-gradient-to-r from-indigo-500/10 to-rose-500/10 rounded-xl p-1 shadow-lg hover:shadow-indigo-500/20 transition-all duration-500">
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="bg-white/5 p-5">
                  <div className="font-mono text-xs space-y-2">
                    <p className="text-white/70">// Generate an MCP for code completion</p>
                    <p className="text-indigo-400">const mcp = new MCP(<span className="text-rose-400">'code-completion'</span>);</p>
                    <p className="text-indigo-400">mcp.enableIntegration(<span className="text-rose-400">'github'</span>);</p>
                    <p className="text-indigo-400">mcp.addSupport([<span className="text-rose-400">'typescript'</span>, <span className="text-rose-400">'python'</span>]);</p>
                    <p className="text-indigo-400">mcp.deploy();</p>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-white/50">// AI-assisted MCP generation</span>
                  <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                    Generate MCP
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-24 bg-gradient-to-b from-black to-[#050505]" id="platforms">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Compatible with Popular AI Platforms
            </h2>
            <p className="text-white/60">
              Build MCPs for various platforms with a unified experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-rose-400 font-semibold group-hover:text-white transition-colors duration-300">Cursor</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-rose-400 font-semibold group-hover:text-white transition-colors duration-300">Claude Desktop</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-rose-400 font-semibold group-hover:text-white transition-colors duration-300">VSCode</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group"
            >
              <span className="text-rose-400 font-semibold group-hover:text-white transition-colors duration-300">ChatGPT</span>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto relative"
          >
            <div className="absolute -top-12 -left-12 animate-pulse z-10">
              <div className="bg-rose-500/20 backdrop-blur-md rounded-full p-2 shadow-lg shadow-rose-500/30">
                <Code className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 animate-pulse z-10">
              <div className="bg-indigo-500/20 backdrop-blur-md rounded-full p-2 shadow-lg shadow-indigo-500/30">
                <Terminal className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-rose-500/20 to-indigo-500/20 rounded-xl p-1 shadow-lg hover:shadow-rose-500/30 transition-all duration-500 hover:scale-[1.02] transform">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden">
                <div className="p-8">
                  <div className="rounded-lg overflow-hidden bg-white/5 p-4 mb-4 hover:bg-white/10 transition-all duration-300">
                    <div className="text-sm text-white/70">
                      <p className="mb-2">Create an MCP for Cursor that provides:</p>
                      <p className="bg-rose-500/10 p-2 rounded">Code review assistance, automatic documentation generation, and repository analysis</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2 hover:bg-white/10 transition-colors group border-white/20">
                      <ArrowRight className="w-3 h-3 group-hover:text-rose-400 transition-colors" />
                      <span className="group-hover:text-rose-400 transition-colors">Create MCP</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#050505]" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How MCP Builder Works
            </h2>
            <p className="text-white/60">
              A simple process to create powerful AI integrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 relative"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-xl font-semibold mb-4 mt-2">Design Your MCP</h3>
              <p className="text-white/70 text-sm mb-4">Describe what you want your MCP to do using natural language or configure detailed options.</p>
              <div className="text-indigo-400">
                <Server className="w-6 h-6" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 relative"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-xl font-semibold mb-4 mt-2">Generate MCP Code</h3>
              <p className="text-white/70 text-sm mb-4">Our AI will create the necessary code and configurations for your MCP.</p>
              <div className="text-indigo-400">
                <Code className="w-6 h-6" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 relative"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-xl font-semibold mb-4 mt-2">Deploy & Use</h3>
              <p className="text-white/70 text-sm mb-4">Deploy locally with one click and start using your MCP with your favorite AI platform.</p>
              <div className="text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-black" id="pricing">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/60">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 relative"
            >
              <h3 className="text-xl font-semibold mb-4">Basic</h3>
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold">$11.99</span>
                <span className="ml-1 text-white/60">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Up to 120 MCP generations per month</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Access to all features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <RainbowButton className="w-full">Get Started</RainbowButton>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-indigo-500/50 relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium</h3>
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold">$15.99</span>
                <span className="ml-1 text-white/60">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited MCP generations</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Access to all features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Priority email support</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <RainbowButton className="w-full">Get Started</RainbowButton>
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/60">
              Save 20% with annual billing. Premium yearly plan available for $159.90/year.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <Link href="/" className="font-bold text-xl text-white">
              buildmcp.space
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-sm">
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#platforms" className="hover:text-white transition-colors">Platforms</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="https://twitter.com/mcpbuilder" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="https://discord.gg/mcpbuilder" className="hover:text-white transition-colors">Discord</Link></li>
                <li><a href="mailto:support@buildmcp.space" className="hover:text-white transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>
          
          {/* Terms Summary */}
          <div className="border border-white/10 rounded-lg p-6 mb-8 bg-white/[0.03]">
            <h4 className="font-semibold mb-3 text-white">Subscription Terms Summary</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                <span>buildmcp.space is a <span className="text-white font-medium">subscription-based service</span> with monthly or annual billing options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                <span>Our service has <span className="text-white font-medium">usage limitations</span> for MCP generation based on your subscription plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                <span>Subscriptions can be cancelled at any time through your account dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                <span><span className="text-white font-medium">No refunds are provided</span> for subscription payments or unused portions of subscriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-1">•</span>
                <span>By using our service, you agree to our <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</Link></span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-white/50 text-sm border-t border-white/10 pt-8">
            <div className="mb-4 md:mb-0">
              © 2023 buildmcp.space. All rights reserved.
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
