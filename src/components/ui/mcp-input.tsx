"use client";

import React from 'react';
import { Input, InputProps } from './input';
import { Textarea, TextareaProps } from './textarea';
import { Label, LabelProps } from './label';

export function McpInput({ 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <Input
      className={`bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] 
                  focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)] 
                  placeholder:text-[var(--mcp-text-faded)] ${className}`}
      {...props}
    />
  );
}

export function McpTextarea({ 
  className = '', 
  ...props 
}: TextareaProps) {
  return (
    <Textarea
      className={`bg-[var(--mcp-background-primary)] border-[var(--mcp-border)] text-[var(--mcp-text)] 
                  focus:border-[var(--mcp-primary)] focus:ring-[var(--mcp-primary)] 
                  placeholder:text-[var(--mcp-text-faded)] ${className}`}
      {...props}
    />
  );
}

export function McpLabel({ 
  className = '', 
  ...props 
}: LabelProps) {
  return (
    <Label
      className={`text-[var(--mcp-text)] ${className}`}
      {...props}
    />
  );
} 