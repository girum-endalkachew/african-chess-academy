"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Lock, LogIn, Eye, EyeOff, ArrowRight,
  BookOpen, Swords, Trophy, Sparkles, Shield
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    router.push("/post-login");
  };

  return (
    <div className="space-y-6">
      {/* Welcome header like student dashboard */}
      <div>
        <p className="text-sm font-bold text-[#368AE4] mb-1">👋 Welcome back</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1528] tracking-tight">
          Sign in to your <span className="text-[#368AE4]">Academy</span>
        </h1>
        <p className="text-sm text-[#64748B] mt-2 font-medium">
          Continue learning, playing, and climbing your ELO.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Form card */}
        <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Account login</h2>
            </div>
            <Badge variant="blue">Secure</Badge>
          </div>

          {err && (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold p-3.5">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Email</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Password</span>
                <Link href="/forgot" className="text-[11px] font-bold text-[#368AE4] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-11 h-12 rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0B1528]"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 rounded-2xl text-sm"
              disabled={busy}
            >
              <LogIn className="h-4 w-4" />
              {busy ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </form>

          <div className="pt-2 border-t border-white/60 text-center text-xs text-[#64748B]">
            New to ACA?{" "}
            <Link href="/register" className="font-extrabold text-[#368AE4] hover:underline inline-flex items-center gap-1">
              Create free account <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </GlassCard>

        {/* Side widgets like student dashboard */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#368AE4]/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider mb-2">After you sign in</p>
              <h3 className="text-lg font-extrabold text-[#0B1528] mb-3">Your workspace awaits</h3>
              <div className="space-y-2.5">
                {[
                  { i: BookOpen, t: "Learning hub", d: "Courses & lessons" },
                  { i: Swords, t: "Play center", d: "AI · Friends · Puzzles" },
                  { i: Trophy, t: "Compete", d: "Tournaments & events" },
                  { i: Sparkles, t: "Track growth", d: "ELO · streaks · certs" },
                ].map((x) => (
                  <div key={x.t} className="flex items-center gap-3 rounded-xl bg-white/50 border border-white/70 px-3 py-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center shrink-0">
                      <x.i className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0B1528]">{x.t}</p>
                      <p className="text-[10px] font-medium text-[#64748B]">{x.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-[#368AE4]" />
              <p className="text-xs font-extrabold text-[#0B1528]">Secure access</p>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Multi-role accounts. New users start on Explore. Student & Coach access is admin-approved.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
