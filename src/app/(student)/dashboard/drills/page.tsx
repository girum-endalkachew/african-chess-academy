"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Brain, Zap, Play, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type DrillMode = "coordinates" | "color" | "knight" | "blindfold";
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

function getRandomSquare() {
  return `${FILES[Math.floor(Math.random() * 8)]}${RANKS[Math.floor(Math.random() * 8)]}`;
}
function isDarkSquare(sq: string) {
  return (FILES.indexOf(sq[0]) + parseInt(sq[1], 10)) % 2 === 0;
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
  const [blindStage, setBlindStage] = useState<"ready" | "memorize" | "hidden" | "solved">("ready");
  const [blindTimer, setBlindTimer] = useState(4);
  const [blindResult, setBlindResult] = useState<string | null>(null);

  useEffect(() => {
    if (!coordActive || coordTimeLeft <= 0) {
      if (coordActive && coordTimeLeft === 0) {
        setCoordActive(false);
        if (coordScore > coordHighScore) setCoordHighScore(coordScore);
      }
      return;
    }
    const t = setInterval(() => setCoordTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [coordActive, coordTimeLeft, coordScore, coordHighScore]);

  const startCoord = () => {
    setCoordScore(0);
    setCoordTimeLeft(30);
    setCoordTarget(getRandomSquare());
    setCoordActive(true);
  };

  const startBlind = () => {
    setBlindStage("memorize");
    setBlindTimer(4);
    setBlindResult(null);
    const id = setInterval(() => {
      setBlindTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
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
            Train coordinates, colors, knight paths, and blindfold memory.
          </p>
        </div>
        <Badge variant="accent" className="px-3 py-1.5 text-xs">
          <Trophy className="h-3.5 w-3.5 mr-1 text-amber-500" /> High Score: {coordHighScore}
        </Badge>
      </GlassCard>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "coordinates", label: "Coordinate Flash", icon: Target },
          { id: "color", label: "Color Memory", icon: Eye },
          { id: "knight", label: "Knight Trajectory", icon: Zap },
          { id: "blindfold", label: "Blindfold Board", icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DrillMode)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0",
                activeTab === tab.id
                  ? "bg-[#368AE4] text-white shadow-md"
                  : "bg-white/50 text-[#64748B] hover:bg-white/80"
              )}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "coordinates" && (
        <div className="grid lg:grid-cols-12 gap-6">
          <GlassCard className="lg:col-span-7 p-5 space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">Target</p>
                <p className="text-4xl font-extrabold text-[#368AE4]">{coordTarget}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#64748B]">Time</p>
                <p className={cn("text-3xl font-extrabold", coordTimeLeft <= 5 ? "text-red-500" : "text-[#0B1528]")}>{coordTimeLeft}s</p>
              </div>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/70 grid grid-cols-8 grid-rows-8">
              {RANKS.map((r, rIdx) =>
                FILES.map((f, fIdx) => {
                  const sq = `${f}${r}`;
                  const dark = (fIdx + rIdx) % 2 === 1;
                  return (
                    <button
                      key={sq}
                      disabled={!coordActive}
                      onClick={() => {
                        if (!coordActive) return;
                        if (sq === coordTarget) {
                          setCoordScore((s) => s + 1);
                          setCoordTarget(getRandomSquare());
                        }
                      }}
                      className={cn(
                        "transition active:scale-95",
                        dark ? "bg-[#368AE4]" : "bg-[#EAF2FB]",
                        !coordActive && "opacity-90 cursor-not-allowed"
                      )}
                    />
                  );
                })
              )}
            </div>
          </GlassCard>
          <GlassCard className="lg:col-span-5 p-6 space-y-4 h-fit">
            <h3 className="text-lg font-extrabold text-[#0B1528]">Speed Test</h3>
            <p className="text-xs text-[#64748B]">Click as many target squares as you can in 30 seconds.</p>
            <div className="rounded-2xl bg-white/60 border border-white/80 p-4">
              <p className="text-xs font-bold text-[#64748B]">Score</p>
              <p className="text-3xl font-extrabold text-[#0B1528]">{coordScore}</p>
            </div>
            <Button variant="primary" className="w-full h-12 rounded-2xl" onClick={startCoord}>
              <Play className="h-4 w-4" /> {coordActive ? "Restart" : "Start 30s Test"}
            </Button>
          </GlassCard>
        </div>
      )}

      {activeTab === "color" && (
        <GlassCard className="max-w-xl mx-auto p-8 text-center space-y-6">
          <Badge variant="blue">Color Memory</Badge>
          <p className="text-6xl font-extrabold text-[#0B1528] tracking-widest">{colorTarget}</p>
          {colorFeedback && (
            <div className={cn("rounded-2xl p-3 text-xs font-extrabold", colorFeedback === "correct" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
              {colorFeedback === "correct" ? "Correct!" : `Wrong — ${colorTarget} is ${isDarkSquare(colorTarget) ? "Dark" : "Light"}`}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-14 rounded-2xl" variant="outline" onClick={() => {
              setColorAttempts((a) => a + 1);
              const ok = !isDarkSquare(colorTarget);
              setColorFeedback(ok ? "correct" : "wrong");
              if (ok) setColorScore((s) => s + 1);
              setTimeout(() => { setColorFeedback(null); setColorTarget(getRandomSquare()); }, 400);
            }}>⚪ Light</Button>
            <Button className="h-14 rounded-2xl bg-[#0B1528] text-white hover:bg-[#1E293B]" onClick={() => {
              setColorAttempts((a) => a + 1);
              const ok = isDarkSquare(colorTarget);
              setColorFeedback(ok ? "correct" : "wrong");
              if (ok) setColorScore((s) => s + 1);
              setTimeout(() => { setColorFeedback(null); setColorTarget(getRandomSquare()); }, 400);
            }}>⚫ Dark</Button>
          </div>
          <p className="text-xs font-bold text-[#64748B]">{colorScore}/{colorAttempts} · {colorAttempts ? Math.round((colorScore / colorAttempts) * 100) : 100}%</p>
        </GlassCard>
      )}

      {activeTab === "knight" && (
        <GlassCard className="max-w-xl mx-auto p-8 text-center space-y-4">
          <Badge variant="accent">Knight Path</Badge>
          <h2 className="text-xl font-extrabold text-[#0B1528]">Minimum hops: b1 → f5?</h2>
          <div className="grid grid-cols-4 gap-2">
            {["2", "3", "4", "5"].map((n, i) => (
              <Button key={n} variant="glass" className="h-12 rounded-2xl font-extrabold" onClick={() => alert(i === 1 ? "✓ Correct! b1→c3→e4→f5" : "Not quite — try again")}>{n} hops</Button>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === "blindfold" && (
        <GlassCard className="max-w-xl mx-auto p-8 text-center space-y-5">
          <Badge variant="blue">Blindfold Memory</Badge>
          {blindStage === "ready" && (
            <Button variant="primary" className="h-12 rounded-2xl" onClick={startBlind}>Start Memory Test</Button>
          )}
          {blindStage === "memorize" && (
            <div className="rounded-3xl bg-[#368AE4]/10 border border-[#368AE4]/30 p-6 space-y-2">
              <p className="text-xs font-extrabold text-[#368AE4]">MEMORIZE ({blindTimer}s)</p>
              <p className="text-4xl font-extrabold text-[#0B1528]">♕ Queen on d4</p>
            </div>
          )}
          {blindStage === "hidden" && (
            <div className="space-y-3">
              <p className="text-sm font-extrabold text-[#0B1528]">Where was the Queen?</p>
              <div className="grid grid-cols-2 gap-2">
                {["d4", "e4", "d5", "c4"].map((sq) => (
                  <Button key={sq} variant="primary" className="h-11 rounded-2xl" onClick={() => {
                    setBlindResult(sq === "d4" ? "✓ Perfect recall!" : "Queen was on d4.");
                    setBlindStage("solved");
                  }}>{sq}</Button>
                ))}
              </div>
            </div>
          )}
          {blindStage === "solved" && (
            <div className="space-y-3">
              <p className="text-sm font-extrabold text-[#368AE4]">{blindResult}</p>
              <Button variant="outline" className="rounded-2xl" onClick={startBlind}>Try again</Button>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
