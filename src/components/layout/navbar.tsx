"use client";


import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative w-full px-6 sm:px-10 lg:px-12 pt-8 pb-4">
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-50">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#0B1528] text-white shadow-sm shrink-0">
            <span className="font-serif text-xl sm:text-2xl leading-none">â™™</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[12px] sm:text-[14px] font-extrabold tracking-wide text-[#0B1528]">
              AFRICAN
            </span>
            <span className="text-[12px] sm:text-[14px] font-extrabold tracking-wide text-[#0B1528] mt-0.5">
              CHESS ACADEMY
            </span>
            <span className="hidden sm:block text-[8px] font-bold tracking-[0.2em] text-[#64748B] mt-1">
              CENTER OF EXCELLENCE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <div className="relative flex flex-col items-center">
            <Link href="/" className="text-sm font-bold text-[#368AE4]">Home</Link>
            <span className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-[#368AE4]" />
          </div>
          <Link href="/about" className="text-sm font-medium text-[#64748B] hover:text-[#0B1528]">About</Link>
          <Link href="/programs" className="text-sm font-medium text-[#64748B] hover:text-[#0B1528]">Programs</Link>
          <Link href="/tournaments" className="text-sm font-medium text-[#64748B] hover:text-[#0B1528]">Tournaments</Link>
          <Link href="/resources" className="text-sm font-medium text-[#64748B] hover:text-[#0B1528]">Resources</Link>
          <Link href="/events" className="text-sm font-medium text-[#64748B] hover:text-[#0B1528]">Events</Link>
          <Link href="/contact" className="text-sm font-medium text-[#64748B] hover:text-[#0B1528]">Contact</Link>
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden lg:flex">
          <Link
            href="/register"
            className="btn-blue inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Join Academy
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative z-50 p-2 text-[#0B1528] bg-white/40 border border-white/60 rounded-xl backdrop-blur-md"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-24 left-6 right-6 p-6 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_20px_40px_rgba(30,60,100,0.1)] z-40 lg:hidden flex flex-col gap-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#368AE4]">Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#0B1528]">About</Link>
          <Link href="/programs" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#0B1528]">Programs</Link>
          <Link href="/tournaments" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#0B1528]">Tournaments</Link>
          <Link href="/resources" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#0B1528]">Resources</Link>
          <Link href="/events" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#0B1528]">Events</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-[15px] font-bold text-[#0B1528]">Contact</Link>
          <div className="pt-4 mt-2 border-t border-[#64748B]/20">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="btn-blue flex items-center justify-center gap-2 rounded-full w-full py-3.5 text-[15px] font-bold text-white"
            >
              Join Academy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
