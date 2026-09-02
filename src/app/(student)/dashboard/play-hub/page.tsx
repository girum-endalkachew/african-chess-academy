"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Swords, Users, Globe2, Settings2, Sparkles, ArrowRight } from "lucide-react";

const LEVELS = ["Beginner", "Easy", "Intermediate", "Advanced", "Expert", "Master"];

export default function PlayHubPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent" />
        <div className="relative z-10">
          <Badge variant="blue" className="mb-2">Level-Up · Play</Badge>
          <h1 className="text-3xl font-extrabold text-[#0B1528]">Play Chess Your Way</h1>
          <p className="text-sm text-[#64748B] mt-2 max-w-xl">
            Choose how you want to train today — computer, friends, or online matchmaking.
          </p>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-4">
        <GlassCard className="p-6 space-y-4" hoverEffect>
          <div className="h-12 w-12 rounded-2xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
            <Swords className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-extrabold text-[#0B1528]">Play vs Computer</h2>
          <p className="text-xs text-[#64748B]">Difficulty, time feel, color, hints, undo, draw — and a forgiving Easy mode.</p>
          <div className="flex flex-wrap gap-1">
            {LEVELS.map((l) => (
              <span key={l} className="text-[9px] font-bold px-2 py-1 rounded-full bg-white/60 border border-white/80 text-[#64748B]">{l}</span>
            ))}
          </div>
          <Link href="/dashboard/play"><Button variant="primary" className="w-full">Open Board <ArrowRight className="h-4 w-4" /></Button></Link>
        </GlassCard>

        <GlassCard className="p-6 space-y-4" hoverEffect>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-extrabold text-[#0B1528]">Play with a Friend</h2>
          <p className="text-xs text-[#64748B]">Create game, share code, time control, rematch, chat, clocks.</p>
          <Link href="/dashboard/friends"><Button variant="glass" className="w-full">Friends Lobby <ArrowRight className="h-4 w-4" /></Button></Link>
        </GlassCard>

        <GlassCard className="p-6 space-y-4" hoverEffect>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Globe2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-extrabold text-[#0B1528]">Play Online</h2>
          <p className="text-xs text-[#64748B]">Coming next: Quick Match, Rated, Casual, Tournament — ACA Rating.</p>
          <Button variant="outline" className="w-full" disabled>Soon · Matchmaking</Button>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-[#368AE4]" />
            <h3 className="font-extrabold text-[#0B1528]">Board Editor</h3>
          </div>
          <p className="text-xs text-[#64748B]">Set positions, arrows, FEN, then play or turn into a puzzle.</p>
          <Link href="/dashboard/editor"><Button variant="glass">Open Editor</Button></Link>
        </GlassCard>
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="font-extrabold text-[#0B1528]">ACA AI Coach</h3>
          </div>
          <p className="text-xs text-[#64748B]">Future mode: the engine doesn’t just beat you — it explains mistakes after the game.</p>
          <Badge variant="warning">Roadmap</Badge>
        </GlassCard>
      </div>
    </div>
  );
}
