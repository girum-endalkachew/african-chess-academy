"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { GraduationCap } from "lucide-react";

export default function AdminCoachesPage() {
  const supabase = createClient();
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("role", "coach").order("created_at", { ascending: false });
      setCoaches(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Coaches Directory</h1>
        <p className="text-xs font-medium text-[#64748B] mt-1">{coaches.length} verified academy coaches</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map(c => (
          <GlassCard key={c.id} className="p-5 space-y-3" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#0B1528] text-white font-extrabold flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-extrabold text-[#0B1528] text-sm">{c.full_name || "Coach"}</p>
                <p className="text-[10px] text-[#64748B]">FIDE Certified Coach</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/60">
              <Badge variant="blue">{c.chess_rating || 2000} ELO</Badge>
              <Badge variant="accent">Verified</Badge>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
