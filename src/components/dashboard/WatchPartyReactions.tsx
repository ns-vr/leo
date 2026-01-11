import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

interface WatchPartyReactionsProps {
  partyId: string;
  userId: string | undefined;
  isActive: boolean;
}

const REACTION_EMOJIS = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Applause" },
  { emoji: "💀", label: "Skull" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "🎉", label: "Party" },
];

export function WatchPartyReactions({ partyId, userId, isActive }: WatchPartyReactionsProps) {
  const [floatingReactions, setFloatingReactions] = useState<Reaction[]>([]);
  const [cooldowns, setCooldowns] = useState<Record<string, boolean>>({});

  // Subscribe to realtime reactions
  useEffect(() => {
    if (!isActive) return;

    const channel = supabase
      .channel(`reactions-${partyId}`)
      .on("broadcast", { event: "reaction" }, (payload) => {
        const reaction: Reaction = {
          id: `${Date.now()}-${Math.random()}`,
          emoji: payload.payload.emoji,
          x: 10 + Math.random() * 80, // Random horizontal position (10-90%)
        };
        setFloatingReactions((prev) => [...prev, reaction]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partyId, isActive]);

  // Clean up old reactions
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFloatingReactions((prev) => prev.slice(-20)); // Keep only last 20
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const sendReaction = async (emoji: string) => {
    if (!userId || cooldowns[emoji]) return;

    // Set cooldown
    setCooldowns((prev) => ({ ...prev, [emoji]: true }));
    setTimeout(() => {
      setCooldowns((prev) => ({ ...prev, [emoji]: false }));
    }, 500);

    // Add local reaction immediately
    const reaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: 10 + Math.random() * 80,
    };
    setFloatingReactions((prev) => [...prev, reaction]);

    // Broadcast to others
    await supabase.channel(`reactions-${partyId}`).send({
      type: "broadcast",
      event: "reaction",
      payload: { emoji, userId },
    });
  };

  const removeReaction = (id: string) => {
    setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
  };

  if (!isActive) return null;

  return (
    <>
      {/* Floating Reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              className="absolute text-4xl"
              style={{ left: `${reaction.x}%`, bottom: 80 }}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0, 
                y: -300, 
                scale: 1.2,
                rotate: Math.random() * 30 - 15
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2.5,
                ease: "easeOut"
              }}
              onAnimationComplete={() => removeReaction(reaction.id)}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction Buttons */}
      <motion.div 
        className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {REACTION_EMOJIS.map(({ emoji, label }) => (
          <motion.button
            key={emoji}
            onClick={() => sendReaction(emoji)}
            disabled={!userId || cooldowns[emoji]}
            className={`p-2 rounded-full text-xl transition-all ${
              cooldowns[emoji] 
                ? "opacity-50 scale-90" 
                : "hover:bg-neon-magenta/20 hover:scale-125 active:scale-90"
            }`}
            whileTap={{ scale: 0.8 }}
            title={label}
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
