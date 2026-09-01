"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Newspaper } from "lucide-react";

export default function AdminNewsPage() {
  const supabase = createClient();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      setNews(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">News & Articles Admin</h1>
        <p className="text-xs font-medium text-[#64748B] mt-1">{news.length} published articles</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map(n => (
          <GlassCard key={n.id} className="p-5 space-y-3" hoverEffect>
            <div className="flex items-center justify-between">
              <Badge variant="blue">{n.category || "News"}</Badge>
              <Newspaper className="h-4 w-4 text-[#368AE4]" />
            </div>
            <h3 className="font-extrabold text-[#0B1528] text-sm">{n.title}</h3>
            <p className="text-xs text-[#64748B] line-clamp-2">{n.content}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
