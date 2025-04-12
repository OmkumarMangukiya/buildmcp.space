"use client";

import { motion } from "framer-motion";
import { Code, Terminal, Server, Database, Settings, Play, Star, ArrowRight } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="w-full bg-black text-white p-8 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, Chief!</h1>
          <p className="text-gray-400 text-sm">Your MCP dashboard overview</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-white/90">
            <span>+</span> Create MCP
          </button>
          <button className="text-white/70 hover:text-white">Sign out</button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-8 bg-[#111111] rounded-lg p-6 border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-lg">Basic Monthly</span>
          </div>
          <button className="text-sm text-white/70 hover:text-white">Change Plan</button>
        </div>
        <p className="text-gray-400 text-sm mb-2">Active until May 6, 2025</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <span>MCP Generations Remaining</span>
            <span className="text-blue-400">119 / 120</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="w-[99%] h-full bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-400">This count decreases each time you generate a new MCP.</p>
        </div>
      </div>

      {/* MCPs Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My MCPs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* MCP Card 1 */}
          <div className="bg-[#111111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <h3 className="font-medium mb-2 truncate group-hover:text-clip">Claude Web Search Assistant</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-3">Integrates Claude with Brave Search API for real-time web search capabilities. Features privacy-focused search, content summarization, and fact verification...</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Last updated</span>
              <span>2 days ago</span>
            </div>
          </div>

          {/* MCP Card 2 */}
          <div className="bg-[#111111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <h3 className="font-medium mb-2 truncate group-hover:text-clip">Git Repository Manager</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-3">Advanced Git operations assistant with commit message generation, PR summaries, and merge conflict resolution. Supports GitHub, GitLab, and Bitbucket...</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Last updated</span>
              <span>4 days ago</span>
            </div>
          </div>

          {/* MCP Card 3 */}
          <div className="bg-[#111111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <h3 className="font-medium mb-2 truncate group-hover:text-clip">Obsidian Knowledge Assistant</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-3">AI assistant that helps organize and analyze your Obsidian vault. Provides smart note suggestions and automated knowledge graph management...</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Last updated</span>
              <span>1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 