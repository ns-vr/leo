import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/chat", icon: MessageCircle, label: "AI Chat" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t-2 border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-neon-green text-glow-green scale-110" 
                  : "text-muted-foreground hover:text-neon-cyan"
              )}
            >
              <Icon 
                size={24} 
                className={cn(
                  "transition-transform duration-300",
                  isActive && "animate-bounce-subtle"
                )} 
              />
              <span className="text-xs font-mono tracking-wide">
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 w-1 h-1 bg-neon-green rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
