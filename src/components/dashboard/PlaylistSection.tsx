import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { useState } from "react";
import { NeonCard } from "@/components/ui/NeonCard";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";

const playlists = [
  {
    id: 1,
    name: "Ultimate Gym Pump",
    tracks: 24,
    duration: "1h 45m",
    color: "green" as const,
    cover: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Basketball Rage",
    tracks: 18,
    duration: "1h 12m",
    color: "cyan" as const,
    cover: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Moto Tour Adrenaline",
    tracks: 32,
    duration: "2h 05m",
    color: "magenta" as const,
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  },
];

const tracks = [
  { id: 1, name: "Street Dreams", artist: "Leo Beats", duration: "3:42" },
  { id: 2, name: "Neon Nights", artist: "Urban Legends", duration: "4:15" },
  { id: 3, name: "Graffiti Soul", artist: "The Streets", duration: "3:58" },
  { id: 4, name: "Hustle Mode", artist: "City Kings", duration: "4:01" },
  { id: 5, name: "Chrome Hearts", artist: "Midnight Crew", duration: "3:33" },
];

export function PlaylistSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  return (
    <div className="space-y-6">
      {/* Playlists Grid */}
      <div className="space-y-3">
        <GraffitiHeader size="sm" glowColor="cyan">
          Sports Hype 🔥
        </GraffitiHeader>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {playlists.map((playlist, i) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-36"
            >
              <NeonCard glowColor={playlist.color} className="p-3">
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className={`font-graffiti text-sm text-neon-${playlist.color} truncate`}>
                  {playlist.name}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {playlist.tracks} tracks • {playlist.duration}
                </p>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Now Playing */}
      <NeonCard glowColor="green" className="bg-gradient-to-r from-neon-green/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
            <Volume2 className="text-neon-green" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-graffiti text-lg text-neon-green">
              {tracks[currentTrack].name}
            </h4>
            <p className="text-sm text-muted-foreground font-mono">
              {tracks[currentTrack].artist}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentTrack((prev) => Math.max(0, prev - 1))}
              className="p-2 text-muted-foreground hover:text-neon-green transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-neon-green text-black rounded-full hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
              onClick={() => setCurrentTrack((prev) => Math.min(tracks.length - 1, prev + 1))}
              className="p-2 text-muted-foreground hover:text-neon-green transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon-green"
            initial={{ width: "0%" }}
            animate={{ width: isPlaying ? "100%" : "30%" }}
            transition={{ duration: isPlaying ? 200 : 0 }}
          />
        </div>
      </NeonCard>

      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, i) => (
          <motion.button
            key={track.id}
            onClick={() => {
              setCurrentTrack(i);
              setIsPlaying(true);
            }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              currentTrack === i
                ? "bg-neon-green/10 border border-neon-green/50"
                : "bg-card hover:bg-muted"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className={`w-6 text-center font-mono text-sm ${
              currentTrack === i ? "text-neon-green" : "text-muted-foreground"
            }`}>
              {currentTrack === i && isPlaying ? "▶" : i + 1}
            </span>
            <div className="flex-1 text-left">
              <div className={`font-mono ${currentTrack === i ? "text-neon-green" : "text-foreground"}`}>
                {track.name}
              </div>
              <div className="text-xs text-muted-foreground">{track.artist}</div>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {track.duration}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
