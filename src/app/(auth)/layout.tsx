import Image from "next/image";
import Link from "next/link";
import { Sparkles, Trophy, BookOpen, Users } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen canvas-bg flex items-center justify-center p-4 sm:p-6">
      <div className="master-glass w-full max-w-6xl rounded-[28px] overflow-hidden grid lg:grid-cols-2 min-h-[640px]">
        {/* LEFT brand panel */}
        <div className="hidden lg:flex relative flex-col justify-between p-10 bg-gradient-to-br from-[#0B1528] to-[#1e293b] text-white overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#368AE4]/40 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-white shadow ring-1 ring-white/20">
              <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold tracking-wide">AFRICAN</p>
              <p className="text-[13px] font-extrabold tracking-wide">CHESS ACADEMY</p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-extrabold text-white/60 tracking-[0.2em] uppercase">The ACA Way</p>
            <h1 className="text-3xl xl:text-4xl font-extrabold leading-[1.05]">
              We don’t just teach chess.
              <br />
              We build <span className="text-[#60A5FA]">strategic thinkers.</span>
            </h1>
            <p className="text-sm text-white/70 max-w-md">
              Learn from experienced coaches, compete in meaningful tournaments,
              and develop the mindset to reach your full potential.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { i: BookOpen, t: "Structured Learning" },
                { i: Trophy, t: "Real Competitions" },
                { i: Users, t: "Global Community" },
                { i: Sparkles, t: "Coach-verified" },
              ].map((f) => (
                <div key={f.t} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2 backdrop-blur">
                  <f.i className="h-4 w-4 text-[#60A5FA]" />
                  <span className="text-[11px] font-bold">{f.t}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-[11px] text-white/50">
            © {new Date().getFullYear()} African Chess Academy
          </p>
        </div>

        {/* RIGHT form panel */}
        <div className="relative flex flex-col justify-center p-6 sm:p-10">
          <Link href="/" className="absolute top-5 right-5 text-[11px] font-bold text-[#64748B] hover:text-[#0B1528]">
            ← Back to site
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
