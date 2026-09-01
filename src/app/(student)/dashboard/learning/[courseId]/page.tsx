"use client";


import { ContentLoader } from "@/components/ui/content-loader";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, ArrowLeft, PlayCircle, CheckCircle2, Circle, Lock,
} from "lucide-react";

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  duration_minutes?: number | null;
  sort_order?: number | null;
  is_published?: boolean | null;
  board_fen?: string | null;
  board_note?: string | null;
};

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push("/login");

        const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(prof || { full_name: user.email?.split("@")[0] });

        const { data: courseData, error: courseErr } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
        if (courseErr) setErrorMsg(courseErr.message);
        setCourse(courseData);

        // CORRECT SCHEMA: sort_order, is_published, board_fen, summary
        const { data: lessonRows, error: lessonErr } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .eq("is_published", true)
          .order("sort_order", { ascending: true });

        if (lessonErr) {
          // fallback without is_published filter
          const { data: fallback, error: fallbackErr } = await supabase
            .from("lessons")
            .select("*")
            .eq("course_id", courseId)
            .order("sort_order", { ascending: true });
          if (fallbackErr) setErrorMsg(fallbackErr.message);
          setLessons((fallback || []) as Lesson[]);
        } else {
          setLessons((lessonRows || []) as Lesson[]);
        }

        const { data: enroll } = await supabase
          .from("course_enrollments")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle();
        setEnrollment(enroll);

        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("lesson_id, completed")
          .eq("user_id", user.id);

        if (progress) {
          setCompletedIds(
            new Set(
              progress
                .filter((p: any) => p.completed)
                .map((p: any) => p.lesson_id)
            )
          );
        }
      } catch (e: any) {
        setErrorMsg(e?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, router, supabase]);

  const progressPct = useMemo(() => {
    if (!lessons.length) return enrollment?.progress || 0;
    const done = lessons.filter((l) => completedIds.has(l.id)).length;
    return Math.round((done / lessons.length) * 100);
  }, [lessons, completedIds, enrollment]);

  const nextLesson = useMemo(() => {
    if (!lessons.length) return null;
    return lessons.find((l) => !completedIds.has(l.id)) || lessons[0];
  }, [lessons, completedIds]);

  const handleEnroll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setEnrolling(true);
    const { data, error } = await supabase
      .from("course_enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
        status: "active",
      })
      .select("*")
      .single();
    if (error) setErrorMsg(error.message);
    setEnrollment(data);
    setEnrolling(false);
  };

  if (loading) { return <ContentLoader />; }

  if (!course) {
    return (
      <>
<GlassCard className="p-8 text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-xl font-extrabold text-[#0B1528]">Course not found</h1>
          {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
          <Link href="/dashboard/learning">
            <Button variant="primary">Back to Learning</Button>
          </Link>
        </GlassCard>
      </>
    );
  }

  return (
    <>
<div className="mx-auto max-w-7xl space-y-6">
        <Link
          href="/dashboard/learning"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-[#64748B] hover:text-[#368AE4]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Learning
        </Link>

        {errorMsg && (
          <GlassCard className="p-4 border-red-200 bg-red-50 text-red-700 text-sm font-bold">
            {errorMsg}
          </GlassCard>
        )}

        <GlassCard className="relative overflow-hidden p-7 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="blue">{course.level || "All levels"}</Badge>
                <Badge variant="outline" className="normal-case tracking-normal">
                  {lessons.length || course.total_lessons || 0} lessons
                </Badge>
                {enrollment ? (
                  <Badge variant="success">Enrolled</Badge>
                ) : (
                  <Badge variant="warning">Not enrolled</Badge>
                )}
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1528] tracking-tight">
                {course.title}
              </h1>
              <p className="text-[14px] font-medium text-[#64748B] max-w-2xl leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div className="rounded-2xl bg-white/60 border border-white/80 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-1">
                  Progress
                </p>
                <p className="text-2xl font-extrabold text-[#0B1528] mb-2">{progressPct}%</p>
                <div className="h-2 rounded-full bg-[#EEF3FA] overflow-hidden">
                  <div className="h-full bg-[#368AE4]" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {!enrollment ? (
                <Button
                  variant="primary"
                  className="w-full h-12 rounded-2xl"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Enroll in Course"}
                </Button>
              ) : nextLesson ? (
                <Link
                  href={`/dashboard/learning/${courseId}/lesson/${nextLesson.id}`}
                  className="block"
                >
                  <Button variant="primary" className="w-full h-12 rounded-2xl">
                    <PlayCircle className="h-4 w-4" /> Continue Learning
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-12 gap-6">
          <GlassCard className="lg:col-span-8 p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-lg font-extrabold text-[#0B1528]">Curriculum</h2>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-sm font-bold text-[#0B1528]">No published lessons found</p>
                <p className="text-xs text-[#64748B]">
                  Check that lessons exist for this course and <code>is_published = true</code>.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, idx) => {
                  const done = completedIds.has(lesson.id);
                  const locked = !enrollment;
                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/45 px-4 py-3.5"
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          done
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[#EEF3FA] text-[#368AE4]"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : locked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-extrabold text-[#0B1528] truncate">
                          {idx + 1}. {lesson.title}
                        </p>
                        <p className="text-[11px] font-medium text-[#64748B] truncate">
                          {lesson.summary ||
                            lesson.board_note ||
                            (lesson.duration_minutes
                              ? `${lesson.duration_minutes} min`
                              : "Lesson content")}
                        </p>
                      </div>
                      {locked ? (
                        <Button size="sm" variant="outline" disabled>
                          Enroll first
                        </Button>
                      ) : (
                        <Link href={`/dashboard/learning/${courseId}/lesson/${lesson.id}`}>
                          <Button size="sm" variant={done ? "outline" : "primary"}>
                            {done ? "Review" : "Start"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          <div className="lg:col-span-4 space-y-4">
            <GlassCard className="p-6 space-y-3">
              <h3 className="text-sm font-extrabold text-[#0B1528]">Course info</h3>
              <div className="text-[12px] font-medium text-[#64748B] space-y-2">
                <p>
                  <span className="font-bold text-[#0B1528]">Level:</span>{" "}
                  {course.level || "All levels"}
                </p>
                <p>
                  <span className="font-bold text-[#0B1528]">Lessons:</span> {lessons.length}
                </p>
                <p>
                  <span className="font-bold text-[#0B1528]">Status:</span>{" "}
                  {enrollment ? "Active enrollment" : "Locked"}
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-3">
              <h3 className="text-sm font-extrabold text-[#0B1528]">Practice tools</h3>
              <Link href="/dashboard/play" className="block">
                <Button variant="glass" className="w-full justify-between">
                  Play Computer <Swords className="h-4 w-4 text-[#368AE4]" />
                </Button>
              </Link>
              <Link href="/dashboard/editor" className="block">
                <Button variant="glass" className="w-full justify-between">
                  Board Editor <Edit3 className="h-4 w-4 text-[#368AE4]" />
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}


