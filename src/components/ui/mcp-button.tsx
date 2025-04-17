"use client";

import React from 'react';
import { Button, ButtonProps } from './button';

type McpButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

interface McpButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: McpButtonVariant;
}

export function McpButton({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}: McpButtonProps) {
  const variantStyles = {
    primary: 'bg-[var(--mcp-primary)] hover:bg-[var(--mcp-primary-hover)] text-white font-medium',
    secondary: 'bg-[var(--mcp-background-secondary)] hover:bg-opacity-80 text-[var(--mcp-text)] border border-[var(--mcp-border)]',
    outline: 'bg-transparent border border-[var(--mcp-border)] text-[var(--mcp-text)] hover:bg-white/10',
    ghost: 'bg-transparent hover:bg-white/10 text-[var(--mcp-text-muted)] hover:text-[var(--mcp-text)]',
    link: 'bg-transparent underline-offset-4 hover:underline text-[var(--mcp-primary)] hover:text-[var(--mcp-primary-hover)]'
  };

  const variantStyle = variantStyles[variant];
  
  return (
    <Button
      className={`${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
} 