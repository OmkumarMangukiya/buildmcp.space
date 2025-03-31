"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BrainCircuit, Terminal, Code, Users, ExternalLink, ArrowRight, Server, Database, Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";

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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />

          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />

          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />

          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-amber-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />

          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-cyan-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-xl group">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400 animate-gradient-slow">MCP.Build</span>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</Link>
                <Link href="#platforms" className="text-sm text-white/70 hover:text-white transition-colors">Platforms</Link>
                <Link href="#about" className="text-sm text-white/70 hover:text-white transition-colors">About</Link>
                <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Log in</Link>
              <Link href="/signup">
                <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">Sign up</Button>
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
            >
              <div className="h-2 w-2 rounded-full bg-rose-500/80" />
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
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Build and Deploy
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Model Context Protocols
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
              <Link href="/dashboard">
                <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
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
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">One-Click Deployment</h3>
              <p className="text-white/70 text-sm">Deploy your MCPs to your local environment with detailed setup instructions.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-rose-400">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-rose-400">
              Built with Modern Technology
            </h2>
            <p className="text-white/60">
              Powerful tools for a seamless development experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="text-rose-400 group-hover:text-white transition-colors mb-2">
                <div className="text-lg font-semibold">Next.js</div>
              </div>
              <p className="text-xs text-white/50 text-center">React framework</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="text-rose-400 group-hover:text-white transition-colors mb-2">
                <div className="text-lg font-semibold">TypeScript</div>
              </div>
              <p className="text-xs text-white/50 text-center">Type-safe JS</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="text-rose-400 group-hover:text-white transition-colors mb-2">
                <div className="text-lg font-semibold">Tailwind</div>
              </div>
              <p className="text-xs text-white/50 text-center">CSS framework</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="text-rose-400 group-hover:text-white transition-colors mb-2">
                <div className="text-lg font-semibold">Supabase</div>
              </div>
              <p className="text-xs text-white/50 text-center">Backend & Auth</p>
            </motion.div>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-indigo-500/20 to-rose-500/20 rounded-xl p-1">
              <div className="bg-black rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-white/60 mb-6">Create your first Model Context Protocol in minutes</p>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
              MCP.Build
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm mb-8">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">Blog</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
          </div>
          <div className="text-center text-white/50 text-sm">
            © 2023 MCP Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
