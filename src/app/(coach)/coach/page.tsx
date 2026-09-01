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
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
  Settings,
  Swords,
  Trophy,
  ArrowRight,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/coach", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coach/students", label: "My Students", icon: Users },
  { href: "/coach/courses", label: "My Courses", icon: BookOpen },
  { href: "/coach/play", label: "Play Computer", icon: Swords },
  { href: "/coach/sessions", label: "Sessions", icon: Calendar },
  { href: "/coach/messages", label: "Messages", icon: MessageSquare },
  { href: "/coach/profile", label: "Profile", icon: User },
  { href: "/coach/settings", label: "Settings", icon: Settings },
];

export default function CoachDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ students: 0, courses: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data?.role === "admin") return router.push("/admin");
      if (data?.role === "student") return router.push("/dashboard");
      setProfile(data || { full_name: user.email?.split("@")[0], chess_rating: 2000 });

      try {
        const { count: sCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student");
        const { count: cCount } = await supabase.from("courses").select("*", { count: "exact", head: true });
        const { count: eCount } = await supabase.from("events").select("*", { count: "exact", head: true });
        setStats({ students: sCount || 0, courses: cCount || 0, sessions: eCount || 0 });
      } catch {}

      setLoading(false);
    })();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-6">
        <GlassCard className="relative overflow-hidden p-7 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="blue" className="mb-2">Coach Workspace</Badge>
              <h1 className="text-[28px] font-extrabold text-[#0B1528] tracking-tight">
                Welcome, {profile?.full_name || "Coach"}
              </h1>
              <p className="text-[13px] font-medium text-[#64748B] mt-1">
                Manage students, courses, sessions, and train on the board.
              </p>
            </div>
            <div className="rounded-2xl bg-white/60 border border-white/80 px-5 py-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">Your rating</p>
              <p className="text-2xl font-extrabold text-[#0B1528]">
                {profile?.chess_rating || 2000} <span className="text-sm text-[#368AE4]">ELO</span>
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Students", value: stats.students, icon: Users },
            { label: "Courses", value: stats.courses, icon: BookOpen },
            { label: "Sessions/Events", value: stats.sessions, icon: Calendar },
            { label: "Role", value: "Verified", icon: Trophy },
          ].map((s) => (
            <GlassCard key={s.label} className="p-5" hoverEffect>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0B1528] leading-none">{s.value}</p>
                  <p className="text-[11px] font-bold text-[#64748B] mt-1">{s.label}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <GlassCard className="lg:col-span-2 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Coach tools</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/coach/students"><Button variant="glass" className="w-full justify-between h-12">My Students <Users className="h-4 w-4 text-[#368AE4]" /></Button></Link>
              <Link href="/coach/courses"><Button variant="glass" className="w-full justify-between h-12">My Courses <BookOpen className="h-4 w-4 text-[#368AE4]" /></Button></Link>
              <Link href="/coach/sessions"><Button variant="glass" className="w-full justify-between h-12">Sessions <Calendar className="h-4 w-4 text-[#368AE4]" /></Button></Link>
              <Link href="/coach/play"><Button variant="primary" className="w-full justify-between h-12">Play vs Computer <Swords className="h-4 w-4" /></Button></Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Quick tips</h2>
            </div>
            <p className="text-[12px] font-medium text-[#64748B] leading-relaxed">
              Review student progress weekly, assign course lessons, and use Play mode to demo tactics live.
            </p>
            <Link href="/coach/messages">
              <Button variant="outline" className="w-full">Open Messages <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </PortalShell>
  );
}
