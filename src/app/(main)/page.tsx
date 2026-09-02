import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Globe2,
  Trophy,
  Target,
  Building,
  HeartHandshake,
  HelpCircle,
  Network,
  Award,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

/* ───────── SVG illustrations (screenshot-style) ───────── */

function StructuredPathsArt() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-[110px]" fill="none" aria-hidden>
      <defs>
        <linearGradient id="step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="pawnB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="kingB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* steps */}
      <rect x="28" y="78" width="44" height="22" rx="4" fill="url(#step)" />
      <rect x="72" y="56" width="48" height="44" rx="4" fill="url(#step)" />
      <rect x="120" y="30" width="52" height="70" rx="4" fill="url(#step)" />
      {/* small pawn */}
      <circle cx="50" cy="66" r="7" fill="url(#pawnB)" />
      <rect x="44" y="72" width="12" height="8" rx="3" fill="url(#pawnB)" />
      <rect x="41" y="78" width="18" height="4" rx="2" fill="#0369A1" />
      {/* mid pawn */}
      <circle cx="96" cy="40" r="9" fill="url(#pawnB)" />
      <rect x="88" y="48" width="16" height="10" rx="4" fill="url(#pawnB)" />
      <rect x="84" y="56" width="24" height="5" rx="2" fill="#0369A1" />
      {/* king on top */}
      <path d="M146 18h8v4h-3v3h6v-3h-3v-4h8v4h-3l2 8h-12l2-8h-3v-4z" fill="url(#kingB)" />
      <rect x="140" y="30" width="28" height="14" rx="4" fill="url(#kingB)" />
      <rect x="144" y="44" width="20" height="18" rx="3" fill="url(#kingB)" />
      <rect x="136" y="60" width="36" height="6" rx="2" fill="#1E3A8A" />
    </svg>
  );
}

function VerifiedMentorsArt() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-[110px]" fill="none" aria-hidden>
      <defs>
        <linearGradient id="kingS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="45%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      {/* king body */}
      <path d="M100 28c-2 0-4 2-4 5v3h-6v5h6l-2 10h16l-2-10h6v-5h-6v-3c0-3-2-5-4-5h-4z" fill="url(#kingS)" />
      <ellipse cx="100" cy="28" rx="8" ry="6" fill="url(#kingS)" />
      <rect x="88" y="48" width="24" height="28" rx="6" fill="url(#kingS)" />
      <rect x="82" y="74" width="36" height="8" rx="3" fill="#334155" />
      <rect x="78" y="82" width="44" height="6" rx="2" fill="#1E293B" />
      {/* graduation cap */}
      <path d="M70 22l30-12 30 12-30 12-30-12z" fill="url(#cap)" />
      <rect x="118" y="22" width="3" height="18" rx="1" fill="#0F172A" />
      <circle cx="121" cy="42" r="3" fill="#F59E0B" />
      <path d="M70 22v8c8 6 52 6 60 0v-8" fill="#1E293B" opacity="0.85" />
    </svg>
  );
}

function LiveTournamentsArt() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-[110px]" fill="none" aria-hidden>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="goldDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* handles */}
      <path d="M68 36c-12 4-16 18-10 28" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M132 36c12 4 16 18 10 28" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* cup */}
      <path d="M78 30h44c2 20 2 36-8 48H86c-10-12-10-28-8-48z" fill="url(#gold)" />
      <ellipse cx="100" cy="30" rx="22" ry="6" fill="#FDE68A" />
      {/* stem + base */}
      <rect x="94" y="76" width="12" height="12" rx="2" fill="url(#goldDark)" />
      <rect x="84" y="88" width="32" height="6" rx="2" fill="url(#goldDark)" />
      <rect x="76" y="94" width="48" height="8" rx="3" fill="#B45309" />
      {/* star */}
      <path d="M100 44l2.5 5 5.5.8-4 3.9.9 5.5L100 56l-4.9 2.6.9-5.5-4-3.9 5.5-.8L100 44z" fill="#FFFBEB" />
    </svg>
  );
}

function GlobalCommunityArt() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-[110px]" fill="none" aria-hidden>
      <defs>
        <linearGradient id="globe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="pawnP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* network dots */}
      <circle cx="46" cy="40" r="3" fill="#93C5FD" />
      <circle cx="160" cy="36" r="3" fill="#93C5FD" />
      <circle cx="170" cy="70" r="2.5" fill="#BFDBFE" />
      <circle cx="30" cy="72" r="2.5" fill="#BFDBFE" />
      <path d="M46 40l30 12M160 36l-28 14M30 72l40 8M170 70l-36 6" stroke="#BFDBFE" strokeWidth="1.5" />
      {/* globe */}
      <circle cx="100" cy="48" r="28" fill="url(#globe)" opacity="0.95" />
      <ellipse cx="100" cy="48" rx="12" ry="28" stroke="#EFF6FF" strokeWidth="2" fill="none" />
      <path d="M72 48h56M100 20v56M78 32h44M78 64h44" stroke="#EFF6FF" strokeWidth="1.5" opacity="0.8" />
      {/* pawns around */}
      {[
        [62, 88],
        [88, 96],
        [112, 96],
        [138, 88],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y - 10} r="6" fill="url(#pawnP)" />
          <rect x={x - 5} y={y - 5} width="10" height="8" rx="3" fill="url(#pawnP)" />
          <rect x={x - 8} y={y + 2} width="16" height="4" rx="2" fill="#1D4ED8" />
        </g>
      ))}
    </svg>
  );
}

function PawnArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="pawnMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="92" rx="28" ry="6" fill="#BAE6FD" opacity="0.7" />
      <circle cx="40" cy="28" r="16" fill="url(#pawnMain)" />
      <path d="M24 48c0-2 4-6 16-6s16 4 16 6c2 14-2 28-16 28S22 62 24 48z" fill="url(#pawnMain)" />
      <rect x="18" y="76" width="44" height="10" rx="3" fill="url(#pawnMain)" />
      <rect x="12" y="84" width="56" height="8" rx="3" fill="#0369A1" />
    </svg>
  );
}

function KnightArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="knightMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="92" rx="28" ry="6" fill="#A7F3D0" opacity="0.7" />
      <path
        d="M54 78c2-16 4-28-6-40 2-6 8-10 12-14 2-2 1-6-2-6-6 2-14 8-18 14-8 2-14 8-16 16 0 4 2 6 6 6 0 8-2 16-2 24h26z"
        fill="url(#knightMain)"
      />
      <circle cx="44" cy="30" r="2.5" fill="#064E3B" />
      <rect x="18" y="76" width="44" height="10" rx="3" fill="url(#knightMain)" />
      <rect x="12" y="84" width="56" height="8" rx="3" fill="#047857" />
    </svg>
  );
}

function QueenArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="queenMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="92" rx="28" ry="6" fill="#DDD6FE" opacity="0.7" />
      {/* crown spikes */}
      <circle cx="20" cy="22" r="4" fill="url(#queenMain)" />
      <circle cx="40" cy="14" r="5" fill="url(#queenMain)" />
      <circle cx="60" cy="22" r="4" fill="url(#queenMain)" />
      <circle cx="28" cy="18" r="3" fill="url(#queenMain)" />
      <circle cx="52" cy="18" r="3" fill="url(#queenMain)" />
      <path d="M18 26l6 20h32l6-20-10 8-6-12-6 12-10-8z" fill="url(#queenMain)" />
      <rect x="26" y="46" width="28" height="30" rx="8" fill="url(#queenMain)" />
      <rect x="18" y="76" width="44" height="10" rx="3" fill="url(#queenMain)" />
      <rect x="12" y="84" width="56" height="8" rx="3" fill="#6D28D9" />
    </svg>
  );
}

/* ───────── Page ───────── */

