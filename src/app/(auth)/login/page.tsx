"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role === "admin") router.push("/admin");
      else if (profile?.role === "coach") router.push("/coach");
      else router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden">
      <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col justify-between p-12" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)" }}>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#00A3E0] rounded-full blur-[120px] opacity-30" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 text-white w-fit">
            <div className="bg-white p-1.5 rounded-xl">
              <Image src="/aca-logo.jpg" alt="ACA Logo" width={36} height={36} className="rounded-lg object-cover" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block leading-none">ACA ACADEMY</span>
              <span className="text-[10px] text-slate-400 tracking-widest">AFRICAN CHESS ACADEMY</span>
            </div>
          </Link>
        </div>
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="text-7xl opacity-20 text-[#87CEEB]">♞</div>
          <h2 className="text-5xl font-bold text-white leading-tight">
            Sign in with your account.
          </h2>
          <p className="text-slate-300 text-lg">Use the email and password you registered with.</p>
        </div>
        <div className="relative z-10 text-sm text-slate-400">© {new Date().getFullYear()} African Chess Academy</div>
      </div>

      <div className="w-full lg:w-[54%] flex flex-col justify-center px-6 sm:px-10 md:px-16 relative bg-white">
        <Link href="/" className="absolute top-6 left-6 sm:left-10 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00A3E0]">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="w-full max-w-md mx-auto space-y-8 relative z-10 py-16">
          <div className="lg:hidden flex justify-center">
            <Image src="/aca-logo.jpg" alt="ACA Logo" width={56} height={56} className="rounded-xl" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F5FF] border border-[#DBE9F7]">
              <Sparkles className="w-3 h-3 text-[#00A3E0]" />
              <span className="text-xs font-semibold text-[#00A3E0]">Real sign in</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B] tracking-tight">Sign in</h2>
            <p className="text-slate-500">Email and password only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1E293B]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input type="email" className="pl-12 h-14 rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1E293B]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input type={showPassword ? "text" : "password"} className="pl-12 pr-12 h-14 rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl font-bold gap-2 bg-[#00A3E0] hover:bg-[#0284C7] text-white" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            New here?{" "}
            <Link href="/register" className="font-bold text-[#00A3E0] hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}