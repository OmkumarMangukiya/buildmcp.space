'use client';

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animationType?: 'sparkle' | 'glow' | 'pulse';
  icon?: boolean;
  label: string;
}

export function AnimatedButton({ 
  animationType = 'glow',
  icon = false,
  label,
  className,
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative group">
      {/* Animation effects */}
      {animationType === 'glow' && (
        <div className={cn(
          "absolute inset-0 rounded-md blur-md transition-all duration-500 opacity-0 group-hover:opacity-70",
          "bg-primary/40", 
        )}></div>
      )}
      
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          animationType === 'sparkle' && "bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20",
          animationType === 'glow' && "hover:scale-105 hover:shadow-lg hover:shadow-primary/20",
          animationType === 'pulse' && "hover:animate-pulse",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <span className={cn(
          "relative z-10 flex items-center gap-2",
          isHovered && "transform transition-transform duration-300",
          isHovered && icon && "translate-x-[-4px]"
        )}>
          {animationType === 'sparkle' && (
            <Sparkles className={cn(
              "w-4 h-4 absolute opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100 animate-ping"
            )} />
          )}
          
          {label}
          
          {icon && (
            <ArrowRight className={cn(
              "w-4 h-4 transition-all duration-300",
              isHovered && "transform translate-x-1"
            )} />
          )}
        </span>
        
        {/* Background animation for sparkle type */}
        {animationType === 'sparkle' && (
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className={cn(
              "absolute top-0 left-0 right-0 bottom-0",
              "bg-gradient-to-r from-transparent via-white/10 to-transparent",
              "-translate-x-full",
              isHovered && "animate-shimmer"
            )}></span>
          </span>
        )}
      </Button>
    </div>
  );
} 