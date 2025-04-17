import React from 'react';

interface McpPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function McpPageLayout({ children, className = '' }: McpPageLayoutProps) {
  return (
    <div className={`min-h-screen bg-[var(--mcp-background-primary)] text-[var(--mcp-text)] ${className}`}>
      {children}
    </div>
  );
} 