export default function HomePage() {
  const journey = [
    {
      title: "Structured Paths",
      desc: "Clear level-by-level training from first moves to mastery.",
      iconBg: "bg-blue-100 text-blue-600",
      Icon: Target,
      Art: StructuredPathsArt,
    },
    {
      title: "Verified Mentors",
      desc: "Learn with verified FIDE coaches and experienced guides.",
      iconBg: "bg-emerald-100 text-emerald-600",
      Icon: GraduationCap,
      Art: VerifiedMentorsArt,
    },
    {
      title: "Live Tournaments",
      desc: "Compete, track ratings, and grow under real pressure.",
      iconBg: "bg-amber-100 text-amber-600",
      Icon: Trophy,
      Art: LiveTournamentsArt,
    },
    {
      title: "Global Community",
      desc: "Train and connect with players across Africa and beyond.",
      iconBg: "bg-violet-100 text-violet-600",
      Icon: Network,
      Art: GlobalCommunityArt,
    },
  ];

  const skills = [
    { t: "Critical Calculation", d: "Evaluating choices under pressure." },
    { t: "Strategic Planning", d: "Formulating long-term advantages." },
    { t: "Emotional Control", d: "Resilience in competitive play." },
    { t: "Pattern Recognition", d: "Instant tactical vision." },
  ];

  const path = [
    {
      n: "1",
      level: "Level 1",
      title: "Fundamentals",
      d: "Piece dynamics, rules, and essential mates.",
      ring: "bg-[#368AE4]",
      Art: PawnArt,
    },
    {
      n: "2",
      level: "Level 2",
      title: "Tactical Pattern",
      d: "Forks, pins, skewers, and combination play.",
      ring: "bg-emerald-500",
      Art: KnightArt,
    },
    {
      n: "3",
      level: "Level 3",
      title: "Advanced Mastery",
      d: "Positional nuances, calculation, and endgames.",
      ring: "bg-violet-500",
      Art: QueenArt,
    },
  ];

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
              Where African
              <br />
              Chess Talent
              <br />
              Becomes <span className="text-[#368AE4]">Global
              <br />
              Excellence.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] max-w-[420px] leading-relaxed font-medium">
              We Don’t Just Teach Chess. We Build Strategic Thinkers. Learn from experienced coaches, compete in tournaments, and master the game.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/register"
                className="btn-blue inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                Start Your Chess Journey <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/60 border border-white px-6 py-3.5 text-sm font-bold text-[#0B1528] shadow-sm backdrop-blur transition hover:bg-white"
              >
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
                <Image
                  src="/africa-map.png"
                  alt="Map of Africa"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_20px_40px_rgba(54,138,228,0.25)]"
                />
              </div>

              <GlassCard className="absolute left-1/2 top-[2%] z-20 flex -translate-x-1/2 items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[108px] sm:min-w-[150px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">500+</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Students</p>
                </div>
              </GlassCard>

              <GlassCard className="absolute right-0 sm:right-1 top-[30%] z-20 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[100px] sm:min-w-[140px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">20+</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Coaches</p>
                </div>
              </GlassCard>

              <GlassCard className="absolute left-1/2 bottom-[4%] z-20 flex -translate-x-1/2 items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[108px] sm:min-w-[150px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0">
                  <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">100+</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Tournaments</p>
                </div>
              </GlassCard>

              <GlassCard className="absolute left-0 sm:left-1 top-[30%] z-20 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-lg min-w-[100px] sm:min-w-[140px]">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#EEF3FA] flex items-center justify-center shrink-0">
                  <Globe2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#368AE4]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-extrabold text-[#0B1528] leading-none">15</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-[#64748B] mt-0.5">Countries</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY ACA EXISTS */}
      <section className="space-y-6">
        <GlassCard className="p-7 space-y-3 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1528]">Why ACA Exists</h2>
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed font-medium">
            African Chess Academy bridges the gap between potential and global performance. We provide
            structured training, verified FIDE coaches, and competitive opportunities to nurture champions.
          </p>
        </GlassCard>

        {/* Built for Every Chess Journey */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528]">
              Built for Every Chess Journey
            </h3>
            <div className="mx-auto h-1 w-12 rounded-full bg-[#368AE4]" />
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {journey.map(({ title, desc, iconBg, Icon, Art }) => (
              <div
                key={title}
                className="rounded-[1.6rem] bg-white/80 border border-white p-5 shadow-sm backdrop-blur-sm hover:-translate-y-1 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <h4 className="text-sm font-extrabold text-[#0B1528]">{title}</h4>
                </div>
                <Art />
                <p className="text-[11px] text-[#64748B] leading-relaxed mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DEVELOP */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528]">What We Develop</h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-[#368AE4]" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((item) => (
            <GlassCard key={item.t} className="p-5 space-y-2 hover:-translate-y-0.5 transition">
              <div className="h-9 w-9 rounded-xl bg-[#EEF3FA] flex items-center justify-center">
                <Award className="h-4 w-4 text-[#368AE4]" />
              </div>
              <p className="text-sm font-extrabold text-[#0B1528]">{item.t}</p>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.d}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 4. THE ACA DEVELOPMENT PATH */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528]">
            The ACA Development Path
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-[#368AE4]" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {path.map((step, idx) => (
            <div key={step.n} className="relative">
              <div className="rounded-[1.6rem] bg-white/80 border border-white p-5 sm:p-6 shadow-sm backdrop-blur-sm min-h-[200px] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${step.ring} text-white text-xs font-extrabold shadow-sm`}
                    >
                      {step.n}
                    </span>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#368AE4]">
                      {step.level}
                    </p>
                    <h3 className="text-base font-extrabold text-[#0B1528]">{step.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed max-w-[160px]">{step.d}</p>
                  </div>
                  <step.Art className="w-[72px] h-[92px] shrink-0" />
                </div>
              </div>

              {idx < path.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-slate-300 z-10" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-[#0B1528] shadow-sm hover:bg-slate-50 transition"
          >
            View Programs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. FOR SCHOOLS, PARENTS, COMMUNITY */}
      <div className="grid md:grid-cols-3 gap-5">
        <GlassCard className="p-6 space-y-3">
          <Building className="h-8 w-8 text-[#368AE4]" />
          <h3 className="text-base font-extrabold text-[#0B1528]">For Schools</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Integrate accredited chess curricula into your school academic programs.
          </p>
          <Link href="/contact" className="text-xs font-bold text-[#368AE4] block pt-2">
            School Programs →
          </Link>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <HeartHandshake className="h-8 w-8 text-amber-500" />
          <h3 className="text-base font-extrabold text-[#0B1528]">For Parents</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Track your child’s cognitive development, ratings, and course certificates.
          </p>
          <Link href="/register" className="text-xs font-bold text-[#368AE4] block pt-2">
            Parent Portal →
          </Link>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <Globe2 className="h-8 w-8 text-emerald-500" />
          <h3 className="text-base font-extrabold text-[#0B1528]">Experience Online</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Play AI, challenge friends in real-time, solve daily puzzles, and join webinars.
          </p>
          <Link href="/register" className="text-xs font-bold text-[#368AE4] block pt-2">
            Join ACA Online →
          </Link>
        </GlassCard>
      </div>

      {/* 6. FAQ & FINAL CTA */}
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
              <p className="text-[#64748B]">
                Games use real-time WebSockets with live clocks and instant move syncing.
              </p>
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