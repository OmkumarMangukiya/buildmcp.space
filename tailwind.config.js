/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        mcp: {
          bg: {
            primary: "var(--mcp-background-primary)",
            secondary: "var(--mcp-background-secondary)",
          },
          primary: "var(--mcp-primary)",
          "primary-hover": "var(--mcp-primary-hover)",
          text: "var(--mcp-text)",
          "text-muted": "var(--mcp-text-muted)",
          "text-faded": "var(--mcp-text-faded)",
          border: "var(--mcp-border)",
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideInUp 0.5s ease-in-out",
        "shimmer": "shimmer 2s linear infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-slow-reverse": "floatReverse 8s ease-in-out infinite",
        "gradient-slow": "gradientBackground 8s ease infinite",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "rainbow": "rainbow 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.05)" }
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(20px) scale(1.05)" }
        },
        gradientBackground: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        sparkle: {
          "0%, 100%": { opacity: 0.8, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.2)" }
        },
        rainbow: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" }
        }
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
}; 