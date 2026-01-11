import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";

const SPOTIFY_PLAYLIST_ID = "6q9mNqQgNJAdKQ3cNycERT";

export function PlaylistSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <GraffitiHeader size="sm" glowColor="cyan">
          Sports Hype 🔥
        </GraffitiHeader>
        <p className="text-muted-foreground font-mono text-sm">
          Get hyped with our curated playlist
        </p>
      </div>

      {/* Spotify Embed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <NeonCard glowColor="green" className="p-0 overflow-hidden">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="452"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title="Leo Hype Playlist"
          />
        </NeonCard>
      </motion.div>

      {/* Open in Spotify Link */}
      <motion.a
        href={`https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-graffiti rounded-xl transition-all hover:scale-105"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ExternalLink size={18} />
        Open in Spotify
      </motion.a>
    </div>
  );
}
