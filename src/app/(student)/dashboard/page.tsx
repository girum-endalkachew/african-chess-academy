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
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  ArrowRight,
  Swords,
  Edit3,
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

export default function StudentDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [tournamentsCount, setTournamentsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof?.role === "admin") return router.push("/admin");
      if (prof?.role === "coach") return router.push("/coach");

      setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });

      const { data: enrolls } = await supabase.from("course_enrollments").select("*, courses(*)").eq("user_id", user.id);
      setEnrollments(enrolls || []);

      const { count: tCount } = await supabase.from("tournament_registrations").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setTournamentsCount(tCount || 0);

      const { count: eCount } = await supabase.from("event_registrations").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setEventsCount(eCount || 0);

      const { count: cCount } = await supabase.from("certificates").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setCertsCount(cCount || 0);

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

  const stats = [
    { icon: BookOpen, label: "Enrolled Courses", value: enrollments.length },
    { icon: Trophy, label: "Tournaments Joined", value: tournamentsCount },
    { icon: Calendar, label: "Events Joined", value: eventsCount },
    { icon: Award, label: "Certificates", value: certsCount },
  ];

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="space-y-6 max-w-7xl mx-auto">
        <GlassCard className="relative overflow-hidden p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-white/80">
          <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <Badge variant="blue" className="mb-3 px-3 py-1">Student Portal</Badge>
            <h1 className="text-[28px] font-extrabold text-[#0B1528] tracking-tight">Good day, {profile?.full_name}! 👋</h1>
            <p className="text-[#64748B] text-[13px] font-medium mt-1">Ready to improve? Train with lessons or play the computer.</p>
          </div>
          <div className="relative z-10 bg-white/60 backdrop-blur-md px-6 py-4 rounded-[20px] border border-white shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#EEF3FA] flex items-center justify-center text-[#368AE4]">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Chess Rating</p>
              <p className="text-[24px] font-extrabold text-[#0B1528] leading-none">
                {profile?.chess_rating || 1200} <span className="text-[12px] font-bold text-[#368AE4]">ELO</span>
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-5" hoverEffect>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[20px] font-extrabold text-[#0B1528] leading-none">{s.value}</p>
                  <p className="text-[11px] font-bold text-[#64748B] mt-1">{s.label}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h2 className="text-[16px] font-extrabold text-[#0B1528]">My active learning</h2>
              </div>
              <Link href="/dashboard/learning" className="text-[12px] font-bold text-[#368AE4] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="text-center py-10 bg-white/40 rounded-[20px] border border-white/60">
                <div className="h-12 w-12 rounded-full bg-[#EEF3FA] flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-5 w-5 text-[#368AE4]" />
                </div>
                <p className="text-[13px] font-bold text-[#0B1528] mb-1">No enrolled courses yet</p>
                <p className="text-[11px] text-[#64748B] mb-4">Start your journey by joining a course.</p>
                <Link href="/dashboard/learning">
                  <Button variant="primary" size="sm">Browse Catalog</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((e) => (
                  <div key={e.id} className="p-4 rounded-[16px] border border-white/80 bg-white/50 backdrop-blur-sm transition hover:bg-white/70">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[14px] font-bold text-[#0B1528]">{e.courses?.title}</span>
                      <Badge variant="default">{e.progress}% Complete</Badge>
                    </div>
                    <div className="h-2 bg-[#EEF3FA] rounded-full overflow-hidden">
                      <div className="h-full bg-[#368AE4] rounded-full" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-[16px] font-extrabold text-[#0B1528]">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard/play" className="block">
                <Button variant="primary" className="w-full justify-between h-14 rounded-2xl px-5">
                  <span className="text-[13px]">Play vs Computer</span>
                  <Swords className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/editor" className="block">
                <Button variant="glass" className="w-full justify-between h-14 rounded-2xl px-5">
                  <span className="text-[13px]">Open Board Editor</span>
                  <Edit3 className="h-4 w-4 text-[#368AE4]" />
                </Button>
              </Link>
              <Link href="/dashboard/learning" className="block">
                <Button variant="glass" className="w-full justify-between h-14 rounded-2xl px-5">
                  <span className="text-[13px]">Browse Courses</span>
                  <BookOpen className="h-4 w-4 text-[#368AE4]" />
                </Button>
              </Link>
              <Link href="/dashboard/tournaments" className="block">
                <Button variant="glass" className="w-full justify-between h-14 rounded-2xl px-5">
                  <span className="text-[13px]">Find Tournaments</span>
                  <Trophy className="h-4 w-4 text-[#368AE4]" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </PortalShell>
  );
}
