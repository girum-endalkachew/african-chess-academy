"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Shield, AlertCircle } from "lucide-react";

export default function AdminApprovalsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

    // 1. Fetch all role requests
    const { data: reqs, error: reqErr } = await supabase
      .from("role_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (reqErr) {
      setErrorMsg(reqErr.message);
      setRows([]);
      setLoading(false);
      return;
    }

    if (!reqs || reqs.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    // 2. Fetch profiles separately for full reliability
    const userIds = Array.from(new Set(reqs.map((r) => r.user_id)));
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const profMap = new Map((profs || []).map((p) => [p.id, p.full_name]));

    const combined = reqs.map((r) => ({
      ...r,
      user_name: profMap.get(r.user_id) || "User " + r.user_id.slice(0, 6),
    }));

    setRows(combined);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (row: any, status: "approved" | "rejected") => {
    setBusy(row.id);
    const { data: { user } } = await supabase.auth.getUser();

    const { error: updateErr } = await supabase
      .from("role_requests")
      .update({
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (updateErr) {
      setErrorMsg(updateErr.message);
      setBusy(null);
      return;
    }

    if (status === "approved") {
      // Grant active role in user_roles
      await supabase.from("user_roles").upsert({
        user_id: row.user_id,
        role: row.requested_role,
        status: "active",
        granted_by: user?.id,
        granted_at: new Date().toISOString(),
      });

      // Update primary workspace & role on profile
      if (row.requested_role === "student") {
        await supabase.from("profiles").update({
          onboarding_complete: true,
          primary_workspace: "student",
          role: "student",
        }).eq("id", row.user_id);
      } else if (row.requested_role === "coach") {
        await supabase.from("profiles").update({
          primary_workspace: "coach",
          role: "coach",
        }).eq("id", row.user_id);
      } else if (row.requested_role === "admin") {
        await supabase.from("profiles").update({
          primary_workspace: "admin",
          role: "admin",
        }).eq("id", row.user_id);
      } else if (row.requested_role === "premium") {
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const pending = rows.filter((r) => r.status === "pending");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard className="p-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Role Approvals</h1>
          <p className="text-xs text-[#64748B] mt-1">Approve Student, Coach, Premium, or Admin access requests</p>
        </div>
        <Badge variant="blue">{pending.length} pending</Badge>
      </GlassCard>

      {errorMsg && (
        <GlassCard className="p-4 border-red-200 bg-red-50 text-red-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </GlassCard>
      )}

      {pending.length === 0 ? (
        <GlassCard className="p-10 text-center space-y-2">
          <Shield className="h-10 w-10 text-[#368AE4] mx-auto opacity-80" />
          <p className="font-extrabold text-[#0B1528]">No pending requests</p>
          <p className="text-xs text-[#64748B]">When registered users click "Request Access" on Explore, their requests will show here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <GlassCard key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" hoverEffect>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-[#0B1528] text-sm">{r.user_name}</p>
                  <Badge variant="blue" className="capitalize">{r.requested_role}</Badge>
                </div>
                {r.message && <p className="text-xs text-[#64748B] font-medium">{r.message}</p>}
                <p className="text-[10px] text-[#64748B] font-bold">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="primary" disabled={busy === r.id} onClick={() => review(r, "approved")}>
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" disabled={busy === r.id} onClick={() => review(r, "rejected")}>
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {rows.filter((r) => r.status !== "pending").length > 0 && (
        <GlassCard className="p-5 space-y-3">
          <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Approval History</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rows.filter((r) => r.status !== "pending").map((r) => (
              <div key={r.id} className="flex items-center justify-between text-xs rounded-xl bg-white/40 border border-white/60 p-3">
                <div>
                  <span className="font-bold text-[#0B1528]">{r.user_name}</span>
                  <span className="text-[#64748B] ml-2">({r.requested_role})</span>
                </div>
                <Badge variant={r.status === "approved" ? "success" : "danger"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
