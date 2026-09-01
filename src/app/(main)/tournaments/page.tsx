import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

export default function PublicTournamentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <GlassCard className="p-8 text-center max-w-3xl mx-auto">
        <Badge variant="blue" className="mb-3">Competitions</Badge>
        <h1 className="text-4xl font-extrabold text-[#0B1528]">Academy Tournaments</h1>
        <p className="text-sm font-medium text-[#64748B] mt-2">Test your skills in Swiss and Blitz online championships.</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: "ACA Monthly Blitz Championship", date: "Online · Swiss System", players: "64 Players" },
          { title: "African Junior Qualifier", date: "Online · Rapid", players: "128 Players" },
        ].map((t) => (
          <GlassCard key={t.title} className="p-6 space-y-4" hoverEffect>
            <div className="flex items-center justify-between">
              <Badge variant="blue">Upcoming</Badge>
              <Trophy className="h-5 w-5 text-[#368AE4]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0B1528]">{t.title}</h3>
            <p className="text-xs font-bold text-[#64748B]">{t.date} · {t.players}</p>
            <Link href="/register">
              <Button variant="primary" className="w-full">Register to Play <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
