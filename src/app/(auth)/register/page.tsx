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
  User, Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight,
  CheckCircle2, BookOpen, Sparkles, GraduationCap
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/post-login`,
        data: { full_name: fullName },
      },
    });

    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }

    if (data.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName || email.split("@")[0],
          onboarding_complete: false,
          primary_workspace: "explore",
          chess_rating: 1200,
        });
        await supabase.from("user_roles").upsert({
          user_id: data.user.id,
          role: "registered",
          status: "active",
        });
        await supabase.from("subscriptions").upsert({
          user_id: data.user.id,
          plan: "free",
          status: "active",
        });
      } catch {}
    }

    setBusy(false);
    if (data.session) router.push("/post-login");
    else setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto">
        <GlassCard className="p-8 sm:p-10 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Check your email</h1>
          <p className="text-sm text-[#64748B] leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="font-extrabold text-[#0B1528]">{email}</span>.
            Activate your account to open Explore and start the free intro course.
          </p>
          <Link href="/login">
            <Button variant="primary" className="h-11 rounded-2xl">Back to Sign In</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-[#368AE4] mb-1">🚀 Join ACA</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1528] tracking-tight">
          Create your <span className="text-[#368AE4]">free account</span>
        </h1>
        <p className="text-sm text-[#64748B] mt-2 font-medium">
          Start on Explore with the free “How to Play Chess” course. Student access is admin-approved.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Registration</h2>
            </div>
            <Badge variant="success">Free to start</Badge>
          </div>

          {err && (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold p-3.5">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Full name</span>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </label>

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
              <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Password</span>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="pl-10 pr-11 h-12 rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <Button type="submit" variant="primary" className="w-full h-12 rounded-2xl" disabled={busy}>
              <UserPlus className="h-4 w-4" />
              {busy ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="pt-2 border-t border-white/60 text-center text-xs text-[#64748B]">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-[#368AE4] hover:underline inline-flex items-center gap-1">
              Sign in <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </GlassCard>

        {/* Journey steps — dashboard widget style */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Your path</p>
              <h3 className="text-lg font-extrabold text-[#0B1528]">How ACA works</h3>
              {[
                { n: "1", t: "Register", d: "Create free account → Explore" },
                { n: "2", t: "Learn free", d: "Finish “How to Play Chess”" },
                { n: "3", t: "Request access", d: "Student or Coach via admin" },
                { n: "4", t: "Level up", d: "Full dashboard + Premium" },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/70 border border-white/80 text-[#368AE4] font-extrabold text-sm flex items-center justify-center shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#0B1528]">{s.t}</p>
                    <p className="text-[10px] text-[#64748B]">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-3 gap-2">
            {[
              { i: BookOpen, t: "Free course" },
              { i: GraduationCap, t: "Student path" },
              { i: Sparkles, t: "Premium" },
            ].map((x) => (
              <GlassCard key={x.t} className="p-3 text-center">
                <x.i className="h-4 w-4 text-[#368AE4] mx-auto mb-1" />
                <p className="text-[10px] font-extrabold text-[#0B1528]">{x.t}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
