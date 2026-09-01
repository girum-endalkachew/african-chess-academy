"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function CoachMessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(me || { full_name: user.email?.split("@")[0] });
      // local draft notes until messaging table exists
      const saved = localStorage.getItem("aca_coach_notes");
      if (saved) setNotes(JSON.parse(saved));
      setLoading(false);
    })();
  }, [router, supabase]);

  const addNote = () => {
    if (!text.trim()) return;
    const next = [text.trim(), ...notes].slice(0, 30);
    setNotes(next);
    localStorage.setItem("aca_coach_notes", JSON.stringify(next));
    setText("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Coach" userName={profile?.full_name || "Coach"} navItems={navItems}>
      <div className="mx-auto max-w-3xl space-y-6">
        <GlassCard className="p-7">
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Messages / Notes</h1>
          <p className="text-sm text-[#64748B] mt-1">Quick coaching notes board (upgradeable to full inbox later).</p>
        </GlassCard>
        <GlassCard className="p-6 space-y-3">
          <Input placeholder="Write a coaching note..." value={text} onChange={(e) => setText(e.target.value)} />
          <Button variant="primary" onClick={addNote}>Save note</Button>
        </GlassCard>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <GlassCard className="p-8 text-center font-bold">No notes yet</GlassCard>
          ) : notes.map((n, i) => (
            <GlassCard key={i} className="p-4 text-sm font-medium text-[#0B1528]">{n}</GlassCard>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
