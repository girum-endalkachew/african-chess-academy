"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, CheckCircle2, Video
} from "lucide-react";
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

export default function StudentEventsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0] });

    const { data: eData } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents(eData || []);

    const { data: rData } = await supabase.from("event_registrations").select("event_id").eq("user_id", user.id);
    setRegistrations(rData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleRegister = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setActionId(eventId);
    await supabase.from("event_registrations").insert({
      event_id: eventId,
      user_id: user.id,
    });

    await loadData();
    setActionId(null);
  };

  const handleUnregister = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setActionId(eventId);
    await supabase.from("event_registrations").delete().eq("event_id", eventId).eq("user_id", user.id);

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

  const registeredIds = new Set(registrations.map((r) => r.event_id));

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Events & Webinars</h1>
          <p className="text-sm text-slate-500 mt-1">Join live masterclasses and coaching sessions.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {events.map((e) => {
            const isRegistered = registeredIds.has(e.id);
            return (
              <div key={e.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B]">{e.title}</h3>
                    <p className="text-xs text-slate-500">{e.event_type}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{e.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium text-[#1E293B]">
                    <Calendar className="h-3.5 w-3.5 text-[#00A3E0]" />
                    {formatDate(e.event_date)}
                  </span>
                  <Badge variant="outline">{e.max_seats} Seats</Badge>
                </div>

                {isRegistered ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Reserved
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnregister(e.id)}
                        disabled={actionId === e.id}
                        className="text-xs text-red-600 hover:bg-red-50 h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                    {e.event_link && (
                      <a href={e.event_link} target="_blank" rel="noreferrer" className="block">
                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                          Join Live Google Meet
                        </Button>
                      </a>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleRegister(e.id)}
                    disabled={actionId === e.id}
                    className="w-full rounded-xl font-semibold"
                  >
                    {actionId === e.id ? "Reserving..." : "Reserve Seat"}
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