import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Terminal, Code, Users, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Plus, Settings, Globe, Share2, Server, Download, Laptop, Cloud, GitFork } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeroImage } from "@/components/ui/hero-image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">MCP.Build</Link>
            <div className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm text-white/70 hover:text-white">Features</Link>
              <Link href="#platforms" className="text-sm text-white/70 hover:text-white">Platforms</Link>
              <Link href="#about" className="text-sm text-white/70 hover:text-white">About</Link>
              <Link href="#pricing" className="text-sm text-white/70 hover:text-white">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#login" className="text-sm text-white/70 hover:text-white">Log in</Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3 flex justify-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">AI-POWERED MCP BUILDER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Intelligent Canvas.</h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Every Model Context Protocol. Every AI platform. One connection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button className="bg-primary hover:bg-primary/90" size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          {/* Platform Logos */}
          <div className="mb-8">
            <p className="text-white/50 mb-4 text-sm">TRUSTED BY</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <span className="text-sm">PlanetScale</span>
              <span className="text-sm">Prisma</span>
              <span className="text-sm">Alibaba</span>
              <span className="text-sm">Vercel</span>
            </div>
          </div>
          
          {/* Hero Image - Now using client component */}
          <HeroImage />
        </div>
      </section>

      {/* Create at the speed of thought section */}
      <section className="py-24 bg-black" id="features">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create at the speed of thought.</h2>
            <p className="text-white/70">
              Design, develop, and implement your Model Context Protocols in real-time, with AI assistance.
            </p>
          </div>

          {/* Feature blocks */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all">
              <BrainCircuit className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-white/70 text-sm">Generate platform-specific MCPs with a natural language interface.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all">
              <Terminal className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Deploy Anywhere</h3>
              <p className="text-white/70 text-sm">One-click deployment to your local environment or cloud infrastructure.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Marketplace</h3>
              <p className="text-white/70 text-sm">Browse, fork, and collaborate on MCPs with developers worldwide.</p>
            </div>
          </div>

          {/* Feature demo */}
          <div className="max-w-4xl mx-auto mt-20 relative">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-1">
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="bg-white/5 p-5">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="flex-1 text-white/70">
                      <div className="font-mono text-xs space-y-2">
                        <p>1. Create a code completion MCP</p>
                        <p>2. Enable GitHub integration</p>
                        <p>3. Support TypeScript and Python</p>
                        <p>4. Add file context awareness</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                  <Button variant="ghost" className="text-xs text-white/50">See example</Button>
                  <Button className="bg-primary hover:bg-primary/90 gap-2 text-xs">
                    Generate MCP
                    <ArrowRight className="w-3 h-3" />
                  </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bring the whole team.</h2>
            <p className="text-white/70">
              Collaborate in real-time with your entire development team.
            </p>
          </div>

          {/* Platforms grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all flex items-center justify-center aspect-square">
              <span className="text-primary font-semibold">Cursor</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all flex items-center justify-center aspect-square">
              <span className="text-primary font-semibold">VSCode</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all flex items-center justify-center aspect-square">
              <span className="text-primary font-semibold">Claude</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover:bg-white/10 transition-all flex items-center justify-center aspect-square">
              <span className="text-primary font-semibold">ChatGPT</span>
            </div>
          </div>

          {/* Example card */}
          <div className="max-w-lg mx-auto relative">
            <div className="absolute -top-12 -left-12">
              <div className="bg-primary/20 backdrop-blur-md rounded-full p-2">
                <Code className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8">
              <div className="bg-primary/20 backdrop-blur-md rounded-full p-2">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-1">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden">
                <div className="p-8">
                  <div className="rounded-lg overflow-hidden bg-white/5 p-4 mb-4">
                    <div className="text-sm text-white/70">
                      <p className="mb-2">Here's a helpful MCP for code reviews:</p>
                      <p className="bg-primary/10 p-2 rounded">This MCP analyzes code changes and provides suggestions based on best practices for your framework.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-3 h-3" />
                      Fork MCP
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find your Flow.</h2>
            <p className="text-white/70">
              Explore pre-configured MCPs to find your workflow.
            </p>
            <Button className="mt-8 bg-primary hover:bg-primary/90">Browse Templates</Button>
          </div>

          {/* Template examples */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all aspect-[3/4]">
              <div className="h-full flex items-center justify-center text-2xl font-bold">C</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all aspect-[3/4]">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-500/30 to-orange-500/30"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all aspect-[3/4]">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/10 transition-all aspect-[3/4]">
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-teal-500/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* AI is complicated section */}
      <section className="py-24 bg-black" id="pricing">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI is complicated. We made it simple.</h2>
            <p className="text-white/70">
              We handle the hard parts, so you can focus on what matters.
            </p>
          </div>

          {/* Integration logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-5xl mx-auto">
            {["Notion", "Hugging Face", "Discord", "GitHub", "VSCode", "Stable Diffusion", "Slack", "Figma"].map((tool, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all flex items-center justify-center">
                <span className="text-sm font-medium text-white/70">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">A new medium needs a new canvas.</h2>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90" size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <Link href="/" className="font-bold text-xl">MCP.Build</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm mb-8">
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Contact</Link>
            <Link href="#" className="hover:text-white">Blog</Link>
            <Link href="#" className="hover:text-white">About</Link>
          </div>
          <div className="text-center text-white/50 text-sm">
            © 2023 MCP Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
