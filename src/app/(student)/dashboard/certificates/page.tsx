"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, ShieldCheck
} from "lucide-react";
import { formatDate } from "@/lib/utils/date";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function StudentCertificatesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: user.email?.split("@")[0] });

      const { data: certs } = await supabase.from("certificates").select("*").eq("user_id", user.id);
      setCertificates(certs || []);

      setLoading(false);
    })();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Student"} navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">My Certificates</h1>
          <p className="text-sm text-slate-500 mt-1">Earn official certificates by completing academy courses.</p>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-10 text-center space-y-3">
            <Award className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="font-bold text-[#1E293B]">No Certificates Earned Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete 100% of any course in your Learning Hub to automatically generate your official African Chess Academy certificate!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {certificates.map((c) => (
              <div key={c.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B]">{c.title}</h3>
                    <p className="text-xs text-slate-500">Issued on {formatDate(c.issued_at)}</p>
                  </div>
                </div>
                <Badge variant="success">Verified ACA Graduate</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}