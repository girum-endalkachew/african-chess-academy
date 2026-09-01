import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";

export default function PublicNewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <GlassCard className="p-8 text-center max-w-3xl mx-auto">
        <Badge variant="blue" className="mb-3">Academy Updates</Badge>
        <h1 className="text-4xl font-extrabold text-[#0B1528]">News & Articles</h1>
        <p className="text-sm font-medium text-[#64748B] mt-2">Latest stories, tournament results, and instructional guides.</p>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "ACA Open Championship Registrations Live", tag: "Tournament" },
          { title: "New Intermediate Tactics Curriculum Released", tag: "Courses" },
          { title: "Calculating Under Pressure: Clinic Recap", tag: "Webinar" },
        ].map((n) => (
          <GlassCard key={n.title} className="p-6 space-y-3" hoverEffect>
            <div className="flex items-center justify-between">
              <Badge variant="blue">{n.tag}</Badge>
              <Newspaper className="h-4 w-4 text-[#368AE4]" />
            </div>
            <h3 className="text-base font-extrabold text-[#0B1528]">{n.title}</h3>
            <p className="text-xs text-[#64748B]">Read the full article and updates inside the academy portal.</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
