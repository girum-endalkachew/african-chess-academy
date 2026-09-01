import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, User, Users, GraduationCap, Globe2, Trophy,
  BookOpen, Star, PlayCircle, Award, TrendingUp, Zap, Target, Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function HomePage() {
  return (
    <div className="px-3 sm:px-8 pb-16 sm:pb-20 max-w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-4 sm:pt-10 pb-12 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Text */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 relative z-30 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/50 border border-white/70 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#368AE4] animate-pulse" />
              Building Champions. Shaping Leaders.
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.8rem] font-extrabold tracking-tight text-[#0B1528] leading-[1.06]">
              Where African<br />
              Chess Talent<br />
              Becomes <span className="text-[#368AE4]">Global<br />Excellence.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] max-w-[420px] leading-relaxed font-medium">
              Learn from experienced coaches, compete in meaningful tournaments,
              and develop the strategic mindset to reach your full potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/programs" className="btn-blue inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">
                Explore Programs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/60 border border-white px-6 py-3.5 text-sm font-bold text-[#0B1528] shadow-sm backdrop-blur transition hover:bg-white">
                Join the Academy <User className="h-4 w-4 text-[#64748B]" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Map Scene */}
          <div className="lg:col-span-7 relative z-10">
            <div className="relative mx-auto h-[420px] sm:h-[520px] lg:h-[600px] w-full max-w-[580px] flex items-center justify-center">
              {/* Background ambient glows */}
              <div className="absolute left-1/2 top-1/2 h-[260px] sm:h-[380px] w-[260px] sm:w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#368AE4]/20 blur-[60px] sm:blur-[100px]" />
              <div className="absolute left-1/2 top-1/2 h-[300px] sm:h-[440px] w-[300px] sm:w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
              
              {/* Pedestal */}
              <div className="absolute bottom-[10%] left-1/2 h-8 w-40 sm:w-56 -translate-x-1/2 rounded-full bg-white/70 blur-xl" />

              {/* Africa Map Image */}
              <div className="relative h-[90%] w-[90%] flex items-center justify-center">
                <Image
                  src="/africa-map.png"
                  alt="African Continent Map"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_20px_40px_rgba(54,138,228,0.25)]"
                />
              </div>

              {/* DESKTOP/TABLET ORBITING CARDS (hidden on small mobile to prevent clipping) */}
              <GlassCard className="flex absolute left-1/2 top-[2%] z-20 -translate-x-1/2 items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#EEF3FA] flex items-center justify-center"><Users className="h-4 w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">500+</p><p className="text-[9px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Students</p></div>
              </GlassCard>

              <GlassCard className="flex absolute right-0 top-[28%] z-20 items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#EEF3FA] flex items-center justify-center"><GraduationCap className="h-4 w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">20+</p><p className="text-[9px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Coaches</p></div>
              </GlassCard>

              <GlassCard className="flex absolute left-1/2 bottom-[2%] z-20 -translate-x-1/2 items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#EEF3FA] flex items-center justify-center"><Trophy className="h-4 w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">100+</p><p className="text-[9px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Tournaments</p></div>
              </GlassCard>

              <GlassCard className="flex absolute left-0 top-[28%] z-20 items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#EEF3FA] flex items-center justify-center"><Globe2 className="h-4 w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">15</p><p className="text-[9px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Countries</p></div>
              </GlassCard>
            </div>

            </div>
      </section>

      {/* VISION & MISSION */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <GlassCard className="p-5 sm:p-7 relative overflow-hidden" hoverEffect>
          <div className="absolute top-0 right-0 h-28 w-28 bg-gradient-to-br from-[#368AE4]/20 to-transparent rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] flex items-center justify-center text-white shadow-md shrink-0">
                <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider">Our Vision</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1528]">Chess Excellence Across Africa</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed">
              To make Africa a global powerhouse of chess by nurturing talent, building sustainable ecosystems, and inspiring grandmasters from every corner of the continent.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-7 relative overflow-hidden" hoverEffect>
          <div className="absolute top-0 right-0 h-28 w-28 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Our Mission</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1528]">Empower Every Player</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed">
              Provide world-class chess education, competitive opportunities, and a community where every player can reach their full potential.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* PROGRAMS */}
      <div className="grid lg:grid-cols-12 gap-6 mb-8 sm:mb-10">
        <GlassCard className="lg:col-span-7 p-5 sm:p-7">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Our Programs</h2>
            </div>
            <Link href="/programs" className="text-[11px] font-bold text-[#368AE4] hover:underline">View All</Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-3.5">
            {[
              { t: "Beginner Chess", d: "Learn fundamentals & piece moves.", l: "Level 1", icon: "♙", color: "from-blue-400 to-blue-600" },
              { t: "Intermediate", d: "Develop tactics & middlegame plans.", l: "Level 2", icon: "♘", color: "from-purple-400 to-purple-600" },
              { t: "Advanced", d: "Master positional play & endgames.", l: "Level 3", icon: "♔", color: "from-amber-400 to-amber-600" },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl bg-white/50 border border-white/70 p-4 flex flex-col justify-between">
                <div>
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-xl shadow-sm mb-3`}>
                    {p.icon}
                  </div>
                  <h3 className="text-xs font-extrabold text-[#0B1528] mb-1">{p.t}</h3>
                  <p className="text-[10px] font-medium text-[#64748B] leading-relaxed mb-3">{p.d}</p>
                </div>
                <div className="pt-2 border-t border-white/60 flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-[#64748B]">{p.l}</span>
                  <Link href="/programs" className="text-[10px] font-bold text-[#368AE4]">Explore →</Link>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* WHY ACA */}
        <GlassCard className="lg:col-span-5 p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Why ACA?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { i: User, t: "Expert Coaching", d: "Learn from FIDE certified coaches." },
              { i: BookOpen, t: "Structured Learning", d: "Curriculum designed for real progress." },
              { i: Trophy, t: "Tournaments", d: "Regular events to test your skills." },
              { i: Globe2, t: "Global Community", d: "Join passionate players worldwide." }
            ].map(w => (
              <div key={w.t} className="rounded-xl bg-white/50 border border-white/70 p-3.5 flex gap-3 items-start">
                <div className="h-9 w-9 rounded-lg bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center shrink-0">
                  <w.i className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#0B1528] mb-0.5">{w.t}</h3>
                  <p className="text-[10px] font-medium text-[#64748B] leading-tight">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* TESTIMONIAL */}
      <GlassCard className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-1 flex items-center gap-3 text-center sm:text-left">
            <span className="text-4xl text-[#368AE4] font-serif leading-none opacity-30">"</span>
            <p className="text-xs sm:text-sm font-bold text-[#0B1528] leading-relaxed">
              ACA changed the way I think. Chess is not just a game, it's a way of life that teaches strategy and patience.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-sm font-extrabold">
              SK
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#0B1528]">Samuel K.</p>
              <p className="text-[10px] font-bold text-[#64748B]">ACA Student · 1650 ELO</p>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}



