import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default function PublicEventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <GlassCard className="p-8 text-center max-w-3xl mx-auto">
        <Badge variant="blue" className="mb-3">Live Sessions</Badge>
        <h1 className="text-4xl font-extrabold text-[#0B1528]">Events & Webinars</h1>
        <p className="text-sm font-medium text-[#64748B] mt-2">Masterclasses and interactive clinics with grandmasters.</p>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: "Opening Preparation Masterclass", host: "Grandmaster Clinic" },
          { title: "Middlegame Calculation Workshop", host: "Tactics Deep Dive" },
        ].map((e) => (
          <GlassCard key={e.title} className="p-6 space-y-4" hoverEffect>
            <div className="flex items-center justify-between">
              <Badge variant="blue">Webinar</Badge>
              <Calendar className="h-5 w-5 text-[#368AE4]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0B1528]">{e.title}</h3>
            <p className="text-xs font-bold text-[#64748B]">{e.host}</p>
            <Link href="/register">
              <Button variant="outline" className="w-full">Reserve Seat <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
