"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
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

export default function CoachSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(me || { full_name: user.email?.split("@")[0] });
      setLoading(false);
    })();
  }, [router, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="mx-auto max-w-3xl space-y-6">
        <GlassCard className="p-7">
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Settings</h1>
          <p className="text-sm text-[#64748B] mt-1">Coach account preferences</p>
        </GlassCard>
        <GlassCard className="p-7 space-y-4">
          <p className="text-sm font-bold text-[#0B1528]">Session</p>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={signOut}>Sign out</Button>
        </GlassCard>
      </div>
    </PortalShell>
  );
}
