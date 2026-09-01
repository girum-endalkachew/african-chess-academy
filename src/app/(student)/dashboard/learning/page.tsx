"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  CheckCircle2,
  ArrowRight,
  Swords,
  PlayCircle,
  Edit3,
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

export default function MyLearningPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });

    const { data: coursesData } = await supabase.from("courses").select("*").order("created_at", { ascending: true });
    setAllCourses(coursesData || []);

    const { data: enrollData } = await supabase.from("course_enrollments").select("*, courses(*)").eq("user_id", user.id);
    setEnrollments(enrollData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleEnroll = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setEnrollingId(courseId);
    await supabase.from("course_enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      progress: 0,
      status: "active",
    });

    await loadData();
    setEnrollingId(null);
    router.push(`/dashboard/learning/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-7xl mx-auto space-y-8">
        <GlassCard className="relative overflow-hidden p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-white/80">
          <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-[28px] font-extrabold text-[#0B1528] tracking-tight">My Learning Hub</h1>
            <p className="text-[#64748B] text-[13px] font-medium mt-1">Master chess step-by-step with structured courses.</p>
          </div>
          <div className="relative z-10 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
        </GlassCard>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-[18px] font-extrabold text-[#0B1528]">In Progress ({enrollments.length})</h2>
          </div>

          {enrollments.length === 0 ? (
            <GlassCard className="p-8 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-[#EEF3FA] flex items-center justify-center mb-3">
                <BookOpen className="h-5 w-5 text-[#368AE4]" />
              </div>
              <p className="text-[14px] font-bold text-[#0B1528] mb-1">No enrolled courses yet</p>
              <p className="text-[12px] text-[#64748B]">Choose a course from the catalog below to start learning.</p>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {enrollments.map((e) => {
                const courseId = e.course_id || e.courses?.id;
                return (
                  <GlassCard key={e.id} className="p-6 flex flex-col justify-between" hoverEffect>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="blue">{e.courses?.level || "All levels"}</Badge>
                        <span className="text-[11px] font-extrabold text-[#368AE4] bg-[#EEF3FA] px-2 py-1 rounded-md">
                          {e.progress || 0}% Complete
                        </span>
                      </div>
                      <h3 className="font-extrabold text-[#0B1528] text-[16px] mb-4">{e.courses?.title || "Course"}</h3>
                      <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-6 border border-white/80">
                        <div className="h-full bg-gradient-to-r from-[#368AE4] to-[#60A5FA] rounded-full transition-all" style={{ width: `${e.progress || 0}%` }} />
                      </div>
                    </div>
                    <Link href={`/dashboard/learning/${courseId}`} className="block">
                      <Button variant="primary" className="w-full rounded-xl">
                        <PlayCircle className="h-4 w-4" /> Continue Learning
                      </Button>
                    </Link>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-[18px] font-extrabold text-[#0B1528]">Course Catalog</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allCourses.map((c) => {
              const isEnrolled = enrolledCourseIds.has(c.id);
              return (
                <GlassCard key={c.id} className="p-5 flex flex-col justify-between" hoverEffect>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{c.level || "All levels"}</Badge>
                      <div className="h-8 w-8 rounded-lg bg-[#EEF3FA] flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#368AE4]" />
                      </div>
                    </div>
                    <h3 className="font-extrabold text-[#0B1528] text-[15px] leading-tight mb-2">{c.title}</h3>
                    <p className="text-[11px] font-medium text-[#64748B] line-clamp-2 leading-relaxed mb-4">{c.description}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3 pb-3 border-b border-white/50">
                      {c.total_lessons} Lessons Included
                    </p>
                    {isEnrolled ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="h-4 w-4" /> Enrolled
                        </div>
                        <Link href={`/dashboard/learning/${c.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl">Open <ArrowRight className="h-3.5 w-3.5" /></Button>
                        </Link>
                      </div>
                    ) : (
                      <Button size="sm" variant="glass" onClick={() => handleEnroll(c.id)} disabled={enrollingId === c.id} className="w-full rounded-xl">
                        {enrollingId === c.id ? "Enrolling..." : "Enroll Now"} <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
