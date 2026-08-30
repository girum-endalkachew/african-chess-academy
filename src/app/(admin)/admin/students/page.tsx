"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, GraduationCap, Trophy, Calendar, Newspaper, BookOpen, Settings, Edit2, CheckCircle2
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/coaches", label: "Coaches", icon: GraduationCap },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminStudentsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(1200);
  const [editRole, setEditRole] = useState<string>("student");

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (prof?.role !== "admin") return router.push("/dashboard");

    setProfile(prof);

    const { data: stdData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setStudents(stdData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleUpdate = async (id: string) => {
    await supabase.from("profiles").update({
      chess_rating: editRating,
      role: editRole,
    }).eq("id", id);

    setEditingId(null);
    await loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Admin" userName={profile?.full_name || "Admin"} navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Student & User Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage user roles, update chess ratings, and view account statuses.</p>
        </div>

        <div className="bg-white border border-[#DBE9F7] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1E293B]">
              <thead className="bg-[#F8FAFC] border-b border-[#DBE9F7] text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Chess ELO</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const isEditing = editingId === s.id;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <p className="font-bold text-[#1E293B]">{s.full_name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="text-xs border border-[#DBE9F7] rounded-lg p-1.5 bg-white"
                          >
                            <option value="student">student</option>
                            <option value="coach">coach</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <Badge variant={s.role === "admin" ? "accent" : s.role === "coach" ? "warning" : "default"}>
                            {s.role}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editRating}
                            onChange={(e) => setEditRating(Number(e.target.value))}
                            className="w-24 h-8 text-xs rounded-lg"
                          />
                        ) : (
                          <span className="font-semibold text-[#00A3E0]">{s.chess_rating || 1200} ELO</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(s.id)}
                            className="rounded-xl h-8 text-xs font-semibold gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Save
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(s.id);
                              setEditRating(s.chess_rating || 1200);
                              setEditRole(s.role || "student");
                            }}
                            className="rounded-xl h-8 text-xs gap-1"
                          >
                            <Edit2 className="h-3 w-3" /> Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}