import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Wand2, Download, Share2, Sparkles } from "lucide-react";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { toast } from "sonner";

const aiFeatures = [
  { id: "design", name: "Image to Design", icon: "🎨", desc: "Transform any image to neon art" },
  { id: "generate", name: "AI Generate", icon: "✨", desc: "Create designs from text prompts" },
  { id: "video", name: "Animate Art", icon: "🎬", desc: "Bring your designs to life" },
  { id: "voice", name: "Voice to Art", icon: "🎤", desc: "Describe and we create" },
];

export function AIToolsSection() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!uploadedImage && !prompt) {
      toast.error("Upload an image or enter a prompt first!");
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedImages([
        uploadedImage || "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=400&fit=crop",
      ]);
      setIsProcessing(false);
      toast.success("Designs generated! 🔥", {
        style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" },
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Tools Grid */}
      <div className="grid grid-cols-2 gap-3">
        {aiFeatures.map((feature, i) => (
          <motion.button
            key={feature.id}
            onClick={() => setSelectedTool(feature.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedTool === feature.id
                ? "border-neon-green bg-neon-green/10"
                : "border-border hover:border-neon-green/50"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-2xl mb-2 block">{feature.icon}</span>
            <h4 className="font-graffiti text-sm text-neon-green">{feature.name}</h4>
            <p className="text-xs text-muted-foreground font-mono mt-1">{feature.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Selected Tool Interface */}
      {selectedTool && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NeonCard glowColor="green">
            <GraffitiHeader size="sm" glowColor="cyan" className="mb-4">
              {selectedTool === "design" && "🎨 Image to Neon Design"}
              {selectedTool === "generate" && "✨ AI Generate"}
              {selectedTool === "video" && "🎬 Animate Art"}
              {selectedTool === "voice" && "🎤 Voice to Art"}
            </GraffitiHeader>

            {/* Upload Area */}
            {(selectedTool === "design" || selectedTool === "video") && (
              <div className="mb-4">
                {uploadedImage ? (
                  <div className="relative aspect-square max-w-xs mx-auto rounded-xl overflow-hidden">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 p-2 bg-background/80 rounded-full text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video max-w-sm mx-auto rounded-xl border-2 border-dashed border-neon-cyan/50 flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all"
                  >
                    <Upload size={32} className="text-neon-cyan mb-2" />
                    <p className="text-sm text-muted-foreground font-mono">Click to upload image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Prompt Input */}
            {(selectedTool === "generate" || selectedTool === "voice") && (
              <div className="mb-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    selectedTool === "generate"
                      ? "Describe your design: neon skull with roses, cyberpunk style..."
                      : "Click mic and describe your vision..."
                  }
                  className="w-full h-24 px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono text-sm resize-none focus:outline-none focus:border-neon-cyan"
                />
              </div>
            )}

            {/* Style Options */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Neon Green", "Cyber Blue", "Pink Glitch", "Yellow Fire"].map((style) => (
                <button
                  key={style}
                  className="px-3 py-1.5 bg-muted rounded-full text-xs font-mono hover:bg-neon-magenta/20 hover:text-neon-magenta transition-all"
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <NeonButton
              variant="green"
              className="w-full"
              onClick={handleGenerate}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="animate-spin" size={18} />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 size={18} />
                  Generate Designs
                </span>
              )}
            </NeonButton>
          </NeonCard>
        </motion.div>
      )}

      {/* Generated Results */}
      {generatedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GraffitiHeader size="sm" glowColor="magenta" className="mb-3">
            Generated Designs ✨
          </GraffitiHeader>
          <div className="grid grid-cols-3 gap-3">
            {generatedImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <NeonCard glowColor={["green", "cyan", "magenta"][i] as any} className="p-0 overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={img}
                      alt={`Generated ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: `hue-rotate(${i * 60}deg) saturate(1.5)` }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-neon-green rounded-lg text-black">
                      <Download size={16} />
                    </button>
                    <button className="p-2 bg-neon-cyan rounded-lg text-black">
                      <Share2 size={16} />
                    </button>
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
