import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, User, Users, GraduationCap, Globe2, Trophy, 
  BookOpen, Star 
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function HomePage() {
  return (
    <div className="px-8 pb-20">
      
      {/* ──────── HERO SECTION ──────── */}
      <section className="relative grid lg:grid-cols-12 gap-10 items-center pt-12 pb-20">
        
        {/* 1. Left Text Content */}
        <div className="lg:col-span-5 space-y-8 relative z-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/40 border border-white/60 px-4 py-2 text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase backdrop-blur-md shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#368AE4]" />
            Building Champions. Shaping Leaders.
          </div>

          <h1 className="text-[3.5rem] lg:text-[4.2rem] font-extrabold tracking-tight text-[#0B1528] leading-[1.05]">
            Where African<br />
            Chess Talent<br />
            Becomes <span className="text-[#368AE4]">Global<br />Excellence.</span>
          </h1>

          <p className="text-base text-[#64748B] max-w-[420px] leading-relaxed font-medium">
            Learn from experienced coaches, compete in meaningful tournaments, and develop the strategic mindset to reach your full potential.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/programs" className="btn-blue inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5">
              Explore Programs <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white/50 border border-white/80 px-7 py-4 text-sm font-bold text-[#0B1528] shadow-sm backdrop-blur transition hover:bg-white/70 hover:-translate-y-0.5">
              Join the Academy <User className="h-4 w-4 ml-1 text-[#64748B]" />
            </Link>
          </div>
        </div>

        {/* 2. Center Stats Stack */}
        <div className="lg:col-span-3 relative z-30 flex flex-col gap-4 lg:-mr-12 mt-12 lg:mt-0">
          {[
            { icon: Users, val: "500+", lbl: "Students" },
            { icon: GraduationCap, val: "20+", lbl: "Expert Coaches" },
            { icon: Globe2, val: "15", lbl: "Countries" },
            { icon: Trophy, val: "100+", lbl: "Tournaments" },
          ].map((stat) => (
            <GlassCard key={stat.lbl} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#EEF3FA] shrink-0">
                <stat.icon className="h-5 w-5 text-[#368AE4]" />
              </div>
              <div>
                <p className="text-[22px] font-extrabold text-[#0B1528] leading-none">{stat.val}</p>
                <p className="text-[12px] font-bold text-[#64748B] mt-1.5">{stat.lbl}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 3. Right 3D Knight Scene */}
        <div className="lg:col-span-4 relative z-10 h-[500px] lg:h-[600px] flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] bg-[#368AE4]/15 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full border border-white/60 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-white/30 pointer-events-none" />
          <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 h-8 w-[240px] bg-white/80 blur-xl rounded-full" />

          <div className="absolute inset-0 flex items-center justify-center -mt-6">
            <div className="relative h-[115%] w-[115%] pointer-events-none">
              <Image src="/hero-knight.png" alt="3D Chess Knight" fill priority className="object-contain drop-shadow-[0_20px_40px_rgba(54,138,228,0.25)]" />
            </div>
          </div>

          <div className="absolute top-24 right-4 h-14 w-14 rounded-2xl bg-white/30 border border-white/60 backdrop-blur-md shadow-sm pointer-events-none" />
          <div className="absolute bottom-1/3 left-4 h-8 w-8 rounded-xl bg-white/40 border border-white/60 backdrop-blur-md shadow-sm pointer-events-none" />
          <div className="absolute top-1/4 right-20 h-2 w-2 rounded-full bg-[#368AE4] shadow-[0_0_12px_#368AE4] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1.5 rounded-full bg-[#368AE4] shadow-[0_0_12px_#368AE4] pointer-events-none" />
        </div>
      </section>

      {/* ──────── PARTNERS STRIP ──────── */}
      <GlassCard className="px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <p className="text-[14px] font-extrabold text-[#0B1528] shrink-0 leading-snug">
          Building the future of<br />chess across <span className="text-[#368AE4]">Africa.</span>
        </p>
        <div className="hidden md:block h-12 w-px bg-white/80" />
        <div className="flex flex-wrap items-center justify-around gap-10 flex-1">
          {["FIDE", "AUSC", "ECF", "CHESS AFRICA", "lichess.org"].map((name) => (
            <span key={name} className="text-[14px] font-extrabold text-[#64748B]/60 tracking-widest uppercase">
              {name}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* ──────── PROGRAMS & WHY ACA ──────── */}
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        
        {/* PROGRAMS (Left Side - 7 Cols) */}
        <GlassCard className="lg:col-span-7 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-lg font-extrabold text-[#0B1528]">Our Programs</h2>
            </div>
            <Link href="/programs" className="text-xs font-bold text-[#368AE4] hover:underline">View All Programs</Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { t: "Beginner Chess", d: "Learn the fundamentals and build a strong foundation.", l: "Level 1", icon: "♙", bars: 1 },
              { t: "Intermediate Strategy", d: "Develop your tactics and strategic thinking.", l: "Level 2", icon: "♘", bars: 2 },
              { t: "Advanced Mastery", d: "Master advanced concepts and competitive play.", l: "Level 3", icon: "♔", bars: 3 },
            ].map((p) => (
              <div key={p.t} className="bg-white/40 border border-white/60 rounded-[24px] p-5 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer">
                {/* Huge faint background watermark icon */}
                <span className="absolute -right-4 -bottom-6 text-[100px] text-[#368AE4] opacity-[0.05] leading-none pointer-events-none select-none">{p.icon}</span>
                
                <div className="relative z-10 flex-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-b from-[#EEF3FA] to-white flex items-center justify-center text-[#368AE4] text-2xl shadow-sm mb-4">
                    {p.icon}
                  </div>
                  <h3 className="text-[14px] font-extrabold text-[#0B1528] mb-2">{p.t}</h3>
                  <p className="text-[11px] font-medium text-[#64748B] leading-relaxed mb-6">{p.d}</p>
                </div>
                
                <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/60">
                  <span className="text-[10px] font-extrabold text-[#64748B]">⏱ {p.l}</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(b => (
                      <span key={b} className={`h-1.5 w-3 rounded-full ${b <= p.bars ? "bg-[#368AE4]" : "bg-[#64748B]/20"}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* WHY ACA (Right Side - 5 Cols) */}
        <GlassCard className="lg:col-span-5 p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-6 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-lg font-extrabold text-[#0B1528]">Why ACA?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {[
              { i: User, t: "Expert Coaching", d: "Learn from FIDE-certified coaches and grandmasters." },
              { i: BookOpen, t: "Structured Learning", d: "Curriculum designed for real progress and results." },
              { i: Trophy, t: "Competitive Tournaments", d: "Regular tournaments to test and improve your skills." },
              { i: Globe2, t: "Global Community", d: "Join a network of passionate players worldwide." }
            ].map(w => (
              <div key={w.t} className="bg-white/40 border border-white/60 rounded-[20px] p-4 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-[12px] bg-[#EEF3FA] flex items-center justify-center text-[#368AE4] shrink-0">
                  <w.i className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[13px] font-extrabold text-[#0B1528] mb-1">{w.t}</h3>
                  <p className="text-[11px] font-medium text-[#64748B] leading-relaxed">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ──────── TESTIMONIAL ──────── */}
      <GlassCard className="px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1">
          <span className="text-6xl text-[#368AE4] font-serif leading-none opacity-20 mt-4">“</span>
          <p className="text-[16px] font-bold text-[#0B1528] leading-relaxed">
            ACA changed the way I think. Chess is not just a game,<br className="hidden md:block"/>it&apos;s a way of life.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 md:mr-10">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#368AE4] to-[#60A5FA] border-2 border-white shadow-md flex items-center justify-center text-white text-base font-extrabold">
            SK
          </div>
          <div>
            <p className="text-[14px] font-extrabold text-[#0B1528]">Samuel K.</p>
            <p className="text-[11px] font-bold text-[#64748B] mb-1">ACA Student</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-[#368AE4] text-[#368AE4]" />)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-[#368AE4]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]/30" />
        </div>
      </GlassCard>

    </div>
  );
}