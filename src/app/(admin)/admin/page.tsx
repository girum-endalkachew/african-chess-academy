"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Users, GraduationCap, BookOpen, Trophy, Calendar, Newspaper,
  ArrowRight, ShieldCheck, Clock
} from "lucide-react";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [counts, setCounts] = useState({
    students: 0, coaches: 0, courses: 0, tournaments: 0, events: 0, news: 0, pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, c, cr, t, e, n, p] = await Promise.all([
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "student").eq("status", "active"),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "coach").eq("status", "active"),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("tournaments").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("role_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setCounts({
        students: s.count || 0,
        coaches: c.count || 0,
        courses: cr.count || 0,
        tournaments: t.count || 0,
        events: e.count || 0,
        news: n.count || 0,
        pending: p.count || 0,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Active Students", value: counts.students, icon: Users, href: "/admin/students", color: "text-blue-600 bg-blue-50" },
    { label: "Verified Coaches", value: counts.coaches, icon: GraduationCap, href: "/admin/coaches", color: "text-purple-600 bg-purple-50" },
    { label: "Active Courses", value: counts.courses, icon: BookOpen, href: "/admin/courses", color: "text-emerald-600 bg-emerald-50" },
    { label: "Tournaments", value: counts.tournaments, icon: Trophy, href: "/admin/tournaments", color: "text-amber-600 bg-amber-50" },
    { label: "Events & Webinars", value: counts.events, icon: Calendar, href: "/admin/events", color: "text-cyan-600 bg-cyan-50" },
    { label: "News Articles", value: counts.news, icon: Newspaper, href: "/admin/news", color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GlassCard className="p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Admin Control Center</Badge>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Platform Administration</h1>
            <p className="text-sm font-medium text-[#64748B] mt-1">Full management overview for African Chess Academy.</p>
          </div>
          <Badge variant="success" className="px-3 py-1 text-xs">System Healthy</Badge>
        </div>
      </GlassCard>

      {/* Pending approvals spotlight */}
      <GlassCard className={counts.pending > 0
        ? "p-5 border-[#368AE4]/40 bg-gradient-to-r from-[#368AE4]/10 to-transparent"
        : "p-5"}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0B1528] flex items-center gap-2">
                Role Approvals
                {counts.pending > 0 && <Badge variant="blue">{counts.pending} pending</Badge>}
              </p>
              <p className="text-xs text-[#64748B] font-medium">
                {counts.pending > 0
                  ? "Users are waiting for Student / Coach / Premium verification."
                  : "No pending access requests right now."}
              </p>
            </div>
          </div>
          <Link href="/admin/approvals">
            <Button variant="primary" className="rounded-xl h-11">
              {counts.pending > 0 ? (
                <><Clock className="h-4 w-4" /> Review Requests</>
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Open Approvals</>
              )}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <GlassCard className="p-5 h-full flex flex-col justify-between" hoverEffect>
              <div className="flex items-center justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-[#64748B]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528]">{s.value}</p>
                <p className="text-xs font-bold text-[#64748B] mt-0.5">{s.label}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
