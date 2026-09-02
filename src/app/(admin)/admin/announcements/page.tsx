"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Plus } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("announcements").insert({ title, body, category, created_by: user?.id });
    setTitle(""); setBody("");
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    await load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Platform Announcements</h1>
        <p className="text-xs text-[#64748B] mt-1">Broadcast messages to all users</p>
      </GlassCard>

      <GlassCard className="p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="h-5 w-5 text-[#368AE4]" />
          <h2 className="font-extrabold text-[#0B1528]">Create Announcement</h2>
        </div>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="w-full min-h-[100px] rounded-xl border border-white/70 bg-white/50 p-3 text-sm"
          placeholder="Announcement body..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <select className="h-11 w-full rounded-xl border border-white/70 bg-white/50 px-3 text-sm font-bold" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="general">General</option>
          <option value="tournament">Tournament</option>
          <option value="course">Course Update</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <Button variant="primary" onClick={create} disabled={saving || !title || !body}>
          <Bell className="h-4 w-4" /> {saving ? "Publishing..." : "Publish Announcement"}
        </Button>
      </GlassCard>

      <div className="space-y-3">
        {items.length === 0 ? (
          <GlassCard className="p-10 text-center font-bold text-[#64748B]">No announcements yet</GlassCard>
        ) : items.map((a) => (
          <GlassCard key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="blue">{a.category}</Badge>
                <p className="font-extrabold text-[#0B1528]">{a.title}</p>
              </div>
              <p className="text-xs text-[#64748B]">{a.body}</p>
              <p className="text-[10px] text-[#64748B] mt-1">{new Date(a.created_at).toLocaleString()}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
