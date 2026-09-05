"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadAccess } from "@/lib/access";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Sparkles, ArrowRight, GraduationCap, Shield,
  Clock, PlayCircle, CheckCircle2, AlertCircle, Target,
  TrendingUp, Zap, Lock, LayoutDashboard
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("Champion");
  const [roles, setRoles] = useState<string[]>([]);
  const [introCourse, setIntroCourse] = useState<any>(null);
  const [premiumCourses, setPremiumCourses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const access = await loadAccess();
      if (!access) return;
      setName(access.profile.full_name || "Champion");
      setRoles(access.roles);

      const { data: intro } = await supabase
        .from("courses")
        .select("*")
        .eq("is_intro", true)
        .maybeSingle();
      setIntroCourse(intro);

      const { data: premium } = await supabase
        .from("courses")
        .select("*")
        .eq("is_free", false)
        .order("created_at", { ascending: true })
        .limit(3);
      setPremiumCourses(premium || []);

      if (intro) {
        const { data: enr } = await supabase
          .from("course_enrollments")
          .select("*")
          .eq("user_id", access.userId)
          .eq("course_id", intro.id)
          .maybeSingle();
        setEnrolled(!!enr);
      }

      const { data: ann } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setAnnouncements(ann || []);

      const { data: reqs } = await supabase
        .from("role_requests")
        .select("requested_role, status")
        .eq("user_id", access.userId)
        .eq("status", "pending");
      setPending((reqs || []).map((r: any) => r.requested_role));
      setLoading(false);
    })();
  }, [router, supabase]);

  const requestRole = async (requested_role: "student" | "coach" | "premium") => {
    setBusy(requested_role);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMsg({ type: "error", text: "Session expired. Please log in again." });
      setBusy(null);
      return;
    }
    const { error } = await supabase.from("role_requests").insert({
      user_id: user.id,
      requested_role,
      message: `Requesting ${requested_role} access from Explore`,
      status: "pending",
    });
    if (error) {
      setMsg({ type: "error", text: error.message });
    } else {
      setMsg({ type: "success", text: `✓ Request for ${requested_role} sent! An admin will review.` });
      setPending((p) => Array.from(new Set([...p, requested_role])));
    }
    setBusy(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const isStudent = roles.includes("student");
  const isCoach = roles.includes("coach");
  const isPremium = roles.includes("premium");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* VERIFIED STUDENT BANNER */}
      {isStudent && (
        <GlassCard className="p-6 bg-gradient-to-r from-[#368AE4]/15 via-white/40 to-[#368AE4]/10 border-[#368AE4]/40 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#368AE4]" />
                <Badge variant="blue">VERIFIED STUDENT ACCOUNT</Badge>
              </div>
              <h2 className="text-xl font-extrabold text-[#0B1528]">
                Congratulations, {name.split(" ")[0]}! You are officially verified.
              </h2>
              <p className="text-xs font-semibold text-[#64748B]">
                Your student account is active. You have full access to learning modules, puzzles, and live games.
              </p>
            </div>
            <Link href="/dashboard" className="shrink-0">
              <Button variant="primary" className="h-12 px-6 rounded-2xl gap-2 text-sm font-extrabold shadow-md">
                <LayoutDashboard className="h-4 w-4" /> Go to Student Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </GlassCard>
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
          Welcome, {name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[#64748B] mt-1 font-medium">
          {isStudent
            ? "Your student account is verified. Head to your dashboard or review courses below."
            : "Complete the free intro course and request student access to unlock full features."}
        </p>
      </div>

      {msg && (
        <GlassCard className={`p-4 text-sm font-bold flex items-center gap-2 ${
          msg.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {msg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{msg.text}</span>
        </GlassCard>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "ELO Rating", value: "1200", icon: Target, color: "text-[#368AE4]" },
          { label: "Courses", value: enrolled ? "1" : "0", icon: BookOpen, color: "text-emerald-600" },
          { label: "Streak", value: "0 days", icon: Zap, color: "text-amber-600" },
          { label: "Status", value: isStudent ? "Verified Student ✓" : "Registered", icon: TrendingUp, color: isStudent ? "text-[#368AE4]" : "text-[#64748B]" },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4">
            <stat.icon className={`h-4 w-4 ${stat.color} mb-2`} />
            <p className="text-lg font-extrabold text-[#0B1528]">{stat.value}</p>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Upgrade / Role Request Cards for unverified users */}
      {!isStudent && (
        <div>
          <h3 className="text-lg font-extrabold text-[#0B1528] mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#64748B]" /> Account Status & Upgrades
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <GlassCard className="p-6 space-y-3" hoverEffect>
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-[#0B1528]">Student Access</h3>
              <p className="text-xs text-[#64748B]">Full course library, tournaments, puzzles, streak tracking, friends multiplayer.</p>
              {pending.includes("student") ? (
                <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending Admin Review</Button>
              ) : (
                <Button variant="primary" className="w-full" disabled={!!busy} onClick={() => requestRole("student")}>
                  {busy === "student" ? "Sending..." : "Request Student Access"}
                </Button>
              )}
            </GlassCard>

            <GlassCard className="p-6 space-y-3" hoverEffect>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-[#0B1528]">Go Premium</h3>
              <p className="text-xs text-[#64748B]">Advanced puzzles, deep AI analysis, PDF certificates, priority tournaments.</p>
              {isPremium ? (
                <Badge variant="success">Premium Active</Badge>
              ) : pending.includes("premium") ? (
                <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending Admin</Button>
              ) : (
                <Button variant="glass" className="w-full" disabled={!!busy} onClick={() => requestRole("premium")}>
                  {busy === "premium" ? "Sending..." : "Request Premium"}
                </Button>
              )}
            </GlassCard>

            <GlassCard className="p-6 space-y-3" hoverEffect>
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-[#0B1528]">Apply as Coach</h3>
              <p className="text-xs text-[#64748B]">Teach, manage students, create lessons, host sessions.</p>
              {isCoach ? (
                <Link href="/coach"><Button variant="primary" className="w-full">Open Coach Portal</Button></Link>
              ) : pending.includes("coach") ? (
                <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending Admin</Button>
              ) : (
                <Button variant="glass" className="w-full" disabled={!!busy} onClick={() => requestRole("coach")}>
                  {busy === "coach" ? "Sending..." : "Apply as Coach"}
                </Button>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}