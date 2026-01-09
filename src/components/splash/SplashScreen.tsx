import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "exit">("logo");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("tagline"), 1500);
    const timer2 = setTimeout(() => setPhase("exit"), 3000);
    const timer3 = setTimeout(onComplete, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center graffiti-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated spray particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ["#00FF41", "#00D4FF", "#FF00FF", "#FFFF00"][i % 4],
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 1 
            }}
          >
            <motion.h1
              className="font-graffiti text-8xl md:text-9xl text-neon-green text-glow-green"
              animate={{
                textShadow: [
                  "0 0 20px #00FF41, 0 0 40px #00FF41",
                  "0 0 40px #00FF41, 0 0 80px #00FF41, 0 0 120px #00FF41",
                  "0 0 20px #00FF41, 0 0 40px #00FF41",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              LEO
            </motion.h1>
            
            {/* Spray effect behind logo */}
            <motion.div
              className="absolute -inset-10 rounded-full bg-gradient-radial from-neon-green/30 via-neon-cyan/10 to-transparent blur-2xl -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Tagline */}
          <AnimatePresence>
            {phase === "tagline" && (
              <motion.p
                className="mt-8 font-graffiti text-xl md:text-2xl text-neon-cyan text-glow-cyan text-center px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                Street Art Merch Empire
                <br />
                <span className="text-neon-magenta text-glow-magenta">
                  Design • Hype • Own It
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full gradient-border"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
