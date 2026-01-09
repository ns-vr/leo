import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GraffitiInput } from "@/components/ui/GraffitiInput";
import { NeonButton } from "@/components/ui/NeonButton";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate auth (replace with actual auth later)
    setTimeout(() => {
      setLoading(false);
      toast.success(isLogin ? "Welcome back, street artist!" : "You're in the crew now!", {
        style: {
          background: "#0A0A0A",
          border: "2px solid #00FF41",
          color: "#00FF41",
        },
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <PageLayout showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 brick-wall">
        {/* Spray paint overlay */}
        <div className="absolute inset-0 spray-effect opacity-50" />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h1 className="font-graffiti text-6xl text-neon-green text-glow-green mb-2">
              LEO
            </h1>
            <GraffitiHeader size="sm" glowColor="cyan">
              Enter the Streets
            </GraffitiHeader>
          </motion.div>

          {/* Auth Form Card */}
          <motion.div
            className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 border-2 border-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tabs */}
            <div className="flex mb-6 bg-muted rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md font-graffiti text-lg transition-all ${
                  isLogin
                    ? "bg-neon-green text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md font-graffiti text-lg transition-all ${
                  !isLogin
                    ? "bg-neon-cyan text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <GraffitiInput
                    label="Street Name"
                    placeholder="Your crew name..."
                    icon={<User size={20} />}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <GraffitiInput
                label="Email"
                type="email"
                placeholder="your@email.com"
                icon={<Mail size={20} />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <div className="relative">
                <GraffitiInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-muted-foreground hover:text-neon-green transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <NeonButton
                type="submit"
                variant={isLogin ? "green" : "cyan"}
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? "Loading..." : isLogin ? "Enter" : "Join the Crew"}
              </NeonButton>
            </form>

            {/* Social Auth */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-mono">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-all hover:box-glow-magenta"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-mono text-sm">Google</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-all hover:box-glow-yellow"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                  <span className="font-mono text-sm">Apple</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Back button */}
          <motion.button
            onClick={() => navigate("/")}
            className="mt-6 text-center w-full text-muted-foreground hover:text-neon-green transition-colors font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ← Back to Home
          </motion.button>
        </motion.div>
      </div>
    </PageLayout>
  );
}
