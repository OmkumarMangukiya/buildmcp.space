import { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
// In production, this should be replaced with Redis or another distributed store
const store = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime <= now) {
      store.delete(key);
    }
  }
}, 60000); // Clean up every minute

export type RateLimitOptions = {
  windowMs?: number;
  max?: number;
  keyGenerator?: (req: NextRequest) => string;
};

/**
 * Creates a rate limiter that can be used to protect API endpoints
 */
export function rateLimit({ 
  windowMs = 60000, // 1 minute
  max = 5, // 5 requests per minute
  keyGenerator = (req: NextRequest) => req.ip || 'unknown'
}: RateLimitOptions = {}) {
  return {
    /**
     * Check if the request should be rate limited
     * @param req The request to check
     * @returns Object indicating success and remaining requests
     */
    check: (req: NextRequest) => {
      const key = keyGenerator(req);
      const now = Date.now();
      const resetTime = now + windowMs;
      
      // Get or create entry
      const entry = store.get(key) || { count: 0, resetTime };
      
      // Reset if expired
      if (entry.resetTime <= now) {
        entry.count = 0;
        entry.resetTime = resetTime;
      }
      
      // Check if over limit
      const remaining = Math.max(0, max - entry.count);
      const success = entry.count < max;
      
      // Increment count if within the window
      if (success) {
        entry.count++;
        store.set(key, entry);
      }
      
      return { success, remaining };
    }
  };
} 