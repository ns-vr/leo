import { useState } from "react";
import { motion } from "framer-motion";
import { Shirt, Music, KeyRound, Wand2, Video } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { MerchSection } from "@/components/dashboard/MerchSection";
import { PlaylistSection } from "@/components/dashboard/PlaylistSection";
import { KeychainSection } from "@/components/dashboard/KeychainSection";
import { AIToolsSection } from "@/components/dashboard/AIToolsSection";
import { YourWordsSection } from "@/components/dashboard/YourWordsSection";

const tabs = [
  { id: "merch", label: "Merch", icon: Shirt, color: "green" as const },
  { id: "playlists", label: "Playlists", icon: Music, color: "cyan" as const },
  { id: "keychains", label: "Keychains", icon: KeyRound, color: "magenta" as const },
  { id: "yourwords", label: "Your Words", icon: Video, color: "magenta" as const },
  { id: "ai", label: "AI Tools", icon: Wand2, color: "yellow" as const },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("merch");

  return (
    <PageLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GraffitiHeader size="md" glowColor="green" underline>
            Your Empire
          </GraffitiHeader>
          <p className="text-muted-foreground font-mono mt-2">
            Design, customize, and dominate the streets
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-graffiti text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? `bg-neon-${tab.color} text-black box-glow-${tab.color}`
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "merch" && <MerchSection />}
          {activeTab === "playlists" && <PlaylistSection />}
          {activeTab === "keychains" && <KeychainSection />}
          {activeTab === "yourwords" && <YourWordsSection />}
          {activeTab === "ai" && <AIToolsSection />}
        </motion.div>
      </div>
    </PageLayout>
  );
}
