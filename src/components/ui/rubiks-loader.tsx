"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function RubiksLoader({ label = "Loading ACA..." }: { label?: string }) {
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    // Cube solves itself after 3.5 seconds
    const timer = setTimeout(() => setSolved(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // 6 faces of a Rubik's cube, mapped to ACA colors + standard cube colors
  const faces = ["front", "back", "right", "left", "top", "bottom"];
  const colors = [
    "bg-[#368AE4]", // ACA Blue
    "bg-emerald-500", 
    "bg-amber-400", 
    "bg-red-500", 
    "bg-white", 
    "bg-purple-500"
  ];

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-12">
      <div className="cube-scene">
        <div className={cn("cube", solved ? "animate-cube-solve" : "animate-cube-scramble")}>
          {faces.map((face, fIdx) => (
            <div key={face} className={`face ${face}`}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-full h-full rounded-[2px] transition-colors duration-1000 shadow-inner",
                    // When solved, each face gets 1 solid color. When scrambled, colors are mixed.
                    solved ? colors[fIdx] : colors[(fIdx + i * 3) % 6]
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-1 z-10">
        <p className="text-sm font-extrabold text-[#0B1528] tracking-tight">{label}</p>
        <p className="text-[11px] font-bold text-[#64748B]">
          {solved ? "✓ Ready" : "Calculating positions..."}
        </p>
      </div>

      <style jsx>{`
        .cube-scene {
          width: 72px;
          height: 72px;
          perspective: 800px;
          margin: 0 auto;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        .face {
          position: absolute;
          width: 72px;
          height: 72px;
          background: #0B1528;
          border-radius: 6px;
          padding: 3px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
        }
        /* Position the 6 faces in 3D space */
        .front  { transform: translateZ(36px); }
        .back   { transform: rotateY(180deg) translateZ(36px); }
        .right  { transform: rotateY(90deg) translateZ(36px); }
        .left   { transform: rotateY(-90deg) translateZ(36px); }
        .top    { transform: rotateX(90deg) translateZ(36px); }
        .bottom { transform: rotateX(-90deg) translateZ(36px); }

        /* Scrambled spinning animation */
        @keyframes scramble {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(1080deg) rotateY(720deg) rotateZ(360deg); }
        }
        .animate-cube-scramble {
          animation: scramble 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Snap to beautiful isometric solved angle */
        .animate-cube-solve {
          transform: rotateX(-25deg) rotateY(-45deg) rotateZ(0deg);
          transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
