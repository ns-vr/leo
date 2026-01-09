import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Wand2, Download, Share2, Sparkles, Loader2 } from "lucide-react";
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
  const [selectedStyle, setSelectedStyle] = useState("neon-green");
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

  const handleGenerate = async () => {
    if (!uploadedImage && !prompt) {
      toast.error("Upload an image or enter a prompt first!");
      return;
    }

    setIsProcessing(true);
    setGeneratedImages([]);

    try {
      if (selectedTool === "design" && uploadedImage) {
        // Use neonify endpoint for image transformation
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/neonify-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ imageBase64: uploadedImage }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Transformation failed");
        }

        if (data.image) {
          setGeneratedImages([data.image]);
          toast.success("Design generated! 🔥", {
            style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" },
          });
        } else {
          toast.info(data.textResponse || "No image generated", {
            style: { background: "#0A0A0A", border: "2px solid #FFFF00", color: "#FFFF00" },
          });
        }
      } else {
        // Use generate-design endpoint for text-to-image
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-design`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ 
              prompt: prompt || "neon skull with glowing eyes",
              style: selectedStyle 
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Generation failed");
        }

        if (data.image) {
          setGeneratedImages([data.image]);
          toast.success(data.message || "Design generated! 🎨", {
            style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" },
          });
        } else {
          toast.info(data.textResponse || "No image generated", {
            style: { background: "#0A0A0A", border: "2px solid #FFFF00", color: "#FFFF00" },
          });
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Generation failed", {
        style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `leo-design-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Design downloaded! 📥");
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
                      className="absolute top-2 right-2 p-2 bg-background/80 rounded-full text-destructive hover:bg-destructive hover:text-white transition-colors"
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
                      ? "Describe your design: neon skull with roses, cyberpunk tiger, glitch art roses..."
                      : "Click mic and describe your vision..."
                  }
                  className="w-full h-24 px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono text-sm resize-none focus:outline-none focus:border-neon-cyan transition-all"
                />
              </div>
            )}

            {/* Style Options */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { id: "neon-green", label: "Neon Green" },
                { id: "cyber-blue", label: "Cyber Blue" },
                { id: "pink-glitch", label: "Pink Glitch" },
                { id: "yellow-fire", label: "Yellow Fire" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                    selectedStyle === style.id
                      ? "bg-neon-magenta text-black"
                      : "bg-muted hover:bg-neon-magenta/20 hover:text-neon-magenta"
                  }`}
                >
                  {style.label}
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
                  <Loader2 className="animate-spin" size={18} />
                  AI Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 size={18} />
                  Generate Design
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
          <div className="grid grid-cols-1 gap-4">
            {generatedImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <NeonCard glowColor="green" className="p-0 overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={img}
                      alt={`Generated ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => downloadImage(img, i)}
                      className="p-3 bg-neon-green rounded-lg text-black hover:scale-110 transition-transform"
                    >
                      <Download size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(img);
                        toast.success("Image URL copied!");
                      }}
                      className="p-3 bg-neon-cyan rounded-lg text-black hover:scale-110 transition-transform"
                    >
                      <Share2 size={20} />
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
