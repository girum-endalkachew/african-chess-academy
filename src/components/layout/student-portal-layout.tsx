"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell } from "@/components/layout/portal-shell";
import { studentNavItems } from "@/components/layout/student-nav";

export function StudentPortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState("Student");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (prof?.role === "admin") {
        router.replace("/admin");
        return;
      }
      if (prof?.role === "coach") {
        router.replace("/coach");
        return;
      }

      setUserName(prof?.full_name || user.email?.split("@")[0] || "Student");
      setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  // Shell stays mounted; only inner content waits
  return (
    <PortalShell role="Student" userName={userName} navItems={studentNavItems}>
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
