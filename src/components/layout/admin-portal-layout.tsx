"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell } from "@/components/layout/portal-shell";
import { adminNavItems } from "@/components/layout/admin-nav";

export function AdminPortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState("Admin");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data: prof } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
      if (!mounted) return;

      if (prof?.role === "student") { router.replace("/dashboard"); return; }
      if (prof?.role === "coach") { router.replace("/coach"); return; }

      setUserName(prof?.full_name || user.email?.split("@")[0] || "Admin");
      setReady(true);
    })();
    return () => { mounted = false; };
  }, [router, supabase]);

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
