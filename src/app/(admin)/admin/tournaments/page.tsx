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

export default function AdminTournamentsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("Blitz");
  const [maxParticipants, setMaxParticipants] = useState(64);
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (prof?.role !== "admin") return router.push("/dashboard");

    setProfile(prof);

    const { data: tData } = await supabase.from("tournaments").select("*").order("tournament_date", { ascending: true });
    setTournaments(tData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("tournaments").insert({
      title,
      description,
      format,
      max_participants: maxParticipants,
      tournament_date: new Date(date).toISOString(),
      status: "Upcoming",
    });

    setTitle("");
    setDescription("");
    setShowForm(false);
    setSubmitting(false);
    await loadData();
  };

  const handleDeleteTournament = async (id: string) => {
    if (confirm("Are you sure you want to delete this tournament?")) {
      await supabase.from("tournaments").delete().eq("id", id);
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
            <h1 className="text-2xl font-bold text-[#1E293B]">Tournament Management</h1>
            <p className="text-sm text-slate-500 mt-1">Schedule and manage competitive academy tournaments.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="rounded-xl font-semibold gap-2 w-fit">
            <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Create Tournament"}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-[#1E293B] text-lg">Create New Tournament</h2>
            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tournament Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ACA Summer Rapid" className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Time Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full h-11 border border-[#DBE9F7] rounded-xl px-3 text-sm bg-white focus:outline-none">
                    <option value="Blitz">Blitz (3+2)</option>
                    <option value="Rapid">Rapid (10+5)</option>
                    <option value="Classical">Classical (30+10)</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tournament Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Max Players</label>
                  <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} className="h-11 rounded-xl" required min={8} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event rules & schedule details" className="h-11 rounded-xl" required />
              </div>

              <Button type="submit" disabled={submitting} className="rounded-xl font-semibold">
                {submitting ? "Publishing..." : "Publish Tournament"}
              </Button>
            </form>
          </div>
        )}

        {/* Tournaments List */}
        <div className="grid md:grid-cols-2 gap-5">
          {tournaments.map((t) => (
            <div key={t.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#1E293B] text-base">{t.title}</h3>
                  <p className="text-xs text-slate-500">{t.format} · {formatDate(t.tournament_date)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteTournament(t.id)} className="text-red-500 hover:bg-red-50 h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{t.current_participants} / {t.max_participants} Players</span>
                <Badge variant="success">{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}