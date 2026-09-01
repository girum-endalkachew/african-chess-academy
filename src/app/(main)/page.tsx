import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, User, Users, GraduationCap, Globe2, Trophy, 
  BookOpen, Star 
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function HomePage() {
  return (
    <div className="px-5 sm:px-8 pb-20">
      
      {/* ──────── HERO SECTION ──────── */}
<section className="relative pt-8 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
  <div className="grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">

    {/* LEFT COPY — tighter, less empty air */}
    <div className="lg:col-span-5 xl:col-span-5 space-y-6 relative z-30 pr-0 lg:pr-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/40 border border-white/60 px-4 py-2 text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase backdrop-blur-md shadow-sm">
        <span className="h-2 w-2 rounded-full bg-[#368AE4]" />
        Building Champions. Shaping Leaders.
      </div>

      <h1 className="text-[3rem] sm:text-[3.4rem] lg:text-[3.8rem] xl:text-[4.1rem] font-extrabold tracking-tight text-[#0B1528] leading-[1.02]">
        Where African
        <br />
        Chess Talent
        <br />
        Becomes{" "}
        <span className="text-[#368AE4]">
          Global
          <br />
          Excellence.
        </span>
      </h1>

      <p className="text-[15px] text-[#64748B] max-w-[400px] leading-relaxed font-medium">
        Learn from experienced coaches, compete in meaningful tournaments,
        and develop the strategic mindset to reach your full potential.
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/programs"
          className="btn-blue inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Explore Programs <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-full bg-white/50 border border-white/80 px-6 py-3.5 text-sm font-bold text-[#0B1528] shadow-sm backdrop-blur transition hover:bg-white/70 hover:-translate-y-0.5"
        >
          Join the Academy <User className="h-4 w-4 text-[#64748B]" />
        </Link>
      </div>
    </div>

    {/* RIGHT: KNIGHT STAGE + ORBITING STATS */}
    <div className="lg:col-span-7 relative z-10">
      <div className="relative mx-auto h-[460px] w-full max-w-[620px] sm:h-[520px] lg:h-[560px] lg:max-w-none lg:-ml-6">

        {/* soft stage glow */}
        <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-[48%] rounded-full bg-[#368AE4]/20 blur-[90px]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-[48%] rounded-full border border-white/50" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-[48%] rounded-full border border-white/25" />

        {/* pedestal */}
        <div className="absolute bottom-[14%] left-1/2 h-10 w-56 -translate-x-1/2 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute bottom-[16%] left-1/2 h-3 w-40 -translate-x-1/2 rounded-full bg-[#368AE4]/25 blur-lg" />

        {/* KNIGHT — shifted toward true center of this stage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[92%] w-[92%] sm:h-[95%] sm:w-[95%]">
            <Image
              src="/hero-knight.png"
              alt="3D Chess Knight"
              fill
              priority
              className="object-contain drop-shadow-[0_25px_50px_rgba(54,138,228,0.28)]"
              sizes="(max-width: 1024px) 90vw, 560px"
            />
          </div>
        </div>

        {/* decorative chips */}
        <div className="absolute right-[12%] top-[16%] h-10 w-10 rounded-2xl bg-white/35 border border-white/70 backdrop-blur-md" />
        <div className="absolute left-[18%] top-[22%] h-6 w-6 rounded-xl bg-white/30 border border-white/60 backdrop-blur-md" />
        <div className="absolute right-[22%] top-[28%] h-2 w-2 rounded-full bg-[#368AE4] shadow-[0_0_12px_#368AE4]" />
        <div className="absolute left-[30%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-[#368AE4] shadow-[0_0_10px_#368AE4]" />

        {/* ========== ORBITING STAT CARDS ========== */}
        {/* top */}
        <GlassCard className="absolute left-1/2 top-[6%] z-20 flex -translate-x-1/2 items-center gap-3 px-4 py-3 min-w-[150px] shadow-lg shadow-blue-500/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FA]">
            <Users className="h-4 w-4 text-[#368AE4]" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0B1528] leading-none">500+</p>
            <p className="text-[11px] font-bold text-[#64748B] mt-1">Students</p>
          </div>
        </GlassCard>

        {/* right */}
        <GlassCard className="absolute right-0 top-[34%] z-20 flex items-center gap-3 px-4 py-3 min-w-[150px] shadow-lg shadow-blue-500/5 sm:right-[2%]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FA]">
            <GraduationCap className="h-4 w-4 text-[#368AE4]" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0B1528] leading-none">20+</p>
            <p className="text-[11px] font-bold text-[#64748B] mt-1">Expert Coaches</p>
          </div>
        </GlassCard>

        {/* bottom */}
        <GlassCard className="absolute left-1/2 bottom-[8%] z-20 flex -translate-x-1/2 items-center gap-3 px-4 py-3 min-w-[150px] shadow-lg shadow-blue-500/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FA]">
            <Trophy className="h-4 w-4 text-[#368AE4]" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0B1528] leading-none">100+</p>
            <p className="text-[11px] font-bold text-[#64748B] mt-1">Tournaments</p>
          </div>
        </GlassCard>

        {/* left */}
        <GlassCard className="absolute left-0 top-[36%] z-20 flex items-center gap-3 px-4 py-3 min-w-[150px] shadow-lg shadow-blue-500/5 sm:left-[2%]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FA]">
            <Globe2 className="h-4 w-4 text-[#368AE4]" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0B1528] leading-none">15</p>
            <p className="text-[11px] font-bold text-[#64748B] mt-1">Countries</p>
          </div>
        </GlassCard>
      </div>
    </div>
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