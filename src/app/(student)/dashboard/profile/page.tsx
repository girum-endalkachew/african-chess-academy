"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, CheckCircle2
, Edit3 } from "lucide-react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function StudentProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      setFullName(prof?.full_name || "");
      setLoading(false);
    })();
  },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Student" userName={fullName || "Student"} navItems={navItems}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information and preferences.</p>
        </div>

        <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="h-16 w-16 rounded-full bg-[#E6F5FF] text-[#00A3E0] font-bold flex items-center justify-center text-2xl">
              {fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-[#1E293B] text-lg">{fullName}</h2>
              <p className="text-xs text-slate-500">{profile?.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="accent">Role: {profile?.role}</Badge>
                <Badge>Rating: {profile?.chess_rating || 1200} ELO</Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            {saved && (
              <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address (Read-Only)</label>
              <Input value={profile?.email || ""} disabled className="h-11 rounded-xl bg-slate-50 cursor-not-allowed" />
            </div>

            <Button type="submit" disabled={saving} className="rounded-xl font-semibold">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </PortalShell>
  );
}

