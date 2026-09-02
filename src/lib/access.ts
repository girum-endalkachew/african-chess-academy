"use client";

import { createClient } from "@/lib/supabase/client";
import {
  AppRole,
  RoleRow,
  activeRoles,
  defaultWorkspace,
  workspacePath,
  isPremium,
  workspacesFor,
  Workspace,
} from "@/lib/roles";

export type AccessProfile = {
  id: string;
  full_name: string | null;
  email?: string | null;
  chess_rating?: number | null;
  onboarding_complete?: boolean | null;
  primary_workspace?: string | null;
  account_status?: string | null;
};

export type AccessState = {
  userId: string;
  profile: AccessProfile;
  roles: AppRole[];
  plan: string;
  premium: boolean;
  workspaces: Workspace[];
  homePath: string;
};

export async function loadAccess(): Promise<AccessState | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, chess_rating, onboarding_complete, primary_workspace, account_status")
    .eq("id", user.id)
    .maybeSingle();

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role, status")
    .eq("user_id", user.id);

  let roles = activeRoles((roleRows || []) as RoleRow[]);
  if (roles.length === 0) {
    roles = ["registered"];
    const legacy = (profile as any)?.role;
    if (legacy && ["student", "coach", "admin"].includes(String(legacy).toLowerCase())) {
      roles.push(String(legacy).toLowerCase() as AppRole);
    }
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .maybeSingle();

  const plan = sub?.status === "active" ? (sub.plan || "free") : "free";
  const ws = workspacesFor(roles);
  
  const primaryWs = (profile?.primary_workspace as Workspace | undefined) || null;
  const home = workspacePath(
    primaryWs && ws.includes(primaryWs)
      ? primaryWs
      : defaultWorkspace(roles)
  );

  return {
    userId: user.id,
    profile: {
      id: user.id,
      full_name: profile?.full_name ?? user.email?.split("@")[0] ?? "User",
      email: user.email,
      chess_rating: profile?.chess_rating ?? 1200,
      onboarding_complete: profile?.onboarding_complete ?? false,
      primary_workspace: profile?.primary_workspace ?? null,
      account_status: profile?.account_status ?? "active",
    },
    roles,
    plan,
    premium: isPremium(roles, plan),
    workspaces: ws,
    homePath: home,
  };
}
