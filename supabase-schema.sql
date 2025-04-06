-- Drop existing subscription-related tables if needed
DROP TABLE IF EXISTS public.user_plans;
DROP TABLE IF EXISTS public.payments;
DROP TABLE IF EXISTS public.plans;

-- Create plans table to define available plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL, -- 'monthly' or 'yearly'
  mcp_limit INTEGER, -- NULL means unlimited
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_plans table to track active plans for users
CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  payment_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create payments table to track all payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL, -- 'succeeded', 'failed', 'refunded'
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create mcp_usage table to track MCP generations
CREATE TABLE IF NOT EXISTS public.mcp_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mcp_id UUID, -- Optional reference to an MCP if we want to track which specific MCP was generated
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create new indexes for better query performance
CREATE INDEX IF NOT EXISTS user_plans_user_id_idx ON public.user_plans(user_id);
CREATE INDEX IF NOT EXISTS user_plans_expires_at_idx ON public.user_plans(expires_at);
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS payments_payment_id_idx ON public.payments(payment_id);
CREATE INDEX IF NOT EXISTS mcp_usage_user_id_idx ON public.mcp_usage(user_id);
CREATE INDEX IF NOT EXISTS mcp_usage_created_at_idx ON public.mcp_usage(created_at);

-- Row Level Security policies

-- Plans table policies
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY plans_select_policy ON public.plans FOR SELECT USING (TRUE);
CREATE POLICY plans_modify_policy ON public.plans USING (auth.role() = 'service_role');

-- User Plans table policies
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_plans_select_policy ON public.user_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_plans_insert_policy ON public.user_plans FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY user_plans_update_policy ON public.user_plans FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY user_plans_delete_policy ON public.user_plans FOR DELETE USING (auth.role() = 'service_role');

-- Payments table policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_select_policy ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY payments_insert_policy ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY payments_update_policy ON public.payments FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY payments_delete_policy ON public.payments FOR DELETE USING (auth.role() = 'service_role');

-- MCP Usage table policies
ALTER TABLE public.mcp_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY mcp_usage_select_policy ON public.mcp_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY mcp_usage_insert_policy ON public.mcp_usage FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY mcp_usage_delete_policy ON public.mcp_usage FOR DELETE USING (auth.role() = 'service_role');

-- Function to check if user has active plan
CREATE OR REPLACE FUNCTION public.user_has_active_plan(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_plans
    WHERE user_id = user_uuid
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check remaining MCP generations for user
CREATE OR REPLACE FUNCTION public.get_user_mcp_remaining(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_plan_id UUID;
  plan_limit INTEGER;
  used_count INTEGER;
  plan_start TIMESTAMPTZ;
BEGIN
  -- Get user's current plan and limit
  SELECT up.plan_id, p.mcp_limit, up.starts_at
  INTO current_plan_id, plan_limit, plan_start
  FROM public.user_plans up
  JOIN public.plans p ON p.id = up.plan_id
  WHERE up.user_id = user_uuid
  AND up.expires_at > NOW()
  ORDER BY up.expires_at DESC
  LIMIT 1;
  
  -- If no active plan or unlimited plan, return -1
  IF current_plan_id IS NULL OR plan_limit IS NULL THEN
    RETURN -1;
  END IF;
  
  -- Count used MCPs during current plan period
  SELECT COUNT(*)
  INTO used_count
  FROM public.mcp_usage
  WHERE user_id = user_uuid
  AND created_at >= plan_start;
  
  -- Return remaining
  RETURN GREATEST(0, plan_limit - used_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 