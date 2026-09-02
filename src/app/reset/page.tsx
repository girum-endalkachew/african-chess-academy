"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function ResetPage() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    setMsg(error ? error.message : "Password updated. You can sign in now.");
  };

  return (
    <div className="min-h-screen canvas-bg flex items-center justify-center p-6">
      <div className="master-glass w-full max-w-md rounded-3xl p-8 space-y-4">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Set new password</h1>
        {msg && <div className="rounded-xl border border-white/70 bg-white/60 text-[#0B1528] text-xs font-bold p-3">{msg}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="New password" className="pl-9" />
          </div>
          <Button type="submit" variant="primary" className="w-full h-11 rounded-xl" disabled={busy}>
            {busy ? "Updating..." : "Update password"}
          </Button>
        </form>
        <p className="text-center text-xs">
          <Link href="/login" className="font-extrabold text-[#368AE4]">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
