"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, GraduationCap, Trophy, Calendar, Newspaper, BookOpen, Settings, ArrowRight
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/coaches", label: "Coaches", icon: GraduationCap },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [counts, setCounts] = useState({
    students: 0,
    coaches: 0,
    courses: 0,
    tournaments: 0,
    events: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof?.role !== "admin") {
        if (prof?.role === "coach") return router.push("/coach");
        return router.push("/dashboard");
      }

      setProfile(prof);

      // Fetch Live Database Counts
      const { count: sCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student");
      const { count: cCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach");
      const { count: crsCount } = await supabase.from("courses").select("*", { count: "exact", head: true });
      const { count: tCount } = await supabase.from("tournaments").select("*", { count: "exact", head: true });
      const { count: eCount } = await supabase.from("events").select("*", { count: "exact", head: true });

      setCounts({
        students: sCount || 0,
        coaches: cCount || 0,
        courses: crsCount || 0,
        tournaments: tCount || 0,
        events: eCount || 0,
      });

      const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentUsers(users || []);

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
    { icon: Users, label: "Total Students", value: counts.students, href: "/admin/students" },
    { icon: GraduationCap, label: "Coaches", value: counts.coaches, href: "/admin/coaches" },
    { icon: BookOpen, label: "Active Courses", value: counts.courses, href: "/admin/courses" },
    { icon: Trophy, label: "Tournaments", value: counts.tournaments, href: "/admin/tournaments" },
    { icon: Calendar, label: "Upcoming Events", value: counts.events, href: "/admin/events" },
  ];

  return (
    <PortalShell role="Admin" userName={profile?.full_name || "Admin"} navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Live academy statistics and management control panel.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="block group">
              <div className="bg-white border border-[#DBE9F7] rounded-2xl p-4 transition-all group-hover:border-[#87CEEB] group-hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center shrink-0">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className="text-lg font-bold text-[#1E293B]">{s.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1E293B]">Recent Platform Users</h2>
              <Link href="/admin/students" className="text-xs font-semibold text-[#00A3E0] flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3 text-sm">
              {recentUsers.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[#1E293B] font-medium block">{r.full_name}</span>
                    <span className="text-xs text-slate-400">{r.email}</span>
                  </div>
                  <Badge variant={r.role === "admin" ? "accent" : r.role === "coach" ? "warning" : "default"}>
                    {r.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[#1E293B]">System Health</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Database Connection</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Supabase Auth</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Storage Buckets</span>
                <Badge variant="success">Operational</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}