"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

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
    setBusy(true); setErr(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/post-login`,
        data: { full_name: fullName },
      },
    });
    if (error) { setErr(error.message); setBusy(false); return; }

    // create profile row (best-effort)
    if (data.user) {
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
    }

    setBusy(false);

    if (data.session) {
      router.push("/post-login");
    } else {
      // email confirmation flow
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="mx-auto w-full max-w-sm text-center space-y-4">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Check your email</h1>
        <p className="text-sm text-[#64748B]">
          We sent a confirmation link to <span className="font-bold text-[#0B1528]">{email}</span>.
          Click it to activate your account.
        </p>
        <Link href="/login">
          <Button variant="primary" className="w-full">Back to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="lg:hidden flex items-center gap-2 justify-center">
        <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-slate-100 bg-white">
          <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
        </div>
        <span className="font-extrabold text-[#0B1528]">ACA</span>
      </div>

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#368AE4]">Join ACA</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0B1528]">Create your account</h1>
        <p className="mt-1 text-sm text-[#64748B]">Start with the free “How to Play Chess” course.</p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold p-3">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-[10px] font-extrabold text-[#64748B] uppercase">Full name</span>
          <div className="mt-1 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your name" className="pl-9" />
          </div>
        </label>

        <label className="block">
          <span className="text-[10px] font-extrabold text-[#64748B] uppercase">Email</span>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="pl-9" />
          </div>
        </label>

        <label className="block">
          <span className="text-[10px] font-extrabold text-[#64748B] uppercase">Password</span>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} required placeholder="At least 8 characters" className="pl-9 pr-10" />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <Button type="submit" variant="primary" className="w-full h-11 rounded-xl" disabled={busy}>
          <UserPlus className="h-4 w-4" /> {busy ? "Creating..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B]">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-[#368AE4] hover:underline inline-flex items-center gap-1">
          Sign in <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-[10px] text-[#64748B] text-center">
        By registering you agree to ACA’s Terms and Privacy.
      </p>
    </div>
  );
}
