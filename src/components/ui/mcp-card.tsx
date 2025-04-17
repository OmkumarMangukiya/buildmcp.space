"use client";

import React from 'react';
import { Card, CardProps, CardHeader, CardHeaderProps, CardTitle, CardTitleProps, CardDescription, CardDescriptionProps, CardContent, CardContentProps, CardFooter, CardFooterProps } from './card';

export function McpCard({ 
  className = '', 
  children, 
  ...props 
}: CardProps) {
  return (
    <Card
      className={`bg-[var(--mcp-background-secondary)] border-[var(--mcp-border)] text-[var(--mcp-text)] ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}

export function McpCardHeader({ 
  className = '', 
  children, 
  ...props 
}: CardHeaderProps) {
  return (
    <CardHeader
      className={`${className}`}
      {...props}
    >
      {children}
    </CardHeader>
  );
}

export function McpCardTitle({ 
  className = '', 
  children, 
  ...props 
}: CardTitleProps) {
  return (
    <CardTitle
      className={`text-white ${className}`}
      {...props}
    >
      {children}
    </CardTitle>
  );
}

export function McpCardDescription({ 
  className = '', 
  children, 
  ...props 
}: CardDescriptionProps) {
  return (
    <CardDescription
      className={`text-[var(--mcp-text-muted)] ${className}`}
      {...props}
    >
      {children}
    </CardDescription>
  );
}

export function McpCardContent({ 
  className = '', 
  children, 
  ...props 
}: CardContentProps) {
  return (
    <CardContent
      className={`${className}`}
      {...props}
    >
      {children}
    </CardContent>
  );
}

export function McpCardFooter({ 
  className = '', 
  children, 
  ...props 
}: CardFooterProps) {
  return (
    <CardFooter
      className={`${className}`}
      {...props}
    >
      {children}
    </CardFooter>
  );
} 