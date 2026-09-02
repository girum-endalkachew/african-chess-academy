"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonBoard } from "@/components/chess/lesson-board";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ExploreLessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUserId(user.id);

      const { data: c } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (!c || !c.is_free) return router.push("/explore");
      setCourse(c);

      const { data: l } = await supabase.from("lessons").select("*").eq("course_id", courseId).eq("is_published", true).order("sort_order");
      setLessons(l || []);
      setLesson((l || []).find((x: any) => x.id === lessonId) || null);

      const { data: prog } = await supabase.from("lesson_progress").select("completed").eq("user_id", user.id).eq("lesson_id", lessonId).maybeSingle();
      setCompleted(!!prog?.completed);
      setLoading(false);
    })();
  }, [courseId, lessonId, router, supabase]);

  useEffect(() => {
    if (!lessons.length) return;
    setLesson(lessons.find((l) => l.id === lessonId) || null);
    if (userId && lessonId) {
      supabase.from("lesson_progress").select("completed").eq("user_id", userId).eq("lesson_id", lessonId).maybeSingle()
        .then(({ data }) => setCompleted(!!data?.completed));
    }
  }, [lessonId, lessons, userId, supabase]);

  const index = useMemo(() => lessons.findIndex((l) => l.id === lessonId), [lessons, lessonId]);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  const markComplete = async () => {
    if (!userId) return;
    setSaving(true);
    await supabase.from("lesson_progress").upsert({
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });

    const total = lessons.length;
    const { data: allProg } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", userId).eq("completed", true);
    const doneSet = new Set((allProg || []).map((p: any) => p.lesson_id));
    doneSet.add(lessonId);
    const pct = Math.round((lessons.filter((l) => doneSet.has(l.id)).length / total) * 100);
    await supabase.from("course_enrollments").update({ progress: pct }).eq("user_id", userId).eq("course_id", courseId);

    setCompleted(true);
    setSaving(false);
    if (next) setTimeout(() => router.push(`/explore/course/${courseId}/lesson/${next.id}`), 400);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;
  }
  if (!lesson) return null;

  return (
    <div className="min-h-screen canvas-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <Link href={`/explore/course/${courseId}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#368AE4]">
            <ArrowLeft className="h-4 w-4" /> {course?.title}
          </Link>
          <Badge variant="outline">Lesson {index + 1} / {lessons.length}</Badge>
        </div>

        <GlassCard className="p-6">
          <h1 className="text-2xl font-extrabold text-[#0B1528] mb-2">{lesson.title}</h1>
          <p className="text-sm text-[#64748B]">{lesson.summary}</p>
        </GlassCard>

        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-[#0B1528]">Lesson Notes</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#334155]">{lesson.content}</p>
          </GlassCard>

          <GlassCard className="p-4">
            <p className="text-xs font-extrabold text-[#0B1528] mb-3">Interactive Board</p>
            <LessonBoard fen={lesson.board_fen} note={lesson.board_note} />
          </GlassCard>
        </div>

        <GlassCard className="p-5 flex flex-wrap gap-2">
          {!completed ? (
            <Button variant="primary" onClick={markComplete} disabled={saving}>
              <CheckCircle2 className="h-4 w-4" /> {saving ? "Saving..." : "Mark Complete"}
            </Button>
          ) : (
            <Button variant="outline" disabled><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Completed</Button>
          )}
          {prev && (
            <Link href={`/explore/course/${courseId}/lesson/${prev.id}`}>
              <Button variant="glass"><ArrowLeft className="h-4 w-4" /> Previous</Button>
            </Link>
          )}
          {next && (
            <Link href={`/explore/course/${courseId}/lesson/${next.id}`}>
              <Button variant="glass">Next <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
