"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About ACA" },
  { href: "/programs", label: "Programs" },
  { href: "/coaches", label: "Coaches" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/events", label: "Events & Webinars" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DBE9F7] bg-white/95 backdrop-blur support-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden bg-white shadow-sm transition-transform group-hover:scale-105">
            <Image src="/aca-logo.jpg" alt="ACA Logo" width={44} height={44} className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#1E293B] leading-none">
              ACA ACADEMY
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wider">
              AFRICAN CHESS ACADEMY
            </span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#E6F5FF] hover:text-[#00A3E0]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="shadow-sm font-semibold">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="xl:hidden border-b border-[#DBE9F7] bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-[#E6F5FF] hover:text-[#00A3E0]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-center">Sign In</Button>
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}