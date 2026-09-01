"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, Users, BookOpen, Calendar, MessageSquare, User, Settings, Swords, Trophy
} from "lucide-react";

export default function CoachProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(me || { full_name: user.email?.split("@")[0], chess_rating: 2000 });
      setFullName(me?.full_name || "");
      setLoading(false);
    })();
  }, [router, supabase]);

  const save = async () => {
    if (!profile?.id) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
    setMsg("Saved");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <>`n<div className="mx-auto max-w-3xl space-y-6">
        <GlassCard className="p-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Coach Profile</h1>
            <p className="text-sm text-[#64748B] mt-1">Your public coaching identity</p>
          </div>
          <Badge variant="blue">{profile?.chess_rating || 2000} ELO</Badge>
        </GlassCard>
        <GlassCard className="p-7 space-y-4">
          <label className="text-xs font-extrabold text-[#64748B] uppercase">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
          {msg && <p className="text-sm font-bold text-emerald-600">{msg}</p>}
        </GlassCard>
      </div>
    </>
  );
}

