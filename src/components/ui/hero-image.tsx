'use client';

import Image from "next/image";
import { Sparkles } from "lucide-react";

export function HeroImage() {
  return (
    <div className="relative mt-16 mx-auto max-w-5xl">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-1">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden relative">
          <div className="aspect-[16/9] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/dashboard-preview.png" 
                alt="MCP Builder Dashboard" 
                width={900} 
                height={506}
                className="object-cover"
                onError={(e) => {
                  // Fallback if image not found
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 