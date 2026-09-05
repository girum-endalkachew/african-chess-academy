"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Dropdown Content Mappings
const programsItems = [
  { label: "Chess Academy", href: "/programs?category=chess-academy" },
  { label: "Strategic Thinking", href: "/programs?category=strategic-thinking" },
  { label: "Cognitive Skills", href: "/programs?category=cognitive-skills" },
  { label: "Rubik’s Cube", href: "/programs?category=rubiks-cube" },
  { label: "School Programs", href: "/programs?category=schools" },
  { label: "Camps & Bootcamps", href: "/programs?category=camps" },
  { label: "Coaching & Seminars", href: "/programs?category=coaching" },
];

const learnItems = [
  { label: "Chess Fundamentals", href: "/explore", description: "Learn the rules and basics" },
  { label: "Chess Strategy", href: "/explore?tab=strategy", description: "Positioning & tactical play" },
  { label: "Puzzles", href: "/dashboard/puzzles", description: "Interactive tactical exercises" },
  { label: "Articles", href: "/news", description: "Blogs, news, and updates" },
  { label: "Resources", href: "/news?category=resources", description: "Study books & templates" },
  { label: "FAQ", href: "/about#faq", description: "Common questions answered" },
];

const eventsItems = [
  { label: "Tournaments", href: "/tournaments" },
  { label: "Camps", href: "/events?category=camps" },
  { label: "Workshops", href: "/events?category=workshops" },
  { label: "Seminars", href: "/events?category=seminars" },
  { label: "Upcoming Events", href: "/events?tab=upcoming" },
  { label: "Past Events", href: "/events?tab=past" },
];

