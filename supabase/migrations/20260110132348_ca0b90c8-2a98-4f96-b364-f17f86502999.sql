-- Create watch_parties table for YOUR WORDS feature
CREATE TABLE public.watch_parties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_storage_path TEXT,
  is_live BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  viewer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create watch_party_comments table for live commentary
CREATE TABLE public.watch_party_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id UUID NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_comments ENABLE ROW LEVEL SECURITY;

-- Watch parties policies
CREATE POLICY "Anyone can view active watch parties"
ON public.watch_parties FOR SELECT
USING (status IN ('live', 'scheduled') OR auth.uid() = user_id);

CREATE POLICY "Users can create their own watch parties"
ON public.watch_parties FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch parties"
ON public.watch_parties FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch parties"
ON public.watch_parties FOR DELETE
USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments on parties they can see"
ON public.watch_party_comments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.watch_parties wp 
  WHERE wp.id = party_id 
  AND (wp.status IN ('live', 'scheduled') OR wp.user_id = auth.uid())
));

CREATE POLICY "Authenticated users can comment"
ON public.watch_party_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.watch_party_comments FOR DELETE
USING (auth.uid() = user_id);

-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Videos storage policies
CREATE POLICY "Anyone can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Triggers for updated_at
CREATE TRIGGER update_watch_parties_updated_at
BEFORE UPDATE ON public.watch_parties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.watch_party_comments;