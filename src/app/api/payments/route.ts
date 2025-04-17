import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();
    
    if (!planId || !userId) {
      return NextResponse.json({ error: 'Plan ID and User ID are required' }, { status: 400 });
    }
    
    // Try to fetch plan by ID first
    let { data: plan, error: planError } = await supabaseAdmin!
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    // If not found by ID, check if it's one of our predefined plan types
    if (planError || !plan) {
      // Map frontend IDs to plan names
      const planNameMap: Record<string, string> = {
        '1': 'Basic Monthly',
        '2': 'Premium Monthly',
        '3': 'Basic Yearly',
        '4': 'Premium Yearly',
        'basic-monthly': 'Basic Monthly',
        'premium-monthly': 'Premium Monthly',
        'basic-yearly': 'Basic Yearly',
        'premium-yearly': 'Premium Yearly'
      };
      
      // Try to find plan by name if we have a mapping
      const planName = planNameMap[planId];
      if (planName) {
        const { data: namedPlan, error: namedPlanError } = await supabaseAdmin!
          .from('plans')
          .select('*')
          .ilike('name', planName)
          .single();
          
        if (namedPlanError || !namedPlan) {
          return NextResponse.json({ 
            error: `Plan not found. ID: ${planId}, Mapped Name: ${planName}` 
          }, { status: 400 });
        }
        
        plan = namedPlan;
      } else {
        return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
      }
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
    
    return NextResponse.json({
      ...orderData,
      planUuid: plan.id
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 