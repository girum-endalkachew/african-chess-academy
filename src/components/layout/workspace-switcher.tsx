"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workspace, workspacePath } from "@/lib/roles";
import { cn } from "@/lib/utils";

const LABELS: Record<Workspace, string> = {
  explore: "Explore",
  student: "Student",
  coach: "Coach",
  admin: "Admin",
};

export function WorkspaceSwitcher({
  workspaces,
  className,
}: {
  workspaces: Workspace[];
  className?: string;
}) {
  const pathname = usePathname();
  if (!workspaces || workspaces.length <= 1) return null;

  const current: Workspace =
    pathname.startsWith("/admin") ? "admin" :
    pathname.startsWith("/coach") ? "coach" :
    pathname.startsWith("/dashboard") ? "student" :
    "explore";

  return (
    <div className={cn("flex items-center gap-1 rounded-full bg-white/50 border border-white/70 p-1 backdrop-blur", className)}>
      {workspaces.map((ws) => {
        const active = current === ws;
        return (
          <Link
            key={ws}
            href={workspacePath(ws)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-extrabold transition",
              active ? "bg-[#368AE4] text-white shadow-sm" : "text-[#64748B] hover:text-[#0B1528] hover:bg-white/70"
            )}
          >
            {LABELS[ws]}
          </Link>
        );
      })}
    </div>
  );
}
