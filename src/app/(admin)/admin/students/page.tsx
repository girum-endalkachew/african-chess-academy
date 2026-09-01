"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";

export default function AdminStudentsPage() {
  const supabase = createClient();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("role", "student").order("created_at", { ascending: false });
      setStudents(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = students.filter(s => (s.full_name || "").toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Students Directory</h1>
          <p className="text-xs font-medium text-[#64748B] mt-1">{students.length} registered students</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-xs" />
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <GlassCard key={s.id} className="p-5 space-y-3" hoverEffect>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white font-extrabold flex items-center justify-center text-sm">
                {(s.full_name || "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-[#0B1528] text-sm truncate">{s.full_name || "Student"}</p>
                <p className="text-[10px] text-[#64748B] truncate">{s.email || "No email"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/60">
              <Badge variant="blue">{s.chess_rating || 1200} ELO</Badge>
              <Badge variant="success">Active</Badge>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
