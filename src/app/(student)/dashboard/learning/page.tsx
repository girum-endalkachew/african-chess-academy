"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  CheckCircle2, ArrowRight, Swords, PlayCircle, Edit3, Search,
  Bell, TrendingUp, Target, Clock, Zap
} from "lucide-react";

export default function MyLearningPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });

    const { data: coursesData } = await supabase.from("courses").select("*").order("created_at", { ascending: true });
    setAllCourses(coursesData || []);

    const { data: enrollData } = await supabase.from("course_enrollments").select("*, courses(*)").eq("user_id", user.id);
    setEnrollments(enrollData || []);

    const { data: progData } = await supabase.from("lesson_progress").select("*").eq("user_id", user.id).eq("completed", true);
    setLessonProgress(progData || []);

    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleEnroll = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setEnrollingId(courseId);
    await supabase.from("course_enrollments").insert({ user_id: user.id, course_id: courseId, progress: 0, status: "active" });
    await loadData();
    setEnrollingId(null);
    router.push(`/dashboard/learning/${courseId}`);
  };

  const stats = useMemo(() => {
    const totalEnrolled = enrollments.length;
    const completed = enrollments.filter(e => (e.progress || 0) === 100).length;
    const inProgress = enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;
    const totalLessons = enrollments.reduce((sum, e) => sum + (e.courses?.total_lessons || 0), 0);
    const completedLessons = lessonProgress.length;
    const avgProgress = totalEnrolled > 0 ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / totalEnrolled) : 0;
    return { totalEnrolled, completed, inProgress, totalLessons, completedLessons, avgProgress };
  }, [enrollments, lessonProgress]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;
  }

  const enrolledCourseIds = new Set(enrollments.map(e => e.course_id));
  const filteredCourses = allCourses.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const displayedEnrollments = enrollments.filter(e => {
    if (filter === "active") return (e.progress || 0) < 100;
    if (filter === "completed") return (e.progress || 0) === 100;
    return true;
  });

  const firstName = (profile?.full_name || "Student").split(" ")[0];

  return (
    <>
<div className="mx-auto max-w-[1400px]">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[#368AE4]/30"
            />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] hover:text-[#0B1528] backdrop-blur relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>

        {/* Hero */}
        <div className="mb-6">
          <p className="text-sm font-bold text-[#368AE4] mb-1">📚 Hey, {firstName}!</p>
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
            Your Learning <span className="text-[#368AE4]">Journey</span>
          </h1>
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center"><BookOpen className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.totalEnrolled}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Enrolled</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.completed}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Completed</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Zap className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.completedLessons}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Lessons Done</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center"><Target className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.avgProgress}%</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">Avg Progress</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* In Progress */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                  <h2 className="text-base font-extrabold text-[#0B1528]">My Courses</h2>
                </div>
                <div className="flex gap-1 bg-white/50 border border-white/70 rounded-xl p-1">
                  {(["all", "active", "completed"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition ${filter === f ? "bg-[#368AE4] text-white" : "text-[#64748B] hover:text-[#0B1528]"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {displayedEnrollments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-[#EEF3FA] flex items-center justify-center mb-3">
                    <BookOpen className="h-6 w-6 text-[#368AE4]" />
                  </div>
                  <p className="text-sm font-bold text-[#0B1528] mb-1">No courses in this view</p>
                  <p className="text-xs text-[#64748B]">Browse the catalog below to start learning</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {displayedEnrollments.map(e => (
                    <Link key={e.id} href={`/dashboard/learning/${e.course_id}`}>
                      <div className="rounded-2xl bg-white/50 border border-white/70 p-5 hover:bg-white/70 hover:-translate-y-0.5 transition cursor-pointer h-full">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="blue">{e.courses?.level || "All levels"}</Badge>
                          <span className="text-[10px] font-extrabold text-[#368AE4]">{e.progress || 0}%</span>
                        </div>
                        <h3 className="font-extrabold text-[#0B1528] text-sm mb-3 leading-tight">{e.courses?.title}</h3>
                        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-gradient-to-r from-[#368AE4] to-[#60A5FA]" style={{ width: `${e.progress || 0}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B]">
                          <span>{e.courses?.total_lessons || 0} lessons</span>
                          <span className="text-[#368AE4]">Continue →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Catalog */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h2 className="text-base font-extrabold text-[#0B1528]">Course Catalog</h2>
                <Badge variant="outline" className="normal-case tracking-normal ml-2">{filteredCourses.length}</Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map(c => {
                  const isEnrolled = enrolledCourseIds.has(c.id);
                  return (
                    <div key={c.id} className="rounded-2xl bg-white/50 border border-white/70 p-4 hover:bg-white/70 transition">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{c.level || "All"}</Badge>
                        <div className="h-8 w-8 rounded-lg bg-[#EEF3FA] flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-[#368AE4]" />
                        </div>
                      </div>
                      <h3 className="font-extrabold text-[#0B1528] text-[13px] leading-tight mb-1">{c.title}</h3>
                      <p className="text-[10px] text-[#64748B] line-clamp-2 mb-3">{c.description}</p>
                      <p className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3 pb-3 border-b border-white/60">{c.total_lessons} lessons</p>
                      {isEnrolled ? (
                        <Link href={`/dashboard/learning/${c.id}`}>
                          <Button variant="outline" size="sm" className="w-full text-xs">Open Course</Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="glass" onClick={() => handleEnroll(c.id)} disabled={enrollingId === c.id} className="w-full text-xs">
                          {enrollingId === c.id ? "..." : "Enroll"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <GlassCard className="p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#368AE4]/10 to-transparent" />
              <div className="relative z-10">
                <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider mb-2">Streak</p>
                <p className="text-3xl font-extrabold text-[#0B1528] mb-1">{stats.completedLessons}</p>
                <p className="text-[11px] font-bold text-[#64748B]">Lessons completed this journey</p>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-4">Quick Actions</p>
              <div className="space-y-2">
                <Link href="/dashboard/play"><Button variant="primary" className="w-full text-xs h-11 justify-between"><span>Play Computer</span><Swords className="h-3.5 w-3.5" /></Button></Link>
                <Link href="/dashboard/editor"><Button variant="glass" className="w-full text-xs h-11 justify-between"><span>Board Editor</span><Edit3 className="h-3.5 w-3.5 text-[#368AE4]" /></Button></Link>
                <Link href="/dashboard/tournaments"><Button variant="glass" className="w-full text-xs h-11 justify-between"><span>Tournaments</span><Trophy className="h-3.5 w-3.5 text-[#368AE4]" /></Button></Link>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Tip of the day</p>
              <p className="text-xs font-bold text-[#0B1528] leading-relaxed">"Study endgames first — they teach you what all the pieces really do."</p>
              <p className="text-[10px] text-[#64748B] mt-2 italic">— José Raúl Capablanca</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}


