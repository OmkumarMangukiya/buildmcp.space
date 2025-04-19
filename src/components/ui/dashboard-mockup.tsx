"use client";

import { Code, Terminal, Server, Database, Settings, Play, Star, ArrowRight } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="w-full bg-[#0F0F0F] text-gray-400 p-10 rounded-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoLTZ2LTZoNnptLTYgMGgtNnY2aDZ2LTZ6bTYtNnY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6 relative">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-white">Welcome back, Chief!</h1>
          <p className="text-gray-500 text-sm">Your MCP dashboard overview</p>
        </div>
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 bg-[#E1623D] text-white px-5 py-2.5 rounded-md font-medium">
            <span>+</span> Create MCP
          </button>
          <button className="text-gray-500 font-medium">Sign out</button>
          <div className="w-9 h-9 rounded-full bg-[#252525] border border-white/10"></div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-10 bg-[#0F0F0F] rounded-lg p-6 border border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#E1623D]" />
            <span className="font-medium text-lg text-white">Premium Yearly</span>
          </div>
          <button className="text-sm text-gray-400 bg-transparent hover:text-white">Change Plan</button>
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-gray-400 text-sm">Active until April 7, 2026</p>
          <p className="text-gray-400 text-sm">Unlimited MCP generations available</p>
        </div>
      </div>

      {/* MCPs Grid */}
      <div className="relative">
        <h2 className="text-xl font-semibold mb-6 text-white">My MCPs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* MCP Card 1 */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-2 border-l-[#E1623D] border-t border-r border-b border-white/5">
            <h3 className="font-medium text-lg mb-3 truncate text-white">Claude Web Search Assistant</h3>
            <p className="text-sm text-gray-500 mb-5 line-clamp-3 leading-relaxed">Integrates Claude with Brave Search API for real-time web search capabilities. Features privacy-focused search, content summarization, and fact verification...</p>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Last updated</span>
              <span>2 days ago</span>
            </div>
          </div>

          {/* MCP Card 2 */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-2 border-l-[#E1623D] border-t border-r border-b border-white/5">
            <h3 className="font-medium text-lg mb-3 truncate text-white">Git Repository Manager</h3>
            <p className="text-sm text-gray-500 mb-5 line-clamp-3 leading-relaxed">Advanced Git operations assistant with commit message generation, PR summaries, and merge conflict resolution. Supports GitHub, GitLab, and Bitbucket...</p>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Last updated</span>
              <span>4 days ago</span>
            </div>
          </div>

          {/* MCP Card 3 */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-2 border-l-[#E1623D] border-t border-r border-b border-white/5">
            <h3 className="font-medium text-lg mb-3 truncate text-white">Obsidian Knowledge Assistant</h3>
            <p className="text-sm text-gray-500 mb-5 line-clamp-3 leading-relaxed">AI assistant that helps organize and analyze your Obsidian vault. Provides smart note suggestions and automated knowledge graph management...</p>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Last updated</span>
              <span>1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style jsx global>{`
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes progress-bar {
    0% { width: 0; }
    100% { width: 99%; }
  }
  .animate-progress-bar {
    animation: progress-bar 1.2s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  .animate-pulse-slow {
    animation: pulse-slow 2.5s infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 6s linear infinite;
  }
`}</style> 