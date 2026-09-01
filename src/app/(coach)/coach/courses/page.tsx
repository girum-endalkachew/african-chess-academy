"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
  Settings,
  Swords,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/coach", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coach/students", label: "My Students", icon: Users },
  { href: "/coach/courses", label: "My Courses", icon: BookOpen },
  { href: "/coach/play", label: "Play Computer", icon: Swords },
  { href: "/coach/sessions", label: "Sessions", icon: Calendar },
  { href: "/coach/messages", label: "Messages", icon: MessageSquare },
  { href: "/coach/profile", label: "Profile", icon: User },
  { href: "/coach/settings", label: "Settings", icon: Settings },
];

export default function CoachCoursesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (me?.role === "student") return router.push("/dashboard");
      setProfile(me || { full_name: user.email?.split("@")[0] });

      const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: true });
      setCourses(data || []);
      setLoading(false);
    })();
  }, [router, supabase]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-6">
        <GlassCard className="p-7">
          <h1 className="text-2xl font-extrabold text-[#0B1528]">My Courses</h1>
          <p className="text-sm text-[#64748B] mt-1">Review curriculum and guide students through lessons.</p>
        </GlassCard>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.length === 0 ? (
            <GlassCard className="p-8 text-center col-span-full font-bold">No courses found</GlassCard>
          ) : courses.map((c) => (
            <GlassCard key={c.id} className="p-5 space-y-3" hoverEffect>
              <div className="flex items-center justify-between">
                <Badge variant="blue">{c.level || "All levels"}</Badge>
                <div className="h-8 w-8 rounded-lg bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center"><BookOpen className="h-4 w-4" /></div>
              </div>
              <h3 className="font-extrabold text-[#0B1528]">{c.title}</h3>
              <p className="text-xs text-[#64748B] line-clamp-2">{c.description}</p>
              <p className="text-[11px] font-bold text-[#64748B]">{c.total_lessons || 0} lessons</p>
              <Link href={"/dashboard/learning/" + c.id}>
                <Button variant="outline" className="w-full">Preview as learning path</Button>
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
