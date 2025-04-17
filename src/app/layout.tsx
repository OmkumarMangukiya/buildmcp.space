import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "BuildMCP - Model Context Protocol Builder",
  description: "Create, manage, and share MCPs across different AI platforms with a seamless experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.className} antialiased bg-[var(--mcp-background-primary)]`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
