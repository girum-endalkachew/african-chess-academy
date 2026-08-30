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

export default function AdminNewsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState("Announcement");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (prof?.role !== "admin") return router.push("/dashboard");

    setProfile(prof);

    const { data: newsData } = await supabase.from("news").select("*").order("published_at", { ascending: false });
    setNews(newsData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("news").insert({
      title,
      excerpt,
      tag,
      published_at: new Date().toISOString(),
    });

    setTitle("");
    setExcerpt("");
    setShowForm(false);
    setSubmitting(false);
    await loadData();
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("Are you sure you want to delete this news post?")) {
      await supabase.from("news").delete().eq("id", id);
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
            <h1 className="text-2xl font-bold text-[#1E293B]">News & Announcements</h1>
            <p className="text-sm text-slate-500 mt-1">Publish updates to the public homepage and news feed.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="rounded-xl font-semibold gap-2 w-fit">
            <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Post News"}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-[#1E293B] text-lg">Publish New Announcement</h2>
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Headline Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grandmaster Simultaneous Exhibition" className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tag / Category</label>
                  <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full h-11 border border-[#DBE9F7] rounded-xl px-3 text-sm bg-white focus:outline-none">
                    <option value="Announcement">Announcement</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Courses">Courses</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Summary Excerpt</label>
                <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short announcement summary" className="h-11 rounded-xl" required />
              </div>

              <Button type="submit" disabled={submitting} className="rounded-xl font-semibold">
                {submitting ? "Publishing..." : "Publish Post"}
              </Button>
            </form>
          </div>
        )}

        {/* News List */}
        <div className="grid md:grid-cols-2 gap-5">
          {news.map((p) => (
            <div key={p.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{p.tag}</Badge>
                    <span className="text-xs text-slate-400">{formatDate(p.published_at)}</span>
                  </div>
                  <h3 className="font-bold text-[#1E293B] text-base leading-snug">{p.title}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteNews(p.id)} className="text-red-500 hover:bg-red-50 h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{p.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}