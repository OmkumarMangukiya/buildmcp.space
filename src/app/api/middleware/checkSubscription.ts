import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

/**
 * Middleware to check if a user has an active subscription and MCP generations available
 * @param req The incoming request
 * @param userId The user ID to check
 * @returns NextResponse success or error
 */
export async function checkSubscription(req: NextRequest, userId: string) {
  try {
    // Check if user has an active subscription
    const { data: hasActivePlan } = await supabaseAdmin!.rpc('user_has_active_plan', {
      user_uuid: userId
    });

    if (!hasActivePlan) {
      return NextResponse.json({
        error: 'No active subscription',
        message: 'You need an active subscription to generate MCPs',
        redirect: '/pricing'
      }, { status: 403 });
    }

    // Check remaining generations
    const { data: remainingGenerations } = await supabaseAdmin!.rpc('get_user_mcp_remaining', {
      user_uuid: userId
    });

    // If remainingGenerations is 0, they've hit their limit
    if (remainingGenerations === 0) {
      return NextResponse.json({
        error: 'Generation limit reached',
        message: 'You have reached your MCP generation limit for this billing period',
        redirect: '/pricing'
      }, { status: 403 });
    }

    // All checks passed
    return NextResponse.json({ 
      success: true,
      remaining: remainingGenerations
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ 
      error: 'Subscription check failed',
      message: 'An error occurred while checking your subscription status'
    }, { status: 500 });
  }
}

/**
 * Record MCP usage for a user
 * @param userId The user ID
 * @param mcpId Optional MCP ID to associate with this usage
 */
export async function recordMcpUsage(userId: string, mcpId?: string) {
  try {
    const { error } = await supabaseAdmin!.from('mcp_usage').insert({
      user_id: userId,
      mcp_id: mcpId
    });

    if (error) {
      console.error('Error recording MCP usage:', error);
    }
  } catch (error) {
    console.error('Failed to record MCP usage:', error);
  }
} 