"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, GraduationCap, Trophy, Calendar, Newspaper, BookOpen, Settings, LogOut
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/coaches", label: "Coaches", icon: GraduationCap },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data?.role !== "admin") return router.push("/dashboard");
      setProfile(data);
      setLoading(false);
    })();
  }, [router, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Admin" userName={profile?.full_name || "Admin"} navItems={navItems}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Admin Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Platform account controls.</p>
        </div>
        <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500">Admin email</p>
            <p className="font-semibold text-[#1E293B]">{profile?.email}</p>
          </div>
          <Button onClick={signOut} variant="outline" className="rounded-xl gap-2 text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </PortalShell>
  );
}