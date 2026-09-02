"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="relative z-50 w-full px-4 sm:px-8 lg:px-10 pt-4 sm:pt-6 pb-2">
      <div className="flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
            <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-[12px] sm:text-[14px] font-extrabold tracking-wide text-[#0B1528]">♟️ AFRICAN</p>
            <p className="text-[12px] sm:text-[14px] font-extrabold tracking-wide text-[#0B1528]">CHESS ACADEMY</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          <Link href="/" className={cn("text-sm font-semibold transition", pathname === "/" ? "text-[#368AE4]" : "text-[#64748B] hover:text-[#0B1528]")}>
            Home
          </Link>

          <Link href="/about" className={cn("text-sm font-semibold transition", pathname === "/about" ? "text-[#368AE4]" : "text-[#64748B] hover:text-[#0B1528]")}>
            About
          </Link>

          {/* Programs Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown("programs")} onMouseLeave={() => setDropdown(null)}>
            <Link href="/programs" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1">
              Programs <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {dropdown === "programs" && (
              <div className="absolute top-full left-0 w-48 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1">
                <Link href="/programs" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#0B1528] hover:bg-[#EEF3FA]">All Programs</Link>
                <Link href="/programs" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA]">Beginner Path</Link>
                <Link href="/programs" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA]">Intermediate Strategy</Link>
                <Link href="/programs" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA]">Advanced Mastery</Link>
              </div>
            )}
          </div>

          {/* Learn Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown("learn")} onMouseLeave={() => setDropdown(null)}>
            <Link href="/news" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1">
              Learn <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {dropdown === "learn" && (
              <div className="absolute top-full left-0 w-48 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1">
                <Link href="/news" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#0B1528] hover:bg-[#EEF3FA]">Articles & News</Link>
                <Link href="/register" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA]">Interactive Lessons</Link>
                <Link href="/register" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA]">Tactics & Puzzles</Link>
              </div>
            )}
          </div>

          {/* Events Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown("events")} onMouseLeave={() => setDropdown(null)}>
            <Link href="/events" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1">
              Events <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {dropdown === "events" && (
              <div className="absolute top-full left-0 w-48 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1">
                <Link href="/events" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#0B1528] hover:bg-[#EEF3FA]">Webinars & Clinics</Link>
                <Link href="/tournaments" className="block rounded-xl px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA]">Tournaments</Link>
              </div>
            )}
          </div>

          <Link href="/coaches" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Community</Link>
          <Link href="/contact" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">For Schools</Link>
          <Link href="/contact" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Contact</Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1.5 px-3 py-2">
            🔐 Sign In
          </Link>
          <Link href="/register" className="btn-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white">
            Join ACA <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 rounded-xl bg-white/60 border border-white/80" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden mt-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-4 space-y-2 shadow-xl">
          <Link href="/" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">Home</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">About</Link>
          <Link href="/programs" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">Programs</Link>
          <Link href="/news" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">Learn</Link>
          <Link href="/events" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">Events</Link>
          <Link href="/coaches" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">Community</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">For Schools</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-[#0B1528]">Contact</Link>
          <div className="pt-3 border-t border-slate-100 grid gap-2">
            <Link href="/login" onClick={() => setOpen(false)} className="text-center text-sm font-bold py-2">🔐 Sign In</Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-blue text-center rounded-full py-3 text-sm font-bold text-white">Join ACA</Link>
          </div>
        </div>
      )}
    </header>
  );
}
