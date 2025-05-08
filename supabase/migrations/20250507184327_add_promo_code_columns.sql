-- Add columns to payments table for promo code support
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS original_amount NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;

-- Update any existing payments to have original_amount match amount
UPDATE public.payments
SET original_amount = amount
WHERE original_amount IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS payments_promo_code_idx ON public.payments(promo_code);

-- Add a function to validate promo codes
CREATE OR REPLACE FUNCTION validate_promo_code(promo_code TEXT, plan_interval TEXT)
RETURNS TABLE(valid BOOLEAN, discount_percent INTEGER, code_value TEXT) AS $$
BEGIN
  -- Currently only supporting the ERBD21 code for monthly plans
  IF promo_code = 'ERBD21' AND plan_interval = 'monthly' THEN
    RETURN QUERY SELECT true::BOOLEAN, 21::INTEGER, 'ERBD21'::TEXT;
  ELSE
    RETURN QUERY SELECT false::BOOLEAN, 0::INTEGER, NULL::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql; 