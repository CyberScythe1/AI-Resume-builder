-- Create resumes table for anonymous storage
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY,
    title TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT a new resume (anonymous, so no user_id required)
CREATE POLICY "Enable insert for all users" ON public.resumes
    FOR INSERT
    WITH CHECK (true);

-- Allow anyone to SELECT a resume if they know the ID
CREATE POLICY "Enable read access for all users" ON public.resumes
    FOR SELECT
    USING (true);

-- Allow anyone to UPDATE a resume if they know the ID
CREATE POLICY "Enable update for all users" ON public.resumes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow anyone to DELETE
CREATE POLICY "Enable delete for all users" ON public.resumes
    FOR DELETE
    USING (true);

-- Set up pg_cron to automatically delete resumes older than 5 minutes
-- Note: This requires the pg_cron extension to be enabled in your database
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'delete-expired-resumes',
    '* * * * *', -- Run every minute
    $$DELETE FROM public.resumes WHERE created_at < now() - interval '5 minutes'$$
);
