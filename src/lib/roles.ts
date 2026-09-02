export type AppRole = "registered" | "student" | "coach" | "admin" | "premium";
export type Workspace = "explore" | "student" | "coach" | "admin";

export type RoleRow = {
  role: AppRole;
  status: "pending" | "active" | "rejected" | "revoked";
};

export function activeRoles(rows: RoleRow[] | null | undefined): AppRole[] {
  return (rows || []).filter((r) => r.status === "active").map((r) => r.role);
}

export function hasRole(roles: AppRole[], role: AppRole) {
  return roles.includes(role);
}

export function workspacesFor(roles: AppRole[]): Workspace[] {
  const ws: Workspace[] = [];
  if (hasRole(roles, "admin")) ws.push("admin");
  if (hasRole(roles, "coach")) ws.push("coach");
  if (hasRole(roles, "student") || hasRole(roles, "premium")) ws.push("student");
  if (!hasRole(roles, "student") && !hasRole(roles, "coach") && !hasRole(roles, "admin")) {
    ws.push("explore");
  }
  // always allow explore as soft landing if registered only
  if (hasRole(roles, "registered") && ws.length === 0) ws.push("explore");
  return Array.from(new Set(ws));
}

export function defaultWorkspace(roles: AppRole[]): Workspace {
  if (hasRole(roles, "admin")) return "admin";
  if (hasRole(roles, "coach")) return "coach";
  if (hasRole(roles, "student") || hasRole(roles, "premium")) return "student";
  return "explore";
}

export function workspacePath(ws: Workspace) {
  switch (ws) {
    case "admin": return "/admin";
    case "coach": return "/coach";
    case "student": return "/dashboard";
    default: return "/explore";
  }
}

export function isPremium(roles: AppRole[], plan?: string | null) {
  return hasRole(roles, "premium") || plan === "premium";
}
