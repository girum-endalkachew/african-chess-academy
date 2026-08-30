import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  BookOpen,
  Target,
  Calendar,
  Newspaper,
  ArrowRight,
  Star,
  Shield,
  Sparkles,
  Play,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#DBE9F7] bg-gradient-to-br from-white via-[#E6F5FF] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="w-fit">African Chess Academy · Digital Platform</Badge>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E293B] leading-[1.1]">
                  Learn. Play.
                  <span className="block text-[#00A3E0]">Compete. Improve.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  A unified digital platform for African Chess Academy — learn with expert coaches,
                  manage your journey, join tournaments, and grow with the community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    <Play className="h-4 w-4" />
                    Explore Programs
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00A3E0]" />
                  Student portal
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00A3E0]" />
                  Live tournaments
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00A3E0]" />
                  Expert coaches
                </div>
              </div>
            </div>

            {/* Hero visual card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-[#87CEEB]/20 blur-3xl rounded-full" />
              <Card className="relative overflow-hidden border-[#DBE9F7] shadow-xl">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-[#87CEEB] to-[#00A3E0] p-8 text-white">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-none">ACA Academy</p>
                          <p className="text-white/80 text-sm">Student Journey</p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">MVP</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/15 backdrop-blur p-4">
                        <p className="text-white/80 text-xs mb-1">Programs</p>
                        <p className="text-2xl font-bold">12+</p>
                      </div>
                      <div className="rounded-2xl bg-white/15 backdrop-blur p-4">
                        <p className="text-white/80 text-xs mb-1">Coaches</p>
                        <p className="text-2xl font-bold">25+</p>
                      </div>
                      <div className="rounded-2xl bg-white/15 backdrop-blur p-4">
                        <p className="text-white/80 text-xs mb-1">Tournaments</p>
                        <p className="text-2xl font-bold">40+</p>
                      </div>
                      <div className="rounded-2xl bg-white/15 backdrop-blur p-4">
                        <p className="text-white/80 text-xs mb-1">Students</p>
                        <p className="text-2xl font-bold">1k+</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-[#00A3E0]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E293B]">Track your progress</p>
                        <p className="text-sm text-slate-500">Courses, rating, certificates & results</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-[#00A3E0]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E293B]">Compete with purpose</p>
                        <p className="text-sm text-slate-500">Register, play, climb the leaderboard</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT ACA */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="default">About ACA</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">
                Building Africa’s next generation of chess champions
              </h2>
              <p className="text-slate-600 leading-relaxed">
                African Chess Academy is more than a school — it’s a complete ecosystem for learning,
                competing, and community. This platform brings courses, coaches, tournaments, webinars,
                and student progress into one modern experience.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Structured learning paths",
                  "Verified coaches",
                  "Tournament management",
                  "Events & webinars",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#00A3E0]" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/about">
                <Button variant="outline" className="gap-2 mt-2">
                  Learn more about ACA
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: "Courses", desc: "From fundamentals to mastery" },
                { icon: Users, label: "Community", desc: "Learn and grow together" },
                { icon: Trophy, label: "Tournaments", desc: "Local & academy events" },
                { icon: Award, label: "Certificates", desc: "Celebrate milestones" },
              ].map((item) => (
                <Card key={item.label} className="p-5 hover:border-[#87CEEB]">
                  <div className="h-11 w-11 rounded-xl bg-[#E6F5FF] flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-[#00A3E0]" />
                  </div>
                  <h3 className="font-bold text-[#1E293B]">{item.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-16 lg:py-20 bg-white border-y border-[#DBE9F7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="space-y-3">
              <Badge>Programs</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Courses built for real improvement</h2>
              <p className="text-slate-600 max-w-2xl">
                Clear paths for beginners, intermediate players, and advanced competitors.
              </p>
            </div>
            <Link href="/programs">
              <Button variant="secondary" className="gap-2">
                View all programs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Chess Fundamentals", level: "Beginner", lessons: "12 Lessons", progress: "Perfect start" },
              { title: "Tactical Patterns", level: "Intermediate", lessons: "18 Lessons", progress: "Sharpen tactics" },
              { title: "Middlegame Strategy", level: "Advanced", lessons: "20 Lessons", progress: "Positional mastery" },
              { title: "Endgame Mastery", level: "Advanced", lessons: "16 Lessons", progress: "Convert wins" },
            ].map((course) => (
              <Card key={course.title} className="group hover:border-[#87CEEB]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="accent">{course.level}</Badge>
                    <BookOpen className="h-4 w-4 text-[#00A3E0]" />
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.lessons} · {course.progress}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/programs">
                    <Button variant="outline" size="sm" className="w-full group-hover:border-[#87CEEB]">
                      Explore course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY LEARN CHESS */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge>Why Learn Chess</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Skills that go beyond the board</h2>
            <p className="text-slate-600">
              Chess trains focus, patience, calculation, and confident decision-making — for school, work, and life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Strategic Thinking", desc: "Learn to plan ahead, evaluate options, and execute with purpose." },
              { icon: Sparkles, title: "Focus & Discipline", desc: "Build mental endurance through structured practice and play." },
              { icon: TrendingUp, title: "Measurable Growth", desc: "Track ratings, course progress, tournament results, and certificates." },
            ].map((item) => (
              <Card key={item.title} className="p-6 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[#E6F5FF] flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COACHES */}
      <section className="py-16 lg:py-20 bg-white border-y border-[#DBE9F7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="space-y-3">
              <Badge>Featured Coaches</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Learn from dedicated mentors</h2>
            </div>
            <Link href="/coaches">
              <Button variant="secondary" className="gap-2">
                Meet all coaches <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Coach Kidane", title: "Tactics & Blitz Specialist", rating: "2140" },
              { name: "Coach Sara", title: "Fundamentals & Youth Training", rating: "1980" },
              { name: "Coach Abel", title: "Strategy & Tournament Prep", rating: "2265" },
            ].map((coach) => (
              <Card key={coach.name} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#00A3E0] flex items-center justify-center text-white font-bold text-lg">
                    {coach.name.split(" ").pop()?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B]">{coach.name}</h3>
                    <p className="text-sm text-slate-500">{coach.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <Badge>ELO {coach.rating}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING TOURNAMENT + WEBINAR */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-[#00A3E0] to-[#87CEEB] p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Upcoming Tournament</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">ACA Monthly Blitz</h3>
                <p className="text-white/90 text-sm">Open · Online · Swiss System</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>May 18, 2025</Badge>
                  <Badge variant="outline">Blitz</Badge>
                  <Badge variant="success">32/64 filled</Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Fast-paced academy blitz event. Register early, meet players, and climb the leaderboard.
                </p>
                <Link href="/tournaments">
                  <Button variant="primary" className="w-full sm:w-auto gap-2">
                    View tournament <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-[#1E293B] p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-[#87CEEB]" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Upcoming Webinar</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Opening Preparation Masterclass</h3>
                <p className="text-white/80 text-sm">Live session with ACA coaches</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>May 22, 2025</Badge>
                  <Badge variant="outline">Webinar</Badge>
                  <Badge variant="warning">Limited seats</Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Practical opening ideas, common traps, and a study plan you can use immediately.
                </p>
                <Link href="/events">
                  <Button className="w-full sm:w-auto gap-2">
                    View event details <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS */}
      <section className="py-16 lg:py-20 bg-white border-y border-[#DBE9F7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge>Student Success</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Real progress from real students</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Girum E.", result: "+180 rating in 3 months", quote: "The structured courses and tournament practice changed how I think about every position." },
              { name: "Hanna T.", result: "Won ACA Junior qualifier", quote: "Coaches made endgames simple. I finally converted winning positions with confidence." },
              { name: "Samuel K.", result: "Completed 4 certificates", quote: "I love tracking my lessons, events, and results in one clean student dashboard." },
            ].map((item) => (
              <Card key={item.name} className="p-6">
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">“{item.quote}”</p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#1E293B]">{item.name}</p>
                    <p className="text-xs text-[#00A3E0] font-medium">{item.result}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#E6F5FF] flex items-center justify-center text-[#00A3E0] font-bold">
                    {item.name.charAt(0)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="space-y-3">
              <Badge>Latest News</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Academy updates & stories</h2>
            </div>
            <Link href="/news">
              <Button variant="secondary" className="gap-2">
                All news <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "ACA Open Championship registrations are live", date: "May 10, 2025", tag: "Tournament" },
              { title: "New intermediate tactics path released", date: "May 6, 2025", tag: "Courses" },
              { title: "Coach clinic: calculating under pressure", date: "May 1, 2025", tag: "Webinar" },
            ].map((news) => (
              <Card key={news.title} className="group hover:border-[#87CEEB]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{news.tag}</Badge>
                    <Newspaper className="h-4 w-4 text-slate-400" />
                  </div>
                  <CardTitle className="text-lg leading-snug group-hover:text-[#00A3E0] transition-colors">
                    {news.title}
                  </CardTitle>
                  <CardDescription>{news.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/news" className="text-sm font-semibold text-[#00A3E0] inline-flex items-center gap-1">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00A3E0] via-[#53B4E0] to-[#87CEEB] p-10 lg:p-14 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                Ready to start your ACA journey?
              </h2>
              <p className="text-white/90 text-lg">
                Join students across Africa learning with structure, competing with confidence, and tracking real progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-[#00A3E0] hover:bg-slate-50 font-bold w-full sm:w-auto">
                    Create free account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Contact ACA
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
