"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { LessonBoard } from "@/components/chess/lesson-board";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  List,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showList, setShowList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load ONCE per courseId — stable deps only
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const { data: courseData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        // ensure enrollment (ignore conflict)
        await supabase.from("course_enrollments").upsert(
          {
            user_id: user.id,
            course_id: courseId,
            progress: 0,
            status: "active",
          },
          { onConflict: "user_id,course_id" }
        );

        const { data: lessonData, error: lessonErr } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("sort_order", { ascending: true });

        if (lessonErr) throw lessonErr;

        const { data: progressData } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("course_id", courseId);

        if (cancelled) return;

        setProfile(prof || { full_name: "Student" });
        setCourse(courseData);
        setLessons(lessonData || []);
        setCompletedIds((progressData || []).map((p: any) => p.lesson_id));

        // Start at first incomplete lesson (no loop)
        const list = lessonData || [];
        const done = new Set((progressData || []).map((p: any) => p.lesson_id));
        let start = 0;
        for (let i = 0; i < list.length; i++) {
          if (!done.has(list[i].id)) {
            start = i;
            break;
          }
        }
        setActiveIndex(start);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load course");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (courseId) load();
    return () => {
      cancelled = true;
    };
  }, [courseId, router]);

  const activeLesson = lessons[activeIndex] || null;
  const doneCount = completedIds.length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const isDone = activeLesson ? completedIds.includes(activeLesson.id) : false;

  const goTo = (index: number) => {
    if (index < 0 || index >= lessons.length) return;
    setActiveIndex(index);
  };

  const markComplete = async () => {
    if (!activeLesson || saving) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: activeLesson.id,
          course_id: courseId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );

      // local update (no reload)
      const nextCompleted = completedIds.includes(activeLesson.id)
        ? completedIds
        : [...completedIds, activeLesson.id];
      setCompletedIds(nextCompleted);

      const progress = lessons.length
        ? Math.round((nextCompleted.length / lessons.length) * 100)
        : 0;

      await supabase.from("course_enrollments").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          progress,
          status: progress >= 100 ? "completed" : "active",
        },
        { onConflict: "user_id,course_id" }
      );

      if (progress >= 100 && course?.title) {
        const title = `${course.title} Certificate`;
        const { data: existing } = await supabase
          .from("certificates")
          .select("id")
          .eq("user_id", user.id)
          .eq("title", title)
          .maybeSingle();

        if (!existing) {
          await supabase.from("certificates").insert({
            user_id: user.id,
            course_id: courseId,
            title,
          });
        }
      }

      // auto-advance without reload
      if (activeIndex < lessons.length - 1) {
        setActiveIndex((i) => i + 1);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-6 max-w-md text-center space-y-3">
          <p className="font-semibold text-red-600">Could not load course</p>
          <p className="text-sm text-slate-600">{error}</p>
          <Link href="/dashboard/learning">
            <Button className="rounded-xl">Back to My Learning</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/dashboard/learning"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#00A3E0] mb-1"
            >
              <ArrowLeft className="h-4 w-4" /> My Learning
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B]">{course?.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="accent">{course?.level}</Badge>
              <span className="text-xs text-slate-500">
                {doneCount}/{lessons.length} lessons · {pct}%
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 lg:hidden"
            onClick={() => setShowList((v) => !v)}
          >
            <List className="h-4 w-4" />
            Lessons
          </Button>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00A3E0] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* Sidebar list */}
          <aside
            className={`${showList ? "block" : "hidden"} lg:block lg:col-span-3 bg-white border border-[#DBE9F7] rounded-2xl overflow-hidden`}
          >
            <div className="px-4 py-3 border-b border-[#DBE9F7] text-sm font-semibold text-[#1E293B]">
              Lessons
            </div>
            <div className="max-h-[55vh] lg:max-h-[70vh] overflow-y-auto p-2 space-y-1">
              {lessons.map((lesson, index) => {
                const done = completedIds.includes(lesson.id);
                const active = index === activeIndex;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      goTo(index);
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        setShowList(false);
                      }
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
                      active
                        ? "bg-[#E6F5FF] border-[#87CEEB]"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          done
                            ? "bg-emerald-100 text-emerald-600"
                            : active
                            ? "bg-[#00A3E0] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {done ? "✓" : lesson.sort_order}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${active ? "text-[#00A3E0]" : "text-[#1E293B]"}`}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {lesson.duration_minutes || 15} min
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {lessons.length === 0 && (
                <p className="text-xs text-slate-500 p-3">No lessons found. Run the lessons SQL seed.</p>
              )}
            </div>
          </aside>

          {/* Player */}
          <section className="lg:col-span-9 bg-white border border-[#DBE9F7] rounded-2xl p-4 sm:p-6">
            {!activeLesson ? (
              <div className="py-16 text-center text-slate-500 text-sm">Select a lesson to begin.</div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">
                      Lesson {activeLesson.sort_order} of {lessons.length}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">{activeLesson.title}</h2>
                    {activeLesson.summary && (
                      <p className="text-sm text-slate-500 mt-1">{activeLesson.summary}</p>
                    )}
                  </div>
                  {isDone && (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </Badge>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-5 items-start">
                  {/* ALWAYS show board */}
                  <LessonBoard
                    fen={activeLesson.board_fen}
                    note={activeLesson.board_note || activeLesson.summary}
                  />

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#DBE9F7] bg-[#F8FAFC] p-4 sm:p-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Lesson content
                      </p>
                      <div className="text-sm sm:text-[15px] leading-relaxed text-[#1E293B] whitespace-pre-wrap">
                        {activeLesson.content}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl gap-1"
                          disabled={activeIndex === 0}
                          onClick={() => goTo(activeIndex - 1)}
                        >
                          <ArrowLeft className="h-4 w-4" /> Prev
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl gap-1"
                          disabled={activeIndex >= lessons.length - 1}
                          onClick={() => goTo(activeIndex + 1)}
                        >
                          Next <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {isDone ? (
                        <Button
                          type="button"
                          className="rounded-xl"
                          disabled={activeIndex >= lessons.length - 1}
                          onClick={() => goTo(activeIndex + 1)}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="rounded-xl font-semibold gap-2"
                          onClick={markComplete}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Mark complete"}
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {pct >= 100 && (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 font-medium">
                        Course complete — certificate unlocked in Certificates.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </PortalShell>
  );
}