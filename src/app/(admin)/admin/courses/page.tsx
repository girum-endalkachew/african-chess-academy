"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen } from "lucide-react";

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      setCourses(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Course Management</h1>
        <p className="text-xs font-medium text-[#64748B] mt-1">{courses.length} courses in catalog</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(c => (
          <GlassCard key={c.id} className="p-5 space-y-3" hoverEffect>
            <div className="flex items-center justify-between">
              <Badge variant="blue">{c.level || "All levels"}</Badge>
              <BookOpen className="h-4 w-4 text-[#368AE4]" />
            </div>
            <h3 className="font-extrabold text-[#0B1528] text-sm">{c.title}</h3>
            <p className="text-xs text-[#64748B] line-clamp-2">{c.description}</p>
            <div className="pt-2 border-t border-white/60 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
              <span>{c.total_lessons || 0} Lessons</span>
              <Badge variant="accent">Published</Badge>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
