import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

/**
 * Extracts the user ID from an authenticated request
 * @param req The Next.js request
 * @returns The user ID or null if not authenticated
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const accessToken = req.cookies.get('sb-access-token')?.value;
    
    if (!accessToken) {
      return null;
    }
    
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return null;
    }
    
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !data.user) {
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error('Error getting user ID from request:', error);
    return null;
  }
}

/**
 * Verifies a user's ownership of a resource
 * @param table The database table to check
 * @param resourceId The ID of the resource
 * @param userId The ID of the user
 * @returns Whether the user owns the resource
 */
export async function verifyResourceOwnership(
  table: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return false;
    }
    
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('user_id')
      .eq('id', resourceId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.user_id === userId;
  } catch (error) {
    console.error(`Error verifying resource ownership for ${table}:${resourceId}:`, error);
    return false;
  }
}

/**
 * Middleware to verify resource ownership
 * @param req The Next.js request
 * @param resourceId The ID of the resource
 * @param table The database table to check
 * @returns A NextResponse if unauthorized, or null if authorized
 */
export async function verifyOwnershipMiddleware(
  req: NextRequest,
  resourceId: string,
  table: string
): Promise<NextResponse | null> {
  try {
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const isOwner = await verifyResourceOwnership(table, resourceId, userId);
    
    if (!isOwner) {
      return NextResponse.json({ error: 'Resource not found or access denied' }, { status: 403 });
    }
    
    return null; // Authorized
  } catch (error) {
    console.error('Error in ownership verification middleware:', error);
    return NextResponse.json({ error: 'Authorization check failed' }, { status: 500 });
  }
} 