const forItems = [
  { label: "For Parents", description: "child development + enrollment", href: "/contact?role=parent" },
  { label: "For Students", description: "learning + playing + community", href: "/register" },
  { label: "For Schools", description: "school partnership", href: "/contact?role=school" },
  { label: "For Corporates", description: "corporate programs", href: "/contact?role=corporate" },
  { label: "For Coaches", description: "professional development", href: "/contact?role=coach" },
  { label: "For Partners", description: "collaboration opportunities", href: "/contact?role=partner" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="relative z-50 w-full px-4 sm:px-8 lg:px-10 pt-4 sm:pt-6 pb-2">
      <div className="flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
            <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover animate-fade-in" />
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
            <button className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1 cursor-pointer">
              Programs <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", dropdown === "programs" && "rotate-180")} />
            </button>
            {dropdown === "programs" && (
              <div className="absolute top-full left-0 w-64 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {programsItems.map((item) => (
                  <Link key={item.label} href={item.href} className="block rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Learn Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown("learn")} onMouseLeave={() => setDropdown(null)}>
            <button className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1 cursor-pointer">
              Learn <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", dropdown === "learn" && "rotate-180")} />
            </button>
            {dropdown === "learn" && (
              <div className="absolute top-full left-0 w-72 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {learnItems.map((item) => (
                  <Link key={item.label} href={item.href} className="block rounded-xl px-3.5 py-2 hover:bg-[#EEF3FA] transition">
                    <p className="text-xs font-bold text-[#0B1528]">{item.label}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{item.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Events Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown("events")} onMouseLeave={() => setDropdown(null)}>
            <button className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1 cursor-pointer">
              Events <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", dropdown === "events" && "rotate-180")} />
            </button>
            {dropdown === "events" && (
              <div className="absolute top-full left-0 w-56 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {eventsItems.map((item) => (
                  <Link key={item.label} href={item.href} className="block rounded-xl px-3.5 py-2 text-xs font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* For... Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown("for")} onMouseLeave={() => setDropdown(null)}>
            <button className="text-sm font-semibold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1 py-1 cursor-pointer">
              For... <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", dropdown === "for" && "rotate-180")} />
            </button>
            {dropdown === "for" && (
              <div className="absolute top-full left-0 w-80 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {forItems.map((item) => (
                  <Link key={item.label} href={item.href} className="block rounded-xl px-3.5 py-2.5 hover:bg-[#EEF3FA] transition group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1528] group-hover:text-[#368AE4] transition">{item.label}</span>
                      <span className="text-xs text-[#368AE4] opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0">→</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-0.5 leading-relaxed">{item.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/contact" className={cn("text-sm font-semibold transition", pathname === "/contact" ? "text-[#368AE4]" : "text-[#64748B] hover:text-[#0B1528]")}>
            Contact
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-[#64748B] hover:text-[#0B1528] flex items-center gap-1.5 px-3 py-2 transition">
            🔐 Sign In
          </Link>
          <Link href="/register" className="btn-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5">
            Join ACA <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 rounded-xl bg-white/60 border border-white/80 transition active:scale-[0.98] cursor-pointer" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Accordions */}
      {open && (
        <div className="md:hidden mt-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 p-4 space-y-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition">
            Home
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition">
            About
          </Link>

          {/* Programs Accordion */}
          <div>
            <button 
              onClick={() => setMobileDropdown(mobileDropdown === "programs" ? null : "programs")} 
              className="flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition cursor-pointer"
            >
              <span>Programs</span>
              <ChevronDown className={cn("h-4 w-4 text-[#64748B] transition-transform duration-200", mobileDropdown === "programs" && "rotate-180")} />
            </button>
            {mobileDropdown === "programs" && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#368AE4]/30 ml-3 animate-in slide-in-from-top-1 duration-150">
                {programsItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-xs font-bold text-[#64748B] hover:text-[#0B1528] hover:bg-[#EEF3FA]">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Learn Accordion */}
          <div>
            <button 
              onClick={() => setMobileDropdown(mobileDropdown === "learn" ? null : "learn")} 
              className="flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition cursor-pointer"
            >
              <span>Learn</span>
              <ChevronDown className={cn("h-4 w-4 text-[#64748B] transition-transform duration-200", mobileDropdown === "learn" && "rotate-180")} />
            </button>
            {mobileDropdown === "learn" && (
              <div className="pl-4 mt-1 space-y-1.5 border-l-2 border-[#368AE4]/30 ml-3 animate-in slide-in-from-top-1 duration-150">
                {learnItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#EEF3FA]">
                    <p className="text-xs font-bold text-[#64748B]">{item.label}</p>
                    <p className="text-[10px] text-[#64748B]/70">{item.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Events Accordion */}
          <div>
            <button 
              onClick={() => setMobileDropdown(mobileDropdown === "events" ? null : "events")} 
              className="flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition cursor-pointer"
            >
              <span>Events</span>
              <ChevronDown className={cn("h-4 w-4 text-[#64748B] transition-transform duration-200", mobileDropdown === "events" && "rotate-180")} />
            </button>
            {mobileDropdown === "events" && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#368AE4]/30 ml-3 animate-in slide-in-from-top-1 duration-150">
                {eventsItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-xs font-bold text-[#64748B] hover:text-[#0B1528] hover:bg-[#EEF3FA]">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* For... Accordion */}
          <div>
            <button 
              onClick={() => setMobileDropdown(mobileDropdown === "for" ? null : "for")} 
              className="flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition cursor-pointer"
            >
              <span>For...</span>
              <ChevronDown className={cn("h-4 w-4 text-[#64748B] transition-transform duration-200", mobileDropdown === "for" && "rotate-180")} />
            </button>
            {mobileDropdown === "for" && (
              <div className="pl-4 mt-1 space-y-1.5 border-l-2 border-[#368AE4]/30 ml-3 animate-in slide-in-from-top-1 duration-150">
                {forItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#EEF3FA]">
                    <p className="text-xs font-bold text-[#64748B]">{item.label}</p>
                    <p className="text-[10px] text-[#64748B]/70">{item.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] hover:bg-[#EEF3FA] transition">
            Contact
          </Link>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
            <Link href="/login" onClick={() => setOpen(false)} className="text-center text-sm font-bold py-2.5 hover:bg-[#EEF3FA] rounded-full transition">
              🔐 Sign In
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-blue text-center rounded-full py-2.5 text-sm font-bold text-white transition">
              Join ACA
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}