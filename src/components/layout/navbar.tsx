"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadAccess, type AccessState } from "@/lib/access";

const programsItems = [
  { label: "Chess Academy", href: "/programs?category=chess-academy" },
  { label: "Strategic Thinking", href: "/programs?category=strategic-thinking" },
  { label: "Cognitive Skills", href: "/programs?category=cognitive-skills" },
  { label: "Rubik's Cube", href: "/programs?category=rubiks-cube" },
  { label: "School Programs", href: "/programs?category=schools" },
  { label: "Camps & Bootcamps", href: "/programs?category=camps" },
  { label: "Coaching & Seminars", href: "/programs?category=coaching" },
];

const learnItems = [
  {
    label: "Chess Fundamentals",
    href: "/explore",
    description: "Learn the rules and basics",
  },
  {
    label: "Chess Strategy",
    href: "/explore?tab=strategy",
    description: "Positioning & tactical play",
  },
  {
    label: "Puzzles",
    href: "/dashboard/puzzles",
    description: "Interactive tactical exercises",
  },
  {
    label: "Articles",
    href: "/news",
    description: "Blogs, news, and updates",
  },
  {
    label: "Resources",
    href: "/news?category=resources",
    description: "Study books & templates",
  },
  {
    label: "FAQ",
    href: "/about#faq",
    description: "Common questions answered",
  },
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
  {
    label: "For Parents",
    description: "child development + enrollment",
    href: "/contact?role=parent",
  },
  {
    label: "For Students",
    description: "learning + playing + community",
    href: "/register",
  },
  {
    label: "For Schools",
    description: "school partnership",
    href: "/contact?role=school",
  },
  {
    label: "For Corporates",
    description: "corporate programs",
    href: "/contact?role=corporate",
  },
  {
    label: "For Coaches",
    description: "professional development",
    href: "/contact?role=coach",
  },
  {
    label: "For Partners",
    description: "collaboration opportunities",
    href: "/contact?role=partner",
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const [access, setAccess] = useState<AccessState | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const a = await loadAccess();
      setAccess(a);
      setAuthLoading(false);
    })();
  }, []);

  return (
    <header className="relative z-50 w-full bg-[#F8FAFD] px-4 pt-4 sm:px-8 sm:pt-6 lg:px-10">
      <div className="flex items-center justify-between gap-3">

        {/* LOGO */}

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm sm:h-11 sm:w-11">
            <Image
              src="/aca-logo.jpg"
              alt="African Chess Academy"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="leading-tight">
            <p className="text-[12px] font-extrabold tracking-wide text-[#0B1528] sm:text-[14px]">
              ♟️ AFRICAN
            </p>

            <p className="text-[12px] font-extrabold tracking-wide text-[#0B1528] sm:text-[14px]">
              CHESS ACADEMY
            </p>
          </div>
        </Link>


        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-6 xl:flex">

          <Link
            href="/"
            className={cn(
              "text-sm font-semibold transition",
              pathname === "/"
                ? "text-[#368AE4]"
                : "text-[#64748B] hover:text-[#0B1528]"
            )}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={cn(
              "text-sm font-semibold transition",
              pathname === "/about"
                ? "text-[#368AE4]"
                : "text-[#64748B] hover:text-[#0B1528]"
            )}
          >
            About
          </Link>


          {/* PROGRAMS */}

          <div
            className="relative"
            onMouseEnter={() => setDropdown("programs")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex cursor-pointer items-center gap-1 py-1 text-sm font-semibold text-[#64748B] transition hover:text-[#0B1528]">
              Programs
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  dropdown === "programs" && "rotate-180"
                )}
              />
            </button>

            {dropdown === "programs" && (
              <div className="absolute left-0 top-full w-64 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                {programsItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0B1528] transition hover:bg-[#EEF3FA]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>


          {/* LEARN */}

          <div
            className="relative"
            onMouseEnter={() => setDropdown("learn")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex cursor-pointer items-center gap-1 py-1 text-sm font-semibold text-[#64748B] transition hover:text-[#0B1528]">
              Learn
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  dropdown === "learn" && "rotate-180"
                )}
              />
            </button>

            {dropdown === "learn" && (
              <div className="absolute left-0 top-full w-72 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                {learnItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-xl px-3.5 py-2 transition hover:bg-[#EEF3FA]"
                  >
                    <p className="text-xs font-bold text-[#0B1528]">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#64748B]">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>


          {/* EVENTS */}

          <div
            className="relative"
            onMouseEnter={() => setDropdown("events")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex cursor-pointer items-center gap-1 py-1 text-sm font-semibold text-[#64748B] transition hover:text-[#0B1528]">
              Events
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  dropdown === "events" && "rotate-180"
                )}
              />
            </button>

            {dropdown === "events" && (
              <div className="absolute left-0 top-full w-56 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                {eventsItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-xl px-3.5 py-2 text-xs font-bold text-[#0B1528] transition hover:bg-[#EEF3FA]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>


          {/* FOR */}

          <div
            className="relative"
            onMouseEnter={() => setDropdown("for")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex cursor-pointer items-center gap-1 py-1 text-sm font-semibold text-[#64748B] transition hover:text-[#0B1528]">
              For...
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  dropdown === "for" && "rotate-180"
                )}
              />
            </button>

            {dropdown === "for" && (
              <div className="absolute left-0 top-full w-80 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                {forItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group block rounded-xl px-3.5 py-2.5 transition hover:bg-[#EEF3FA]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1528] transition group-hover:text-[#368AE4]">
                        {item.label}
                      </span>

                      <span className="translate-x-[-4px] text-xs text-[#368AE4] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] leading-relaxed text-[#64748B]">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>


          <Link
            href="/contact"
            className={cn(
              "text-sm font-semibold transition",
              pathname === "/contact"
                ? "text-[#368AE4]"
                : "text-[#64748B] hover:text-[#0B1528]"
            )}
          >
            Contact
          </Link>

        </nav>


        {/* RIGHT SIDE */}

        <div className="hidden items-center gap-3 md:flex">

          {authLoading ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/40" />
          ) : access ? (
            <Link
              href={access.homePath}
              className="btn-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to {access.roles.includes("student") ? "Dashboard" : "Portal"}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[#64748B] transition hover:text-[#0B1528]"
              >
                🔐 Sign In
              </Link>

              <Link
                href="/register"
                className="btn-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
              >
                Join ACA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

        </div>


        {/* MOBILE BUTTON */}

        <button
          className="cursor-pointer rounded-xl bg-white/60 p-2 transition active:scale-[0.98] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

      </div>


      {/* MOBILE MENU */}

      {open && (
        <div className="mt-3 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden">

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] transition hover:bg-[#EEF3FA]"
          >
            Home
          </Link>

          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] transition hover:bg-[#EEF3FA]"
          >
            About
          </Link>


          {/* MOBILE PROGRAMS */}

          <div>
            <button
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "programs" ? null : "programs"
                )
              }
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] transition hover:bg-[#EEF3FA]"
            >
              <span>Programs</span>

              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[#64748B] transition-transform duration-200",
                  mobileDropdown === "programs" && "rotate-180"
                )}
              />
            </button>

            {mobileDropdown === "programs" && (
              <div className="ml-3 mt-1 space-y-1 pl-4">
                {programsItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#EEF3FA] hover:text-[#0B1528]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>


          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0B1528] transition hover:bg-[#EEF3FA]"
          >
            Contact
          </Link>


          <div className="mt-2 pt-3">

            {!authLoading && access ? (
              <Link
                href={access.homePath}
                onClick={() => setOpen(false)}
                className="btn-blue flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white shadow-md"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to{" "}
                {access.roles.includes("student")
                  ? "Dashboard"
                  : "Portal"}
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">

                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full py-2.5 text-center text-sm font-bold transition hover:bg-[#EEF3FA]"
                >
                  🔐 Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="btn-blue rounded-full py-2.5 text-center text-sm font-bold text-white transition"
                >
                  Join ACA
                </Link>

              </div>
            )}

          </div>

        </div>
      )}

    </header>
  );
}