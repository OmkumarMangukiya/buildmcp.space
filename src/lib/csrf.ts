import { createHmac, randomBytes } from 'crypto';

const SECRET_KEY = process.env.CSRF_SECRET || randomBytes(32).toString('hex');

export const csrf = {
  /**
   * Generate a CSRF token
   * @param sessionId A unique identifier for the session
   * @returns A secure CSRF token
   */
  generate: (sessionId: string): string => {
    const timestamp = Date.now().toString();
    const payload = `${sessionId}:${timestamp}`;
    const hmac = createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex');
    
    return `${payload}:${hmac}`;
  },

  /**
   * Validate a CSRF token
   * @param token The token to validate
   * @param sessionId The session identifier
   * @param maxAge Maximum age of the token in milliseconds (default 1 hour)
   * @returns Whether the token is valid
   */
  validate: (token?: string, sessionId?: string, maxAge = 3600000): boolean => {
    if (!token || !sessionId) return false;
    
    const parts = token.split(':');
    if (parts.length !== 3) return false;
    
    const [tokenSessionId, timestamp, hmac] = parts;
    
    // Validate the session ID
    if (tokenSessionId !== sessionId) return false;
    
    // Validate token age
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > maxAge) return false;
    
    // Validate HMAC
    const expectedHmac = createHmac('sha256', SECRET_KEY)
      .update(`${tokenSessionId}:${timestamp}`)
      .digest('hex');
    
    return hmac === expectedHmac;
  }
}; 