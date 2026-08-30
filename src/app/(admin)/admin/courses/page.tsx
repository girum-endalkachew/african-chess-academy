"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, GraduationCap, Trophy, Calendar, Newspaper, BookOpen, Settings, Plus, Trash2, CheckCircle2
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

export default function AdminCoursesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [totalLessons, setTotalLessons] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (prof?.role !== "admin") return router.push("/dashboard");

    setProfile(prof);

    const { data: crsData } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses(crsData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router, supabase]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("courses").insert({
      title,
      description,
      level,
      total_lessons: totalLessons,
    });

    setTitle("");
    setDescription("");
    setShowForm(false);
    setSubmitting(false);
    await loadData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await supabase.from("courses").delete().eq("id", id);
      await loadData();
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Course Management</h1>
            <p className="text-sm text-slate-500 mt-1">Create, view, and manage academy curriculum courses.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="rounded-xl font-semibold gap-2 w-fit">
            <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add New Course"}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white border border-[#DBE9F7] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-[#1E293B] text-lg">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Course Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Master the Italian Game" className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Target Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full h-11 border border-[#DBE9F7] rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#87CEEB]">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All levels">All levels</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short course summary" className="h-11 rounded-xl" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Total Lessons</label>
                <Input type="number" value={totalLessons} onChange={(e) => setTotalLessons(Number(e.target.value))} className="h-11 rounded-xl" required min={1} />
              </div>

              <Button type="submit" disabled={submitting} className="rounded-xl font-semibold">
                {submitting ? "Creating..." : "Save & Publish Course"}
              </Button>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">{c.level}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(c.id)} className="text-red-500 hover:bg-red-50 h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-bold text-[#1E293B]">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{c.total_lessons} Lessons</span>
                <span className="text-emerald-600 font-medium">Published</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}