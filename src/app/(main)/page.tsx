import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, User, Users, GraduationCap, Globe2, Trophy,
  BookOpen, Star, Target, Sparkles, Shield, CheckCircle2,
  Building, HeartHandshake, PlayCircle, HelpCircle, ChevronRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function HomePage() {
  return (
    <div className="px-3 sm:px-8 pb-16 sm:pb-20 max-w-full overflow-hidden space-y-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-4 sm:pt-10 pb-6 lg:pb-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 relative z-30">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/50 border border-white/70 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] text-[#64748B] uppercase backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#368AE4] animate-pulse" />
              BUILDING CHAMPIONS. SHAPING LEADERS.
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight text-[#0B1528] leading-[1.06]">
              Where African<br />
              Chess Talent<br />
              Becomes <span className="text-[#368AE4]">Global<br />Excellence.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] max-w-[420px] leading-relaxed font-medium">
              We Don’t Just Teach Chess. We Build Strategic Thinkers. Learn from experienced coaches, compete in tournaments, and master the game.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/register" className="btn-blue inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">
                Start Your Chess Journey <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/programs" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/60 border border-white px-6 py-3.5 text-sm font-bold text-[#0B1528] shadow-sm backdrop-blur transition hover:bg-white">
                Explore Programs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative z-10">
            <div className="relative mx-auto h-[400px] sm:h-[500px] lg:h-[560px] w-full max-w-[560px] flex items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-[240px] sm:h-[340px] w-[240px] sm:w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#368AE4]/20 blur-[50px] sm:blur-[80px]" />
              <div className="absolute left-1/2 top-1/2 h-[280px] sm:h-[400px] w-[280px] sm:w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
              <div className="absolute bottom-[12%] left-1/2 h-6 sm:h-8 w-36 sm:w-52 -translate-x-1/2 rounded-full bg-white/70 blur-xl" />

              <div className="relative h-[72%] w-[72%] sm:h-[78%] sm:w-[78%] z-10">
                <Image src="/africa-map.png" alt="Map of Africa" fill priority className="object-contain drop-shadow-[0_20px_40px_rgba(54,138,228,0.25)]" />
              </div>

              <GlassCard className="absolute left-1/2 top-[2%] z-20 flex -translate-x-1/2 items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[108px] sm:min-w-[150px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0"><Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">500+</p><p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Students</p></div>
              </GlassCard>

              <GlassCard className="absolute right-0 sm:right-1 top-[30%] z-20 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[100px] sm:min-w-[140px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0"><GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">20+</p><p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Coaches</p></div>
              </GlassCard>

              <GlassCard className="absolute left-1/2 bottom-[4%] z-20 flex -translate-x-1/2 items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[108px] sm:min-w-[150px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0"><Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">100+</p><p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Tournaments</p></div>
              </GlassCard>

              <GlassCard className="absolute left-0 sm:left-1 top-[30%] z-20 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[100px] sm:min-w-[140px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0"><Globe2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" /></div>
                <div><p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">15</p><p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Countries</p></div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. WHY ACA & WHAT WE DEVELOP */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-lg font-extrabold text-[#0B1528]">Why ACA Exists</h2>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed font-medium">
            African Chess Academy bridges the gap between potential and global performance. We provide structured training, verified FIDE coaches, and competitive opportunities to nurture champions.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#0B1528]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#368AE4]" /> Structured Paths</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#368AE4]" /> Verified Mentors</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#368AE4]" /> Live Tournaments</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#368AE4]" /> Global Community</span>
          </div>
        </GlassCard>

        <GlassCard className="p-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-lg font-extrabold text-[#0B1528]">What We Develop</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { t: "Critical Calculation", d: "Evaluating choices under pressure." },
              { t: "Strategic Planning", d: "Formulating long-term advantages." },
              { t: "Emotional Control", d: "Resilience in competitive play." },
              { t: "Pattern Recognition", d: "Instant tactical vision." }
            ].map(item => (
              <div key={item.t} className="p-3 rounded-xl bg-white/40 border border-white/60">
                <p className="text-xs font-extrabold text-[#0B1528] mb-1">{item.t}</p>
                <p className="text-[10px] text-[#64748B]">{item.d}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 4 & 5. OUR PROGRAMS & DEVELOPMENT PATH */}
      <GlassCard className="p-7 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-lg font-extrabold text-[#0B1528]">The ACA Development Path</h2>
          </div>
          <Link href="/programs" className="text-xs font-bold text-[#368AE4]">View Programs →</Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { t: "1. Fundamentals", d: "Piece dynamics, rules, and essential mates.", level: "Level 1" },
            { t: "2. Tactical Pattern", d: "Forks, pins, skewers, and combination play.", level: "Level 2" },
            { t: "3. Advanced Mastery", d: "Positional nuances, calculation, and endgames.", level: "Level 3" },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl bg-white/50 border border-white/70 p-5 space-y-2">
              <span className="text-[10px] font-extrabold text-[#368AE4] uppercase">{p.level}</span>
              <h3 className="text-sm font-extrabold text-[#0B1528]">{p.t}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 6, 7 & 8. FOR SCHOOLS, PARENTS, COMMUNITY */}
      <div className="grid md:grid-cols-3 gap-5">
        <GlassCard className="p-6 space-y-3">
          <Building className="h-8 w-8 text-[#368AE4]" />
          <h3 className="text-base font-extrabold text-[#0B1528]">For Schools</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">Integrate accredited chess curricula into your school academic programs.</p>
          <Link href="/contact" className="text-xs font-bold text-[#368AE4] block pt-2">School Programs →</Link>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <HeartHandshake className="h-8 w-8 text-amber-500" />
          <h3 className="text-base font-extrabold text-[#0B1528]">For Parents</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">Track your child’s cognitive development, ratings, and course certificates.</p>
          <Link href="/register" className="text-xs font-bold text-[#368AE4] block pt-2">Parent Portal →</Link>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <Globe2 className="h-8 w-8 text-emerald-500" />
          <h3 className="text-base font-extrabold text-[#0B1528]">Experience Online</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">Play AI, challenge friends in real-time, solve daily puzzles, and join webinars.</p>
          <Link href="/register" className="text-xs font-bold text-[#368AE4] block pt-2">Join ACA Online →</Link>
        </GlassCard>
      </div>

      {/* FAQ & FINAL CTA */}
      <div className="grid lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-7 p-7 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-[#368AE4]" />
            <h3 className="text-lg font-extrabold text-[#0B1528]">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/40 border border-white/60">
              <p className="font-extrabold text-[#0B1528] mb-1">Is ACA suitable for complete beginners?</p>
              <p className="text-[#64748B]">Yes! Our Level 1 path assumes zero previous knowledge.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/40 border border-white/60">
              <p className="font-extrabold text-[#0B1528] mb-1">How do online multiplayer games work?</p>
              <p className="text-[#64748B]">Games use real-time WebSockets with live clocks and instant move syncing.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-5 p-7 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-[#368AE4]/15 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <Badge variant="blue">Get Started Today</Badge>
            <h3 className="text-2xl font-extrabold text-[#0B1528]">Ready to elevate your game?</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Create your account to unlock interactive lessons, play against AI, and join tournaments.
            </p>
          </div>
          <Link href="/register" className="relative z-10 pt-4">
            <button className="btn-blue w-full rounded-full py-3.5 text-sm font-bold text-white shadow-lg">
              Start Free Trial →
            </button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
