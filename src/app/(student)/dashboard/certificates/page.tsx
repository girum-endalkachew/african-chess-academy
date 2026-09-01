"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, Search, Bell, Download, Sparkles
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

  const firstName = (profile?.full_name || "Student").split(" ")[0];

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input type="text" placeholder="Search..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none" />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] backdrop-blur"><Bell className="h-4 w-4" /></button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-[#368AE4] mb-1">🏅 Hey, {firstName}!</p>
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
            Your <span className="text-[#368AE4]">Achievements</span>
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Award className="h-5 w-5" /></div>
              <div><p className="text-2xl font-extrabold text-[#0B1528] leading-none">{items.length}</p><p className="text-[10px] font-bold text-[#64748B] mt-1">Certificates</p></div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
              <div><p className="text-2xl font-extrabold text-[#0B1528] leading-none">{items.length * 100}</p><p className="text-[10px] font-bold text-[#64748B] mt-1">Points Earned</p></div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Trophy className="h-5 w-5" /></div>
              <div><p className="text-2xl font-extrabold text-[#0B1528] leading-none">{items.length > 0 ? "Gold" : "—"}</p><p className="text-[10px] font-bold text-[#64748B] mt-1">Rank</p></div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Earned Certificates</h2>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center mb-3"><Award className="h-8 w-8 text-amber-700" /></div>
              <p className="font-bold text-[#0B1528]">No certificates yet</p>
              <p className="text-xs text-[#64748B] mt-1">Complete courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(c => (
                <div key={c.id} className="rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 p-5 hover:-translate-y-1 transition shadow-sm">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3 shadow-md">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <Badge variant="success" className="mb-2">Awarded</Badge>
                  <h3 className="font-extrabold text-[#0B1528] mb-1">{c.title || c.course_title || "Certificate"}</h3>
                  <p className="text-[10px] font-bold text-[#64748B] mb-3">{c.issued_at || c.created_at ? new Date(c.issued_at || c.created_at).toLocaleDateString() : ""}</p>
                  <button className="w-full text-xs font-bold text-[#368AE4] flex items-center justify-center gap-1 hover:underline">
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PortalShell>
  );
}
