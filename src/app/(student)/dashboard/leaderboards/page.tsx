"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ContentLoader } from "@/components/ui/content-loader";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, Flame, Puzzle, Crown, Medal, Award } from "lucide-react";

type LeaderRow = { id: string; full_name: string; value: number; rank: number; };
type Tab = "elo" | "puzzle" | "streak";

export default function LeaderboardsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("elo");
  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setMyId(user.id);

    let column = "chess_rating";
    if (tab === "puzzle") column = "puzzle_rating";
    let data: any[] = [];

    if (tab === "streak") {
      const { data: streaks } = await supabase
        .from("user_streaks")
        .select("user_id, current_streak")
        .order("current_streak", { ascending: false })
        .limit(50);
      const userIds = (streaks || []).map((s) => s.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      const profMap = new Map((profs || []).map((p) => [p.id, p.full_name]));
      data = (streaks || []).map((s) => ({
        id: s.user_id,
        full_name: profMap.get(s.user_id) || "Player",
        value: s.current_streak || 0,
      }));
    } else {
      const { data: profs } = await supabase
        .from("profiles")
        .select(`id, full_name, ${column}`)
        .order(column, { ascending: false })
        .limit(50);
      data = (profs || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name || "Player",
        value: p[column] || (tab === "puzzle" ? 1200 : 1200),
      }));
    }

    const ranked = data.map((r, i) => ({ ...r, rank: i + 1 }));
    setRows(ranked);
    if (user) {
      const me = ranked.find((r) => r.id === user.id);
      setMyRank(me?.rank || null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const TABS: { id: Tab; label: string; icon: any; unit: string }[] = [
    { id: "elo", label: "Chess ELO", icon: TrendingUp, unit: "ELO" },
    { id: "puzzle", label: "Puzzle Rating", icon: Puzzle, unit: "PR" },
    { id: "streak", label: "Daily Streak", icon: Flame, unit: "days" },
  ];

  const rankIcon = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: "text-amber-500" };
    if (rank === 2) return { icon: Medal, color: "text-slate-400" };
    if (rank === 3) return { icon: Award, color: "text-orange-600" };
    return null;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 via-transparent to-[#368AE4]/10 pointer-events-none" />
        <div className="relative z-10 flex justify-between items-start gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Leaderboards</Badge>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Academy Champions</h1>
            <p className="text-sm text-[#64748B] mt-1">See where you stand among your peers.</p>
          </div>
          {myRank && (
            <div className="text-center px-4 py-3 rounded-2xl bg-white/70 border border-white/80">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Your Rank</p>
              <p className="text-2xl font-extrabold text-[#368AE4]">#{myRank}</p>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0",
                tab === t.id ? "bg-[#368AE4] text-white shadow-md" : "bg-white/40 text-[#64748B] hover:bg-white/70"
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <ContentLoader label="Loading rankings..." />
      ) : rows.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <Trophy className="h-8 w-8 text-[#64748B] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-[#0B1528]">No rankings yet</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => {
            const isMe = row.id === myId;
            const ri = rankIcon(row.rank);
            const RankIcon = ri?.icon;
            const currentTab = TABS.find((t) => t.id === tab);
            return (
              <GlassCard
                key={row.id}
                className={cn(
                  "p-4 flex items-center gap-4 transition",
                  isMe && "ring-2 ring-[#368AE4] bg-[#EEF3FA]/70",
                  row.rank <= 3 && "shadow-md"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0",
                    row.rank === 1 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white" :
                    row.rank === 2 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white" :
                    row.rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                    "bg-white/70 text-[#64748B] border border-white/80"
                  )}>
                    {RankIcon ? <RankIcon className="h-5 w-5" /> : `#${row.rank}`}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#0B1528] truncate">
                      {row.full_name} {isMe && <span className="text-[#368AE4] text-[10px] font-bold">(You)</span>}
                    </p>
                    <p className="text-[10px] font-bold text-[#64748B]">Rank #{row.rank}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-extrabold text-[#368AE4]">{row.value}</p>
                  <p className="text-[9px] font-bold text-[#64748B] uppercase">{currentTab?.unit}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
