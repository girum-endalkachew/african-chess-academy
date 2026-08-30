"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, ArrowRight, Swords
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play", label: "Play Computer", icon: Swords },
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
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
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#00A3E0] to-[#87CEEB] rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-white/20 text-white border-0 mb-2">Student Portal</Badge>
            <h1 className="text-2xl font-bold">Good day, {profile?.full_name}! 👋</h1>
            <p className="text-white/90 text-xs mt-1">Train with lessons or play the computer.</p>
          </div>
          <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-2xl border border-white/20">
            <p className="text-[10px] text-white/80 uppercase tracking-wider">Current Chess Rating</p>
            <p className="text-2xl font-bold">{profile?.chess_rating || 1200} <span className="text-xs font-normal text-emerald-200">ELO</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-[#DBE9F7] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-lg font-bold text-[#1E293B]">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#DBE9F7] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1E293B]">My active learning</h2>
              <Link href="/dashboard/learning" className="text-xs font-semibold text-[#00A3E0] flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {enrollments.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm text-slate-500">No enrolled courses yet.</p>
                <Link href="/dashboard/learning"><Button size="sm" variant="outline" className="rounded-xl">Browse Catalog</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((e) => (
                  <div key={e.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#1E293B] font-medium">{e.courses?.title}</span>
                      <span className="text-xs text-[#00A3E0] font-semibold">{e.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00A3E0]" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[#1E293B]">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/dashboard/play" className="block">
                <Button className="w-full justify-between rounded-xl text-xs font-semibold gap-2">
                  <span>Play vs Computer</span>
                  <Swords className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/learning" className="block">
                <Button variant="outline" className="w-full justify-between rounded-xl text-xs font-semibold">
                  <span>Browse Courses</span>
                  <BookOpen className="h-4 w-4 text-[#00A3E0]" />
                </Button>
              </Link>
              <Link href="/dashboard/tournaments" className="block">
                <Button variant="outline" className="w-full justify-between rounded-xl text-xs font-semibold">
                  <span>Register Tournament</span>
                  <Trophy className="h-4 w-4 text-[#00A3E0]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}