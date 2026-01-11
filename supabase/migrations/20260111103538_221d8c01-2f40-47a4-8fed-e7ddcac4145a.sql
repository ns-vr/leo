-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows public viewing of profiles (for social features like watch parties, comments)
-- This enables displaying usernames and avatars in social contexts
CREATE POLICY "Profiles are publicly viewable"
ON public.profiles
FOR SELECT
USING (true);

-- Note: The existing UPDATE policy "Users can update their own profile" remains in place
-- ensuring only owners can modify their own profile data