"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, GraduationCap, Trophy, Calendar, Newspaper, BookOpen, Settings, Star
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

export default function AdminCoachesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof?.role !== "admin") return router.push("/dashboard");

      setProfile(prof);

      const { data: coachData } = await supabase.from("coaches").select("*").order("chess_rating", { ascending: false });
      setCoaches(coachData || []);

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
    <PortalShell role="Admin" userName={profile?.full_name || "Admin"} navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Verified Coaches Directory</h1>
          <p className="text-sm text-slate-500 mt-1">List of active coaches featured on the public website.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coaches.map((c) => (
            <div key={c.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#00A3E0] text-white font-bold flex items-center justify-center text-lg">
                  {c.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#1E293B]">{c.full_name}</h3>
                  <p className="text-xs text-slate-500">{c.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{c.bio || c.specialties}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Badge variant="accent">ELO {c.chess_rating}</Badge>
                {c.is_featured && <Badge variant="success">Featured</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}