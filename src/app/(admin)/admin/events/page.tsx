"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, GraduationCap, Trophy, Calendar, Newspaper, BookOpen, Settings, Plus, Trash2
} from "lucide-react";
import { formatDate } from "@/lib/utils/date";

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

export default function AdminEventsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Webinar");
  const [eventLink, setEventLink] = useState("https://meet.google.com/aca-live");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (prof?.role !== "admin") return router.push("/dashboard");

    setProfile(prof);

    const { data: eData } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents(eData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("events").insert({
      title,
      description,
      event_type: eventType,
      event_link: eventLink,
      event_date: new Date(date).toISOString(),
    });

    setTitle("");
    setDescription("");
    setShowForm(false);
    setSubmitting(false);
    await loadData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await supabase.from("events").delete().eq("id", id);
      await loadData();
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Events & Webinars Manager</h1>
            <p className="text-sm text-slate-500 mt-1">Schedule live masterclasses and Google Meet sessions.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="rounded-xl font-semibold gap-2 w-fit">
            <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add New Event"}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-[#1E293B] text-lg">Schedule New Webinar/Clinic</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Event Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Endgame Lab Live" className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Event Type</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full h-11 border border-[#DBE9F7] rounded-xl px-3 text-sm bg-white focus:outline-none">
                    <option value="Webinar">Webinar</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Info Session">Info Session</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Event Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Google Meet / Video Link</label>
                  <Input value={eventLink} onChange={(e) => setEventLink(e.target.value)} className="h-11 rounded-xl" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Session topic & key takeaways" className="h-11 rounded-xl" required />
              </div>

              <Button type="submit" disabled={submitting} className="rounded-xl font-semibold">
                {submitting ? "Publishing..." : "Publish Event"}
              </Button>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="grid md:grid-cols-2 gap-5">
          {events.map((e) => (
            <div key={e.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#1E293B] text-base">{e.title}</h3>
                  <p className="text-xs text-slate-500">{e.event_type} · {formatDate(e.event_date)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(e.id)} className="text-red-500 hover:bg-red-50 h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{e.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px] text-[#00A3E0] truncate max-w-[200px]">{e.event_link}</span>
                <Badge variant="accent">{e.max_seats || 100} Seats</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}