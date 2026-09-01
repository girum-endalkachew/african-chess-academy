"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, Search, Bell, Loader2, Clock, Video, Users
} from "lucide-react";

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

  const join = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setBusyId(id);
    await supabase.from("event_registrations").insert({ user_id: user.id, event_id: id });
    await load();
    setBusyId(null);
  };

  const stats = useMemo(() => ({
    total: items.length,
    upcoming: items.filter(e => e.start_date && new Date(e.start_date) > new Date()).length,
    joined: joined.size,
  }), [items, joined]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  const firstName = (profile?.full_name || "Student").split(" ")[0];

  return (
    <>
<div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input type="text" placeholder="Search events..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none" />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] backdrop-blur"><Bell className="h-4 w-4" /></button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-[#368AE4] mb-1">📅 Hey, {firstName}!</p>
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
            Live <span className="text-[#368AE4]">Events</span> & Webinars
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center"><Calendar className="h-5 w-5" /></div>
              <div><p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.total}</p><p className="text-[10px] font-bold text-[#64748B] mt-1">All Events</p></div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
              <div><p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.upcoming}</p><p className="text-[10px] font-bold text-[#64748B] mt-1">Upcoming</p></div>
            </div>
          </GlassCard>
          <GlassCard className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users className="h-5 w-5" /></div>
              <div><p className="text-2xl font-extrabold text-[#0B1528] leading-none">{stats.joined}</p><p className="text-[10px] font-bold text-[#64748B] mt-1">Registered</p></div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Upcoming Events</h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-[#EEF3FA] flex items-center justify-center mb-3"><Video className="h-6 w-6 text-[#368AE4]" /></div>
              <p className="font-bold text-[#0B1528]">No events scheduled</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {items.map(e => (
                <div key={e.id} className="rounded-2xl bg-white/50 border border-white/70 p-5 hover:bg-white/70 transition">
                  <Badge variant="blue" className="mb-3">{e.type || "Webinar"}</Badge>
                  <h3 className="text-base font-extrabold text-[#0B1528] mb-2">{e.title || e.name}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{e.description}</p>
                  <p className="text-[11px] font-bold text-[#64748B] mb-4">{e.start_date ? new Date(e.start_date).toLocaleString() : "TBA"}</p>
                  {joined.has(e.id) ? <Button disabled variant="outline" className="w-full">✓ Registered</Button> : (
                    <Button variant="primary" className="w-full" disabled={busyId === e.id} onClick={() => join(e.id)}>
                      {busyId === e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}


