-- 1. Create or ensure resumes table exists
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY,
    title TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
DROP POLICY IF EXISTS "Anyone can delete anonymous resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Anyone can insert anonymous resumes" ON public.resumes;

-- 4. INSERT POLICIES
CREATE POLICY "Users can insert own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. SELECT POLICIES 
CREATE POLICY "Users can view own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

-- 6. UPDATE POLICIES
CREATE POLICY "Users can update own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. DELETE POLICIES
CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Remove the old CRON JOB (if it exists)
DO $$
BEGIN
  PERFORM cron.unschedule('delete-expired-resumes');
EXCEPTION WHEN OTHERS THEN
  -- Ignore error if job does not exist
END $$;

-- 9. Setup User Roles Table for Admin features
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Everyone can view their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);
    
-- Note: Insert/Update/Delete on user_roles should ideally be done by super admins only in the dashboard.
-- For simplicity, we leave them locked down (no public insert policy). Only service_role can mutate.

-- 10. Admin RPC Functions (SECURITY DEFINER to bypass RLS safely)
-- Get App Stats
CREATE OR REPLACE FUNCTION get_app_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_users INT;
    total_resumes INT;
    is_admin BOOLEAN;
BEGIN
    -- Check if the calling user is an admin
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can view stats.';
    END IF;

    SELECT count(*) INTO total_users FROM auth.users;
    SELECT count(*) INTO total_resumes FROM public.resumes;

    RETURN json_build_object(
        'totalUsers', total_users,
        'totalResumes', total_resumes
    );
END;
$$;

-- Delete User by Admin
CREATE OR REPLACE FUNCTION admin_delete_user(target_uid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if the calling user is an admin
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can delete users.';
    END IF;

    -- auth.users delete will cascade to public.resumes and public.user_roles
    DELETE FROM auth.users WHERE id = target_uid;
END;
$$;

-- Get all users for admin dashboard
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if calling user is admin
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    RETURN QUERY
    SELECT 
        au.id, 
        au.email::VARCHAR, 
        au.created_at, 
        COALESCE(ur.role, 'user') AS role
    FROM auth.users au
    LEFT JOIN public.user_roles ur ON au.id = ur.user_id
    ORDER BY au.created_at DESC;
END;
$$;
