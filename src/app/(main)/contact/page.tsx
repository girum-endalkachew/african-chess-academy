import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <GlassCard className="p-8 text-center max-w-3xl mx-auto">
        <Badge variant="blue" className="mb-3">Get in Touch</Badge>
        <h1 className="text-4xl font-extrabold text-[#0B1528]">Contact African Chess Academy</h1>
        <p className="text-sm font-medium text-[#64748B] mt-2">Have questions about courses, partnerships, or enrollment?</p>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-8">
        <GlassCard className="lg:col-span-5 p-8 space-y-6">
          <h3 className="text-xl font-extrabold text-[#0B1528]">Contact Information</h3>
          <div className="space-y-4 text-xs font-bold text-[#64748B]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center shrink-0"><Mail className="h-5 w-5" /></div>
              <div><p className="text-[10px] text-[#64748B] uppercase">Email</p><p className="text-[#0B1528]">info@africanchessacademy.org</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center shrink-0"><Phone className="h-5 w-5" /></div>
              <div><p className="text-[10px] text-[#64748B] uppercase">Phone</p><p className="text-[#0B1528]">+251 900 000 000</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center shrink-0"><MapPin className="h-5 w-5" /></div>
              <div><p className="text-[10px] text-[#64748B] uppercase">Location</p><p className="text-[#0B1528]">Addis Ababa, Ethiopia</p></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-7 p-8 space-y-4">
          <h3 className="text-xl font-extrabold text-[#0B1528]">Send a Message</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-[10px] font-extrabold text-[#64748B] uppercase mb-1 block">First Name</label><Input placeholder="John" /></div>
            <div><label className="text-[10px] font-extrabold text-[#64748B] uppercase mb-1 block">Last Name</label><Input placeholder="Doe" /></div>
          </div>
          <div><label className="text-[10px] font-extrabold text-[#64748B] uppercase mb-1 block">Email</label><Input placeholder="john@example.com" /></div>
          <div><label className="text-[10px] font-extrabold text-[#64748B] uppercase mb-1 block">Message</label><textarea className="w-full rounded-xl border border-white/70 bg-white/50 p-4 text-xs font-medium text-[#0B1528] backdrop-blur min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#368AE4]/30" placeholder="How can we help you?" /></div>
          <Button variant="primary" className="w-full h-12 rounded-2xl">Send Message</Button>
        </GlassCard>
      </div>
    </div>
  );
}
