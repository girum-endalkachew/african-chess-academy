import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Star } from "lucide-react";

export default function PublicCoachesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <GlassCard className="p-8 text-center max-w-3xl mx-auto">
        <Badge variant="blue" className="mb-3">Expert Mentors</Badge>
        <h1 className="text-4xl font-extrabold text-[#0B1528]">Learn from FIDE Certified Coaches</h1>
        <p className="text-sm font-medium text-[#64748B] mt-2">Dedicated Grandmasters and International Masters guiding your growth.</p>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: "Coach Kidane", title: "Tactics & Blitz Specialist", rating: "2140" },
          { name: "Coach Sara", title: "Youth & Fundamentals", rating: "1980" },
          { name: "Coach Abel", title: "Strategy & Tournament Prep", rating: "2265" },
        ].map((c) => (
          <GlassCard key={c.name} className="p-6 text-center space-y-4" hoverEffect>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
              {c.name.split(" ").pop()?.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0B1528]">{c.name}</h3>
              <p className="text-xs font-bold text-[#64748B] mt-0.5">{c.title}</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <Badge variant="blue">{c.rating} ELO</Badge>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
