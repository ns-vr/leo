import { motion } from "framer-motion";
import { User, Package, Trophy, Settings, LogOut, Edit3 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Orders", value: "12", icon: Package, color: "green" as const },
  { label: "Points", value: "2,450", icon: Trophy, color: "yellow" as const },
  { label: "Designs", value: "8", icon: Edit3, color: "cyan" as const },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="p-4 pt-6">
        {/* Profile Header */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-neon p-1">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <User size={40} className="text-neon-green" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-neon-magenta rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
              <Edit3 size={14} />
            </button>
          </div>
          
          <GraffitiHeader size="md" glowColor="green">
            Street Artist
          </GraffitiHeader>
          <p className="text-muted-foreground font-mono">@streetking</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <NeonCard key={stat.label} glowColor={stat.color} className="text-center p-4">
                <Icon size={24} className={`mx-auto mb-2 text-neon-${stat.color}`} />
                <div className={`font-graffiti text-2xl text-neon-${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {stat.label}
                </div>
              </NeonCard>
            );
          })}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border-2 border-border hover:border-neon-green transition-all group">
            <Package className="text-neon-green group-hover:text-glow-green" size={24} />
            <div className="text-left flex-1">
              <div className="font-graffiti text-lg">Order History</div>
              <div className="text-xs text-muted-foreground font-mono">Track your street gear</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border-2 border-border hover:border-neon-cyan transition-all group">
            <Settings className="text-neon-cyan group-hover:text-glow-cyan" size={24} />
            <div className="text-left flex-1">
              <div className="font-graffiti text-lg">Settings</div>
              <div className="text-xs text-muted-foreground font-mono">Customize your experience</div>
            </div>
          </button>

          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border-2 border-border hover:border-destructive transition-all group"
          >
            <LogOut className="text-destructive" size={24} />
            <div className="text-left flex-1">
              <div className="font-graffiti text-lg text-destructive">Log Out</div>
              <div className="text-xs text-muted-foreground font-mono">Peace out ✌️</div>
            </div>
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
}
