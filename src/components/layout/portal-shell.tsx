"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, LogOut, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aca_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("aca_sidebar_collapsed", String(next));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = userName?.charAt(0)?.toUpperCase() || "U";
  const sidebarWidth = collapsed ? "w-20" : "w-64";

  return (
    <div className="min-h-screen canvas-bg flex font-sans max-w-full overflow-x-hidden">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40 
          ${sidebarWidth}
          bg-white/70 lg:bg-white/40 backdrop-blur-xl border-r border-white/60 
          flex flex-col
          ${mounted ? "transition-all duration-300 ease-in-out" : ""}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          shadow-[4px_0_24px_rgba(30,60,100,0.08)]
        `}
      >
        <div className={`h-16 sm:h-20 border-b border-white/50 flex items-center justify-between shrink-0 ${collapsed ? "px-4" : "px-5"}`}>
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#0B1528] text-white shadow-sm shrink-0">
              <span className="font-serif text-lg sm:text-xl leading-none">♙</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none min-w-0">
                <span className="font-extrabold text-[#0B1528] text-[13px] truncate">ACA {role}</span>
                <span className="font-bold text-[#64748B] text-[9px] tracking-wider mt-0.5">PORTAL</span>
              </div>
            )}
          </Link>

          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-[#64748B]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex absolute -right-3 top-24 z-50 h-6 w-6 rounded-full bg-white border border-white/80 shadow-md items-center justify-center text-[#64748B] hover:text-[#368AE4] hover:scale-110 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        <nav className="flex-1 overflow-y-auto overscroll-contain py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <div key={item.href} className={collapsed ? "px-2" : "px-3"}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center rounded-xl transition-all
                    ${collapsed ? "justify-center h-10 w-12 mx-auto" : "gap-3 px-3.5 py-2.5"}
                    ${active
                      ? "bg-white/80 text-[#368AE4] shadow-sm border border-white/90"
                      : "text-[#64748B] hover:bg-white/50 hover:text-[#0B1528]"}
                  `}
                >
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-[#368AE4]" : "text-[#64748B]"}`} />
                  {!collapsed && <span className="text-[13px] font-bold truncate">{item.label}</span>}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className={`border-t border-white/50 shrink-0 ${collapsed ? "p-2" : "p-3"}`}>
          <button
            onClick={handleSignOut}
            title={collapsed ? "Sign out" : undefined}
            className={`
              flex items-center rounded-xl text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors
              ${collapsed ? "justify-center h-10 w-12 mx-auto" : "gap-3 px-3.5 py-2.5 w-full"}
            `}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="text-[13px] font-bold">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-[#0B1528]/30 backdrop-blur-sm z-30" />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-16 sm:h-20 bg-white/30 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-[0_4px_24px_rgba(30,60,100,0.02)]">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl text-[#0B1528] bg-white/60 border border-white/80 shadow-sm">
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden sm:block text-[13px] font-bold text-[#64748B]">
              Welcome back to the <span className="text-[#368AE4]">Academy</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-extrabold text-[#0B1528] leading-tight">{userName}</p>
              <p className="text-[10px] font-bold text-[#64748B] leading-tight uppercase tracking-wider">{role}</p>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white font-extrabold flex items-center justify-center shadow-md border-2 border-white text-sm">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
