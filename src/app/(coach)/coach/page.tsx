"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import {
  LayoutDashboard, Users, BookOpen, Calendar, MessageSquare, User, Settings, Swords
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

export default function CoachDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data?.role === "admin") return router.push("/admin");
      if (data?.role === "student") return router.push("/dashboard");
      setProfile(data || { full_name: user.email?.split("@")[0], chess_rating: 2000 });
      setLoading(false);
    })();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">Coach Workspace</h1>
        <p className="text-sm text-slate-500">Manage students and train on the board.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5">
            <p className="text-xs text-slate-500">Your rating</p>
            <p className="text-3xl font-bold text-[#00A3E0]">{profile?.chess_rating || 2000} ELO</p>
          </div>
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5">
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-lg font-bold text-[#1E293B]">Verified Coach</p>
          </div>
          <a href="/coach/play" className="bg-[#E6F5FF] border border-[#DBE9F7] rounded-2xl p-5 hover:bg-[#DBE9F7] transition-colors">
            <p className="text-xs text-slate-500">Practice</p>
            <p className="text-lg font-bold text-[#00A3E0]">Play vs Computer</p>
          </a>
        </div>
      </div>
    </PortalShell>
  );
}