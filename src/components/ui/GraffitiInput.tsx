import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GraffitiInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const GraffitiInput = forwardRef<HTMLInputElement, GraffitiInputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="font-graffiti text-lg text-neon-cyan tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-muted/50 border-2 border-border rounded-lg",
              "font-mono text-foreground placeholder:text-muted-foreground",
              "transition-all duration-300",
              "focus:outline-none focus:border-neon-green focus:box-glow-green",
              "hover:border-neon-green/50",
              icon && "pl-12",
              error && "border-destructive focus:border-destructive",
              className
            )}
            {...props}
          />
          {/* Spray paint corner effect */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green/20 rounded-full blur-sm" />
        </div>
        {error && (
          <p className="text-sm text-destructive font-mono animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

GraffitiInput.displayName = "GraffitiInput";

export { GraffitiInput };
