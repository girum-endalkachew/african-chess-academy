"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function ForgotPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const redirectTo = `${window.location.origin}/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);
    setMsg(error ? error.message : "Check your email for the reset link.");
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#368AE4]">Forgot password</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#0B1528]">Reset it in one click</h1>
        <p className="mt-1 text-sm text-[#64748B]">We’ll email you a secure link.</p>
      </div>

      {msg && <div className="rounded-xl border border-white/70 bg-white/60 text-[#0B1528] text-xs font-bold p-3">{msg}</div>}

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-[10px] font-extrabold text-[#64748B] uppercase">Email</span>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="pl-9" />
          </div>
        </label>
        <Button type="submit" variant="primary" className="w-full h-11 rounded-xl" disabled={busy}>
          {busy ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B]">
        <Link href="/login" className="font-extrabold text-[#368AE4]">Back to sign in</Link>
      </div>
    </div>
  );
}
