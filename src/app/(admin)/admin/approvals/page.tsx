"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Shield } from "lucide-react";

export default function AdminApprovalsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("role_requests")
      .select("*, profiles:user_id(full_name)")
      .order("created_at", { ascending: false });
    // if join alias fails, fallback
    if (!data) {
      const { data: plain } = await supabase.from("role_requests").select("*").order("created_at", { ascending: false });
      setRows(plain || []);
    } else setRows(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const review = async (row: any, status: "approved" | "rejected") => {
    setBusy(row.id);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("role_requests").update({
      status,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", row.id);

    if (status === "approved") {
      await supabase.from("user_roles").upsert({
        user_id: row.user_id,
        role: row.requested_role,
        status: "active",
        granted_by: user?.id,
        granted_at: new Date().toISOString(),
      });

      // ensure registered + student onboarding flags
      if (row.requested_role === "student") {
        await supabase.from("profiles").update({
          onboarding_complete: true,
          primary_workspace: "student",
          role: "student",
        }).eq("id", row.user_id);
      }
      if (row.requested_role === "coach") {
        await supabase.from("profiles").update({
          primary_workspace: "coach",
          role: "coach",
        }).eq("id", row.user_id);
      }
      if (row.requested_role === "admin") {
        await supabase.from("profiles").update({
          primary_workspace: "admin",
          role: "admin",
        }).eq("id", row.user_id);
      }
      if (row.requested_role === "premium") {
        await supabase.from("subscriptions").upsert({
          user_id: row.user_id,
          plan: "premium",
          status: "active",
          updated_at: new Date().toISOString(),
        });
      }
    }
    await load();
    setBusy(null);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  const pending = rows.filter((r) => r.status === "pending");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard className="p-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Approvals</h1>
          <p className="text-xs text-[#64748B] mt-1">Grant Student, Coach, Premium, or Admin access</p>
        </div>
        <Badge variant="blue">{pending.length} pending</Badge>
      </GlassCard>

      {pending.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <Shield className="h-8 w-8 text-[#368AE4] mx-auto mb-2" />
          <p className="font-extrabold text-[#0B1528]">No pending requests</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <GlassCard key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-extrabold text-[#0B1528]">
                  {r.profiles?.full_name || r.user_id.slice(0, 8)}
                </p>
                <p className="text-xs text-[#64748B]">
                  Requests <span className="font-bold text-[#368AE4]">{r.requested_role}</span>
                  {r.message ? ` · ${r.message}` : ""}
                </p>
                <p className="text-[10px] text-[#64748B] mt-1">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" disabled={busy === r.id} onClick={() => review(r, "approved")}>
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600" disabled={busy === r.id} onClick={() => review(r, "rejected")}>
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <GlassCard className="p-5">
        <p className="text-[10px] font-extrabold text-[#64748B] uppercase mb-3">Recent history</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {rows.filter(r => r.status !== "pending").slice(0, 20).map((r) => (
            <div key={r.id} className="flex items-center justify-between text-xs rounded-xl bg-white/40 border border-white/60 px-3 py-2">
              <span className="font-bold text-[#0B1528]">{r.requested_role}</span>
              <Badge variant={r.status === "approved" ? "success" : "danger"}>{r.status}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
