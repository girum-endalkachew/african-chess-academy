"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadAccess, type AccessState } from "@/lib/access";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Home, BookOpen, Compass, BarChart3, GraduationCap,
  Sparkles, Shield, LogOut, Menu, X, ChevronRight,
  ArrowUpRight, Clock, CheckCircle2, LayoutDashboard
} from "lucide-react";

const sidebarLinks = [
  { href: "/explore", label: "Overview", icon: Home },
  { href: "/explore?tab=course", label: "Free Course", icon: BookOpen },
  { href: "/explore?tab=browse", label: "Browse Courses", icon: Compass },
  { href: "/explore?tab=progress", label: "My Progress", icon: BarChart3 },
];

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [access, setAccess] = useState<AccessState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const a = await loadAccess();
      if (!a) {
        router.replace("/login");
        return;
      }
      setAccess(a);
      setLoading(false);
    })();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center canvas-bg">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!access) return null;

  const isStudent = access.roles.includes("student");

  return (
    <div className="min-h-screen canvas-bg flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0B1528]/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 flex flex-col",
          "bg-white/70 backdrop-blur-xl border-r border-white/80 shadow-[0_8px_30px_rgba(50,70,100,0.06)]",
          "transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/60">
          <Link href="/explore" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-extrabold tracking-wide text-[#0B1528]">♟️ AFRICAN</p>
              <p className="text-[11px] font-extrabold tracking-wide text-[#0B1528]">CHESS ACADEMY</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#EEF3FA] text-[#64748B]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-5 pt-4 pb-2">
          {isStudent ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#368AE4]/10 border border-[#368AE4]/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#368AE4]" />
                <span className="text-[11px] font-extrabold text-[#368AE4]">
                  Verified Student
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#368AE4] animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EEF3FA]/80 border border-[#DBE9F7]">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                Registered User
              </span>
            </div>
          )}
        </div>

        {/* Quick Launch Dashboard if verified */}
        {isStudent && (
          <div className="px-3 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#368AE4] text-white text-xs font-extrabold shadow-[0_4px_12px_rgba(54,138,228,0.3)] hover:bg-[#2B7AD4] transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Launch Dashboard
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[9px] font-extrabold text-[#64748B]/60 uppercase tracking-widest">
            Navigation
          </p>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/explore" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
                  isActive
                    ? "bg-[#368AE4] text-white shadow-[0_4px_12px_rgba(54,138,228,0.3)]"
                    : "text-[#64748B] hover:bg-white/60 hover:text-[#0B1528]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
                {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/60">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/50 transition cursor-pointer group">
            <div className="h-9 w-9 rounded-xl bg-[#368AE4] text-white flex items-center justify-center text-sm font-extrabold shrink-0 relative">
              {access.profile.full_name?.charAt(0)?.toUpperCase() || "U"}
              {isStudent && (
                <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                  <CheckCircle2 className="h-3 w-3 text-[#368AE4] fill-[#368AE4]/20" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-[#0B1528] truncate flex items-center gap-1">
                {access.profile.full_name}
              </p>
              <p className="text-[10px] text-[#64748B] truncate">{access.profile.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-red-500 hover:bg-red-50 transition"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/40 backdrop-blur-xl border-b border-white/60">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/60 border border-white/80 text-[#64748B] hover:text-[#0B1528] transition"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs font-bold text-[#64748B]">Explore Workspace</p>
              <p className="text-sm font-extrabold text-[#0B1528]">
                {isStudent ? "Verified Student Account" : "Registered User Access"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStudent ? (
              <Badge variant="blue" className="hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Student
              </Badge>
            ) : (
              <Badge variant="warning" className="hidden sm:inline-flex">
                <Clock className="h-3 w-3 mr-1" /> Pending Student Verification
              </Badge>
            )}
            <WorkspaceSwitcher workspaces={access.workspaces} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}