"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
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

export default function CoachSessionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(me || { full_name: user.email?.split("@")[0] });

      // reuse events as sessions feed if dedicated sessions table is absent
      const { data } = await supabase.from("events").select("*").order("start_date", { ascending: true });
      setItems(data || []);
      setLoading(false);
    })();
  }, [router, supabase]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-6">
        <GlassCard className="p-7">
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Sessions</h1>
          <p className="text-sm text-[#64748B] mt-1">Upcoming clinics, webinars, and coaching sessions.</p>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          {items.length === 0 ? (
            <GlassCard className="p-8 text-center col-span-full font-bold">No sessions scheduled</GlassCard>
          ) : items.map((e) => (
            <GlassCard key={e.id} className="p-5 space-y-2" hoverEffect>
              <Badge variant="blue">{e.type || "Session"}</Badge>
              <h3 className="font-extrabold text-[#0B1528]">{e.title || e.name}</h3>
              <p className="text-xs text-[#64748B]">{e.description}</p>
              <p className="text-[11px] font-bold text-[#64748B]">{e.start_date ? new Date(e.start_date).toLocaleString() : "TBA"}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
