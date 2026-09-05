"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function RubiksLoader({ label = "Solving ACA..." }: { label?: string }) {
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSolved(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* 3D Rubik's Cube CSS Scene */}
      <div className="perspective-800 w-24 h-24 relative flex items-center justify-center">
        <div className={cn(
          "w-16 h-16 relative transform-style-3d animate-rubik-rotate transition-all duration-1000"
        )}>
          {/* 3x3 Faces Grid */}
          <div className="grid grid-cols-3 gap-1 w-16 h-16 p-1 rounded-xl bg-[#0B1528] shadow-2xl border border-white/60">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-sm transition-colors duration-700 ease-in-out",
                  solved
                    ? "bg-[#368AE4]" // Solved: uniform ACA Blue
                    : [
                        "bg-[#368AE4]", "bg-amber-400", "bg-emerald-500",
                        "bg-red-500", "bg-white", "bg-amber-400",
                        "bg-emerald-500", "bg-[#368AE4]", "bg-red-500"
                      ][i]
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-extrabold text-[#0B1528] tracking-tight">{label}</p>
        <p className="text-[11px] font-bold text-[#64748B]">
          {solved ? "✓ Position Analyzed" : "Scrambling tactics → Solving..."}
        </p>
      </div>

      <style jsx global>{`
        .perspective-800 {
          perspective: 800px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes rubikRotate {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          33% {
            transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg);
          }
          66% {
            transform: rotateX(270deg) rotateY(270deg) rotateZ(180deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }
        .animate-rubik-rotate {
          animation: rubikRotate 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
