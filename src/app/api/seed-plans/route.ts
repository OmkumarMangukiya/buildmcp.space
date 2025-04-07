import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

export async function GET(req: Request) {
  try {
    // Only allow in development or with a secret key
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    
    if (process.env.NODE_ENV !== 'development' && key !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if plans already exist
    const { data: existingPlans, error: checkError } = await supabaseAdmin!
      .from('plans')
      .select('*');
      
    if (checkError) {
      return NextResponse.json({ error: 'Error checking plans: ' + checkError.message }, { status: 500 });
    }
    
    if (existingPlans && existingPlans.length > 0) {
      return NextResponse.json({ 
        message: 'Plans already exist', 
        count: existingPlans.length,
        plans: existingPlans
      });
    }
    
    // Create the plans
    const plans = [
      {
        name: 'Basic Monthly',
        description: 'Up to 120 MCP generations per month',
        price: 11.99,
        currency: 'USD',
        interval: 'monthly',
        mcp_limit: 120
      },
      {
        name: 'Premium Monthly',
        description: 'Unlimited MCP generations',
        price: 15.99,
        currency: 'USD',
        interval: 'monthly',
        mcp_limit: null
      },
      {
        name: 'Basic Yearly',
        description: 'Up to 120 MCP generations per month, billed yearly',
        price: 119.99,
        currency: 'USD',
        interval: 'yearly',
        mcp_limit: 120
      },
      {
        name: 'Premium Yearly',
        description: 'Unlimited MCP generations, billed yearly',
        price: 159.90,
        currency: 'USD',
        interval: 'yearly',
        mcp_limit: null
      }
    ];
    
    const { data, error } = await supabaseAdmin!
      .from('plans')
      .insert(plans)
      .select();
      
    if (error) {
      return NextResponse.json({ error: 'Error creating plans: ' + error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Successfully created plans', 
      plans: data 
    });
    
  } catch (error: any) {
    console.error('Error in seed plans route:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
} 