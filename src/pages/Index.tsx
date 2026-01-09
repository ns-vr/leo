import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { NeonButton } from "@/components/ui/NeonButton";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { StickerGame } from "@/components/home/StickerGame";
import { FloatingStickers } from "@/components/home/FloatingStickers";
import { SplashScreen } from "@/components/splash/SplashScreen";

export default function Home() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <PageLayout showNav={false}>
      <FloatingStickers />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Hero Section */}
        <motion.div
          className="relative z-10 px-4 pt-12 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h1 className="font-graffiti text-7xl md:text-8xl text-neon-green text-glow-green neon-pulse">
              LEO
            </h1>
            <p className="font-graffiti text-xl text-neon-cyan text-glow-cyan mt-2">
              Street Art Merch Empire
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-center text-muted-foreground font-mono max-w-md mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Design custom hoodies, create audio keychains, and build your street empire with AI-powered tools
          </motion.p>

          {/* Auth Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <NeonButton
              variant="green"
              size="lg"
              onClick={() => navigate("/auth")}
              className="group"
            >
              <LogIn size={20} className="mr-2 group-hover:animate-bounce" />
              Login
            </NeonButton>
            <NeonButton
              variant="cyan"
              size="lg"
              onClick={() => navigate("/auth")}
              className="group"
            >
              <UserPlus size={20} className="mr-2 group-hover:animate-bounce" />
              Sign Up
            </NeonButton>
          </motion.div>
        </motion.div>

        {/* Hero Carousel */}
        <motion.div
          className="px-4 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GraffitiHeader size="sm" glowColor="magenta" className="text-center mb-4">
            🔥 Fresh Drops
          </GraffitiHeader>
          <HeroCarousel />
        </motion.div>

        {/* Mini Game */}
        <motion.div
          className="px-4 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <StickerGame />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="px-4 pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <GraffitiHeader size="sm" glowColor="yellow" className="text-center mb-4">
            ⚡ What You Can Do
          </GraffitiHeader>
          
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {[
              { icon: "🧥", title: "Custom Hoodies", color: "green" },
              { icon: "🔑", title: "Audio Keychains", color: "cyan" },
              { icon: "🎨", title: "AI Designs", color: "magenta" },
              { icon: "🎵", title: "Hype Playlists", color: "yellow" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`p-4 bg-card rounded-xl border-2 border-neon-${feature.color}/30 hover:border-neon-${feature.color} transition-all cursor-pointer group`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <span className="text-3xl block mb-2">{feature.icon}</span>
                <span className={`font-graffiti text-sm text-neon-${feature.color}`}>
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <NeonButton
            variant="green"
            size="lg"
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            <Sparkles size={20} className="mr-2" />
            Join the Empire
          </NeonButton>
        </motion.div>
      </div>
    </PageLayout>
  );
}
