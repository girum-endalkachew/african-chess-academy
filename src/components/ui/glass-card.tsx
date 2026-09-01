import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-[rgba(255,255,255,0.35)] backdrop-blur-[14px]",
        "border border-[rgba(255,255,255,0.65)]",
        "rounded-[18px] shadow-[0_12px_30px_rgba(50,70,100,0.08)]",
        hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(54,138,228,0.12)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}