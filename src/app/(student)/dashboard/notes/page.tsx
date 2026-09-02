"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StickyNote, Plus, Trash2 } from "lucide-react";

export default function NotesPage() {
  const supabase = createClient();
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fen, setFen] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("student_notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("student_notes").insert({ user_id: user.id, title, body, fen });
    setTitle(""); setBody(""); setFen("");
    await load();
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete note?")) return;
    await supabase.from("student_notes").delete().eq("id", id);
    await load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <StickyNote className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">My Study Notes</h1>
            <p className="text-xs text-[#64748B]">Save positions, ideas, and lesson notes</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <Input placeholder="Note title..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="w-full min-h-[80px] rounded-xl border border-white/70 bg-white/50 p-3 text-sm"
          placeholder="Your note..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Input placeholder="Optional FEN position..." value={fen} onChange={(e) => setFen(e.target.value)} className="font-mono text-xs" />
        <Button variant="primary" onClick={save} disabled={saving || !title}>
          <Plus className="h-4 w-4" /> {saving ? "Saving..." : "Save Note"}
        </Button>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <GlassCard className="p-10 text-center col-span-full font-bold text-[#64748B]">No notes yet — write your first one above!</GlassCard>
        ) : notes.map((n) => (
          <GlassCard key={n.id} className="p-5 space-y-2" hoverEffect>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#0B1528]">{n.title}</h3>
              <Button size="sm" variant="ghost" className="text-red-600 p-1" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-[#64748B] whitespace-pre-wrap">{n.body}</p>
            {n.fen && <code className="block text-[10px] font-mono text-[#368AE4] break-all bg-white/40 p-2 rounded">{n.fen}</code>}
            <p className="text-[10px] text-[#64748B]">{new Date(n.created_at).toLocaleDateString()}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
