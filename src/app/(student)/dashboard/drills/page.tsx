"use client";

import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target, Eye, Brain, Zap, Play, CheckCircle2,
  XCircle, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

type DrillMode = "coordinates" | "color" | "knight" | "blindfold";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

function getRandomSquare(): string {
  const f = FILES[Math.floor(Math.random() * 8)];
  const r = RANKS[Math.floor(Math.random() * 8)];
  return `${f}${r}`;
}

function isDarkSquare(sq: string): boolean {
  const fileIdx = FILES.indexOf(sq[0]);
  const rankIdx = parseInt(sq[1], 10);
  return (fileIdx + rankIdx) % 2 === 0;
}

export default function DrillsPage() {
  const [activeTab, setActiveTab] = useState<DrillMode>("coordinates");

  const [coordTarget, setCoordTarget] = useState("e4");
  const [coordScore, setCoordScore] = useState(0);
  const [coordTimeLeft, setCoordTimeLeft] = useState(30);
  const [coordActive, setCoordActive] = useState(false);
  const [coordHighScore, setCoordHighScore] = useState(0);

  const [colorTarget, setColorTarget] = useState("c6");
  const [colorScore, setColorScore] = useState(0);
  const [colorAttempts, setColorAttempts] = useState(0);
  const [colorFeedback, setColorFeedback] = useState<"correct" | "wrong" | null>(null);

  const [blindStage, setBlindStage] = useState<"memorize" | "hidden" | "solved">("memorize");
  const [blindTimer, setBlindTimer] = useState(5);
  const [blindResult, setBlindResult] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (coordActive && coordTimeLeft > 0) {
      timer = setInterval(() => setCoordTimeLeft((t) => t - 1), 1000);
    } else if (coordTimeLeft === 0 && coordActive) {
      setCoordActive(false);
      if (coordScore > coordHighScore) setCoordHighScore(coordScore);
    }
    return () => clearInterval(timer);
  }, [coordActive, coordTimeLeft, coordScore, coordHighScore]);

  const startCoordGame = () => {
    setCoordScore(0);
    setCoordTimeLeft(30);
    setCoordTarget(getRandomSquare());
    setCoordActive(true);
  };

  const handleSquareClick = (sq: string) => {
    if (!coordActive) return;
    if (sq === coordTarget) {
      setCoordScore((s) => s + 1);
      setCoordTarget(getRandomSquare());
    }
  };

  const handleColorGuess = (guessDark: boolean) => {
    const isDark = isDarkSquare(colorTarget);
    setColorAttempts((a) => a + 1);
    if (guessDark === isDark) {
      setColorScore((s) => s + 1);
      setColorFeedback("correct");
    } else {
      setColorFeedback("wrong");
    }
    setTimeout(() => {
      setColorFeedback(null);
      setColorTarget(getRandomSquare());
    }, 400);
  };

  const startBlindTest = () => {
    setBlindStage("memorize");
    setBlindTimer(4);
    setBlindResult(null);
    const interval = setInterval(() => {
      setBlindTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setBlindStage("hidden");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Vision & Memory Drills</h1>
            <Badge variant="blue">Visual Intelligence</Badge>
          </div>
          <p className="text-xs text-[#64748B] font-medium">
            Train square coordinates, board colors, and blindfold calculation without looking at pieces.
          </p>
        </div>
        <Badge variant="accent" className="px-3 py-1.5 text-xs">
          <Trophy className="h-3.5 w-3.5 mr-1 text-amber-500" /> High Score: {coordHighScore}
        </Badge>
      </GlassCard>

      <div className="flex gap-2 border-b border-white/60 pb-1 overflow-x-auto">
        {[
          { id: "coordinates", label: "Coordinate Flash", icon: Target },
          { id: "color", label: "Color Memory", icon: Eye },
          { id: "knight", label: "Knight Trajectory", icon: Zap },
          { id: "blindfold", label: "Blindfold Board", icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DrillMode)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0",
                isActive
                  ? "bg-[#368AE4] text-white shadow-md"
                  : "bg-white/40 text-[#64748B] hover:bg-white/70 hover:text-[#0B1528]"
              )}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "coordinates" && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <GlassCard className="lg:col-span-7 p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">Target Square</p>
                <p className="text-4xl font-extrabold text-[#368AE4] tracking-tight">{coordTarget}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#64748B]">Time Left</p>
                <p className={cn("text-3xl font-extrabold", coordTimeLeft <= 5 ? "text-red-500" : "text-[#0B1528]")}>
                  {coordTimeLeft}s
                </p>
              </div>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden border border-white/80 shadow-md grid grid-cols-8 grid-rows-8 bg-[#EEF3FA]">
              {RANKS.map((r, rIdx) =>
                FILES.map((f, fIdx) => {
                  const sq = `${f}${r}`;
                  const isDark = (fIdx + rIdx) % 2 === 1;
                  return (
                    <button
                      key={sq}
                      onClick={() => handleSquareClick(sq)}
                      disabled={!coordActive}
                      className={cn(
                        "relative flex items-center justify-center font-bold text-[10px] transition active:scale-95",
                        isDark ? "bg-[#368AE4] text-white/80" : "bg-[#EAF2FB] text-[#0B1528]/80",
                        !coordActive && "cursor-not-allowed opacity-90"
                      )}
                    >
                      {(fIdx === 0 || rIdx === 7) && (
                        <span className="absolute bottom-0.5 left-1 text-[8px] opacity-40">{sq}</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </GlassCard>

          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-lg font-extrabold text-[#0B1528]">Speed Test</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Click target squares in 30 seconds.
              </p>
              <div className="p-4 rounded-2xl bg-white/50 border border-white/80 space-y-1">
                <p className="text-xs font-bold text-[#64748B]">Current Score</p>
                <p className="text-3xl font-extrabold text-[#0B1528]">{coordScore} squares</p>
              </div>

              {!coordActive ? (
                <Button variant="primary" className="w-full h-12 rounded-2xl" onClick={startCoordGame}>
                  <Play className="h-4 w-4" /> {coordTimeLeft === 0 ? "Play Again" : "Start 30s Speed Test"}
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-12 rounded-2xl" onClick={() => setCoordActive(false)}>
                  Stop Game
                </Button>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === "color" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <GlassCard className="p-8 text-center space-y-6">
            <Badge variant="blue">Square Color Memory</Badge>
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#64748B]">Is this square Light or Dark?</p>
              <p className="text-6xl font-extrabold text-[#0B1528] tracking-widest">{colorTarget}</p>
            </div>

            {colorFeedback && (
              <div className={cn(
                "p-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2",
                colorFeedback === "correct" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
              )}>
                {colorFeedback === "correct" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {colorFeedback === "correct" ? "Correct!" : `Wrong! ${colorTarget} is ${isDarkSquare(colorTarget) ? "Dark" : "Light"}`}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button
                variant="outline"
                className="h-16 rounded-2xl bg-[#EAF2FB] text-[#0B1528] font-extrabold text-lg border-2 border-slate-200 hover:bg-white"
                onClick={() => handleColorGuess(false)}
              >
                ⚪ Light Square
              </Button>
              <Button
                variant="primary"
                className="h-16 rounded-2xl bg-[#0B1528] text-white font-extrabold text-lg shadow-lg hover:bg-[#1E293B]"
                onClick={() => handleColorGuess(true)}
              >
                ⚫ Dark Square
              </Button>
            </div>

            <div className="pt-4 border-t border-white/60 flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span>Score: {colorScore} / {colorAttempts}</span>
              <span>Accuracy: {colorAttempts > 0 ? Math.round((colorScore / colorAttempts) * 100) : 100}%</span>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "knight" && (
        <GlassCard className="p-8 text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="accent">Knight Trajectory</Badge>
          <h2 className="text-xl font-extrabold text-[#0B1528]">Knight Minimum Hop Challenge</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            A knight starts on <span className="font-extrabold text-[#368AE4]">b1</span>. Minimum hops to <span className="font-extrabold text-[#368AE4]">f5</span>?
          </p>

          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto pt-4">
            {["2 hops", "3 hops", "4 hops", "5 hops"].map((opt, idx) => (
              <Button
                key={opt}
                variant="glass"
                className="h-12 rounded-2xl font-extrabold text-xs"
                onClick={() => alert(idx === 1 ? "✓ Correct! b1 -> c3 -> e4 -> f5 (3 hops)" : "Try again!")}
              >
                {opt}
              </Button>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === "blindfold" && (
        <GlassCard className="p-8 max-w-2xl mx-auto text-center space-y-6">
          <Badge variant="blue">Blindfold Memory Test</Badge>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-[#0B1528]">Position Recall</h2>
            <p className="text-xs text-[#64748B]">
              Memorize piece locations before the board vanishes!
            </p>
          </div>

          {blindStage === "memorize" && (
            <div className="p-6 rounded-3xl bg-[#368AE4]/10 border border-[#368AE4]/30 space-y-3">
              <p className="text-xs font-extrabold text-[#368AE4]">MEMORIZE THIS PIECE ({blindTimer}s left)</p>
              <div className="text-5xl font-extrabold text-[#0B1528]">♕ White Queen on d4</div>
            </div>
          )}

          {blindStage === "hidden" && (
            <div className="space-y-4">
              <p className="text-sm font-extrabold text-[#0B1528]">Where was the White Queen located?</p>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                {["d4", "e4", "d5", "c4"].map((sq) => (
                  <Button
                    key={sq}
                    variant="primary"
                    className="h-12 rounded-2xl font-extrabold text-sm"
                    onClick={() => {
                      if (sq === "d4") {
                        setBlindResult("✓ Perfect Recall! Queen was on d4.");
                      } else {
                        setBlindResult("Incorrect. Queen was on d4.");
                      }
                      setBlindStage("solved");
                    }}
                  >
                    Square {sq}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {blindStage === "solved" && (
            <div className="space-y-3">
              <p className="text-sm font-extrabold text-[#368AE4]">{blindResult}</p>
              <Button variant="outline" className="rounded-2xl h-11" onClick={startBlindTest}>
                Try Another Puzzle
              </Button>
            </div>
          )}

          {blindStage === "memorize" && blindTimer === 5 && (
            <Button variant="primary" className="rounded-2xl h-12 px-8" onClick={startBlindTest}>
              Start Blindfold Memory Test
            </Button>
          )}
        </GlassCard>
      )}
    </div>
  );
}
