import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showNav?: boolean;
}

export function PageLayout({ children, className, showNav = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background graffiti-bg relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-30 z-50" />
      
      {/* Main content */}
      <main className={cn(
        "relative z-10",
        showNav && "pb-24",
        className
      )}>
        {children}
      </main>
      
      {showNav && <BottomNav />}
    </div>
  );
}
