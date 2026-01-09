import { motion } from "framer-motion";

const stickers = [
  { emoji: "🧥", delay: 0 },
  { emoji: "🔑", delay: 0.5 },
  { emoji: "🎨", delay: 1 },
  { emoji: "🔥", delay: 1.5 },
  { emoji: "💀", delay: 2 },
  { emoji: "⚡", delay: 2.5 },
];

export function FloatingStickers() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stickers.map((sticker, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          style={{
            left: `${10 + (i * 15)}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            delay: sticker.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {sticker.emoji}
        </motion.div>
      ))}
    </div>
  );
}
