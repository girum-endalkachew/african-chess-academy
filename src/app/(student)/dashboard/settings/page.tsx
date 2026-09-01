"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, Swords, LogOut
, Edit3 } from "lucide-react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play", label: "Play Computer", icon: Swords },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data || { full_name: "Student" });
      setLoading(false);
    })();
  },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 }, [router, supabase]);

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
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Account preferences and session controls.</p>
        </div>

        <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="font-semibold text-[#1E293B]">{profile?.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="font-semibold text-[#1E293B] capitalize">{profile?.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Chess rating</p>
            <p className="font-semibold text-[#00A3E0]">{profile?.chess_rating || 1200} ELO</p>
          </div>
          <Button onClick={signOut} variant="outline" className="rounded-xl gap-2 text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </PortalShell>
  );
}

