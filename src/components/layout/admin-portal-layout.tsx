"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loadAccess } from "@/lib/access";
import { PortalShell } from "@/components/layout/portal-shell";
import { adminNavItems } from "@/components/layout/admin-nav";

export function AdminPortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const access = await loadAccess();
      if (!mounted) return;

      if (!access) {
        router.replace("/login");
        return;
      }

      if (!access.roles.includes("admin")) {
        router.replace(access.homePath || "/explore");
        return;
      }

      setUserName(access.profile.full_name || access.profile.email?.split("@")[0] || "Admin");
      setReady(true);
    })();
    return () => { mounted = false; };
  }, [router]);

  return (
    <PortalShell role="Admin" userName={userName} navItems={adminNavItems}>
      {!ready ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
        </div>
      ) : (
        children
      )}
    </PortalShell>
  );
}
