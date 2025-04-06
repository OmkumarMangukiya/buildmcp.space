import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();
    
    if (!planId || !userId) {
      return NextResponse.json({ error: 'Plan ID and User ID are required' }, { status: 400 });
    }
    
    // Fetch plan details
    const { data: plan, error: planError } = await supabaseAdmin!
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
    }
    
    // Create PayPal order with the plan price
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: plan.currency,
              value: plan.price.toString()
            },
            description: plan.name
          }
        ],
        application_context: {
          brand_name: "BuildMCP",
          user_action: "PAY_NOW"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal API error:', errorData);
      return NextResponse.json({ error: 'Failed to create order', details: errorData }, { status: 500 });
    }

    const orderData = await response.json();
    
    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 