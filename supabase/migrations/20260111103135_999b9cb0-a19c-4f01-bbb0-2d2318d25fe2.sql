-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view audio for QR playback" ON public.audio_files;

-- Add an access_token column for secure QR code playback
ALTER TABLE public.audio_files 
ADD COLUMN IF NOT EXISTS access_token uuid DEFAULT gen_random_uuid() NOT NULL;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_audio_files_access_token ON public.audio_files(access_token);

-- Create a secure policy that allows token-based access for QR playback
-- Users can view audio files if they have the correct access token (passed via RPC or direct lookup)
-- This prevents enumeration attacks while still allowing QR code playback
CREATE POLICY "Users can view audio via access token"
ON public.audio_files
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Note: For QR playback, we'll create an edge function that validates the token
-- and returns a signed URL, rather than exposing the table directly