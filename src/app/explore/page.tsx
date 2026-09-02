"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadAccess } from "@/lib/access";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Sparkles, ArrowRight, GraduationCap, Shield,
  Clock, PlayCircle, Lock, CheckCircle2, Bell, Trophy
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("Champion");
  const [roles, setRoles] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [introCourse, setIntroCourse] = useState<any>(null);
  const [premiumCourses, setPremiumCourses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const access = await loadAccess();
      if (!access) {
        router.replace("/login");
        return;
      }
      setName(access.profile.full_name || "Champion");
      setRoles(access.roles);
      setWorkspaces(access.workspaces);

      // Load intro (free) course
      const { data: intro } = await supabase
        .from("courses")
        .select("*")
        .eq("is_intro", true)
        .maybeSingle();
      setIntroCourse(intro);

      // Load premium courses (locked previews)
      const { data: premium } = await supabase
        .from("courses")
        .select("*")
        .eq("is_free", false)
        .order("created_at", { ascending: true })
        .limit(3);
      setPremiumCourses(premium || []);

      // Check if enrolled in intro
      if (intro) {
        const { data: enr } = await supabase
          .from("course_enrollments")
          .select("*")
          .eq("user_id", access.userId)
          .eq("course_id", intro.id)
          .maybeSingle();
        setEnrolled(!!enr);
      }

      // Load announcements
      const { data: ann } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setAnnouncements(ann || []);

      // Pending role requests
      const { data: reqs } = await supabase
        .from("role_requests")
        .select("requested_role, status")
        .eq("user_id", access.userId)
        .eq("status", "pending");
      setPending((reqs || []).map((r: any) => r.requested_role));
      setLoading(false);
    })();
  }, [router, supabase]);

  const enrollIntro = async () => {
    if (!introCourse) return;
    const access = await loadAccess();
    if (!access) return;
    setBusy("enroll");
    await supabase.from("course_enrollments").insert({
      user_id: access.userId,
      course_id: introCourse.id,
      progress: 0,
      status: "active",
    });
    setEnrolled(true);
    setBusy(null);
    router.push(`/explore/course/${introCourse.id}`);
  };

  const requestRole = async (requested_role: "student" | "coach" | "premium") => {
    setBusy(requested_role);
    setMsg("");
    const access = await loadAccess();
    if (!access) return;
    const { error } = await supabase.from("role_requests").insert({
      user_id: access.userId,
      requested_role,
      message: `Requesting ${requested_role} access from Explore`,
      status: "pending",
    });
    if (error) setMsg(error.message);
    else {
      setMsg(`✓ Request for ${requested_role} sent! An admin will review.`);
      setPending((p) => Array.from(new Set([...p, requested_role])));
    }
    setBusy(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const isStudent = roles.includes("student");
  const isCoach = roles.includes("coach");
  const isAdmin = roles.includes("admin");
  const isPremium = roles.includes("premium");

  return (
    <div className="min-h-screen canvas-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Registered · Explore</Badge>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1528] tracking-tight">
              Welcome, {name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-[#64748B] mt-1 font-medium">
              We don’t just teach chess. We build strategic thinkers.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <WorkspaceSwitcher workspaces={workspaces} />
            <Link href="/" className="text-xs font-bold text-[#368AE4]">← Public site</Link>
          </div>
        </div>

        {msg && (
          <GlassCard className="p-4 border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold">
            {msg}
          </GlassCard>
        )}

        {/* FREE INTRO COURSE - Hero */}
        {introCourse && (
          <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 to-transparent" />
            <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <Badge variant="success">100% FREE</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528]">
                  {introCourse.title}
                </h2>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {introCourse.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-bold text-[#64748B]">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {introCourse.total_lessons} Lessons</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~50 min</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Certificate</span>
                </div>
                <div className="pt-2">
                  {enrolled ? (
                    <Link href={`/explore/course/${introCourse.id}`}>
                      <Button variant="primary" className="h-12 rounded-2xl">
                        <PlayCircle className="h-4 w-4" /> Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="primary" className="h-12 rounded-2xl" onClick={enrollIntro} disabled={busy === "enroll"}>
                      {busy === "enroll" ? "Enrolling..." : "Start Free Course"} <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* UPGRADE PATHS */}
        <div>
          <h3 className="text-lg font-extrabold text-[#0B1528] mb-3">Ready for more? Request access:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <GlassCard className="p-6 space-y-3" hoverEffect>
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-[#0B1528]">Become a Student</h3>
              <p className="text-xs text-[#64748B]">Full course library, tournaments, puzzles, streak tracking, friends multiplayer.</p>
              {isStudent ? (
                <Link href="/dashboard"><Button variant="primary" className="w-full">Open Dashboard</Button></Link>
              ) : pending.includes("student") ? (
                <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending Admin</Button>
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

        {/* LOCKED PREMIUM COURSES PREVIEW */}
        {premiumCourses.length > 0 && (
          <div>
            <h3 className="text-lg font-extrabold text-[#0B1528] mb-3">Unlock More Courses (Student Access)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {premiumCourses.map((c) => (
                <GlassCard key={c.id} className="p-5 space-y-3 relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <Lock className="h-4 w-4 text-[#64748B]" />
                  </div>
                  <Badge variant="outline">{c.level}</Badge>
                  <h4 className="text-sm font-extrabold text-[#0B1528]">{c.title}</h4>
                  <p className="text-[10px] text-[#64748B] line-clamp-2">{c.description}</p>
                  <p className="text-[10px] font-bold text-[#64748B]">{c.total_lessons} lessons</p>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <Lock className="h-3.5 w-3.5" /> Student Only
                  </Button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {announcements.length > 0 && (
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-[#368AE4]" />
              <h3 className="text-base font-extrabold text-[#0B1528]">Latest Announcements</h3>
            </div>
            <div className="space-y-2">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-xl bg-white/50 border border-white/70 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="blue" className="text-[9px]">{a.category}</Badge>
                    <p className="text-xs font-extrabold text-[#0B1528]">{a.title}</p>
                  </div>
                  <p className="text-[11px] text-[#64748B]">{a.body}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
