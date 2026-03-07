-- 1. Add user_id column to existing resumes table
ALTER TABLE public.resumes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop the old overly-permissive SELECT policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.resumes;

-- Create two new SELECT policies
-- a) Users can see their own resumes
CREATE POLICY "Users can view own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

-- b) ANYONE can view an anonymous resume (where user_id is null) - for sharing/printing workflow
CREATE POLICY "Anyone can view anonymous resumes" ON public.resumes
    FOR SELECT USING (user_id IS NULL);

-- 3. Update the UPDATE and DELETE policies mapping to owners
DROP POLICY IF EXISTS "Enable update for all users" ON public.resumes;
CREATE POLICY "Users can update own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can update anonymous resumes" ON public.resumes
    FOR UPDATE USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Enable delete for all users" ON public.resumes;
CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Re-Write the Cron Job to ONLY delete ANONYMOUS resumes
SELECT cron.unschedule('delete-expired-resumes');
SELECT cron.schedule(
    'delete-expired-resumes',
    '* * * * *', -- Run every minute
    $$DELETE FROM public.resumes WHERE user_id IS NULL AND created_at < now() - interval '5 minutes'$$
);
