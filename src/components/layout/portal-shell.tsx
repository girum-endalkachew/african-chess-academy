"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
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
    // We use the same canvas-bg from the landing page
    <div className="min-h-screen canvas-bg flex font-sans">
      
      {/* Sidebar (Glassmorphic) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/40 backdrop-blur-xl border-r border-white/60 flex flex-col transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(30,60,100,0.04)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Area */}
        <div className="h-20 px-6 border-b border-white/50 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1528] text-white shadow-sm shrink-0">
              <span className="font-serif text-xl leading-none">♙</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[#0B1528] text-[13px]">ACA {role}</span>
              <span className="font-bold text-[#64748B] text-[9px] tracking-wider mt-0.5">PORTAL</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-[#64748B]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-bold transition-all ${
                  active
                    ? "bg-white/70 text-[#368AE4] shadow-sm border border-white/80"
                    : "text-[#64748B] hover:bg-white/40 hover:text-[#0B1528]"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${active ? "text-[#368AE4]" : "text-[#64748B]"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-white/50">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-xl px-4 py-3 w-full text-[13px] font-bold text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-[#0B1528]/20 backdrop-blur-sm z-30" />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header (Glassmorphic) */}
        <header className="h-20 bg-white/30 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-20 shadow-[0_4px_24px_rgba(30,60,100,0.02)]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-[#0B1528] bg-white/50 border border-white/60">
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden sm:block text-[13px] font-bold text-[#64748B]">
              Welcome back to the <span className="text-[#368AE4]">Academy</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-extrabold text-[#0B1528] leading-tight">{userName}</p>
              <p className="text-[10px] font-bold text-[#64748B] leading-tight uppercase tracking-wider">{role}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white font-extrabold flex items-center justify-center shadow-md border-2 border-white">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}