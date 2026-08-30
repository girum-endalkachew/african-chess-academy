"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
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
  CheckCircle2,
  ArrowRight,
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

export default function MyLearningPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });

    const { data: coursesData } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });
    setAllCourses(coursesData || []);

    const { data: enrollData } = await supabase
      .from("course_enrollments")
      .select("*, courses(*)")
      .eq("user_id", user.id);
    setEnrollments(enrollData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleEnroll = async (courseId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    // Go straight into the course lessons
    router.push(`/dashboard/learning/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">My Learning Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your active courses and continue your lessons.
          </p>
        </div>

        {/* Active Enrollments */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">In Progress ({enrollments.length})</h2>

          {enrollments.length === 0 ? (
            <div className="bg-white border border-[#DBE9F7] rounded-2xl p-8 text-center space-y-3">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-medium">You have not enrolled in any courses yet.</p>
              <p className="text-xs text-slate-400">Choose a course from the catalog below to start learning.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {enrollments.map((e) => {
                const courseId = e.course_id || e.courses?.id;
                return (
                  <div key={e.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent">{e.courses?.level || "All levels"}</Badge>
                      <span className="text-xs font-semibold text-[#00A3E0]">
                        {e.progress || 0}% Complete
                      </span>
                    </div>

                    <h3 className="font-bold text-[#1E293B] text-base">
                      {e.courses?.title || "Course"}
                    </h3>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00A3E0] transition-all"
                        style={{ width: `${e.progress || 0}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-500">
                      {e.courses?.total_lessons || 0} Total Lessons
                    </p>

                    <Link href={`/dashboard/learning/${courseId}`} className="block">
                      <Button className="w-full rounded-xl font-semibold gap-2">
                        Continue Learning
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Course Catalog */}
        <div className="space-y-4 pt-4 border-t border-[#DBE9F7]">
          <h2 className="text-lg font-semibold text-[#1E293B]">Course Catalog</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allCourses.map((c) => {
              const isEnrolled = enrolledCourseIds.has(c.id);

              return (
                <div
                  key={c.id}
                  className="bg-white border border-[#DBE9F7] rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{c.level || "All levels"}</Badge>
                      <BookOpen className="h-4 w-4 text-[#00A3E0]" />
                    </div>
                    <h3 className="font-bold text-[#1E293B]">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{c.description}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-3">{c.total_lessons} lessons</p>

                    {isEnrolled ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="h-4 w-4" /> Enrolled
                        </div>
                        <Link href={`/dashboard/learning/${c.id}`} className="block">
                          <Button variant="outline" size="sm" className="w-full rounded-xl gap-2">
                            Open Course <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleEnroll(c.id)}
                        disabled={enrollingId === c.id}
                        className="w-full rounded-xl gap-2 font-semibold"
                      >
                        {enrollingId === c.id ? "Enrolling..." : "Enroll Now"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}