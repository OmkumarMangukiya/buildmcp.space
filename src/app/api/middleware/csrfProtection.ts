import { NextRequest, NextResponse } from 'next/server';
import { csrf } from '@/lib/csrf';
import { getUserIdFromRequest } from '@/lib/authUtils';

/**
 * Middleware to verify CSRF token for mutating API requests
 * @param req The Next.js request
 * @returns NextResponse with error if CSRF validation fails, null otherwise
 */
export async function verifyCsrfToken(req: NextRequest): Promise<NextResponse | null> {
  // Only verify for mutating methods
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (!mutatingMethods.includes(req.method)) {
    return null;
  }

  try {
    // Get user ID for session validation
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get CSRF token from request headers
    const csrfToken = req.headers.get('X-CSRF-Token');
    if (!csrfToken) {
      return NextResponse.json({ error: 'CSRF token missing' }, { status: 403 });
    }

    // Validate the token against the session
    const isValid = csrf.validate(csrfToken, userId);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    // Token is valid
    return null;
  } catch (error) {
    console.error('CSRF validation error:', error);
    return NextResponse.json({ error: 'Security validation failed' }, { status: 500 });
  }
} 