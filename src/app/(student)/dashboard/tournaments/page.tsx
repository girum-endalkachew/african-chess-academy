"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, CheckCircle2, Users
, Edit3 } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function StudentTournamentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });

    const { data: tData } = await supabase.from("tournaments").select("*").order("tournament_date", { ascending: true });
    setTournaments(tData || []);

    const { data: rData } = await supabase.from("tournament_registrations").select("tournament_id").eq("user_id", user.id);
    setRegistrations(rData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 }, [router, supabase]);

  const handleRegister = async (tournamentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setActionId(tournamentId);
    await supabase.from("tournament_registrations").insert({
      tournament_id: tournamentId,
      user_id: user.id,
    });

    await loadData();
    setActionId(null);
  };

  const handleUnregister = async (tournamentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setActionId(tournamentId);
    await supabase.from("tournament_registrations").delete().eq("tournament_id", tournamentId).eq("user_id", user.id);

    await loadData();
    setActionId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  const registeredIds = new Set(registrations.map((r) => r.tournament_id));

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Tournament Arena</h1>
          <p className="text-sm text-slate-500 mt-1">Register for academy tournaments and test your skill.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {tournaments.map((t) => {
            const isRegistered = registeredIds.has(t.id);
            return (
              <div key={t.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E293B]">{t.title}</h3>
                      <p className="text-xs text-slate-500">{t.format} time control</p>
                    </div>
                  </div>
                  <Badge variant="success">{t.status}</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium text-[#1E293B]">
                    <Calendar className="h-3.5 w-3.5 text-[#00A3E0]" />
                    {formatDate(t.tournament_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#00A3E0]" />
                    {t.current_participants} / {t.max_participants} players
                  </span>
                </div>

                {isRegistered ? (
                  <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> You are registered!
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUnregister(t.id)}
                      disabled={actionId === t.id}
                      className="text-xs text-red-600 hover:bg-red-50 h-8"
                    >
                      {actionId === t.id ? "Processing..." : "Cancel"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleRegister(t.id)}
                    disabled={actionId === t.id}
                    className="w-full rounded-xl font-semibold"
                  >
                    {actionId === t.id ? "Registering..." : "Register Now"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}

