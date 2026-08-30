import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="mb-4">Programs</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">Courses & learning paths</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">Structured programs for beginners to advanced players.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(courses || []).map((c) => (
            <div key={c.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="accent">{c.level || "All levels"}</Badge>
                <BookOpen className="h-4 w-4 text-[#00A3E0]" />
              </div>
              <h2 className="font-bold text-lg text-[#1E293B]">{c.title}</h2>
              <p className="text-sm text-slate-600 mt-2 flex-1">{c.description}</p>
              <p className="text-xs text-slate-500 mt-4 mb-4">{c.total_lessons} lessons</p>
              <Link href="/register">
                <Button variant="outline" className="w-full rounded-xl gap-2">
                  Enroll <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
        {(!courses || courses.length === 0) && (
          <p className="text-center text-slate-500 py-10">No courses yet. Seed data in Supabase.</p>
        )}
      </section>
    </div>
  );
}