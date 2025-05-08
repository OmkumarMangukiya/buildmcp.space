import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supaClient';

// Add this helper function before the POST handler
const findPlanById = async (planId: string) => {
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
        
      if (!namedPlanError && namedPlan) {
        return namedPlan;
      }
    }
  }
  
  return plan;
};

// Helper to validate promo codes
const validatePromoCode = (code: string, planInterval: string) => {
  // Currently only supporting the ERBD21 code for monthly plans
  if (code === 'ERBD21' && planInterval === 'monthly') {
    return {
      valid: true,
      discountPercent: 21,
      code: 'ERBD21'
    };
  }
  return { valid: false, discountPercent: 0 };
};

export async function POST(req: Request) {
  try {
    const { 
      orderId, 
      planId, 
      userId, 
      promoCode, 
      discountPercent,
      originalPrice,
      finalPrice 
    } = await req.json();
    
    if (!orderId || !planId || !userId) {
      return NextResponse.json({ 
        error: 'Order ID, Plan ID, and User ID are required' 
      }, { status: 400 });
    }
    
    // Check if this order ID has already been processed
    const { data: existingPayment, error: existingError } = await supabaseAdmin!
      .from('payments')
      .select('*')
      .eq('payment_id', orderId)
      .maybeSingle();
    
    if (existingError) {
      console.error('Error checking existing payment:', existingError);
    }
    
    // If payment exists, check if user already has an active plan
    if (existingPayment) {
      console.log('Payment already processed:', orderId);
      
      // Check if user has an active plan from this payment
      const { data: existingPlan, error: planCheckError } = await supabaseAdmin!
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('payment_id', existingPayment.id)
        .maybeSingle();
      
      if (planCheckError) {
        console.error('Error checking existing plan:', planCheckError);
      }
      
      // If plan exists, return success
      if (existingPlan) {
        return NextResponse.json({
          success: true,
          plan: existingPayment.plan_name || 'Subscription',
          expiresAt: existingPlan.expires_at,
          alreadyProcessed: true
        });
      }
      
      // If payment exists but plan doesn't, continue with plan assignment
      const plan = await findPlanById(planId);
      if (!plan) {
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
      
      // Assign plan to user
      const { error: planAssignError } = await supabaseAdmin!
        .from('user_plans')
        .insert({
          user_id: userId,
          plan_id: plan.id,
          starts_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_id: existingPayment.id
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
    }
    
    // Verify with PayPal
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    
    let paymentData;
    let response;
    
    try {
      response = await fetch(`https://api-m.live.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Check for ORDER_ALREADY_CAPTURED error
        if (responseData.details && 
            responseData.details[0] && 
            responseData.details[0].issue === 'ORDER_ALREADY_CAPTURED') {
          
          // Get the order details instead
          const orderResponse = await fetch(`https://api-m.live.paypal.com/v2/checkout/orders/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (!orderResponse.ok) {
            console.error('Error getting order details:', await orderResponse.json());
            return NextResponse.json({ 
              error: 'Failed to verify payment status. Please contact support.' 
            }, { status: 400 });
          }
          
          paymentData = await orderResponse.json();
        } else {
          console.error('PayPal verification error:', responseData);
          return NextResponse.json({ 
            error: 'Payment verification failed. Please try again or contact support.' 
          }, { status: 400 });
        }
      } else {
        paymentData = responseData;
      }
    } catch (paypalError) {
      console.error('PayPal API error:', paypalError);
      return NextResponse.json({ 
        error: 'Payment service unavailable. Please try again later.' 
      }, { status: 500 });
    }
    
    // Get plan details
    const plan = await findPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
    }
    
    // Validate promo code on server side
    let validPromoCode = null;
    let appliedDiscount = 0;
    let finalAmount = plan.price;
    
    if (promoCode) {
      const promoValidation = validatePromoCode(promoCode, plan.interval);
      
      if (promoValidation.valid) {
        validPromoCode = promoCode;
        appliedDiscount = promoValidation.discountPercent;
        
        // Calculate the discounted amount - ensure it matches what was shown to the user
        const calculatedFinalPrice = parseFloat((plan.price * (1 - appliedDiscount / 100)).toFixed(2));
        
        // Verify the final price matches what was passed from frontend
        if (Math.abs(calculatedFinalPrice - finalPrice) > 0.01) {
          console.warn(`Price mismatch: calculated=${calculatedFinalPrice}, received=${finalPrice}`);
        }
        
        finalAmount = finalPrice;
      }
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
        plan_id: plan.id,
        amount: finalAmount,
        original_amount: plan.price,
        currency: plan.currency,
        status: 'succeeded',
        payment_method: 'paypal',
        promo_code: validPromoCode,
        discount_percent: appliedDiscount
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
        plan_id: plan.id,
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
      expiresAt: expiresAt.toISOString(),
      discountApplied: appliedDiscount > 0,
      discountPercent: appliedDiscount
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed. Please try again later.' }, { status: 500 });
  }
} 