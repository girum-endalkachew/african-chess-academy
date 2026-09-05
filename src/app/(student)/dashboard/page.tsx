"use client";

import { ContentLoader } from "@/components/ui/content-loader";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import {
  BookOpen, Trophy, Calendar, Award, ArrowRight, Bell, Search,
  Clock, Zap, PlayCircle, ChevronLeft, ChevronRight, Puzzle, Brain,
  Gamepad2, TrendingUp, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const cells: Array<{ day: number; current: boolean }> = [];
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) cells.push({ day: prevLast - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - startWeekday - daysInMonth + 1, current: false });
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

      if (enrolls && enrolls.length > 0) setFeaturedCourse(enrolls[0].courses);
      else {
        const { data: firstCourse } = await supabase.from("courses").select("*").limit(1).maybeSingle();
        setFeaturedCourse(firstCourse);
      }

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

  const monthlyActivity = useMemo(() => {
    const now = new Date();
    const buckets: Array<{ label: string; count: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ label: d.toLocaleDateString("en", { month: "short" }), count: 0 });
    }
    games.forEach((g) => {
      const d = new Date(g.created_at);
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (monthsAgo >= 0 && monthsAgo < 12) buckets[11 - monthsAgo].count++;
    });
    return buckets;
  }, [games]);

  const maxMonthly = Math.max(...monthlyActivity.map((b) => b.count), 1);
  const eloTrend = useMemo(() => games.slice(0, 10).reverse().map((g) => g.rating_after || 1200), [games]);

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

  const eloTier = useMemo(() => {
    const r = profile?.chess_rating || 1200;
    if (r >= 2000) return { name: "Expert", pct: 100 };
    if (r >= 1800) return { name: "Advanced", pct: 85 };
    if (r >= 1500) return { name: "Intermediate", pct: 65 };
    if (r >= 1200) return { name: "Improving", pct: 45 };
    return { name: "Beginner", pct: 25 };
  }, [profile]);

  const calendarCells = useMemo(() => getCalendarGrid(calYear, calMonth), [calYear, calMonth]);
  const prevMonth = () => { if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); } else setCalMonth(calMonth - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); } else setCalMonth(calMonth + 1); };

  if (loading) return <ContentLoader label="Preparing your board..." />;

  const rating = profile?.chess_rating || 1200;
  const firstName = (profile?.full_name || "Player").split(" ")[0];
  const isToday = (day: number) => day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Clean Greeting Header */}
      <div>
        <p className="text-sm font-bold text-[#368AE4] mb-1">👋 Hey, {firstName}!</p>
        <h1 className="text-[36px] sm:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-[1.05]">
          You&apos;ve got <span className="text-[#368AE4]">{rating} ELO</span> Points!
        </h1>
      </div>

      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search courses, lessons, tournaments..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/55 border border-white/70 text-sm font-medium text-[#0B1528] placeholder:text-[#64748B]/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[#368AE4]/30"
          />
        </div>
        <button className="h-12 w-12 rounded-2xl bg-white/55 border border-white/70 flex items-center justify-center text-[#64748B] relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="grid xl:grid-cols-[1.55fr_0.9fr] gap-6">
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-extrabold text-[#0B1528]">Chess Activity</h2>
                <p className="text-[11px] font-bold text-[#64748B]">Games played · last 12 months</p>
              </div>
              <Badge variant="outline" className="normal-case tracking-normal">Year view</Badge>
            </div>
            <div className="flex items-end gap-2 h-44">
              {monthlyActivity.map((b, i) => {
                const heightPct = (b.count / maxMonthly) * 100;
                const isPeak = b.count === maxMonthly && b.count > 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex items-end h-36">
                      {isPeak && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-white bg-[#0B1528] px-2 py-0.5 rounded-md">
                          {b.count}
                        </div>
                      )}
                      <div
                        className={cn("w-full rounded-t-xl transition-all", isPeak ? "bg-[#368AE4] shadow-[0_8px_20px_rgba(54,138,228,0.35)]" : "bg-[#368AE4]/35 group-hover:bg-[#368AE4]/55")}
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#64748B]">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-5">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#0B1528]">Course Progress</h3>
                <Target className="h-4 w-4 text-[#368AE4]" />
              </div>
              <div className="relative w-36 h-36 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(54,138,228,0.12)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#368AE4" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(courseStats.completedPct / 100) * 251} 251`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-extrabold text-[#0B1528]">{courseStats.total}</p>
                  <p className="text-[10px] font-bold text-[#64748B]">COURSES</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="rounded-xl bg-[#EEF3FA] p-2"><p className="text-[#368AE4] text-sm">{courseStats.completedPct}%</p><p className="text-[#64748B]">Done</p></div>
                <div className="rounded-xl bg-white/60 p-2 border border-white/80"><p className="text-[#0B1528] text-sm">{courseStats.inProgressPct}%</p><p className="text-[#64748B]">Active</p></div>
                <div className="rounded-xl bg-white/40 p-2 border border-white/70"><p className="text-[#0B1528] text-sm">{courseStats.notStartedPct}%</p><p className="text-[#64748B]">New</p></div>
              </div>
            </GlassCard>

            <div className="space-y-5">
              <GlassCard className="p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-[#64748B] uppercase">Award Level</p>
                      <p className="text-sm font-extrabold text-[#0B1528]">{eloTier.name}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/70 overflow-hidden mb-1">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${eloTier.pct}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-[#64748B]">{eloTier.pct}% toward next tier</p>
                </div>
              </GlassCard>

              <GlassCard className="p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-extrabold text-[#0B1528]">ELO Growth</h3>
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                  </div>
                  {eloTrend.length > 1 ? (
                    <div className="h-16">
                      <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="growth-grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {(() => {
                          const min = Math.min(...eloTrend);
                          const max = Math.max(...eloTrend);
                          const range = max - min || 1;
                          const points = eloTrend.map((r, i) => {
                            const x = (i / (eloTrend.length - 1 || 1)) * 100;
                            const y = 40 - ((r - min) / range) * 32 - 4;
                            return `${x},${y}`;
                          });
                          return (
                            <>
                              <polyline points={points.join(" ")} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              <polygon points={`0,40 ${points.join(" ")} 100,40`} fill="url(#growth-grad)" />
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#64748B] py-4">Play games to unlock your growth curve.</p>
                  )}
                  <p className="text-[10px] font-bold text-[#64748B] mt-1">Last {Math.max(eloTrend.length, 0)} rated games</p>
                </div>
              </GlassCard>
            </div>
          </div>

          {featuredCourse && (
            <GlassCard className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#368AE4]" />
                    <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider">Continue Learning</p>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0B1528] truncate">{featuredCourse.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 max-w-2xl">{featuredCourse.description || "Keep building your foundation with structured lessons."}</p>
                  <div className="flex flex-wrap gap-3 text-[11px] font-bold text-[#64748B]">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#368AE4]" /> {(featuredCourse.total_lessons || 5) * 5} mins</span>
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-[#368AE4]" /> {featuredCourse.total_lessons || 5} lessons</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/dashboard/learning/${featuredCourse.id}`}>
                    <Button variant="primary" className="h-11 rounded-2xl px-5">
                      <PlayCircle className="h-4 w-4" /> Start
                    </Button>
                  </Link>
                  <Link href="/dashboard/learning">
                    <Button variant="outline" className="h-11 rounded-2xl px-5">Browse</Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        <div className="space-y-5">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-extrabold text-[#0B1528]">{MONTHS[calMonth]} {calYear}</p>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="h-7 w-7 rounded-lg hover:bg-white/70 flex items-center justify-center text-[#64748B]"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={nextMonth} className="h-7 w-7 rounded-lg hover:bg-white/70 flex items-center justify-center text-[#64748B]"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[9px] font-extrabold text-[#64748B] uppercase py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((c, i) => {
                const active = c.current && isToday(c.day);
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square flex items-center justify-center text-[11px] font-bold rounded-lg",
                      active ? "bg-[#368AE4] text-white shadow-md" : c.current ? "text-[#0B1528] hover:bg-white/70" : "text-[#64748B]/30"
                    )}
                  >
                    {c.day}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <StreakCard />

          <GlassCard className="p-5 space-y-3">
            <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Practice shortcuts</p>
            {[
              { href: "/dashboard/drills", label: "Vision & Memory Drills", desc: "Coordinates, colors, blindfold", icon: Brain },
              { href: "/dashboard/puzzles", label: "Puzzle Trainer", desc: "Tactics under pressure", icon: Puzzle },
              { href: "/dashboard/play-hub", label: "Play Center", desc: "AI, friends, arenas", icon: Gamepad2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl p-3 bg-white/45 border border-white/70 hover:bg-white/75 transition group">
                  <div className="h-10 w-10 rounded-xl bg-[#EEF3FA] text-[#368AE4] flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#0B1528]">{item.label}</p>
                    <p className="text-[10px] text-[#64748B] truncate">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:text-[#368AE4]" />
                </Link>
              );
            })}
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Quick stats</p>
            <div className="space-y-3">
              {[
                { icon: Trophy, label: "Tournaments", value: tournamentsCount },
                { icon: Calendar, label: "Events", value: eventsCount },
                { icon: Award, label: "Certificates", value: certsCount },
                { icon: Zap, label: "Games played", value: games.length },
              ].map((row, idx) => (
                <div key={row.label} className={cn("flex items-center justify-between", idx === 3 && "pt-3 border-t border-white/60")}>
                  <div className="flex items-center gap-2">
                    <row.icon className={cn("h-4 w-4", idx === 3 ? "text-amber-500" : "text-[#368AE4]")} />
                    <span className="text-xs font-bold text-[#0B1528]">{row.label}</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0B1528]">{row.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
