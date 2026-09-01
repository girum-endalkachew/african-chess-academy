"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { LessonBoard } from "@/components/chess/lesson-board";
import { ContentLoader } from "@/components/ui/content-loader";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Fetch course + all lessons once per courseId
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCourse(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (mounted) setUserId(user.id);

      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (mounted) setCourse(courseData);

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
        list = q2.data || [];
      } else {
        list = q1.data || [];
      }

      if (mounted) {
        setLessons(list);
        setLoadingCourse(false);
      }
    })();

    return () => { mounted = false; };
  }, [courseId, router, supabase]);

  // 2. Instant client-side lesson switch when lessonId changes (0ms lag!)
  useEffect(() => {
    if (!lessons.length) return;
    const current = lessons.find((l) => l.id === lessonId);
    if (current) {
      setLesson(current);
    }

    // Silent background fetch for lesson completion status
    if (userId && lessonId) {
      supabase
        .from("lesson_progress")
        .select("completed")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .maybeSingle()
        .then(({ data }) => {
          setCompleted(!!data?.completed);
        });
    }
  }, [lessonId, lessons, userId, supabase]);

  const index = useMemo(
    () => lessons.findIndex((l) => l.id === lessonId),
    [lessons, lessonId]
  );
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  const goToLesson = (id: string) => {
    // Instantly update state before router push
    const target = lessons.find((l) => l.id === id);
    if (target) setLesson(target);
    router.push(`/dashboard/learning/${courseId}/lesson/${id}`, { scroll: false });
  };

  const markComplete = async () => {
    if (!userId || !lessonId) return;
    setSaving(true);

    try {
      await supabase.from("lesson_progress").upsert(
        {
          user_id: userId,
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
        .eq("user_id", userId)
        .eq("completed", true);

      const doneSet = new Set((allProg || []).map((p: any) => p.lesson_id));
      doneSet.add(lessonId);
      const doneInCourse = lessons.filter((l) => doneSet.has(l.id)).length;
      const pct = Math.round((doneInCourse / total) * 100);

      await supabase
        .from("course_enrollments")
        .update({ progress: pct })
        .eq("user_id", userId)
        .eq("course_id", courseId);
    } catch {}

    setCompleted(true);
    setSaving(false);

    if (next) {
      setTimeout(() => goToLesson(next.id), 300);
    }
  };

  if (loadingCourse) return <ContentLoader label="Loading course..." />;

  if (!lesson) {
    return (
      <GlassCard className="p-8 text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-xl font-extrabold text-[#0B1528]">Lesson not found</h1>
        <Link href={`/dashboard/learning/${courseId}`}>
          <Button variant="primary">Back to course</Button>
        </Link>
      </GlassCard>
    );
  }

  return (
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

      <GlassCard className="p-6 sm:p-7">
        <h1 className="text-2xl font-extrabold text-[#0B1528] tracking-tight mb-2">
          {lesson.title}
        </h1>
        <p className="text-[13px] font-medium text-[#64748B]">
          {lesson.summary || "Study the concept, review the board, then mark complete."}
        </p>
        {lesson.duration_minutes ? (
          <p className="text-[11px] font-bold text-[#368AE4] mt-2">{lesson.duration_minutes} min</p>
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
              <Button variant="primary" onClick={markComplete} disabled={saving} className="rounded-2xl">
                <CheckCircle2 className="h-4 w-4" />
                {saving ? "Saving..." : "Mark Complete"}
              </Button>
            ) : (
              <Button variant="outline" disabled className="rounded-2xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Completed
              </Button>
            )}

            {prev && (
              <Button
                type="button"
                variant="glass"
                className="rounded-2xl"
                onClick={() => goToLesson(prev.id)}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
            )}
            {next && (
              <Button
                type="button"
                variant="glass"
                className="rounded-2xl"
                onClick={() => goToLesson(next.id)}
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
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
                <button
                  key={l.id}
                  type="button"
                  onClick={() => goToLesson(l.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-bold border text-left transition ${
                    l.id === lessonId
                      ? "bg-white border-[#368AE4] text-[#368AE4]"
                      : "bg-white/40 border-white/70 text-[#0B1528] hover:bg-white/70"
                  }`}
                >
                  <span className="truncate">
                    {i + 1}. {l.title}
                  </span>
                  {l.id === lessonId ? <Badge variant="blue">Now</Badge> : null}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
