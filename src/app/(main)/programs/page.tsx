import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <GlassCard className="p-8 text-center max-w-3xl mx-auto">
        <Badge variant="blue" className="mb-3">Academy Programs</Badge>
        <h1 className="text-4xl font-extrabold text-[#0B1528]">Structured Chess Courses</h1>
        <p className="text-sm font-medium text-[#64748B] mt-2">Clear progression paths for beginner, intermediate, and advanced players.</p>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Beginner Fundamentals", level: "Level 1", lessons: "12 Lessons", desc: "Piece moves, basic checkmates, opening principles." },
          { title: "Intermediate Strategy", level: "Level 2", lessons: "18 Lessons", desc: "Tactical patterns, middlegame planning, pawn structures." },
          { title: "Advanced Mastery", level: "Level 3", lessons: "24 Lessons", desc: "Positional play, endgame technique, tournament preparation." },
        ].map((p) => (
          <GlassCard key={p.title} className="p-6 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="blue">{p.level}</Badge>
                <BookOpen className="h-5 w-5 text-[#368AE4]" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0B1528] mb-2">{p.title}</h3>
              <p className="text-xs font-medium text-[#64748B] leading-relaxed mb-4">{p.desc}</p>
            </div>
            <div className="pt-4 border-t border-white/60 flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B]">{p.lessons}</span>
              <Link href="/register">
                <Button size="sm" variant="primary">Enroll <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
