"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, Search, Bell, LogOut, Shield, Mail, Palette, Volume2
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: user.email?.split("@")[0], email: user.email });
      setLoading(false);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  const firstName = (profile?.full_name || "Student").split(" ")[0];

  return (
    <>
<div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input type="text" placeholder="Search settings..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none" />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] backdrop-blur"><Bell className="h-4 w-4" /></button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-[#368AE4] mb-1">⚙️ Hey, {firstName}!</p>
          <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
            Account <span className="text-[#368AE4]">Settings</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h3 className="font-extrabold text-[#0B1528]">Preferences</h3>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Bell, label: "Push Notifications", desc: "Get notified about lessons and tournaments", state: notifications, set: setNotifications },
                  { icon: Volume2, label: "Sound Effects", desc: "Play move sounds during games", state: sounds, set: setSounds },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/40 border border-white/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-[#0B1528]">{item.label}</p>
                        <p className="text-[10px] text-[#64748B]">{item.desc}</p>
                      </div>
                    </div>
                    <button onClick={() => item.set(!item.state)} className={`h-6 w-11 rounded-full transition ${item.state ? "bg-[#368AE4]" : "bg-white/60 border border-white/80"}`}>
                      <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${item.state ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h3 className="font-extrabold text-[#0B1528]">Account</h3>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-white/40 border border-white/60 p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#368AE4]" />
                    <div>
                      <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold text-[#0B1528]">{profile?.email || "—"}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/40 border border-white/60 p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-[#368AE4]" />
                    <div>
                      <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Role</p>
                      <p className="text-sm font-bold text-[#0B1528] capitalize">{profile?.role || "Student"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-red-200/60">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-5 w-1.5 rounded-full bg-red-500" />
                <h3 className="font-extrabold text-[#0B1528]">Danger Zone</h3>
              </div>
              <div className="rounded-xl bg-red-50/60 border border-red-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-extrabold text-red-700">Sign Out</p>
                  <p className="text-[11px] text-red-600">End your current session</p>
                </div>
                <Button variant="ghost" className="text-red-600 hover:bg-red-100" onClick={signOut}>
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Palette className="h-5 w-5 text-[#368AE4]" />
                <p className="font-extrabold text-[#0B1528]">Theme</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl bg-white border-2 border-[#368AE4] p-3 text-center">
                  <div className="h-8 w-full rounded-lg bg-gradient-to-br from-[#EEF3FA] to-white mb-2" />
                  <p className="text-[10px] font-bold text-[#0B1528]">Light</p>
                </button>
                <button className="rounded-xl bg-white/40 border border-white/60 p-3 text-center opacity-50 cursor-not-allowed">
                  <div className="h-8 w-full rounded-lg bg-gradient-to-br from-[#0B1528] to-slate-800 mb-2" />
                  <p className="text-[10px] font-bold text-[#64748B]">Dark</p>
                </button>
              </div>
              <p className="text-[10px] text-[#64748B] mt-2 text-center">Dark mode coming soon</p>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Version</p>
              <p className="text-sm font-extrabold text-[#0B1528]">ACA Platform v1.0</p>
              <p className="text-[10px] text-[#64748B] mt-1">Latest update: Nov 2025</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}


