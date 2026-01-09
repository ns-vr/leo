import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Mic, QrCode, Eye, ShoppingCart, X, Check, Play, Square } from "lucide-react";
import QRCode from "react-qr-code";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { toast } from "sonner";

type Step = "upload" | "neonify" | "audio" | "qr" | "preview" | "order";

const existingKeychains = [
  { id: 1, name: "Cyber Rose", image: "https://images.unsplash.com/photo-1518911710364-17ec553f6591?w=200&h=200&fit=crop" },
  { id: 2, name: "Street Lion", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { id: 3, name: "Neon Crown", image: "https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=200&h=200&fit=crop" },
];

export function KeychainSection() {
  const [step, setStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [neonifiedImage, setNeonifiedImage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showCustomFlow, setShowCustomFlow] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setStep("neonify");
        toast.success("Image uploaded! Let's neonify it 🔥", {
          style: { background: "#0A0A0A", border: "2px solid #00FF41", color: "#00FF41" },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNeonify = () => {
    // Simulate AI neonification
    setTimeout(() => {
      setNeonifiedImage(uploadedImage);
      setStep("audio");
      toast.success("Design neonified! 💀 Now add your audio", {
        style: { background: "#0A0A0A", border: "2px solid #00D4FF", color: "#00D4FF" },
      });
    }, 1500);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setStep("qr");
      toast.success("Audio ready! Generating QR code...", {
        style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" },
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate recorded audio
      setAudioUrl("recorded-audio.mp3");
      setStep("qr");
      toast.success("Audio recorded! Generating QR code...", {
        style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" },
      });
    } else {
      setIsRecording(true);
      toast("Recording... 🎤", {
        style: { background: "#0A0A0A", border: "2px solid #FFFF00", color: "#FFFF00" },
      });
    }
  };

  const generateQR = () => {
    setStep("preview");
  };

  const resetFlow = () => {
    setStep("upload");
    setUploadedImage(null);
    setNeonifiedImage(null);
    setAudioUrl(null);
    setShowCustomFlow(false);
  };

  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 mx-auto mb-4 rounded-2xl border-2 border-dashed border-neon-green/50 flex items-center justify-center cursor-pointer hover:border-neon-green hover:bg-neon-green/10 transition-all"
            >
              <Upload size={40} className="text-neon-green" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="font-graffiti text-xl text-neon-green mb-2">Upload Your Image</p>
            <p className="text-sm text-muted-foreground font-mono">
              We'll transform it into neon street art
            </p>
          </motion.div>
        );

      case "neonify":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-xl overflow-hidden">
              <img src={uploadedImage!} alt="Uploaded" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neon-green/30 to-transparent" />
            </div>
            <NeonButton variant="cyan" onClick={handleNeonify}>
              <span className="animate-pulse">✨</span> Neonify It!
            </NeonButton>
          </motion.div>
        );

      case "audio":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <div className="flex-1 relative w-24 h-24 rounded-xl overflow-hidden">
                <img src={neonifiedImage!} alt="Neonified" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/50 to-neon-magenta/30 mix-blend-overlay" />
              </div>
              <div className="flex-1">
                <p className="font-graffiti text-lg text-neon-magenta mb-2">Add Audio</p>
                <p className="text-xs text-muted-foreground font-mono">
                  Record a message or upload audio
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleRecording}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isRecording
                    ? "border-destructive bg-destructive/20"
                    : "border-neon-yellow/50 hover:border-neon-yellow"
                }`}
              >
                {isRecording ? (
                  <Square size={24} className="mx-auto text-destructive mb-2" />
                ) : (
                  <Mic size={24} className="mx-auto text-neon-yellow mb-2" />
                )}
                <span className="text-sm font-mono">
                  {isRecording ? "Stop" : "Record"}
                </span>
              </button>

              <button
                onClick={() => audioInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-neon-magenta/50 hover:border-neon-magenta transition-all"
              >
                <Upload size={24} className="mx-auto text-neon-magenta mb-2" />
                <span className="text-sm font-mono">Upload</span>
              </button>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </div>
          </motion.div>
        );

      case "qr":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="bg-white p-4 rounded-xl w-fit mx-auto mb-4">
              <QRCode
                value={audioUrl || "https://leo.app/keychain/audio/123"}
                size={120}
                level="H"
              />
            </div>
            <p className="font-graffiti text-lg text-neon-cyan mb-2">QR Generated!</p>
            <p className="text-xs text-muted-foreground font-mono mb-4">
              Scan to play your audio message
            </p>
            <NeonButton variant="magenta" onClick={generateQR}>
              <Eye size={18} className="mr-2" /> Preview Keychain
            </NeonButton>
          </motion.div>
        );

      case "preview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="relative w-48 h-64 mx-auto mb-4">
              {/* Keychain mockup */}
              <div className="absolute inset-0 bg-card rounded-2xl border-2 border-neon-green/50 overflow-hidden">
                <div className="h-3/5 overflow-hidden">
                  <img
                    src={neonifiedImage!}
                    alt="Keychain"
                    className="w-full h-full object-cover"
                    style={{ filter: "saturate(1.5) contrast(1.2)" }}
                  />
                  <div className="absolute inset-0 h-3/5 bg-gradient-to-b from-neon-green/20 via-transparent to-neon-magenta/20" />
                </div>
                <div className="h-2/5 flex items-center justify-center p-2">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCode
                      value={audioUrl || "https://leo.app/keychain/audio/123"}
                      size={60}
                      level="H"
                    />
                  </div>
                </div>
              </div>
              {/* Keychain ring */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 border-4 border-neon-green rounded-full" />
            </div>

            <p className="font-graffiti text-xl text-neon-green mb-4">Your Custom Keychain 🔥</p>

            <div className="grid grid-cols-2 gap-3">
              <NeonButton variant="cyan" onClick={() => setStep("order")}>
                <ShoppingCart size={18} className="mr-2" /> Order Now
              </NeonButton>
              <NeonButton variant="yellow" onClick={resetFlow}>
                Start Over
              </NeonButton>
            </div>
          </motion.div>
        );

      case "order":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
              <Check size={40} className="text-neon-green" />
            </div>
            <GraffitiHeader size="md" glowColor="green">
              Order Placed! 🎉
            </GraffitiHeader>
            <p className="text-muted-foreground font-mono mt-2 mb-6">
              Your custom keychain is being crafted
            </p>
            <NeonButton variant="cyan" onClick={resetFlow}>
              Create Another
            </NeonButton>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Custom CTA */}
      {!showCustomFlow && (
        <NeonCard glowColor="magenta" className="bg-gradient-to-r from-neon-magenta/10 to-neon-yellow/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-graffiti text-xl text-neon-magenta">Custom Keychain</h3>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                Image + Audio + QR = Fire 🔥
              </p>
            </div>
            <NeonButton variant="magenta" size="sm" onClick={() => setShowCustomFlow(true)}>
              <QrCode size={18} className="mr-2" />
              Create
            </NeonButton>
          </div>
        </NeonCard>
      )}

      {/* Custom Flow */}
      <AnimatePresence>
        {showCustomFlow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <NeonCard glowColor="magenta">
              <div className="flex items-center justify-between mb-4">
                <GraffitiHeader size="sm" glowColor="magenta">
                  Custom Keychain
                </GraffitiHeader>
                <button onClick={resetFlow} className="text-muted-foreground hover:text-destructive">
                  <X size={20} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6 px-4">
                {["upload", "neonify", "audio", "qr", "preview"].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                        ["upload", "neonify", "audio", "qr", "preview", "order"].indexOf(step) >= i
                          ? "bg-neon-green text-black"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < 4 && (
                      <div
                        className={`w-8 h-0.5 ${
                          ["upload", "neonify", "audio", "qr", "preview", "order"].indexOf(step) > i
                            ? "bg-neon-green"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {renderStep()}
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Keychains */}
      <div>
        <GraffitiHeader size="sm" glowColor="yellow" className="mb-3">
          Popular Designs
        </GraffitiHeader>
        <div className="grid grid-cols-3 gap-3">
          {existingKeychains.map((keychain, i) => (
            <motion.div
              key={keychain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard glowColor="yellow" className="p-2">
                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                  <img
                    src={keychain.image}
                    alt={keychain.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-graffiti text-neon-yellow truncate">
                  {keychain.name}
                </p>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
