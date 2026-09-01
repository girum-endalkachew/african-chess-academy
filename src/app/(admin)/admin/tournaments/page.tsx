"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Trophy } from "lucide-react";

export default function AdminTournamentsPage() {
  const supabase = createClient();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("tournaments").select("*").order("start_date", { ascending: false });
      setTournaments(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Tournaments Admin</h1>
        <p className="text-xs font-medium text-[#64748B] mt-1">{tournaments.length} tournaments created</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        {tournaments.map(t => (
          <GlassCard key={t.id} className="p-5 space-y-3" hoverEffect>
            <div className="flex items-center justify-between">
              <Badge variant="blue">{t.status || "Open"}</Badge>
              <Trophy className="h-4 w-4 text-[#368AE4]" />
            </div>
            <h3 className="font-extrabold text-[#0B1528] text-base">{t.title || t.name}</h3>
            <p className="text-xs text-[#64748B] line-clamp-2">{t.description}</p>
            <p className="text-[11px] font-bold text-[#64748B]">{t.start_date ? new Date(t.start_date).toLocaleString() : "Date TBA"}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
