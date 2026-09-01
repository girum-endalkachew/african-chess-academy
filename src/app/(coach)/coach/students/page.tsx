"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, Users, BookOpen, Calendar, MessageSquare, User, Settings, Swords, Trophy
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

export default function CoachStudentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (me?.role === "student") return router.push("/dashboard");
      if (me?.role === "admin") return router.push("/admin");
      setProfile(me || { full_name: user.email?.split("@")[0] });

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, chess_rating, created_at, role")
        .eq("role", "student")
        .order("full_name", { ascending: true });
      setStudents(data || []);
      setLoading(false);
    })();
  }, [router, supabase]);

  const filtered = students.filter((s) =>
    (s.full_name || "").toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-6">
        <GlassCard className="p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">My Students</h1>
            <p className="text-sm text-[#64748B] mt-1">{students.length} students in the academy</p>
          </div>
          <Input className="max-w-xs" placeholder="Search students..." value={q} onChange={(e) => setQ(e.target.value)} />
        </GlassCard>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <GlassCard className="p-8 text-center col-span-full font-bold">No students found</GlassCard>
          ) : filtered.map((s) => (
            <GlassCard key={s.id} className="p-5 space-y-3" hoverEffect>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white font-extrabold flex items-center justify-center">
                  {(s.full_name || "S").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-extrabold text-[#0B1528]">{s.full_name || "Student"}</p>
                  <p className="text-[11px] font-bold text-[#64748B]">Student</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="blue">{s.chess_rating || 1200} ELO</Badge>
                <Badge variant="outline" className="normal-case tracking-normal">Active</Badge>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
