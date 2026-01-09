import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "green" | "cyan" | "magenta" | "yellow";
  hover?: boolean;
}

export function NeonCard({ 
  children, 
  className, 
  glowColor = "green",
  hover = true 
}: NeonCardProps) {
  const glowClasses = {
    green: "hover:box-glow-green border-neon-green/30",
    cyan: "hover:box-glow-cyan border-neon-cyan/30",
    magenta: "hover:box-glow-magenta border-neon-magenta/30",
    yellow: "hover:box-glow-yellow border-neon-yellow/30",
  };

  return (
    <div
      className={cn(
        "relative bg-card border-2 rounded-xl p-6",
        "transition-all duration-300",
        "spray-effect",
        hover && "hover:scale-[1.02] hover:-translate-y-1",
        glowClasses[glowColor],
        className
      )}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-magenta rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-yellow rounded-br-lg" />
      
      {children}
    </div>
  );
}
