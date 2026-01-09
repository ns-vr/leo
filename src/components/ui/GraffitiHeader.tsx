import { cn } from "@/lib/utils";

interface GraffitiHeaderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "green" | "cyan" | "magenta" | "yellow";
  size?: "sm" | "md" | "lg" | "xl";
  underline?: boolean;
}

export function GraffitiHeader({
  children,
  className,
  glowColor = "green",
  size = "lg",
  underline = false,
}: GraffitiHeaderProps) {
  const glowClasses = {
    green: "text-glow-green text-neon-green",
    cyan: "text-glow-cyan text-neon-cyan",
    magenta: "text-glow-magenta text-neon-magenta",
    yellow: "text-glow-yellow text-neon-yellow",
  };

  const sizeClasses = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl lg:text-5xl",
    xl: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  };

  return (
    <h1
      className={cn(
        "font-graffiti tracking-wider uppercase",
        sizeClasses[size],
        glowClasses[glowColor],
        underline && "neon-underline pb-2",
        className
      )}
    >
      {children}
    </h1>
  );
}
