import { motion } from "framer-motion";
import { ShoppingBag, Palette } from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";

const merchItems = [
  {
    id: 1,
    name: "Neon Skull Hoodie",
    price: 89,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    color: "green" as const,
  },
  {
    id: 2,
    name: "Cyber Tiger Jacket",
    price: 129,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
    color: "cyan" as const,
  },
  {
    id: 3,
    name: "Glitch Roses Tee",
    price: 49,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    color: "magenta" as const,
  },
  {
    id: 4,
    name: "Street King Vest",
    price: 79,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    color: "yellow" as const,
  },
];

export function MerchSection() {
  return (
    <div className="space-y-6">
      {/* Custom Design CTA */}
      <NeonCard glowColor="magenta" className="bg-gradient-to-r from-neon-magenta/10 to-neon-cyan/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-graffiti text-xl text-neon-magenta">Custom Jacket</h3>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              Upload your art, we neonify it 🔥
            </p>
          </div>
          <NeonButton variant="magenta" size="sm">
            <Palette size={18} className="mr-2" />
            Create
          </NeonButton>
        </div>
      </NeonCard>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {merchItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard glowColor={item.color} className="p-0 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className={`font-graffiti text-sm text-neon-${item.color} truncate`}>
                  {item.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-lg">${item.price}</span>
                  <button className={`p-2 rounded-lg bg-neon-${item.color}/20 text-neon-${item.color} hover:bg-neon-${item.color}/30 transition-colors`}>
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
