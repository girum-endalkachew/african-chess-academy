"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, CheckCircle2, Circle, BookOpen } from "lucide-react";

export default function ExploreCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: c } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (!c || !c.is_free) return router.push("/explore");
      setCourse(c);

      const { data: l } = await supabase.from("lessons").select("*").eq("course_id", courseId).eq("is_published", true).order("sort_order");
      setLessons(l || []);

      const { data: prog } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id).eq("completed", true);
      setCompleted(new Set((prog || []).map((p: any) => p.lesson_id)));

      setLoading(false);
    })();
  }, [courseId, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const progress = lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0;
  const nextLesson = lessons.find((l) => !completed.has(l.id)) || lessons[0];

  return (
    <div className="min-h-screen canvas-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#368AE4]">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 to-transparent" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="success" className="mb-2">FREE INTRO COURSE</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528]">{course.title}</h1>
              <p className="text-sm text-[#64748B] mt-1">{course.description}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase">Progress</p>
              <p className="text-3xl font-extrabold text-[#0B1528]">{progress}%</p>
              <div className="w-32 h-2 bg-white/60 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </GlassCard>

        {nextLesson && progress < 100 && (
          <Link href={`/explore/course/${courseId}/lesson/${nextLesson.id}`}>
            <GlassCard className="p-5 flex items-center justify-between hover:bg-white/60 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <PlayCircle className="h-8 w-8 text-[#368AE4]" />
                <div>
                  <p className="text-xs font-extrabold text-[#368AE4] uppercase tracking-wider">Continue</p>
                  <p className="text-sm font-extrabold text-[#0B1528]">{nextLesson.title}</p>
                </div>
              </div>
              <Button variant="primary">Start Lesson</Button>
            </GlassCard>
          </Link>
        )}

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Curriculum</h2>
          </div>
          <div className="space-y-2">
            {lessons.map((l, idx) => {
              const done = completed.has(l.id);
              return (
                <Link key={l.id} href={`/explore/course/${courseId}/lesson/${l.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/70 hover:bg-white/70 transition cursor-pointer">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${done ? "bg-emerald-50 text-emerald-600" : "bg-[#EEF3FA] text-[#368AE4]"}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-extrabold text-[#0B1528]">{idx + 1}. {l.title}</p>
                      <p className="text-[10px] text-[#64748B]">{l.duration_minutes || 10} min</p>
                    </div>
                    <Button size="sm" variant={done ? "outline" : "glass"}>{done ? "Review" : "Start"}</Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6 text-center space-y-3 bg-gradient-to-br from-[#368AE4]/10 to-transparent">
          <p className="text-sm font-extrabold text-[#0B1528]">Finished learning?</p>
          <p className="text-xs text-[#64748B]">Request Student access to unlock the full course library, puzzles, tournaments, and more!</p>
          <Link href="/explore">
            <Button variant="primary">Request Student Access →</Button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
