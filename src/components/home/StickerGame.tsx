import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Sticker {
  id: number;
  emoji: string;
  x: number;
  y: number;
  color: string;
  points: number;
}

const stickerEmojis = ["🎨", "🔥", "⚡", "💀", "🌹", "🐯", "👑", "💎", "🎭", "🦁"];
const colors = ["#00FF41", "#00D4FF", "#FF00FF", "#FFFF00"];

export function StickerGame() {
  const [score, setScore] = useState(0);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const spawnSticker = useCallback(() => {
    const newSticker: Sticker = {
      id: Date.now(),
      emoji: stickerEmojis[Math.floor(Math.random() * stickerEmojis.length)],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      color: colors[Math.floor(Math.random() * colors.length)],
      points: Math.floor(Math.random() * 50) + 10,
    };
    setStickers((prev) => [...prev.slice(-5), newSticker]);
  }, []);

  const handleStickerClick = (sticker: Sticker) => {
    // Add points
    setScore((prev) => prev + sticker.points);

    // Create particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: sticker.x,
      y: sticker.y,
      color: sticker.color,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove sticker
    setStickers((prev) => prev.filter((s) => s.id !== sticker.id));

    // Clean up particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 600);
  };

  return (
    <div className="relative bg-card/50 rounded-2xl border-2 border-border p-4 h-48 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-graffiti text-lg text-neon-cyan flex items-center gap-2">
          <Sparkles size={20} className="text-neon-yellow" />
          Tap to Score!
        </h3>
        <div className="font-mono text-neon-green text-glow-green">
          {score} pts
        </div>
      </div>

      {/* Game area */}
      <div 
        className="relative h-28 bg-muted/30 rounded-lg cursor-pointer"
        onClick={spawnSticker}
      >
        <AnimatePresence>
          {stickers.map((sticker) => (
            <motion.button
              key={sticker.id}
              className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
              style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                handleStickerClick(sticker);
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
            >
              <span style={{ filter: `drop-shadow(0 0 8px ${sticker.color})` }}>
                {sticker.emoji}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                scale: 0,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Tap hint */}
        {stickers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-sm">
            Tap anywhere to spawn stickers!
          </div>
        )}
      </div>
    </div>
  );
}
