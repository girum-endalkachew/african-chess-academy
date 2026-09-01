import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, User, Users, GraduationCap, Globe2, Trophy,
  BookOpen, Star, PlayCircle, Award, TrendingUp, Zap, Target, Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function HomePage() {
  return (
    <div className="px-6 sm:px-8 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-10 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: Text */}
          <div className="lg:col-span-5 space-y-6 relative z-30">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/40 border border-white/60 px-4 py-2 text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#368AE4] animate-pulse" />
              Building Champions. Shaping Leaders.
            </div>

            <h1 className="text-[3rem] sm:text-[3.4rem] lg:text-[4rem] font-extrabold tracking-tight text-[#0B1528] leading-[1.02]">
              Where African<br />
              Chess Talent<br />
              Becomes <span className="text-[#368AE4]">Global<br />Excellence.</span>
            </h1>

            <p className="text-[15px] text-[#64748B] max-w-[420px] leading-relaxed font-medium">
              Learn from experienced coaches, compete in meaningful tournaments,
              and develop the strategic mindset to reach your full potential.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/programs" className="btn-blue inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">
                Explore Programs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white/50 border border-white/80 px-6 py-3.5 text-sm font-bold text-[#0B1528] shadow-sm backdrop-blur transition hover:bg-white/70 hover:-translate-y-0.5">
                Join the Academy <User className="h-4 w-4 text-[#64748B]" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Knight scene with orbiting stats */}
          <div className="lg:col-span-7 relative z-10">
            <div className="relative mx-auto h-[460px] w-full max-w-[620px] sm:h-[520px] lg:h-[580px]">
              {/* Ambient glows */}
              <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#368AE4]/20 blur-[100px]" />
              <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
              <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />

              {/* Pedestal */}
              <div className="absolute bottom-[14%] left-1/2 h-10 w-56 -translate-x-1/2 rounded-full bg-white/70 blur-2xl" />
              <div className="absolute bottom-[16%] left-1/2 h-3 w-40 -translate-x-1/2 rounded-full bg-[#368AE4]/25 blur-lg" />

              {/* Knight */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[92%] w-[92%]">
                  <Image
                    src="/hero-knight.png"
                    alt="Chess Knight"
                    fill
                    priority
                    className="object-contain drop-shadow-[0_25px_50px_rgba(54,138,228,0.28)]"
                  />
                </div>
              </div>

              {/* Floating orbiting stat cards */}
              <GlassCard className="absolute left-1/2 top-[4%] z-20 flex -translate-x-1/2 items-center gap-3 px-4 py-3 min-w-[160px] shadow-lg">
                <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] flex items-center justify-center">
                  <Users className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0B1528] leading-none">500+</p>
                  <p className="text-[10px] font-bold text-[#64748B] mt-1">Students</p>
                </div>
              </GlassCard>

              <GlassCard className="absolute right-0 top-[30%] z-20 flex items-center gap-3 px-4 py-3 min-w-[160px] shadow-lg sm:right-[2%]">
                <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0B1528] leading-none">20+</p>
                  <p className="text-[10px] font-bold text-[#64748B] mt-1">Expert Coaches</p>
                </div>
              </GlassCard>

              <GlassCard className="absolute left-1/2 bottom-[6%] z-20 flex -translate-x-1/2 items-center gap-3 px-4 py-3 min-w-[160px] shadow-lg">
                <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0B1528] leading-none">100+</p>
                  <p className="text-[10px] font-bold text-[#64748B] mt-1">Tournaments</p>
                </div>
              </GlassCard>

              <GlassCard className="absolute left-0 top-[32%] z-20 flex items-center gap-3 px-4 py-3 min-w-[150px] shadow-lg sm:left-[2%]">
                <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] flex items-center justify-center">
                  <Globe2 className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0B1528] leading-none">15</p>
                  <p className="text-[10px] font-bold text-[#64748B] mt-1">Countries</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS STRIP */}
      <GlassCard className="px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <p className="text-[13px] font-extrabold text-[#0B1528] shrink-0 leading-snug">
          Building the future of<br />chess across <span className="text-[#368AE4]">Africa.</span>
        </p>
        <div className="hidden md:block h-10 w-px bg-white/80" />
        <div className="flex flex-wrap items-center justify-around gap-8 flex-1">
          {["FIDE", "AUSC", "ECF", "CHESS AFRICA", "lichess.org"].map((name) => (
            <span key={name} className="text-[13px] font-extrabold text-[#64748B]/60 tracking-widest uppercase">
              {name}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* STATS ROW (matching dashboard style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Users, val: "500+", lbl: "Active Students", color: "bg-[#EEF3FA] text-[#368AE4]" },
          { icon: Award, val: "100+", lbl: "Certificates", color: "bg-amber-50 text-amber-600" },
          { icon: Trophy, val: "50+", lbl: "Championships", color: "bg-emerald-50 text-emerald-600" },
          { icon: TrendingUp, val: "95%", lbl: "Success Rate", color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <GlassCard key={s.lbl} className="p-5" hoverEffect>
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#0B1528] leading-none">{s.val}</p>
                <p className="text-[10px] font-bold text-[#64748B] mt-1">{s.lbl}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* PROGRAMS + WHY ACA */}
      <div className="grid lg:grid-cols-12 gap-6 mb-10">
        {/* PROGRAMS */}
        <GlassCard className="lg:col-span-7 p-7">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Our Programs</h2>
            </div>
            <Link href="/programs" className="text-[11px] font-bold text-[#368AE4] hover:underline">View All Programs</Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Beginner Chess", d: "Learn fundamentals and build a strong foundation.", l: "Level 1", icon: "♙", bars: 1, color: "from-blue-400 to-blue-600" },
              { t: "Intermediate Strategy", d: "Develop tactics and strategic thinking.", l: "Level 2", icon: "♘", bars: 2, color: "from-purple-400 to-purple-600" },
              { t: "Advanced Mastery", d: "Master advanced concepts and competitive play.", l: "Level 3", icon: "♔", bars: 3, color: "from-amber-400 to-amber-600" },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl bg-white/50 border border-white/70 p-5 flex flex-col relative overflow-hidden hover:-translate-y-1 transition cursor-pointer">
                <span className="absolute -right-4 -bottom-6 text-[100px] text-[#368AE4] opacity-[0.05] leading-none pointer-events-none select-none">{p.icon}</span>

                <div className="relative z-10 flex-1">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-2xl shadow-md mb-4`}>
                    {p.icon}
                  </div>
                  <h3 className="text-[13px] font-extrabold text-[#0B1528] mb-2">{p.t}</h3>
                  <p className="text-[11px] font-medium text-[#64748B] leading-relaxed mb-6">{p.d}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/60">
                  <span className="text-[10px] font-extrabold text-[#64748B]">⏱ {p.l}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(b => (
                      <span key={b} className={`h-1.5 w-3 rounded-full ${b <= p.bars ? "bg-[#368AE4]" : "bg-[#64748B]/20"}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* WHY ACA */}
        <GlassCard className="lg:col-span-5 p-7">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Why ACA?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { i: User, t: "Expert Coaching", d: "Learn from FIDE-certified coaches.", color: "bg-[#EEF3FA] text-[#368AE4]" },
              { i: BookOpen, t: "Structured Learning", d: "Curriculum designed for real progress.", color: "bg-purple-50 text-purple-600" },
              { i: Trophy, t: "Competitive Tournaments", d: "Regular events to test your skills.", color: "bg-amber-50 text-amber-600" },
              { i: Globe2, t: "Global Community", d: "Join passionate players worldwide.", color: "bg-emerald-50 text-emerald-600" }
            ].map(w => (
              <div key={w.t} className="rounded-2xl bg-white/50 border border-white/70 p-4 flex gap-3 items-start hover:bg-white/70 transition">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${w.color}`}>
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

      {/* FEATURED COURSE + JOURNEY */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <GlassCard className="lg:col-span-2 p-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#368AE4]/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#368AE4]" />
              <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider">Featured</p>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0B1528] mb-3">Master Chess in 90 Days</h2>
            <p className="text-sm text-[#64748B] mb-6 max-w-lg leading-relaxed">
              Join our flagship program combining live coaching, structured lessons, and tournament practice for accelerated growth.
            </p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#EEF3FA] flex items-center justify-center">
                  <PlayCircle className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B1528]">90 Days</p>
                  <p className="text-[10px] text-[#64748B]">Full Program</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#EEF3FA] flex items-center justify-center">
                  <Target className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B1528]">+300 ELO</p>
                  <p className="text-[10px] text-[#64748B]">Avg Growth</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#EEF3FA] flex items-center justify-center">
                  <Zap className="h-4 w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B1528]">Live Coaching</p>
                  <p className="text-[10px] text-[#64748B]">Weekly Sessions</p>
                </div>
              </div>
            </div>

            <Link href="/register" className="btn-blue inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white">
              Enroll Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h3 className="font-extrabold text-[#0B1528]">Your Journey</h3>
          </div>

          <div className="space-y-3">
            {[
              { step: "1", label: "Sign Up", done: true },
              { step: "2", label: "Take Assessment", done: true },
              { step: "3", label: "Start Learning", done: false },
              { step: "4", label: "Play Tournaments", done: false },
              { step: "5", label: "Earn Certification", done: false },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                  s.done ? "bg-[#368AE4] text-white" : "bg-white/60 text-[#64748B] border border-white/80"
                }`}>
                  {s.done ? "✓" : s.step}
                </div>
                <p className={`text-xs font-bold ${s.done ? "text-[#0B1528]" : "text-[#64748B]"}`}>{s.label}</p>
              </div>
            ))}
          </div>

          <Link href="/register">
            <button className="w-full mt-4 rounded-xl bg-[#EEF3FA] hover:bg-[#DDEAF7] text-[#368AE4] text-xs font-extrabold py-3 transition">
              Start Your Journey
            </button>
          </Link>
        </GlassCard>
      </div>

      {/* TESTIMONIAL */}
      <GlassCard className="px-8 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-6xl text-[#368AE4] font-serif leading-none opacity-20 mt-4">"</span>
            <p className="text-[16px] font-bold text-[#0B1528] leading-relaxed">
              ACA changed the way I think. Chess is not just a game,<br className="hidden md:block" />
              it&apos;s a way of life that teaches strategy and patience.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-lg font-extrabold">
              SK
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0B1528]">Samuel K.</p>
              <p className="text-[11px] font-bold text-[#64748B]">ACA Student · 1650 ELO</p>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#368AE4]" />
            <span className="h-2 w-2 rounded-full bg-[#64748B]/30" />
            <span className="h-2 w-2 rounded-full bg-[#64748B]/30" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
