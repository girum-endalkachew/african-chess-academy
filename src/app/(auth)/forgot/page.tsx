"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const redirectTo = `${window.location.origin}/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);
    setMsg(error ? error.message : "Check your email for the reset link.");
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <p className="text-sm font-bold text-[#368AE4] mb-1">🔐 Security</p>
        <h1 className="text-3xl font-extrabold text-[#0B1528] tracking-tight">
          Reset your <span className="text-[#368AE4]">password</span>
        </h1>
        <p className="text-sm text-[#64748B] mt-2">We’ll send a secure link to your inbox.</p>
      </div>

      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Email recovery</h2>
          </div>
          <Badge variant="blue">SMTP</Badge>
        </div>

        {msg && (
          <div className="rounded-2xl border border-white/70 bg-white/60 text-[#0B1528] text-xs font-bold p-3.5">
            {msg}
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
                className="pl-10 h-12 rounded-2xl"
                placeholder="you@example.com"
              />
            </div>
          </label>
          <Button type="submit" variant="primary" className="w-full h-12 rounded-2xl" disabled={busy}>
            {busy ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#368AE4]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </GlassCard>
    </div>
  );
}
