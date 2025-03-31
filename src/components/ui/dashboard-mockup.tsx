"use client";

import { motion } from "framer-motion";
import { Code, Terminal, Server, Database, Settings, Play } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="bg-[#0A0A0A] rounded-lg overflow-hidden border border-white/10 shadow-xl">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-white/80 text-xs">MCP Builder Dashboard</div>
        <div className="w-4"></div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 h-[500px]">
        {/* Sidebar */}
        <div className="col-span-2 border-r border-white/10 bg-[#0A0A0A] p-4">
          <nav className="space-y-6">
            <div className="space-y-2">
              <div className="text-indigo-400 font-medium text-xs uppercase tracking-wider">Main</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-white bg-indigo-500/20 p-2 rounded-md text-sm">
                  <Server className="w-4 h-4" />
                  <span>MCPs</span>
                </li>
                <li className="flex items-center gap-2 text-white/60 hover:text-white p-2 rounded-md text-sm">
                  <Code className="w-4 h-4" />
                  <span>Templates</span>
                </li>
                <li className="flex items-center gap-2 text-white/60 hover:text-white p-2 rounded-md text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Console</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-indigo-400 font-medium text-xs uppercase tracking-wider">Settings</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-white/60 hover:text-white p-2 rounded-md text-sm">
                  <Settings className="w-4 h-4" />
                  <span>Preferences</span>
                </li>
                <li className="flex items-center gap-2 text-white/60 hover:text-white p-2 rounded-md text-sm">
                  <Database className="w-4 h-4" />
                  <span>Storage</span>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="col-span-10 bg-[#0A0A0A] overflow-hidden">
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">My MCPs</h1>
            <div className="grid grid-cols-2 gap-4">
              {/* MCP Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111] rounded-lg border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium">Code Completion MCP</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-indigo-500/20 rounded-full text-indigo-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span>Active</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-white/60 text-sm mb-4">AI-powered code completion with GitHub integration</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-full">TypeScript</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-full">Python</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-full">GitHub</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs text-white/40">Created 2 days ago</div>
                    <button className="text-xs flex items-center gap-1 text-indigo-400">
                      <Play className="w-3 h-3" />
                      <span>Deploy</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* MCP Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111] rounded-lg border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-rose-400" />
                    <span className="font-medium">Code Review Assistant</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-rose-500/20 rounded-full text-rose-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Active</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-white/60 text-sm mb-4">Automated code reviews based on best practices</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-full">JavaScript</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-full">React</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-full">ESLint</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs text-white/40">Created 5 days ago</div>
                    <button className="text-xs flex items-center gap-1 text-rose-400">
                      <Play className="w-3 h-3" />
                      <span>Deploy</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Code Example */}
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#111] rounded-lg border border-white/10 overflow-hidden"
              >
                <div className="border-b border-white/10 bg-[#0D0D0D] px-4 py-2 font-mono text-xs text-white/60">
                  console.log
                </div>
                <div className="p-4 font-mono text-xs">
                  <div className="text-green-400 mb-1">[INFO] Deployed Code Completion MCP to localhost:3001</div>
                  <div className="text-indigo-400 mb-1">[STATUS] Connection established with GitHub repository</div>
                  <div className="text-white/60 mb-1">[DATA] Loaded 3782 code snippets for training</div>
                  <div className="text-white/60 mb-1">[DATA] Initialized language models: TypeScript, Python</div>
                  <div className="text-yellow-400">[WARN] Running in development mode - switch to production for optimal performance</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 