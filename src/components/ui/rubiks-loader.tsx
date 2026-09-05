"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function RubiksLoader({ label = "Loading ACA..." }: { label?: string }) {
  const [phase, setPhase] = useState<"scramble" | "solve" | "done">("scramble");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("solve"), 1000);
    const t2 = setTimeout(() => setPhase("done"), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const faces = [
    { name: "front", color: "bg-[#368AE4]" },
    { name: "back", color: "bg-emerald-500" },
    { name: "right", color: "bg-amber-400" },
    { name: "left", color: "bg-red-500" },
    { name: "top", color: "bg-white" },
    { name: "bottom", color: "bg-orange-500" },
  ] as const;

  const scrambleColors = [
    "bg-[#368AE4]", "bg-amber-400", "bg-red-500",
    "bg-emerald-500", "bg-white", "bg-orange-500",
    "bg-red-500", "bg-[#368AE4]", "bg-amber-400",
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-20">
      <div className="rubik-scene">
        <div
          className={cn(
            "rubik-cube",
            phase === "scramble" && "rubik-scramble",
            phase === "solve" && "rubik-solve",
            phase === "done" && "rubik-done"
          )}
        >
          {faces.map((face, fIdx) => (
            <div key={face.name} className={cn("rubik-face", face.name)}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rubik-sticker transition-colors duration-700",
                    phase === "scramble"
                      ? scrambleColors[(fIdx * 3 + i) % scrambleColors.length]
                      : face.color
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-extrabold text-[#0B1528] tracking-tight">{label}</p>
        <p className="text-[11px] font-bold text-[#64748B]">
          {phase === "scramble" && "Scrambling positions..."}
          {phase === "solve" && "Solving the cube..."}
          {phase === "done" && "✓ Ready to play"}
        </p>
      </div>

      <style jsx>{`
        .rubik-scene {
          width: 84px;
          height: 84px;
          perspective: 900px;
        }
        .rubik-cube {
          width: 84px;
          height: 84px;
          position: relative;
          transform-style: preserve-3d;
        }
        .rubik-face {
          position: absolute;
          width: 84px;
          height: 84px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 3px;
          padding: 4px;
          border-radius: 8px;
          background: #0B1528;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
        }
        .rubik-sticker {
          border-radius: 3px;
          box-shadow: inset 0 0 6px rgba(0,0,0,0.15);
        }
        .front  { transform: rotateY(0deg) translateZ(42px); }
        .back   { transform: rotateY(180deg) translateZ(42px); }
        .right  { transform: rotateY(90deg) translateZ(42px); }
        .left   { transform: rotateY(-90deg) translateZ(42px); }
        .top    { transform: rotateX(90deg) translateZ(42px); }
        .bottom { transform: rotateX(-90deg) translateZ(42px); }

        @keyframes rubikScramble {
          0%   { transform: rotateX(-20deg) rotateY(20deg); }
          25%  { transform: rotateX(200deg) rotateY(140deg) rotateZ(40deg); }
          50%  { transform: rotateX(80deg) rotateY(320deg) rotateZ(-60deg); }
          75%  { transform: rotateX(-120deg) rotateY(200deg) rotateZ(90deg); }
          100% { transform: rotateX(340deg) rotateY(380deg) rotateZ(0deg); }
        }
        .rubik-scramble {
          animation: rubikScramble 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .rubik-solve {
          transform: rotateX(-28deg) rotateY(-42deg);
          transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .rubik-done {
          transform: rotateX(-28deg) rotateY(-42deg);
          animation: rubikIdle 4s ease-in-out infinite;
        }
        @keyframes rubikIdle {
          0%, 100% { transform: rotateX(-28deg) rotateY(-42deg); }
          50% { transform: rotateX(-22deg) rotateY(-28deg); }
        }
      `}</style>
    </div>
  );
}
