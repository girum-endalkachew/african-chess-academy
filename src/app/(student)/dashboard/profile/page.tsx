"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, Search, Bell, TrendingUp, Zap
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play", label: "Play Computer", icon: Swords },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });
      setFullName(prof?.full_name || "");
      const { data: g } = await supabase.from("chess_games").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      setGames(g || []);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!profile?.id) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
    setMsg("Profile updated!");
    setTimeout(() => setMsg(""), 3000);
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  const wins = games.filter(g => g.result === "win").length;
  const draws = games.filter(g => g.result === "draw").length;
  const losses = games.filter(g => g.result === "loss" || g.result === "resign").length;
  const rating = profile?.chess_rating || 1200;
  const firstName = (fullName || profile?.full_name || "Student").split(" ")[0];

  return (
    <PortalShell role="Student" userName={fullName || profile?.full_name || "Student"} navItems={navItems}>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input type="text" placeholder="Search..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none" />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] backdrop-blur"><Bell className="h-4 w-4" /></button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-[#368AE4] mb-1">👤 Hey, {firstName}!</p>
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
            Your <span className="text-[#368AE4]">Profile</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-7">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B1528]">{fullName || "Student"}</h2>
                  <Badge variant="blue" className="mt-1">{rating} ELO</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-2 block">Full Name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <Button variant="primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                {msg && <p className="text-sm font-bold text-emerald-600">{msg}</p>}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h3 className="font-extrabold text-[#0B1528]">Game History</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                  <p className="text-2xl font-extrabold text-emerald-700">{wins}</p>
                  <p className="text-[10px] font-bold text-emerald-600">Wins</p>
                </div>
                <div className="rounded-xl bg-white/50 border border-white/70 p-3 text-center">
                  <p className="text-2xl font-extrabold text-[#64748B]">{draws}</p>
                  <p className="text-[10px] font-bold text-[#64748B]">Draws</p>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
                  <p className="text-2xl font-extrabold text-red-700">{losses}</p>
                  <p className="text-[10px] font-bold text-red-600">Losses</p>
                </div>
              </div>
              {games.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {games.slice(0, 10).map((g, i) => (
                    <div key={g.id || i} className="flex items-center justify-between rounded-xl bg-white/40 border border-white/60 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant={g.result === "win" ? "success" : g.result === "draw" ? "outline" : "danger"} className="normal-case tracking-normal">{g.result}</Badge>
                        <span className="text-[#64748B]">vs {g.difficulty} AI</span>
                      </div>
                      <span className={`font-bold ${(g.rating_delta || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {(g.rating_delta || 0) >= 0 ? "+" : ""}{g.rating_delta || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard className="p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#368AE4]/10 to-transparent" />
              <div className="relative z-10 text-center">
                <TrendingUp className="h-8 w-8 text-[#368AE4] mx-auto mb-2" />
                <p className="text-3xl font-extrabold text-[#0B1528]">{rating}</p>
                <p className="text-[11px] font-bold text-[#64748B]">Current ELO</p>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Win Rate</p>
              <p className="text-3xl font-extrabold text-[#0B1528] mb-2">{games.length > 0 ? Math.round((wins / games.length) * 100) : 0}%</p>
              <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${games.length > 0 ? (wins / games.length) * 100 : 0}%` }} />
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Total Games</p>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-amber-500" />
                <p className="text-3xl font-extrabold text-[#0B1528]">{games.length}</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
