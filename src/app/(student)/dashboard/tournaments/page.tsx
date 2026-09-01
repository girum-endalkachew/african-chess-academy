"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, Swords, Edit3,
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
import { ArrowRight, Loader2 } from "lucide-react";

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

  const join = async (tournamentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setBusyId(tournamentId);
    await supabase.from("tournament_registrations").insert({ user_id: user.id, tournament_id: tournamentId });
    await load();
    setBusyId(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-7xl mx-auto space-y-6">
        <GlassCard className="p-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent" />
          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Tournaments</h1>
            <p className="text-sm text-[#64748B] mt-1">Register, compete, and climb the leaderboard.</p>
          </div>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-5">
          {items.length === 0 ? (
            <GlassCard className="p-8 text-center col-span-full"><p className="font-bold text-[#0B1528]">No tournaments yet</p></GlassCard>
          ) : items.map((t) => {
            const isJoined = joined.has(t.id);
            return (
              <GlassCard key={t.id} className="p-6 space-y-4" hoverEffect>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="blue">{t.status || "Open"}</Badge>
                  <Badge variant="outline" className="normal-case tracking-normal">{t.format || "Swiss"}</Badge>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B1528]">{t.title || t.name}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2">{t.description || "Academy tournament"}</p>
                <p className="text-[11px] font-bold text-[#64748B]">{t.start_date ? new Date(t.start_date).toLocaleString() : "Date TBA"}</p>
                {isJoined ? (
                  <Button variant="outline" className="w-full" disabled>Registered</Button>
                ) : (
                  <Button variant="primary" className="w-full" disabled={busyId===t.id} onClick={() => join(t.id)}>
                    {busyId===t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Register <ArrowRight className="h-4 w-4" /></>}
                  </Button>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}
