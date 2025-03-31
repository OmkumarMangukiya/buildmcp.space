'use client';

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroImage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroElement = document.getElementById('hero-image');
      if (heroElement && scrollPosition < window.innerHeight) {
        const opacity = 1 - (scrollPosition / window.innerHeight) * 0.8;
        const scale = 1 - (scrollPosition / window.innerHeight) * 0.1;
        heroElement.style.opacity = opacity.toString();
        heroElement.style.transform = `scale(${scale})`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      id="hero-image"
      className={`relative mt-16 mx-auto max-w-5xl transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-1 shadow-lg hover:shadow-primary/20 transition-all duration-500">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden relative">
          <div className="aspect-[16/9] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 mix-blend-overlay animate-gradient-slow"></div>
              <Image 
                src="/dashboard-preview.png" 
                alt="MCP Builder Dashboard" 
                width={900} 
                height={506}
                className="object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback if image not found
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/20 backdrop-blur-md rounded-full shadow-lg shadow-primary/30">
                  <Sparkles className="w-8 h-8 text-primary animate-sparkle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float-slow-reverse"></div>
    </div>
  );
} 