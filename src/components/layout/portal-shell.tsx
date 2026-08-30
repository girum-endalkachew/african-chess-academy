"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, LogOut, LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type Props = {
  role: "Student" | "Coach" | "Admin";
  userName: string;
  navItems: NavItem[];
  children: ReactNode;
};

export function PortalShell({ role, userName, navItems, children }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#DBE9F7] flex flex-col transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-16 px-5 border-b border-[#DBE9F7] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/aca-logo.jpg" alt="ACA" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-[#1E293B] text-sm">ACA {role}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#E6F5FF] text-[#00A3E0]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#1E293B]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#DBE9F7]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-30"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#DBE9F7] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm text-slate-500">
              <span className="font-semibold text-[#1E293B]">{role} Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#1E293B] leading-tight">{userName}</p>
              <p className="text-xs text-slate-500 leading-tight">{role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#E6F5FF] text-[#00A3E0] font-bold flex items-center justify-center text-sm">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}