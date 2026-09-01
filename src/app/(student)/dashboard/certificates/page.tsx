"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
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

export default function CertificatesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: user.email?.split("@")[0] });
      const { data } = await supabase.from("certificates").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="max-w-7xl mx-auto space-y-6">
        <GlassCard className="p-7"><h1 className="text-2xl font-extrabold text-[#0B1528]">Certificates</h1><p className="text-sm text-[#64748B] mt-1">Your completed milestones.</p></GlassCard>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.length === 0 ? <GlassCard className="p-8 text-center col-span-full font-bold">No certificates yet</GlassCard> : items.map((c) => (
            <GlassCard key={c.id} className="p-6 space-y-3" hoverEffect>
              <Badge variant="success">Awarded</Badge>
              <h3 className="font-extrabold text-[#0B1528]">{c.title || c.course_title || "Certificate"}</h3>
              <p className="text-xs text-[#64748B]">{c.issued_at || c.created_at ? new Date(c.issued_at || c.created_at).toLocaleDateString() : ""}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
