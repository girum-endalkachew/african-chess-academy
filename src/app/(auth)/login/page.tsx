"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowRight } from "lucide-react";

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
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setBusy(false); return; }
    router.push("/post-login");
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="lg:hidden flex items-center gap-2 justify-center">
        <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-slate-100 bg-white">
          <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
        </div>
        <span className="font-extrabold text-[#0B1528]">ACA</span>
      </div>

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#368AE4]">Welcome back</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0B1528]">Sign in to ACA</h1>
        <p className="mt-1 text-sm text-[#64748B]">Continue your chess journey.</p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold p-3">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-[10px] font-extrabold text-[#64748B] uppercase">Email</span>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="pl-9" />
          </div>
        </label>

        <label className="block">
          <div className="flex justify-between">
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase">Password</span>
            <Link href="/forgot" className="text-[10px] font-bold text-[#368AE4]">Forgot?</Link>
          </div>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} required placeholder="••••••••" className="pl-9 pr-10" />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <Button type="submit" variant="primary" className="w-full h-11 rounded-xl" disabled={busy}>
          <LogIn className="h-4 w-4" /> {busy ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B]">
        New to ACA?{" "}
        <Link href="/register" className="font-extrabold text-[#368AE4] hover:underline inline-flex items-center gap-1">
          Create an account <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-[10px] text-[#64748B] text-center">
        By continuing you agree to ACA’s Terms and Privacy.
      </p>
    </div>
  );
}
