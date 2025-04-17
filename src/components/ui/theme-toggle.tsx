"use client";

import { useTheme } from "@/context/ThemeContext";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="rounded-full w-9 h-9 bg-transparent hover:bg-white/10"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[var(--mcp-text-muted)]" />
      ) : (
        <Moon className="h-4 w-4 text-[var(--mcp-text-muted)]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 