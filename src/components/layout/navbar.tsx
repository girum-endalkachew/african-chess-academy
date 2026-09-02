"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/news", label: "Learn" },
  { href: "/events", label: "Events" },
  { href: "/coaches", label: "Community" },
  { href: "/contact", label: "For Schools" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative z-50 w-full px-4 sm:px-8 lg:px-10 pt-4 sm:pt-6 pb-2">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
            <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-[12px] sm:text-[14px] font-extrabold tracking-wide text-[#0B1528]">AFRICAN</p>
            <p className="text-[12px] sm:text-[14px] font-extrabold tracking-wide text-[#0B1528]">CHESS ACADEMY</p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-5">
          {mainLinks.map((l) => (
            <Link
              key={l.label + l.href}
              href={l.href}
              className={cn(
                "text-sm font-semibold transition",
                pathname === l.href ? "text-[#368AE4]" : "text-[#64748B] hover:text-[#0B1528]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="text-sm font-bold text-[#64748B] hover:text-[#0B1528] px-3 py-2">
            🔐 Sign In
          </Link>
          <Link
            href="/register"
            className="btn-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
          >
            Join ACA <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-xl bg-white/60 border border-white/80"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-3 rounded-2xl bg-white/80 backdrop-blur border border-white/80 p-4 space-y-1 shadow-lg">
          {mainLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-white"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 grid gap-2">
            <Link href="/login" onClick={() => setOpen(false)} className="text-center text-sm font-bold py-2">Sign In</Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-blue text-center rounded-full py-3 text-sm font-bold text-white">Join ACA</Link>
          </div>
        </div>
      )}
    </header>
  );
}
