"use client";

import { motion } from "framer-motion";
import { Code, Terminal, Server, Database, Settings, Play, Star, ArrowRight } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="w-full bg-black text-white p-10 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Welcome back, Chief!</h1>
          <p className="text-gray-400 text-sm">Your MCP dashboard overview</p>
        </div>
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md hover:bg-white/90 font-medium">
            <span>+</span> Create MCP
          </button>
          <button className="text-white/70 hover:text-white font-medium">Sign out</button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-10 bg-[#111111] rounded-lg p-8 border border-white/10">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-lg">Basic Monthly</span>
          </div>
          <button className="text-sm text-white/70 hover:text-white font-medium">Change Plan</button>
        </div>
        <p className="text-gray-400 text-sm mb-4">Active until May 6, 2025</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm mb-2">
            <span>MCP Generations Remaining</span>
            <span className="text-blue-400 font-medium">119 / 120</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-[99%] h-full bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">This count decreases each time you generate a new MCP.</p>
        </div>
      </div>

      {/* MCPs Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-6">My MCPs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* MCP Card 1 */}
          <div className="bg-[#111111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <h3 className="font-medium text-lg mb-3 truncate group-hover:text-clip">Claude Web Search Assistant</h3>
            <p className="text-sm text-gray-400 mb-5 line-clamp-3 leading-relaxed">Integrates Claude with Brave Search API for real-time web search capabilities. Features privacy-focused search, content summarization, and fact verification...</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Last updated</span>
              <span>2 days ago</span>
            </div>
          </div>

          {/* MCP Card 2 */}
          <div className="bg-[#111111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <h3 className="font-medium text-lg mb-3 truncate group-hover:text-clip">Git Repository Manager</h3>
            <p className="text-sm text-gray-400 mb-5 line-clamp-3 leading-relaxed">Advanced Git operations assistant with commit message generation, PR summaries, and merge conflict resolution. Supports GitHub, GitLab, and Bitbucket...</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Last updated</span>
              <span>4 days ago</span>
            </div>
          </div>

          {/* MCP Card 3 */}
          <div className="bg-[#111111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <h3 className="font-medium text-lg mb-3 truncate group-hover:text-clip">Obsidian Knowledge Assistant</h3>
            <p className="text-sm text-gray-400 mb-5 line-clamp-3 leading-relaxed">AI assistant that helps organize and analyze your Obsidian vault. Provides smart note suggestions and automated knowledge graph management...</p>
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