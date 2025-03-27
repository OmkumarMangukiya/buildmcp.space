-- Create users table to extend the Supabase Auth
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Add policy to allow inserting users during registration
CREATE POLICY "Service role can insert users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Create MCPs table
CREATE TABLE public.mcps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'offline',
  platform TEXT NOT NULL,
  prompt TEXT NOT NULL,
  config JSONB,
  is_public BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security for MCPs table
ALTER TABLE public.mcps ENABLE ROW LEVEL SECURITY;

-- Create policies for MCPs table
CREATE POLICY "Users can view their own MCPs" 
  ON public.mcps 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view public MCPs" 
  ON public.mcps 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can create their own MCPs" 
  ON public.mcps 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MCPs" 
  ON public.mcps 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MCPs" 
  ON public.mcps 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create MCP Versions table for versioning
CREATE TABLE public.mcp_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcp_id UUID NOT NULL REFERENCES public.mcps(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changes TEXT,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security for MCP Versions table
ALTER TABLE public.mcp_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for MCP Versions table
CREATE POLICY "Users can view versions of their own MCPs" 
  ON public.mcp_versions 
  FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.mcps WHERE id = mcp_id));

CREATE POLICY "Everyone can view versions of public MCPs" 
  ON public.mcp_versions 
  FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.mcps WHERE id = mcp_id AND is_public = true));

CREATE POLICY "Users can create versions for their own MCPs" 
  ON public.mcp_versions 
  FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.mcps WHERE id = mcp_id));

-- Create MCP Forks table to track forked MCPs
CREATE TABLE public.mcp_forks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_mcp_id UUID NOT NULL REFERENCES public.mcps(id) ON DELETE CASCADE,
  forked_mcp_id UUID NOT NULL REFERENCES public.mcps(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security for MCP Forks table
ALTER TABLE public.mcp_forks ENABLE ROW LEVEL SECURITY;

-- Create policies for MCP Forks table
CREATE POLICY "Everyone can view fork relationships" 
  ON public.mcp_forks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create fork relationships for their MCPs" 
  ON public.mcp_forks 
  FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.mcps WHERE id = forked_mcp_id));

-- Create functions and triggers
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp for users
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Trigger to update updated_at timestamp for mcps
CREATE TRIGGER update_mcps_modtime
BEFORE UPDATE ON public.mcps
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for better performance
CREATE INDEX idx_mcps_user_id ON public.mcps(user_id);
CREATE INDEX idx_mcps_is_public ON public.mcps(is_public);
CREATE INDEX idx_mcp_versions_mcp_id ON public.mcp_versions(mcp_id);
CREATE INDEX idx_mcp_forks_original_mcp_id ON public.mcp_forks(original_mcp_id);
CREATE INDEX idx_mcp_forks_forked_mcp_id ON public.mcp_forks(forked_mcp_id); 