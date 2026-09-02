"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadAccess } from "@/lib/access";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Swords, Trophy, Users, Sparkles, ArrowRight,
  GraduationCap, Shield, CheckCircle2, Clock
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("Champion");
  const [roles, setRoles] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const access = await loadAccess();
      if (!access) {
        router.replace("/login");
        return;
      }
      // If they already have a strong workspace and finished onboarding, soft-suggest home
      setName(access.profile.full_name || "Champion");
      setRoles(access.roles);
      setWorkspaces(access.workspaces);

      const { data: reqs } = await supabase
        .from("role_requests")
        .select("requested_role, status")
        .eq("user_id", access.userId)
        .eq("status", "pending");
      setPending((reqs || []).map((r: any) => r.requested_role));
      setLoading(false);
    })();
  }, [router, supabase]);

  const requestRole = async (requested_role: "student" | "coach" | "premium") => {
    setBusy(requested_role);
    setMsg("");
    const access = await loadAccess();
    if (!access) return;
    const { error } = await supabase.from("role_requests").insert({
      user_id: access.userId,
      requested_role,
      message: `Requesting ${requested_role} access from Explore onboarding`,
      status: "pending",
    });
    if (error) setMsg(error.message);
    else {
      setMsg(`Request for ${requested_role} sent. An admin will approve you.`);
      setPending((p) => Array.from(new Set([...p, requested_role])));
    }
    setBusy(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const isStudent = roles.includes("student");
  const isCoach = roles.includes("coach");
  const isAdmin = roles.includes("admin");
  const isPremium = roles.includes("premium");

  return (
    <div className="min-h-screen canvas-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Registered · Explore</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1528] tracking-tight">
              Welcome, {name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-[#64748B] mt-1 font-medium">
              We don’t just teach chess. We build strategic thinkers.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <WorkspaceSwitcher workspaces={workspaces} />
            <Link href="/" className="text-xs font-bold text-[#368AE4]">← Back to public site</Link>
          </div>
        </div>

        {msg && (
          <GlassCard className="p-4 border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold">
            {msg}
          </GlassCard>
        )}

        {/* Path cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="h-12 w-12 rounded-2xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-[#0B1528]">Become a Student</h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Courses, puzzles, play vs computer, friends, streak tracking, and tournaments.
            </p>
            {isStudent ? (
              <Link href="/dashboard"><Button variant="primary" className="w-full">Open Student Dashboard</Button></Link>
            ) : pending.includes("student") ? (
              <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending approval</Button>
            ) : (
              <Button variant="primary" className="w-full" disabled={!!busy} onClick={() => requestRole("student")}>
                {busy === "student" ? "Sending..." : "Request Student Access"}
              </Button>
            )}
          </GlassCard>

          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-[#0B1528]">Go Premium</h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Deeper AI hints, premium puzzles, analysis tools, and exclusive academy modules.
            </p>
            {isPremium ? (
              <Link href="/dashboard"><Button variant="primary" className="w-full">Premium unlocked</Button></Link>
            ) : pending.includes("premium") ? (
              <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending approval</Button>
            ) : (
              <Button variant="glass" className="w-full" disabled={!!busy} onClick={() => requestRole("premium")}>
                {busy === "premium" ? "Sending..." : "Request Premium"}
              </Button>
            )}
          </GlassCard>

          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-[#0B1528]">Become a Coach</h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Manage students, sessions, and guide learning paths across the academy.
            </p>
            {isCoach ? (
              <Link href="/coach"><Button variant="primary" className="w-full">Open Coach Dashboard</Button></Link>
            ) : pending.includes("coach") ? (
              <Button variant="outline" className="w-full" disabled><Clock className="h-4 w-4" /> Pending approval</Button>
            ) : (
              <Button variant="glass" className="w-full" disabled={!!busy} onClick={() => requestRole("coach")}>
                {busy === "coach" ? "Sending..." : "Apply as Coach"}
              </Button>
            )}
          </GlassCard>
        </div>

        {/* Preview tools (creative limited access) */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Explore ACA Online</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { href: "/programs", label: "Programs", icon: BookOpen, desc: "Learning paths" },
              { href: "/events", label: "Events", icon: Trophy, desc: "Clinics & webinars" },
              { href: "/coaches", label: "Coaches", icon: Users, desc: "Meet mentors" },
              { href: "/contact", label: "Contact", icon: Shield, desc: "Talk to ACA" },
            ].map((i) => (
              <Link key={i.href} href={i.href}>
                <div className="rounded-2xl bg-white/50 border border-white/70 p-4 hover:bg-white/70 transition h-full">
                  <i.icon className="h-5 w-5 text-[#368AE4] mb-2" />
                  <p className="text-sm font-extrabold text-[#0B1528]">{i.label}</p>
                  <p className="text-[11px] text-[#64748B]">{i.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold text-[#0B1528]">Already approved?</p>
            <p className="text-xs text-[#64748B]">Use the workspace switcher or jump to your home.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isStudent && <Link href="/dashboard"><Button variant="primary">Student <ArrowRight className="h-4 w-4" /></Button></Link>}
            {isCoach && <Link href="/coach"><Button variant="glass">Coach</Button></Link>}
            {isAdmin && <Link href="/admin"><Button variant="outline">Admin</Button></Link>}
            {!isStudent && !isCoach && !isAdmin && (
              <Badge variant="warning">Waiting for admin approval</Badge>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
