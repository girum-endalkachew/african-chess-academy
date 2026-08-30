import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Trophy, BookOpen, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <Badge className="mb-4">About ACA</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] max-w-3xl leading-tight">
            Building Africa&apos;s next generation of chess champions
          </h1>
          <p className="mt-5 text-slate-600 text-lg max-w-2xl leading-relaxed">
            African Chess Academy is a modern learning platform where students train with expert coaches,
            compete in tournaments, join webinars, and track real progress — all in one place.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Target, title: "Our Mission", text: "Make high-quality chess education accessible across Africa." },
            { icon: Heart, title: "Our Values", text: "Discipline, growth, sportsmanship, and community." },
            { icon: Globe, title: "Our Reach", text: "Students, coaches, and events connected on one digital platform." },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-[#DBE9F7] rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center mb-4">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-[#1E293B] text-lg mb-2">{item.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Students", value: "1,000+" },
            { icon: BookOpen, label: "Programs", value: "12+" },
            { icon: Trophy, label: "Tournaments", value: "40+" },
            { icon: Users, label: "Coaches", value: "25+" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 text-center">
              <s.icon className="h-5 w-5 text-[#00A3E0] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#1E293B]">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/register"><Button className="rounded-xl">Join ACA</Button></Link>
          <Link href="/contact"><Button variant="outline" className="rounded-xl">Contact us</Button></Link>
        </div>
      </section>
    </div>
  );
}