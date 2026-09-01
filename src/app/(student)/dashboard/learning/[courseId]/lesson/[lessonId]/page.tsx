"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { LessonBoard } from "@/components/chess/lesson-board";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, ArrowLeft, ArrowRight, CheckCircle2, PlayCircle,
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

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push("/login");

        const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(prof || { full_name: user.email?.split("@")[0] });

        const { data: courseData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
        setCourse(courseData);

        // CORRECT SCHEMA
        let list: any[] = [];
        const q1 = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .eq("is_published", true)
          .order("sort_order", { ascending: true });

        if (q1.error) {
          const q2 = await supabase
            .from("lessons")
            .select("*")
            .eq("course_id", courseId)
            .order("sort_order", { ascending: true });
          if (q2.error) setErrorMsg(q2.error.message);
          list = q2.data || [];
        } else {
          list = q1.data || [];
        }

        setLessons(list);
        const current = list.find((l: any) => l.id === lessonId) || null;
        setLesson(current);

        const { data: prog } = await supabase
          .from("lesson_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .maybeSingle();
        setCompleted(!!prog?.completed);
      } catch (e: any) {
        setErrorMsg(e?.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, lessonId, router, supabase]);

  const index = useMemo(
    () => lessons.findIndex((l) => l.id === lessonId),
    [lessons, lessonId]
  );
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  const markComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);

    try {
      await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
    } catch {}

    try {
      const total = Math.max(lessons.length, 1);
      const { data: allProg } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      const doneSet = new Set((allProg || []).map((p: any) => p.lesson_id));
      doneSet.add(lessonId);
      const doneInCourse = lessons.filter((l) => doneSet.has(l.id)).length;
      const pct = Math.round((doneInCourse / total) * 100);

      await supabase
        .from("course_enrollments")
        .update({ progress: pct })
        .eq("user_id", user.id)
        .eq("course_id", courseId);
    } catch {}

    setCompleted(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
        <GlassCard className="p-8 text-center max-w-xl mx-auto space-y-4">
          <h1 className="text-xl font-extrabold text-[#0B1528]">Lesson not found</h1>
          {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
          <Link href={`/dashboard/learning/${courseId}`}>
            <Button variant="primary">Back to course</Button>
          </Link>
        </GlassCard>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/dashboard/learning/${courseId}`}
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#64748B] hover:text-[#368AE4]"
          >
            <ArrowLeft className="h-4 w-4" /> {course?.title || "Course"}
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="normal-case tracking-normal">
              Lesson {Math.max(index + 1, 1)} / {Math.max(lessons.length, 1)}
            </Badge>
            {completed && <Badge variant="success">Completed</Badge>}
          </div>
        </div>

        {errorMsg && (
          <GlassCard className="p-4 border-red-200 bg-red-50 text-red-700 text-sm font-bold">
            {errorMsg}
          </GlassCard>
        )}

        <GlassCard className="p-6 sm:p-7">
          <h1 className="text-2xl font-extrabold text-[#0B1528] tracking-tight mb-2">
            {lesson.title}
          </h1>
          <p className="text-[13px] font-medium text-[#64748B]">
            {lesson.summary || "Study the concept, review the board, then mark complete."}
          </p>
          {lesson.duration_minutes ? (
            <p className="text-[11px] font-bold text-[#368AE4] mt-2">
              {lesson.duration_minutes} min
            </p>
          ) : null}
        </GlassCard>

        <div className="grid lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-6 space-y-4">
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
                <h2 className="text-sm font-extrabold text-[#0B1528]">Lesson notes</h2>
              </div>
              <p className="text-[14px] font-medium leading-relaxed whitespace-pre-wrap text-[#334155]">
                {lesson.content ||
                  "No written notes for this lesson yet. Use the board position and practice tools."}
              </p>
            </GlassCard>

            <GlassCard className="p-5 flex flex-wrap gap-2">
              {!completed ? (
                <Button
                  variant="primary"
                  onClick={markComplete}
                  disabled={saving}
                  className="rounded-2xl"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {saving ? "Saving..." : "Mark Complete"}
                </Button>
              ) : (
                <Button variant="outline" disabled className="rounded-2xl">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Completed
                </Button>
              )}

              {prev && (
                <Link href={`/dashboard/learning/${courseId}/lesson/${prev.id}`}>
                  <Button variant="glass" className="rounded-2xl">
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </Button>
                </Link>
              )}
              {next && (
                <Link href={`/dashboard/learning/${courseId}/lesson/${next.id}`}>
                  <Button variant="glass" className="rounded-2xl">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/play">
                <Button variant="ghost" className="rounded-2xl">
                  <PlayCircle className="h-4 w-4" /> Practice vs Computer
                </Button>
              </Link>
            </GlassCard>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <GlassCard className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
                  <h2 className="text-sm font-extrabold text-[#0B1528]">Interactive board</h2>
                </div>
                <Badge variant="blue">Study</Badge>
              </div>
              <LessonBoard fen={lesson.board_fen} note={lesson.board_note || null} />
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[12px] font-bold text-[#64748B] mb-3">Continue path</p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {lessons.map((l: any, i: number) => (
                  <Link
                    key={l.id}
                    href={`/dashboard/learning/${courseId}/lesson/${l.id}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-bold border ${
                      l.id === lessonId
                        ? "bg-white border-[#368AE4] text-[#368AE4]"
                        : "bg-white/40 border-white/70 text-[#0B1528] hover:bg-white/70"
                    }`}
                  >
                    <span className="truncate">
                      {i + 1}. {l.title}
                    </span>
                    {l.id === lessonId ? <Badge variant="blue">Now</Badge> : null}
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
