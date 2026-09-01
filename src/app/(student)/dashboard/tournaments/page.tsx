"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, Search, Bell, ArrowRight, Loader2, Users, Clock
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

export default function TournamentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });

    const { data: tours } = await supabase.from("tournaments").select("*").order("start_date", { ascending: true });
    setItems(tours || []);

    const { data: regs } = await supabase.from("tournament_registrations").select("tournament_id").eq("user_id", user.id);
    setJoined(new Set((regs || []).map((r: any) => r.tournament_id)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const join = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setBusyId(id);
    await supabase.from("tournament_registrations").insert({ user_id: user.id, tournament_id: id });
    await load();
    setBusyId(null);
  };

  const stats = useMemo(() => {
    const total = items.length;
    const upcoming = items.filter(t => t.start_date && new Date(t.start_date) > new Date()).length;
    const myCount = joined.size;
    return { total, upcoming, myCount };
  }, [items, joined]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  const firstName = (profile?.full_name || "Player").split(" ")[0];

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input type="text" placeholder="Search tournaments..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none" />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] backdrop-blur"><Bell className="h-4 w-4" /></button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-[#368AE4] mb-1">🏆 Hey, {firstName}!</p>
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
            Compete & <span className="text-[#368AE4]">Rise</span>
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center"><Trophy className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.total}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Total</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.upcoming}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Upcoming</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.myCount}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Joined</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">All Tournaments</h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-[#EEF3FA] flex items-center justify-center mb-3"><Trophy className="h-6 w-6 text-[#368AE4]" /></div>
              <p className="font-bold text-[#0B1528]">No tournaments scheduled</p>
              <p className="text-xs text-[#64748B]">Check back soon for new events</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {items.map(t => {
                const isJoined = joined.has(t.id);
                return (
                  <div key={t.id} className="rounded-2xl bg-white/50 border border-white/70 p-5 hover:bg-white/70 transition">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="blue">{t.status || "Open"}</Badge>
                      <Badge variant="outline" className="normal-case tracking-normal">{t.format || "Swiss"}</Badge>
                    </div>
                    <h3 className="text-base font-extrabold text-[#0B1528] mb-2">{t.title || t.name}</h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{t.description || "Academy tournament — compete with players worldwide."}</p>
                    <p className="text-[11px] font-bold text-[#64748B] mb-4">{t.start_date ? new Date(t.start_date).toLocaleString() : "Date TBA"}</p>
                    {isJoined ? (
                      <Button variant="outline" className="w-full" disabled>✓ Registered</Button>
                    ) : (
                      <Button variant="primary" className="w-full" disabled={busyId === t.id} onClick={() => join(t.id)}>
                        {busyId === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Register <ArrowRight className="h-4 w-4" /></>}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </PortalShell>
  );
}
