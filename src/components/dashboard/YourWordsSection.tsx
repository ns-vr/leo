import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Upload, Play, Users, MessageCircle, Send, 
  Radio, Calendar, Clock, Eye, X, Plus, Loader2,
  Mic, MicOff, Volume2, VolumeX, MonitorUp
} from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { MediaRecorderUI } from "./MediaRecorderUI";
import { WatchPartyReactions } from "./WatchPartyReactions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WatchParty {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  is_live: boolean;
  status: string;
  viewer_count: number;
  user_id: string;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

type VideoSource = "upload" | "url" | "record";

export function YourWordsSection() {
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [activeParty, setActiveParty] = useState<WatchParty | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [videoSource, setVideoSource] = useState<VideoSource>("upload");
  
  const [newParty, setNewParty] = useState({
    title: "",
    description: "",
    videoFile: null as File | null,
    videoUrl: "",
    isLive: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchParties();
  }, []);

  useEffect(() => {
    if (activeParty) {
      fetchComments(activeParty.id);
      
      // Subscribe to realtime comments
      const channel = supabase
        .channel(`party-${activeParty.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'watch_party_comments',
            filter: `party_id=eq.${activeParty.id}`
          },
          (payload) => {
            setComments(prev => [...prev, payload.new as Comment]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeParty]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const fetchParties = async () => {
    const { data, error } = await supabase
      .from('watch_parties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setParties(data);
  };

  const fetchComments = async (partyId: string) => {
    const { data } = await supabase
      .from('watch_party_comments')
      .select('*')
      .eq('party_id', partyId)
      .order('created_at', { ascending: true });
    
    if (data) setComments(data);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Video must be under 500MB", {
          style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" }
        });
        return;
      }
      setNewParty(prev => ({ ...prev, videoFile: file }));
      toast.success("Video selected! 🎬", {
        style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" }
      });
    }
  };

  const handleRecordingComplete = (blob: Blob, filename: string) => {
    const file = new File([blob], filename, { type: blob.type });
    setNewParty(prev => ({ ...prev, videoFile: file }));
    setVideoSource("upload"); // Switch back to upload view to show the file
    toast.success("Recording ready! 🎥", {
      style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" }
    });
  };

  const createWatchParty = async () => {
    if (!user) {
      toast.error("Please login to create a watch party");
      return;
    }
    
    if (!newParty.title) {
      toast.error("Give your watch party a title!");
      return;
    }

    setIsLoading(true);
    let videoUrl = newParty.videoUrl;

    try {
      // Upload video if provided
      if (newParty.videoFile) {
        setIsUploading(true);
        const fileName = `${user.id}/${Date.now()}-${newParty.videoFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, newParty.videoFile, {
            onUploadProgress: (progress) => {
              setUploadProgress((progress.loaded / progress.total) * 100);
            }
          } as any);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);
        
        videoUrl = urlData.publicUrl;
        setIsUploading(false);
      }

      // Create watch party
      const { data, error } = await supabase
        .from('watch_parties')
        .insert({
          user_id: user.id,
          title: newParty.title,
          description: newParty.description,
          video_url: videoUrl,
          is_live: newParty.isLive,
          status: newParty.isLive ? 'live' : 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Watch party created! 🔥", {
        style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" }
      });

      setShowCreateModal(false);
      setNewParty({ title: "", description: "", videoFile: null, videoUrl: "", isLive: false });
      setVideoSource("upload");
      fetchParties();
      
      if (data) setActiveParty(data);
    } catch (error) {
      console.error("Error creating party:", error);
      toast.error("Failed to create watch party", {
        style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" }
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const sendComment = async () => {
    if (!newComment.trim() || !activeParty || !user) return;

    const { error } = await supabase
      .from('watch_party_comments')
      .insert({
        party_id: activeParty.id,
        user_id: user.id,
        content: newComment
      });

    if (!error) {
      setNewComment("");
    }
  };

  const goLive = async () => {
    if (!activeParty) return;
    
    await supabase
      .from('watch_parties')
      .update({ status: 'live', is_live: true, started_at: new Date().toISOString() })
      .eq('id', activeParty.id);
    
    setActiveParty(prev => prev ? { ...prev, status: 'live', is_live: true } : null);
    toast.success("You're LIVE! 🔴", {
      style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" }
    });
  };

  const endParty = async () => {
    if (!activeParty) return;
    
    await supabase
      .from('watch_parties')
      .update({ status: 'ended', is_live: false, ended_at: new Date().toISOString() })
      .eq('id', activeParty.id);
    
    setActiveParty(null);
    fetchParties();
    toast.success("Watch party ended", {
      style: { background: "#0A0A0A", border: "2px solid #00D4FF", color: "#00D4FF" }
    });
  };

  const videoSourceOptions = [
    { id: "upload" as const, label: "Upload", icon: Upload },
    { id: "record" as const, label: "Record", icon: MonitorUp },
    { id: "url" as const, label: "URL", icon: Video },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-sm">
            Host watch parties with live commentary
          </p>
        </div>
        <NeonButton 
          variant="magenta" 
          size="sm" 
          onClick={() => setShowCreateModal(true)}
          disabled={!user}
        >
          <Plus size={18} className="mr-2" />
          New Party
        </NeonButton>
      </div>

      {/* Active Watch Party */}
      <AnimatePresence>
        {activeParty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NeonCard glowColor="magenta" className="p-0 overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                {activeParty.video_url ? (
                  <video
                    ref={videoRef}
                    src={activeParty.video_url}
                    className="w-full h-full object-contain"
                    controls
                    muted={isMuted}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Radio size={48} className="text-neon-magenta mx-auto mb-2 animate-pulse" />
                      <p className="text-neon-magenta font-graffiti">Waiting for stream...</p>
                    </div>
                  </div>
                )}
                
                {/* Live Badge */}
                {activeParty.is_live && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-sm font-bold">LIVE</span>
                  </div>
                )}

                {/* Viewer Count */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1 rounded-full">
                  <Eye size={16} className="text-neon-cyan" />
                  <span className="text-sm font-mono">{activeParty.viewer_count}</span>
                </div>

                {/* Reactions Overlay */}
                <WatchPartyReactions 
                  partyId={activeParty.id} 
                  userId={user?.id} 
                  isActive={activeParty.is_live}
                />

                {/* Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-graffiti text-lg text-neon-green truncate">{activeParty.title}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 bg-muted rounded-lg hover:bg-neon-cyan/20 transition-colors"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      {activeParty.user_id === user?.id && !activeParty.is_live && (
                        <NeonButton variant="magenta" size="sm" onClick={goLive}>
                          <Radio size={16} className="mr-1" /> Go Live
                        </NeonButton>
                      )}
                      {activeParty.user_id === user?.id && (
                        <NeonButton variant="yellow" size="sm" onClick={endParty}>
                          End Party
                        </NeonButton>
                      )}
                      <button 
                        onClick={() => setActiveParty(null)}
                        className="p-2 bg-muted rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Reaction Bar for Viewers */}
                  {activeParty.is_live && (
                    <div className="mt-3 flex justify-center">
                      <WatchPartyReactions 
                        partyId={activeParty.id} 
                        userId={user?.id} 
                        isActive={activeParty.is_live}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Live Commentary Section */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle size={18} className="text-neon-cyan" />
                  <span className="font-graffiti text-sm text-neon-cyan">Live Commentary</span>
                  <span className="text-xs text-muted-foreground font-mono">({comments.length})</span>
                </div>

                {/* Comments List */}
                <div className="h-48 overflow-y-auto space-y-2 mb-3 pr-2 scrollbar-thin">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-2 rounded-lg ${
                        comment.user_id === user?.id 
                          ? "bg-neon-green/10 border border-neon-green/30" 
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm font-mono">{comment.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleTimeString()}
                      </span>
                    </motion.div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>

                {/* Comment Input */}
                {user ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendComment()}
                      placeholder="Drop your thoughts..."
                      className="flex-1 px-4 py-2 bg-muted border-2 border-border rounded-xl font-mono text-sm focus:outline-none focus:border-neon-cyan transition-all"
                    />
                    <NeonButton variant="cyan" size="sm" onClick={sendComment}>
                      <Send size={18} />
                    </NeonButton>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm">Login to comment</p>
                )}
              </div>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watch Parties List */}
      {!activeParty && (
        <div className="grid gap-4">
          {parties.length === 0 ? (
            <NeonCard glowColor="cyan" className="text-center py-8">
              <Video size={48} className="mx-auto text-neon-cyan mb-4 opacity-50" />
              <p className="text-muted-foreground font-mono">No watch parties yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create one to get started!</p>
            </NeonCard>
          ) : (
            parties.map((party, i) => (
              <motion.div
                key={party.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <NeonCard 
                  glowColor={party.is_live ? "magenta" : "cyan"} 
                  className="cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => setActiveParty(party)}
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {party.video_url ? (
                        <video src={party.video_url} className="w-full h-full object-cover" />
                      ) : (
                        <Video size={24} className="text-muted-foreground" />
                      )}
                      {party.is_live && (
                        <div className="absolute">
                          <span className="bg-destructive px-2 py-0.5 rounded text-xs text-white font-bold">
                            LIVE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-graffiti text-neon-green truncate">{party.title}</h4>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {party.description || "No description"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye size={12} /> {party.viewer_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} /> {new Date(party.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Join Button */}
                    <NeonButton variant={party.is_live ? "magenta" : "cyan"} size="sm">
                      <Play size={16} className="mr-1" />
                      {party.is_live ? "Watch" : "View"}
                    </NeonButton>
                  </div>
                </NeonCard>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <NeonCard glowColor="magenta">
                <div className="flex items-center justify-between mb-6">
                  <GraffitiHeader size="sm" glowColor="magenta">
                    Create Watch Party
                  </GraffitiHeader>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-mono text-muted-foreground mb-1 block">
                      Party Title *
                    </label>
                    <input
                      type="text"
                      value={newParty.title}
                      onChange={(e) => setNewParty(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="My Epic Watch Party"
                      className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono focus:outline-none focus:border-neon-magenta transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-mono text-muted-foreground mb-1 block">
                      Description
                    </label>
                    <textarea
                      value={newParty.description}
                      onChange={(e) => setNewParty(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What's this party about?"
                      rows={2}
                      className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono resize-none focus:outline-none focus:border-neon-magenta transition-all"
                    />
                  </div>

                  {/* Video Source Tabs */}
                  <div>
                    <label className="text-sm font-mono text-muted-foreground mb-2 block">
                      Add Video
                    </label>
                    <div className="flex gap-1 p-1 bg-muted rounded-xl mb-3">
                      {videoSourceOptions.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setVideoSource(id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-mono transition-all ${
                            videoSource === id
                              ? "bg-neon-cyan text-black"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={16} />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Upload Option */}
                    {videoSource === "upload" && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          newParty.videoFile 
                            ? "border-neon-green bg-neon-green/10" 
                            : "border-border hover:border-neon-cyan"
                        }`}
                      >
                        {newParty.videoFile ? (
                          <div className="flex items-center justify-center gap-2">
                            <Video size={24} className="text-neon-green" />
                            <span className="text-neon-green font-mono text-sm truncate">
                              {newParty.videoFile.name}
                            </span>
                          </div>
                        ) : (
                          <>
                            <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground font-mono">
                              Click to upload video (max 500MB)
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Record Option */}
                    {videoSource === "record" && (
                      <MediaRecorderUI
                        onRecordingComplete={handleRecordingComplete}
                        onCancel={() => setVideoSource("upload")}
                      />
                    )}

                    {/* URL Option */}
                    {videoSource === "url" && (
                      <input
                        type="url"
                        value={newParty.videoUrl}
                        onChange={(e) => setNewParty(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono focus:outline-none focus:border-neon-cyan transition-all"
                      />
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Live Toggle */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <div className="flex items-center gap-2">
                      <Radio size={18} className={newParty.isLive ? "text-destructive" : "text-muted-foreground"} />
                      <span className="font-mono text-sm">Start as Live</span>
                    </div>
                    <button
                      onClick={() => setNewParty(prev => ({ ...prev, isLive: !prev.isLive }))}
                      className={`w-12 h-6 rounded-full transition-all ${
                        newParty.isLive ? "bg-destructive" : "bg-border"
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          newParty.isLive ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span>Uploading...</span>
                        <span className="text-neon-green">{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neon-green transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Create Button */}
                  <NeonButton
                    variant="green"
                    className="w-full"
                    onClick={createWatchParty}
                    disabled={isLoading || !newParty.title}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Video size={18} />
                        Create Watch Party
                      </span>
                    )}
                  </NeonButton>
                </div>
              </NeonCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
