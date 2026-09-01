"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="w-full h-[72px] flex items-center justify-between px-8">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1528] text-white">
          <span className="font-serif text-xl leading-none">♙</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-extrabold tracking-wide text-[#0B1528]">
            AFRICAN
          </span>
          <span className="text-[13px] font-extrabold tracking-wide text-[#0B1528] mt-[2px]">
            CHESS ACADEMY
          </span>
        </div>
      </Link>

      {/* Center Nav Links */}
      <nav className="hidden lg:flex items-center gap-8">
        <div className="relative flex flex-col items-center">
          <Link href="/" className="text-sm font-bold text-[#368AE4]">Home</Link>
          <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-[#368AE4]" />
        </div>
        <Link href="/about" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">About</Link>
        <Link href="/programs" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Programs</Link>
        <Link href="/tournaments" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Tournaments</Link>
        <Link href="/resources" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Resources</Link>
        <Link href="/events" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Events</Link>
        <Link href="/contact" className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528]">Contact</Link>
      </nav>

      {/* Right CTA */}
      <div className="hidden lg:flex">
        <Link
          href="/register"
          className="btn-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          Join Academy
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>

    </header>
  );
}