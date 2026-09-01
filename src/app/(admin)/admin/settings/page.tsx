"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, LogOut } from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="p-7">
        <h1 className="text-2xl font-extrabold text-[#0B1528]">Admin Settings</h1>
        <p className="text-sm font-medium text-[#64748B] mt-1">Platform level configuration</p>
      </GlassCard>

      <GlassCard className="p-7 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-[#368AE4]" />
          <div>
            <p className="text-sm font-extrabold text-[#0B1528]">Administrator Rights</p>
            <p className="text-xs text-[#64748B]">You have full access to database records.</p>
          </div>
        </div>
        <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </GlassCard>
    </div>
  );
}
