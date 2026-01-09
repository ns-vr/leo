import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "cyan" | "magenta" | "yellow";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "green", size = "md", glow = true, children, ...props }, ref) => {
    const variants = {
      green: "bg-neon-green text-black hover:bg-neon-green/90 box-glow-green",
      cyan: "bg-neon-cyan text-black hover:bg-neon-cyan/90 box-glow-cyan",
      magenta: "bg-neon-magenta text-black hover:bg-neon-magenta/90 box-glow-magenta",
      yellow: "bg-neon-yellow text-black hover:bg-neon-yellow/90 box-glow-yellow",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-graffiti tracking-wider uppercase transition-all duration-300",
          "border-2 border-transparent rounded-lg",
          "transform hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variants[variant],
          sizes[size],
          glow && "animate-pulse-neon",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export { NeonButton };
