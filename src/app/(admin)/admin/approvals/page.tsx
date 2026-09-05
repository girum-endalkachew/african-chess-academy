"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2, XCircle, Shield, AlertCircle, GraduationCap,
  Sparkles, UserCog, Clock, Search, RefreshCw, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

type RequestRow = {
  id: string;
  user_id: string;
  requested_role: string;
  message?: string | null;
  status: "pending" | "approved" | "rejected" | string;
  created_at: string;
  reviewed_at?: string | null;
  user_name?: string;
};

const ROLE_META: Record<string, { label: string; icon: any; badge: "blue" | "accent" | "warning" | "navy"; color: string; bg: string }> = {
  student: { label: "Student", icon: GraduationCap, badge: "blue", color: "text-[#368AE4]", bg: "bg-[#EEF3FA]" },
  premium: { label: "Premium", icon: Sparkles, badge: "warning", color: "text-amber-600", bg: "bg-amber-50" },
  coach: { label: "Coach", icon: Shield, badge: "accent", color: "text-purple-600", bg: "bg-purple-50" },
  admin: { label: "Admin", icon: UserCog, badge: "navy", color: "text-[#0B1528]", bg: "bg-slate-100" },
};

export default function AdminApprovalsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "history" | "all">("pending");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

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

    const userIds = Array.from(new Set(reqs.map((r: any) => r.user_id)));
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const profMap = new Map((profs || []).map((p: any) => [p.id, p.full_name]));

    const combined: RequestRow[] = reqs.map((r: any) => ({
      ...r,
      user_name: profMap.get(r.user_id) || `User ${String(r.user_id).slice(0, 6)}`,
    }));

    setRows(combined);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const review = async (row: RequestRow, status: "approved" | "rejected") => {
    setBusy(row.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg("Session expired. Please sign in again.");
      setBusy(null);
      return;
    }

    const { error: updateErr } = await supabase
      .from("role_requests")
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (updateErr) {
      setErrorMsg(updateErr.message);
      setBusy(null);
      return;
    }

    if (status === "approved") {
      // Grant active role
      const { error: roleErr } = await supabase.from("user_roles").upsert(
        {
          user_id: row.user_id,
          role: row.requested_role,
          status: "active",
          granted_by: user.id,
          granted_at: new Date().toISOString(),
        },
        { onConflict: "user_id,role" }
      );

      if (roleErr) {
        // Fallback without onConflict if composite key differs
        await supabase.from("user_roles").upsert({
          user_id: row.user_id,
          role: row.requested_role,
          status: "active",
          granted_by: user.id,
          granted_at: new Date().toISOString(),
        });
      }

      if (row.requested_role === "student") {
        await supabase.from("profiles").update({
          onboarding_complete: true,
          primary_workspace: "student",
          role: "student",
          account_status: "verified",
        }).eq("id", row.user_id);
      } else if (row.requested_role === "coach") {
        await supabase.from("profiles").update({
          primary_workspace: "coach",
          role: "coach",
          account_status: "verified",
        }).eq("id", row.user_id);
      } else if (row.requested_role === "admin") {
        await supabase.from("profiles").update({
          primary_workspace: "admin",
          role: "admin",
          account_status: "verified",
        }).eq("id", row.user_id);
      } else if (row.requested_role === "premium") {
        await supabase.from("subscriptions").upsert(
          {
            user_id: row.user_id,
            plan: "premium",
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        // Also keep premium as an active role for isPremium() checks
        await supabase.from("user_roles").upsert(
          {
            user_id: row.user_id,
            role: "premium",
            status: "active",
            granted_by: user.id,
            granted_at: new Date().toISOString(),
          },
          { onConflict: "user_id,role" }
        );
      }

      setSuccessMsg(`Approved ${row.requested_role} for ${row.user_name}. They now have verified access.`);
    } else {
      setSuccessMsg(`Rejected ${row.requested_role} request for ${row.user_name}.`);
    }

    await load();
    setBusy(null);
  };

  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const approvedCount = rows.filter((r) => r.status === "approved").length;
  const rejectedCount = rows.filter((r) => r.status === "rejected").length;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tab === "pending" && r.status !== "pending") return false;
      if (tab === "history" && r.status === "pending") return false;
      if (roleFilter !== "all" && r.requested_role !== roleFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${r.user_name} ${r.requested_role} ${r.message || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, tab, roleFilter, query]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Role Approvals</h1>
            {pendingCount > 0 && <Badge variant="blue">{pendingCount} pending</Badge>}
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Approve Student, Coach, Premium, or Admin access. Verified students get the blue check + dashboard.
          </p>
        </div>
        <Button variant="glass" size="sm" className="rounded-xl" onClick={load}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approved", value: approvedCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Rejected", value: rejectedCount, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4">
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mb-2", s.bg, s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-[#0B1528]">{s.value}</p>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {errorMsg && (
        <GlassCard className="p-4 border-red-200 bg-red-50 text-red-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </GlassCard>
      )}

      {successMsg && (
        <GlassCard className="p-4 border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </GlassCard>
      )}

      {/* Filters */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {([
              ["pending", "Pending"],
              ["history", "History"],
              ["all", "All"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-extrabold transition border",
                  tab === id
                    ? "bg-[#368AE4] text-white border-[#368AE4] shadow-sm"
                    : "bg-white/50 text-[#64748B] border-white/70 hover:bg-white/80"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, role, message..."
                className="pl-9 h-10 rounded-xl text-xs"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-xl border border-white/70 bg-white/50 px-3 text-xs font-bold text-[#0B1528] backdrop-blur"
            >
              <option value="all">All roles</option>
              <option value="student">Student</option>
              <option value="premium">Premium</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* List */}
      {filtered.length === 0 ? (
        <GlassCard className="p-10 text-center space-y-2">
          <Users className="h-10 w-10 text-[#368AE4] mx-auto opacity-80" />
          <p className="font-extrabold text-[#0B1528]">No requests here</p>
          <p className="text-xs text-[#64748B]">
            When registered users click &quot;Request Access&quot; on Explore, they will appear in Pending.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const meta = ROLE_META[r.requested_role] || ROLE_META.student;
            const Icon = meta.icon;
            const isPending = r.status === "pending";

            return (
              <GlassCard key={r.id} className="p-5" hoverEffect={isPending}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0", meta.bg, meta.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-extrabold text-[#0B1528] text-sm truncate">{r.user_name}</p>
                        <Badge variant={meta.badge} className="capitalize">{meta.label}</Badge>
                        {!isPending && (
                          <Badge variant={r.status === "approved" ? "success" : "danger"}>{r.status}</Badge>
                        )}
                      </div>
                      {r.message && (
                        <p className="text-xs text-[#64748B] font-medium line-clamp-2">{r.message}</p>
                      )}
                      <p className="text-[10px] text-[#64748B] font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Requested {new Date(r.created_at).toLocaleString()}
                        {r.reviewed_at ? ` · Reviewed ${new Date(r.reviewed_at).toLocaleString()}` : ""}
                      </p>
                      <p className="text-[10px] font-mono text-[#64748B]/80 truncate">ID: {r.user_id}</p>
                    </div>
                  </div>

                  {isPending ? (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        className="rounded-xl"
                        disabled={busy === r.id}
                        onClick={() => review(r, "approved")}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {busy === r.id ? "..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-red-600 hover:bg-red-50"
                        disabled={busy === r.id}
                        onClick={() => review(r, "rejected")}
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
