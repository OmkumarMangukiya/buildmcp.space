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
      <div className="mb-10 bg-[#1A1A1A] rounded-lg p-8 border-l-4 border-[#E1623D] border-t border-r border-b border-white/5 shadow-lg">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-[#E1623D]" />
            <span className="font-semibold text-lg text-white">Basic Monthly</span>
          </div>
          <button className="text-sm text-gray-500 font-medium">Change Plan</button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Active until May 6, 2025</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-400">MCP Generations Remaining</span>
            <span className="text-[#E1623D] font-medium">119 / 120</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
            <div className="w-[99%] h-full bg-[#E1623D] rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This count decreases each time you generate a new MCP.</p>
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