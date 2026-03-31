-- Phase 8: Auth & Profiling Migration
-- Paste and Run this in the Supabase SQL Editor

-- 1. Add user_id to projects so we know who submitted what
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create the robust project_upvotes junction table
CREATE TABLE IF NOT EXISTS public.project_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- 3. Row Level Security for upvotes
ALTER TABLE public.project_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read upvotes" 
ON public.project_upvotes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own upvotes" 
ON public.project_upvotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes" 
ON public.project_upvotes 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Secure RPC function to safely count total users for the Admin panel
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT count(*)::int FROM auth.users;
$$;
