import React from "react";
import { cn } from "@/lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {}

export function Code({ className, ...props }: CodeProps) {
  return (
    <pre
      className={cn(
        "rounded-md p-4 font-mono text-sm overflow-auto relative",
        "bg-muted text-foreground",
        className
      )}
      {...props}
    />
  );
} 