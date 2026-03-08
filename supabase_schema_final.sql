-- 1. Create or ensure resumes table exists
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY,
    title TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Enable insert for all users" ON public.resumes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.resumes;
DROP POLICY IF EXISTS "Enable update for all users" ON public.resumes;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.resumes;
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Anyone can view anonymous resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Anyone can update anonymous resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;

-- 4. INSERT POLICIES
-- Allow authenticated users to insert their own resumes
CREATE POLICY "Users can insert own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to insert resumes (where user_id is null)
CREATE POLICY "Anyone can insert anonymous resumes" ON public.resumes
    FOR INSERT WITH CHECK (user_id IS NULL);

-- 5. SELECT POLICIES 
CREATE POLICY "Users can view own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view anonymous resumes" ON public.resumes
    FOR SELECT USING (user_id IS NULL);

-- 6. UPDATE POLICIES
CREATE POLICY "Users can update own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can update anonymous resumes" ON public.resumes
    FOR UPDATE USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

-- 7. DELETE POLICIES
CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can delete anonymous resumes" ON public.resumes
    FOR DELETE USING (user_id IS NULL);

-- 8. Setup CRON JOB (5 minute auto-deletion for anonymous resumes only)
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  PERFORM cron.unschedule('delete-expired-resumes');
EXCEPTION WHEN OTHERS THEN
  -- Ignore error if job does not exist
END $$;
SELECT cron.schedule(
    'delete-expired-resumes',
    '* * * * *', -- Run every minute
    $$DELETE FROM public.resumes WHERE user_id IS NULL AND created_at < now() - interval '5 minutes'$$
);
