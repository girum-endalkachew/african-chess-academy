"use client";


import { ContentLoader } from "@/components/ui/content-loader";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  ArrowRight,
  Swords,
  Edit3,
  Bell,
  Search,
  TrendingUp,
  Clock,
  Target,
  Zap,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Calendar helpers
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = lastDay.getDate();

  const cells: Array<{ day: number; current: boolean }> = [];

  // prev month tail
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevLast - i, current: false });
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  // next month head
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - startWeekday - daysInMonth + 1, current: false });
  }

  return cells;
}

export default function StudentDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [tournamentsCount, setTournamentsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [featuredCourse, setFeaturedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof?.role === "admin") return router.push("/admin");
      if (prof?.role === "coach") return router.push("/coach");
      setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });

      const { data: enrolls } = await supabase
        .from("course_enrollments")
        .select("*, courses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setEnrollments(enrolls || []);

      // Featured = most recent enrolled, else first course
      if (enrolls && enrolls.length > 0) {
        setFeaturedCourse(enrolls[0].courses);
      } else {
        const { data: firstCourse } = await supabase.from("courses").select("*").limit(1).single();
        setFeaturedCourse(firstCourse);
      }

      // Recent games for the chart
      const { data: gamesData } = await supabase
        .from("chess_games")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setGames(gamesData || []);

      const { count: tCount } = await supabase.from("tournament_registrations").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setTournamentsCount(tCount || 0);
      const { count: eCount } = await supabase.from("event_registrations").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setEventsCount(eCount || 0);
      const { count: cCount } = await supabase.from("certificates").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setCertsCount(cCount || 0);

      setLoading(false);
    })();
  }, [router, supabase]);

  // Chart: games per month over last 12 months
  const monthlyActivity = useMemo(() => {
    const now = new Date();
    const buckets: Array<{ label: string; count: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        label: d.toLocaleDateString("en", { month: "short" }),
        count: 0,
      });
    }
    games.forEach((g) => {
      const d = new Date(g.created_at);
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (monthsAgo >= 0 && monthsAgo < 12) {
        buckets[11 - monthsAgo].count++;
      }
    });
    return buckets;
  }, [games]);

  const maxMonthly = Math.max(...monthlyActivity.map((b) => b.count), 1);

  // ELO progression sparkline
  const eloTrend = useMemo(() => {
    return games.slice(0, 10).reverse().map((g) => g.rating_after || 1200);
  }, [games]);

  // Course completion stats
  const courseStats = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter((e) => (e.progress || 0) === 100).length;
    const inProgress = enrollments.filter((e) => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;
    const notStarted = enrollments.filter((e) => (e.progress || 0) === 0).length;
    return {
      total,
      completedPct: total ? Math.round((completed / total) * 100) : 0,
      inProgressPct: total ? Math.round((inProgress / total) * 100) : 0,
      notStartedPct: total ? Math.round((notStarted / total) * 100) : 0,
    };
  }, [enrollments]);

  // ELO tier for "Level"
  const eloTier = useMemo(() => {
    const r = profile?.chess_rating || 1200;
    if (r >= 2000) return { name: "Expert", pct: 100 };
    if (r >= 1800) return { name: "Advanced", pct: 85 };
    if (r >= 1500) return { name: "Intermediate", pct: 65 };
    if (r >= 1200) return { name: "Improving", pct: 45 };
    return { name: "Beginner", pct: 25 };
  }, [profile]);

  const calendarCells = useMemo(() => getCalendarGrid(calYear, calMonth), [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };

  if (loading) { return <ContentLoader />; }

  const rating = profile?.chess_rating || 1200;
  const firstName = (profile?.full_name || "Player").split(" ")[0];
  const isToday = (day: number) =>
    day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  return (
    <>
<div className="mx-auto max-w-[1400px]">
        {/* Top bar: search + notifications */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search courses, lessons, tournaments..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/50 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[#368AE4]/30"
            />
          </div>
          <button className="h-12 w-12 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-center text-[#64748B] hover:text-[#0B1528] backdrop-blur relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>

        {/* MAIN GRID: main content + right sidebar */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* LEFT: main content */}
          <div className="space-y-6">
            {/* Hero: Hey + ELO points */}
            <div>
              <p className="text-sm font-bold text-[#368AE4] mb-1">👋 Hey, {firstName}!</p>
              <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
                You've got <span className="text-[#368AE4]">{rating} ELO</span> Points!
              </h1>
            </div>

            {/* Time Spent Learning (bar chart) */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#0B1528]">Chess Activity</h2>
                  <p className="text-[11px] font-bold text-[#64748B]">Games played per month · last 12 months</p>
                </div>
                <Badge variant="outline" className="normal-case tracking-normal">Year view</Badge>
              </div>

              <div className="flex items-end gap-2 h-40">
                {monthlyActivity.map((b, i) => {
                  const heightPct = (b.count / maxMonthly) * 100;
                  const isPeak = b.count === maxMonthly && b.count > 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex items-end h-32">
                        {isPeak && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-white bg-[#0B1528] px-2 py-0.5 rounded-md whitespace-nowrap">
                            {b.count}
                          </div>
                        )}
                        <div
                          className={`w-full rounded-t-lg transition-all ${isPeak ? "bg-[#368AE4]" : "bg-[#368AE4]/40 group-hover:bg-[#368AE4]/60"}`}
                          style={{ height: `${Math.max(heightPct, 3)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#64748B]">{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Row: Statistics (donut) + Awards + Growth */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Statistics (donut) */}
              <GlassCard className="p-6">
                <h3 className="text-base font-extrabold text-[#0B1528] mb-4">Statistics</h3>

                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(54,138,228,0.1)" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#368AE4"
                        strokeWidth="10"
                        strokeDasharray={`${(courseStats.completedPct / 100) * 264} 264`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-extrabold text-[#0B1528]">{courseStats.total}</p>
                      <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Courses</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 text-[10px] font-bold w-full">
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center mb-1">
                        <span className="h-2 w-2 rounded-full bg-[#368AE4]" />
                        <span className="text-[#0B1528]">{courseStats.completedPct}%</span>
                      </div>
                      <p className="text-[#64748B]">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center mb-1">
                        <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                        <span className="text-[#0B1528]">{courseStats.inProgressPct}%</span>
                      </div>
                      <p className="text-[#64748B]">In Progress</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center mb-1">
                        <span className="h-2 w-2 rounded-full bg-[#EEF3FA]" />
                        <span className="text-[#0B1528]">{courseStats.notStartedPct}%</span>
                      </div>
                      <p className="text-[#64748B]">Not Started</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Awards + Growth stacked */}
              <div className="space-y-5">
                {/* Awards */}
                <GlassCard className="p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-sm font-extrabold text-[#0B1528] mb-3">Awards</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Level</p>
                        <p className="text-sm font-extrabold text-[#0B1528]">{eloTier.name}</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white/60 overflow-hidden mb-1">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
                        style={{ width: `${eloTier.pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[#64748B]">Congratulations! You're at {eloTier.pct}%</p>
                  </div>
                </GlassCard>

                {/* Growth (ELO sparkline) */}
                <GlassCard className="p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-sm font-extrabold text-[#0B1528] mb-3">Growth</h3>
                    {eloTrend.length > 0 ? (
                      <div className="h-16">
                        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="growth-grad" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {(() => {
                            const min = Math.min(...eloTrend);
                            const max = Math.max(...eloTrend);
                            const range = max - min || 1;
                            const points = eloTrend.map((r, i) => {
                              const x = (i / (eloTrend.length - 1 || 1)) * 100;
                              const y = 40 - ((r - min) / range) * 35 - 2;
                              return `${x},${y}`;
                            });
                            return (
                              <>
                                <polyline
                                  points={points.join(" ")}
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <polygon
                                  points={`0,40 ${points.join(" ")} 100,40`}
                                  fill="url(#growth-grad)"
                                />
                                {points.length > 0 && (
                                  <circle
                                    cx={points[points.length - 1].split(",")[0]}
                                    cy={points[points.length - 1].split(",")[1]}
                                    r="2"
                                    fill="#f59e0b"
                                  />
                                )}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#64748B]">No games played yet</p>
                    )}
                    <p className="text-[10px] font-bold text-[#64748B] mt-1">Last {eloTrend.length} games</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Calendar + Featured Course */}
          <div className="space-y-5">
            {/* Calendar */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-extrabold text-[#0B1528]">
                  {MONTHS[calMonth]} {calYear}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="h-7 w-7 rounded-lg hover:bg-white/60 flex items-center justify-center text-[#64748B]">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={nextMonth} className="h-7 w-7 rounded-lg hover:bg-white/60 flex items-center justify-center text-[#64748B]">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[9px] font-extrabold text-[#64748B] uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((c, i) => {
                  const active = c.current && isToday(c.day);
                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center text-[11px] font-bold rounded-lg ${
                        active
                          ? "bg-[#368AE4] text-white shadow-md"
                          : c.current
                          ? "text-[#0B1528] hover:bg-white/60 cursor-pointer"
                          : "text-[#64748B]/30"
                      }`}
                    >
                      {c.day}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Featured / Today's course */}
            {featuredCourse && (
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#368AE4]" />
                  <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider">Today</p>
                </div>

                <h3 className="text-base font-extrabold text-[#0B1528] leading-tight">
                  {featuredCourse.title}
                </h3>

                <p className="text-[11px] font-medium text-[#64748B] leading-relaxed line-clamp-3">
                  {featuredCourse.description || "Continue your chess mastery journey with this course."}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-[#368AE4] to-[#60A5FA] border-2 border-white" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-[#64748B]">30+ joined this course</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#368AE4]" />
                    <div>
                      <p className="text-[11px] font-extrabold text-[#0B1528]">{(featuredCourse.total_lessons || 10) * 5} mins</p>
                      <p className="text-[9px] text-[#64748B]">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-[#368AE4]" />
                    <div>
                      <p className="text-[11px] font-extrabold text-[#0B1528]">{featuredCourse.total_lessons || 10} lessons</p>
                      <p className="text-[9px] text-[#64748B]">Course content</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href={`/dashboard/learning/${featuredCourse.id}`}>
                    <Button variant="primary" className="w-full text-xs h-10">
                      <PlayCircle className="h-3.5 w-3.5" /> Start
                    </Button>
                  </Link>
                  <Link href="/dashboard/learning">
                    <Button variant="outline" className="w-full text-xs h-10">
                      Browse
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            )}

            {/* Quick stats */}
            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Quick stats</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#368AE4]" />
                    <span className="text-xs font-bold text-[#0B1528]">Tournaments</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0B1528]">{tournamentsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#368AE4]" />
                    <span className="text-xs font-bold text-[#0B1528]">Events</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0B1528]">{eventsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#368AE4]" />
                    <span className="text-xs font-bold text-[#0B1528]">Certificates</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0B1528]">{certsCount}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/60">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold text-[#0B1528]">Games played</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0B1528]">{games.length}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}


