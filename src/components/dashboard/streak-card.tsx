"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { calculateStreak } from "@/lib/streak";
import { Flame, Trophy, Calendar } from "lucide-react";

export function StreakCard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ current: 0, longest: 0, days: new Set<string>() });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Pull from games + lesson_progress for combined activity
      const [gamesRes, lessonsRes] = await Promise.all([
        supabase.from("chess_games").select("created_at").eq("user_id", user.id),
        supabase.from("lesson_progress").select("completed_at").eq("user_id", user.id).eq("completed", true),
      ]);

      const allDates: Date[] = [
        ...(gamesRes.data || []).map((g: any) => new Date(g.created_at)),
        ...(lessonsRes.data || []).filter((l: any) => l.completed_at).map((l: any) => new Date(l.completed_at)),
      ];

      const { currentStreak, longestStreak, streakDays } = calculateStreak(allDates);
      setStats({ current: currentStreak, longest: longestStreak, days: streakDays });
      setLoading(false);
    })();
  }, [supabase]);

  // Generate last 7 days visual
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    last7Days.push({
      day: d.toLocaleDateString("en", { weekday: "short" }).charAt(0),
      active: stats.days.has(key),
      isToday: i === 0,
    });
  }

  return (
    <GlassCard className="p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Current Streak</p>
              <p className="text-2xl font-extrabold text-[#0B1528] leading-none">
                {loading ? "..." : stats.current} <span className="text-sm text-orange-500">days</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Best</span>
            </div>
            <p className="text-lg font-extrabold text-[#0B1528]">{loading ? "..." : stats.longest}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mt-4">
          {last7Days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold transition
                  ${d.active
                    ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md"
                    : d.isToday
                    ? "bg-white/60 border-2 border-dashed border-orange-300 text-orange-500"
                    : "bg-white/40 border border-white/60 text-[#64748B]/40"
                  }
                `}
              >
                {d.active ? <Flame className="h-3.5 w-3.5" /> : d.day}
              </div>
              <span className={`text-[9px] font-bold ${d.isToday ? "text-orange-500" : "text-[#64748B]"}`}>
                {d.day}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/60 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-orange-500" />
          <p className="text-[11px] font-bold text-[#64748B]">
            {stats.current > 0 
              ? `Keep it going! Play or complete a lesson today.`
              : "Start a game or lesson today to begin your streak."}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
