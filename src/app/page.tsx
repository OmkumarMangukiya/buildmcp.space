import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Terminal, Code, Users, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Plus, Settings, Globe, Share2, Server, Download, Laptop, Cloud, GitFork } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeroImage } from "@/components/ui/hero-image";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl group">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent bg-200% animate-gradient-slow">MCP.Build</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#platforms" className="text-sm text-white/70 hover:text-white transition-colors relative group">
                Platforms
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#about" className="text-sm text-white/70 hover:text-white transition-colors relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#login" className="text-sm text-white/70 hover:text-white transition-colors">Log in</Link>
            <Link href="/dashboard">
              <AnimatedButton 
                animationType="sparkle" 
                icon={true}
                label="Get Started"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3 flex justify-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full animate-pulse">AI-POWERED MCP BUILDER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-accent bg-200% animate-gradient-slow">Your Intelligent Canvas.</h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in">
            Every Model Context Protocol. Every AI platform. One connection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <AnimatedButton 
              animationType="glow" 
              icon={true}
              label="Get Started"
              size="lg"
            />
            <AnimatedButton 
              animationType="pulse" 
              label="Learn More"
              variant="outline"
              size="lg"
            />
          </div>

          {/* Platform Logos */}
          <div className="mb-8">
            <p className="text-white/50 mb-4 text-sm">TRUSTED BY</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <div className="hover:text-primary transition-colors">
                <span className="text-sm">PlanetScale</span>
              </div>
              <div className="hover:text-primary transition-colors">
                <span className="text-sm">Prisma</span>
              </div>
              <div className="hover:text-primary transition-colors">
                <span className="text-sm">Alibaba</span>
              </div>
              <div className="hover:text-primary transition-colors">
                <span className="text-sm">Vercel</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <HeroImage />
        </div>
      </section>

      {/* Create at the speed of thought section */}
      <section className="py-24 bg-black" id="features">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary bg-200% animate-gradient-slow">Create at the speed of thought.</h2>
            <p className="text-white/70">
              Design, develop, and implement your Model Context Protocols in real-time, with AI assistance.
            </p>
          </div>

          {/* Feature blocks with hover effects */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20 group">
              <BrainCircuit className="w-10 h-10 text-primary mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">AI-Powered Creation</h3>
              <p className="text-white/70 text-sm">Generate platform-specific MCPs with a natural language interface.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20 group">
              <Terminal className="w-10 h-10 text-primary mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Deploy Anywhere</h3>
              <p className="text-white/70 text-sm">One-click deployment to your local environment or cloud infrastructure.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20 group">
              <Users className="w-10 h-10 text-primary mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Community Marketplace</h3>
              <p className="text-white/70 text-sm">Browse, fork, and collaborate on MCPs with developers worldwide.</p>
            </div>
          </div>

          {/* Feature demo with enhanced effects */}
          <div className="max-w-4xl mx-auto mt-20 relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-accent/10 rounded-full blur-xl animate-float-slow-reverse"></div>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-1 shadow-lg hover:shadow-primary/20 transition-all duration-500">
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="bg-white/5 p-5">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="flex-1 text-white/70">
                      <div className="font-mono text-xs space-y-2">
                        <p className="animate-fade-in" style={{ animationDelay: '0ms' }}>1. Create a code completion MCP</p>
                        <p className="animate-fade-in" style={{ animationDelay: '100ms' }}>2. Enable GitHub integration</p>
                        <p className="animate-fade-in" style={{ animationDelay: '200ms' }}>3. Support TypeScript and Python</p>
                        <p className="animate-fade-in" style={{ animationDelay: '300ms' }}>4. Add file context awareness</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                  <Button variant="ghost" className="text-xs text-white/50 hover:text-white/80 transition-colors">See example</Button>
                  <AnimatedButton 
                    animationType="sparkle" 
                    icon={true}
                    label="Generate MCP"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bring the whole team section */}
      <section className="py-24 bg-black" id="platforms">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-accent bg-200% animate-gradient-slow">Bring the whole team.</h2>
            <p className="text-white/70">
              Collaborate in real-time with your entire development team.
            </p>
          </div>

          {/* Platforms grid with hover effects */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group">
              <span className="text-primary font-semibold group-hover:text-white transition-colors duration-300">Cursor</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group">
              <span className="text-primary font-semibold group-hover:text-white transition-colors duration-300">VSCode</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group">
              <span className="text-primary font-semibold group-hover:text-white transition-colors duration-300">Claude</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square group">
              <span className="text-primary font-semibold group-hover:text-white transition-colors duration-300">ChatGPT</span>
            </div>
          </div>

          {/* Example card with enhanced animations */}
          <div className="max-w-lg mx-auto relative">
            <div className="absolute -top-12 -left-12 animate-float-slow z-10">
              <div className="bg-primary/20 backdrop-blur-md rounded-full p-2 shadow-lg shadow-primary/30">
                <Code className="w-6 h-6 text-primary animate-sparkle" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 animate-float-slow-reverse z-10">
              <div className="bg-primary/20 backdrop-blur-md rounded-full p-2 shadow-lg shadow-primary/30">
                <Terminal className="w-6 h-6 text-primary animate-sparkle" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-1 shadow-lg hover:shadow-primary/30 transition-all duration-500 hover:scale-[1.02] transform">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden">
                <div className="p-8">
                  <div className="rounded-lg overflow-hidden bg-white/5 p-4 mb-4 hover:bg-white/10 transition-all duration-300">
                    <div className="text-sm text-white/70">
                      <p className="mb-2">Here's a helpful MCP for code reviews:</p>
                      <p className="bg-primary/10 p-2 rounded animate-pulse">This MCP analyzes code changes and provides suggestions based on best practices for your framework.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2 hover:bg-white/10 transition-colors group">
                      <ExternalLink className="w-3 h-3 group-hover:text-primary transition-colors" />
                      <span className="group-hover:text-primary transition-colors">Fork MCP</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find your Flow section */}
      <section className="py-24 bg-black" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary bg-200% animate-gradient-slow">Find your Flow.</h2>
            <p className="text-white/70">
              Explore pre-configured MCPs to find your workflow.
            </p>
            <AnimatedButton 
              animationType="glow" 
              label="Browse Templates"
              className="mt-8"
            />
          </div>

          {/* Template examples with animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 aspect-[3/4] group">
              <div className="h-full flex items-center justify-center text-2xl font-bold transition-all duration-500 group-hover:text-primary">C</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 aspect-[3/4]">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-500/30 to-orange-500/30 transition-all duration-500 hover:from-red-500/40 hover:to-orange-500/40"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 aspect-[3/4]">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30 transition-all duration-500 hover:from-blue-500/40 hover:to-purple-500/40"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 aspect-[3/4]">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-teal-500/30 transition-all duration-500 hover:from-blue-500/40 hover:to-teal-500/40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* AI is complicated section */}
      <section className="py-24 bg-black" id="pricing">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-accent bg-200% animate-gradient-slow">AI is complicated. We made it simple.</h2>
            <p className="text-white/70">
              We handle the hard parts, so you can focus on what matters.
            </p>
          </div>

          {/* Integration logos with hover effects */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-5xl mx-auto">
            {["Notion", "Hugging Face", "Discord", "GitHub", "VSCode", "Stable Diffusion", "Slack", "Figma"].map((tool, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center group">
                <span className="text-sm font-medium text-white/70 group-hover:text-primary transition-colors">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-accent bg-200% animate-gradient-slow">A new medium needs a new canvas.</h2>
          <Link href="/dashboard">
            <AnimatedButton 
              animationType="sparkle" 
              icon={true}
              label="Get Started"
              size="lg"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-gradient-slow">MCP.Build</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm mb-8">
            <Link href="#" className="hover:text-white transition-colors relative group">
              Terms
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors relative group">
              Privacy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors relative group">
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="text-center text-white/50 text-sm">
            © 2023 MCP Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
