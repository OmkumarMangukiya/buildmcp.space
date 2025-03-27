import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config()

if(!process.env.SUPABASE_PROJECT_URL || !process.env.SUPABASE_ANON_KEY){
  throw new Error('Please provide SUPABASE_PROJECT_URL and SUPABASE_ANON_KEY in .env file')
}

// Regular client for authenticated operations
const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_ANON_KEY)

// Check for service role key for admin operations
if(!process.env.SUPABASE_SERVICE_ROLE_KEY){
  console.warn('SUPABASE_SERVICE_ROLE_KEY not provided. Some admin operations may not work.');
}

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.SUPABASE_PROJECT_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export default supabase;