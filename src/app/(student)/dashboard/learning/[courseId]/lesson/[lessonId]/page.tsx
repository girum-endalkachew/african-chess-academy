"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  ArrowLeft, CheckCircle2, Clock
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

export default function LessonReaderPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshProgress = async (userId: string) => {
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);

    const { data: doneRows } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("course_id", courseId);

    const total = allLessons?.length || 0;
    const done = doneRows?.length || 0;
    const pct = total ? Math.round((done / total) * 100) : 0;

    await supabase.from("course_enrollments").upsert(
      {
        user_id: userId,
        course_id: courseId,
        progress: pct,
        status: pct >= 100 ? "completed" : "active",
      },
      { onConflict: "user_id,course_id" }
    );

    if (pct >= 100 && course) {
      const title = `${course.title} Certificate`;
      const { data: existing } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", userId)
        .eq("title", title)
        .maybeSingle();

      if (!existing) {
        await supabase.from("certificates").insert({
          user_id: userId,
          course_id: courseId,
          title,
        });
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: "Student" });

      const { data: courseData } = await supabase.from("courses").select("*").eq("id", courseId).single();
      setCourse(courseData);

      const { data: lessonData } = await supabase.from("lessons").select("*").eq("id", lessonId).single();
      setLesson(lessonData);

      const { data: list } = await supabase
        .from("lessons")
        .select("id, sort_order, title")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });
      setLessons(list || []);

      const { data: prog } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      setCompleted(!!prog);
      setLoading(false);
    })();
  }, [courseId, lessonId]);

  const markComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !lesson) return;

    setSaving(true);

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

    // ensure enrollment exists
    await supabase.from("course_enrollments").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        progress: 0,
        status: "active",
      },
      { onConflict: "user_id,course_id" }
    );

    await refreshProgress(user.id);
    setCompleted(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  const idx = lessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-3xl space-y-6">
        <div>
          <Link
            href={`/dashboard/learning/${courseId}`}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#00A3E0] mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to lessons
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline">{course?.title}</Badge>
            <Badge>Lesson {lesson?.sort_order}</Badge>
            {completed && <Badge variant="success">Completed</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">{lesson?.title}</h1>
          <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
            <Clock className="h-4 w-4" /> {lesson?.duration_minutes || 15} min read
          </p>
        </div>

        <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 sm:p-8 space-y-4">
          {lesson?.summary && (
            <p className="text-base font-medium text-[#00A3E0] bg-[#E6F5FF] border border-[#DBE9F7] rounded-xl p-4">
              {lesson.summary}
            </p>
          )}
          <div className="prose prose-slate max-w-none text-[#1E293B] leading-relaxed whitespace-pre-wrap text-[15px]">
            {lesson?.content}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {prev ? (
              <Link href={`/dashboard/learning/${courseId}/lesson/${prev.id}`}>
                <Button variant="outline" className="rounded-xl">Previous</Button>
              </Link>
            ) : (
              <Button variant="outline" className="rounded-xl" disabled>Previous</Button>
            )}
            {next ? (
              <Link href={`/dashboard/learning/${courseId}/lesson/${next.id}`}>
                <Button variant="outline" className="rounded-xl">Next</Button>
              </Link>
            ) : (
              <Button variant="outline" className="rounded-xl" disabled>Next</Button>
            )}
          </div>

          {completed ? (
            <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5" /> Lesson completed
            </div>
          ) : (
            <Button onClick={markComplete} disabled={saving} className="rounded-xl font-semibold gap-2">
              {saving ? "Saving..." : "Mark as complete"}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </PortalShell>
  );
}