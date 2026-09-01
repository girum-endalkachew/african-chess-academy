import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, Users, Globe2, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <GlassCard className="p-8 sm:p-12 relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
        <Badge variant="blue" className="mb-4">About ACA</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1528] tracking-tight leading-tight">
          Building Africa’s Next Generation of <span className="text-[#368AE4]">Chess Champions</span>
        </h1>
        <p className="text-base text-[#64748B] font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
          African Chess Academy is a unified ecosystem for learning, competing, and community across the continent.
        </p>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "Structured Learning", desc: "Curriculum designed by Grandmasters and FIDE coaches." },
          { icon: Users, title: "Global Community", desc: "Connect with passionate players across 15+ countries." },
          { icon: Award, title: "Real Excellence", desc: "Track ratings, earn certificates, and compete in major tournaments." },
        ].map((item) => (
          <GlassCard key={item.title} className="p-6 text-center" hoverEffect>
            <div className="h-12 w-12 rounded-2xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center mx-auto mb-4">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-[#0B1528] text-lg mb-2">{item.title}</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
