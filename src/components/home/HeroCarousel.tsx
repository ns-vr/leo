import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

interface MerchItem {
  id: number;
  name: string;
  image: string;
  price: number;
  color: "green" | "cyan" | "magenta" | "yellow";
}

const merchItems: MerchItem[] = [
  {
    id: 1,
    name: "Neon Skull Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
    price: 89,
    color: "green",
  },
  {
    id: 2,
    name: "Cyber Tiger Jacket",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop",
    price: 129,
    color: "cyan",
  },
  {
    id: 3,
    name: "Glitch Roses Tee",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
    price: 49,
    color: "magenta",
  },
  {
    id: 4,
    name: "Street King Vest",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
    price: 79,
    color: "yellow",
  },
  {
    id: 5,
    name: "Urban Legend Bomber",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
    price: 159,
    color: "green",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % merchItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => {
      if (dir === 1) return (prev + 1) % merchItems.length;
      return prev === 0 ? merchItems.length - 1 : prev - 1;
    });
  };

  const item = merchItems[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const glowClasses = {
    green: "box-glow-green",
    cyan: "box-glow-cyan",
    magenta: "box-glow-magenta",
    yellow: "box-glow-yellow",
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main carousel */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-card border-2 border-border">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {/* Neon overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent`} />
            
            {/* Product info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h3
                className={`font-graffiti text-2xl text-neon-${item.color} text-glow-${item.color}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {item.name}
              </motion.h3>
              <motion.div
                className="flex items-center justify-between mt-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-mono text-2xl text-foreground">
                  ${item.price}
                </span>
                <NeonButton variant={item.color} size="sm">
                  <ShoppingBag size={18} className="mr-2" />
                  Cop Now
                </NeonButton>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full text-neon-green hover:box-glow-green transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full text-neon-green hover:box-glow-green transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {merchItems.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-neon-green box-glow-green"
                : "bg-muted hover:bg-neon-green/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
