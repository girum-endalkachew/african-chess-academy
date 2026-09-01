"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, Swords, Edit3,
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
import { Loader2 } from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });
    const { data: events } = await supabase.from("events").select("*").order("start_date", { ascending: true });
    setItems(events || []);
    const { data: regs } = await supabase.from("event_registrations").select("event_id").eq("user_id", user.id);
    setJoined(new Set((regs || []).map((r: any) => r.event_id)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const join = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setBusyId(eventId);
    await supabase.from("event_registrations").insert({ user_id: user.id, event_id: eventId });
    await load();
    setBusyId(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-7xl mx-auto space-y-6">
        <GlassCard className="p-7"><h1 className="text-2xl font-extrabold text-[#0B1528]">Events & Webinars</h1><p className="text-sm text-[#64748B] mt-1">Live sessions, clinics, and academy events.</p></GlassCard>
        <div className="grid md:grid-cols-2 gap-5">
          {items.length === 0 ? <GlassCard className="p-8 text-center col-span-full font-bold">No events yet</GlassCard> : items.map((e) => (
            <GlassCard key={e.id} className="p-6 space-y-3" hoverEffect>
              <Badge variant="blue">{e.type || "Event"}</Badge>
              <h3 className="text-lg font-extrabold text-[#0B1528]">{e.title || e.name}</h3>
              <p className="text-xs text-[#64748B]">{e.description}</p>
              <p className="text-[11px] font-bold text-[#64748B]">{e.start_date ? new Date(e.start_date).toLocaleString() : "TBA"}</p>
              {joined.has(e.id) ? <Button disabled variant="outline" className="w-full">Registered</Button> : (
                <Button variant="primary" className="w-full" disabled={busyId===e.id} onClick={() => join(e.id)}>
                  {busyId===e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
                </Button>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
