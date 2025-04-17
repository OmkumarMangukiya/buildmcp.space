import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

export async function POST(req: Request) {
  try {
    const { orderId, planId, userId } = await req.json();
    
    if (!orderId || !planId || !userId) {
      return NextResponse.json({ 
        error: 'Order ID, Plan ID, and User ID are required' 
      }, { status: 400 });
    }
    
    // Verify with PayPal
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal verification error:', errorData);
      return NextResponse.json({ 
        error: 'Payment verification failed. Please try again or contact support.' 
      }, { status: 400 });
    }

    const paymentData = await response.json();
    
    // Get plan details
    const { data: plan, error: planError } = await supabaseAdmin!
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
    }
    
    // Calculate expiration date
    const now = new Date();
    let expiresAt = new Date(now);
    if (plan.interval === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan.interval === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      return NextResponse.json({ error: 'Invalid plan interval' }, { status: 400 });
    }
    
    // Record payment
    const { data: payment, error: paymentError } = await supabaseAdmin!
      .from('payments')
      .insert({
        payment_id: paymentData.id,
        user_id: userId,
        plan_id: planId,
        amount: plan.price,
        currency: plan.currency,
        status: 'succeeded',
        payment_method: 'paypal'
      })
      .select()
      .single();
    
    if (paymentError) {
      console.error('Payment record error:', paymentError);
      return NextResponse.json({ error: 'Failed to process payment record' }, { status: 500 });
    }
    
    // Assign plan to user
    const { error: planAssignError } = await supabaseAdmin!
      .from('user_plans')
      .insert({
        user_id: userId,
        plan_id: planId,
        starts_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_id: payment.id
      });
    
    if (planAssignError) {
      console.error('Plan assignment error:', planAssignError);
      return NextResponse.json({ error: 'Failed to assign plan' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      plan: plan.name,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed. Please try again later.' }, { status: 500 });
  }
} 