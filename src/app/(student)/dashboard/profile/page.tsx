"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });
      setFullName(prof?.full_name || "");
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!profile?.id) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
    setMsg("Saved");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Student" userName={fullName || profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-3xl mx-auto space-y-6">
        <GlassCard className="p-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Profile</h1>
            <p className="text-sm text-[#64748B] mt-1">Your academy identity</p>
          </div>
          <Badge variant="blue">{profile?.chess_rating || 1200} ELO</Badge>
        </GlassCard>
        <GlassCard className="p-7 space-y-4">
          <label className="text-xs font-extrabold text-[#64748B] uppercase">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
          {msg && <p className="text-sm font-bold text-emerald-600">{msg}</p>}
        </GlassCard>
      </div>
    </PortalShell>
  );
}
