import Link from "next/link";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Globe2,
  Trophy,
  Target,
  Building,
  HeartHandshake,
  HelpCircle,
  Network,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const journey = [
    {
      title: "Structured Paths",
      desc: "Clear level-by-level training from first moves to mastery.",
      iconBg: "bg-blue-100 text-blue-600",
      Icon: Target,
    },
    {
      title: "Verified Mentors",
      desc: "Learn with verified FIDE coaches and experienced guides.",
      iconBg: "bg-emerald-100 text-emerald-600",
      Icon: GraduationCap,
    },
    {
      title: "Live Tournaments",
      desc: "Compete, track ratings, and grow under real pressure.",
      iconBg: "bg-amber-100 text-amber-600",
      Icon: Trophy,
    },
    {
      title: "Global Community",
      desc: "Train and connect with players across Africa and beyond.",
      iconBg: "bg-violet-100 text-violet-600",
      Icon: Network,
    },
  ];

  const skills = [
    {
      t: "Critical Calculation",
      d: "Evaluating choices under pressure.",
    },
    {
      t: "Strategic Planning",
      d: "Formulating long-term advantages.",
    },
    {
      t: "Emotional Control",
      d: "Resilience in competitive play.",
    },
    {
      t: "Pattern Recognition",
      d: "Instant tactical vision.",
    },
  ];

  const path = [
    {
      n: "01",
      level: "Level 1",
      title: "Fundamentals",
      d: "Piece dynamics, rules, and essential mates.",
      icon: "♟",
    },
    {
      n: "02",
      level: "Level 2",
      title: "Tactical Pattern",
      d: "Forks, pins, skewers, and combination play.",
      icon: "♞",
    },
    {
      n: "03",
      level: "Level 3",
      title: "Advanced Mastery",
      d: "Positional nuances, calculation, and endgames.",
      icon: "♛",
    },
  ];

  return (
    <main className="w-full overflow-hidden bg-[#F8FAFD] text-[#0B1528]">

      {/* =========================================================
          HERO
      ========================================================== */}

      <section
        className="
          relative isolate min-h-[720px] overflow-hidden
          bg-[#F7F9FC]
          bg-cover bg-no-repeat
          bg-[position:62%_center]
          sm:min-h-[760px]
          lg:min-h-[calc(100vh-80px)]
          lg:bg-[position:center_center]
        "
        style={{
          backgroundImage: "url('/aca-hero-bg.jpg')",
        }}
      >

        {/* Soft overlay only on the left.
            This keeps the woman's side natural. */}
        <div
          className="
            absolute inset-y-0 left-0 -z-10
            w-full lg:w-[64%]
            bg-gradient-to-r
            from-[#F8FAFD]
            via-[#F8FAFD]/95
            to-transparent
          "
        />

        {/* Very subtle overall lightening */}
        <div className="absolute inset-0 -z-20 bg-white/5" />

        {/* Decorative blue glow */}
        <div
          className="
            absolute -left-32 top-20 -z-10
            h-72 w-72 rounded-full
            bg-[#368AE4]/10 blur-3xl
          "
        />

        <div
          className="
            absolute -right-32 bottom-10 -z-10
            h-96 w-96 rounded-full
            bg-[#368AE4]/10 blur-3xl
          "
        />

        <div
          className="
            mx-auto flex min-h-[720px] max-w-[1400px]
            items-center px-5 py-20
            sm:min-h-[760px] sm:px-8
            lg:min-h-[calc(100vh-80px)]
            lg:px-12 xl:px-16
          "
        >

          {/* HERO CONTENT */}

          <div className="relative z-10 w-full max-w-[610px] pt-12 lg:pt-0">

            {/* Eyebrow */}

            <div
              className="
                mb-5 inline-flex items-center gap-2
                rounded-full
                border border-[#368AE4]/20
                bg-white/65
                px-4 py-2
                text-[10px] font-extrabold
                uppercase tracking-[0.16em]
                text-[#368AE4]
                shadow-sm backdrop-blur-md
                sm:text-[11px]
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#368AE4]" />
              Welcome to African Chess Academy
            </div>

            {/* Heading */}

            <h1
              className="
                max-w-[620px]
                text-[3.3rem]
                font-black
                leading-[0.98]
                tracking-[-0.045em]
                text-[#0B1528]
                sm:text-6xl
                lg:text-[5rem]
                xl:text-[5.4rem]
              "
            >
              Think.
              <br />

              Strategize.
              <br />

              <span className="text-[#368AE4]">
                Become.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-7 max-w-[500px]
                text-sm font-medium leading-7
                text-[#526174]
                sm:text-base
              "
            >
              We empower students across Africa to learn, compete,
              and grow through the game of chess. Every move builds
              a stronger mind and a brighter future.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/programs"
                className="
                  group inline-flex items-center
                  justify-center gap-3
                  rounded-xl
                  bg-[#368AE4]
                  px-6 py-4
                  text-sm font-bold text-white
                  shadow-[0_12px_30px_rgba(54,138,228,0.25)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:bg-[#2679D2]
                  hover:shadow-[0_16px_35px_rgba(54,138,228,0.3)]
                "
              >
                Explore Programs

                <ArrowRight
                  className="
                    h-4 w-4
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <Link
                href="/tournaments"
                className="
                  group inline-flex items-center
                  justify-center gap-3
                  rounded-xl
                  border border-slate-200
                  bg-white/75
                  px-6 py-4
                  text-sm font-bold
                  text-[#0B1528]
                  shadow-sm
                  backdrop-blur-md
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:shadow-md
                "
              >
                View Tournaments

                <ArrowRight
                  className="
                    h-4 w-4 text-[#368AE4]
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </Link>

            </div>

            {/* TRUST / STATS */}

            <div
              className="
                mt-10 flex flex-wrap
                items-center gap-x-7 gap-y-5
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-11 w-11 items-center
                    justify-center rounded-full
                    border border-white
                    bg-white/70
                    shadow-sm
                    backdrop-blur
                  "
                >
                  <Users className="h-5 w-5 text-[#368AE4]" />
                </div>

                <div>
                  <p className="text-lg font-black text-[#0B1528]">
                    2,500+
                  </p>

                  <p className="text-[11px] font-medium text-[#64748B]">
                    Students
                  </p>
                </div>

              </div>

              <div className="hidden h-10 w-px bg-slate-300 sm:block" />

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-11 w-11 items-center
                    justify-center rounded-full
                    border border-white
                    bg-white/70
                    shadow-sm
                    backdrop-blur
                  "
                >
                  <Trophy className="h-5 w-5 text-[#368AE4]" />
                </div>

                <div>
                  <p className="text-lg font-black text-[#0B1528]">
                    150+
                  </p>

                  <p className="text-[11px] font-medium text-[#64748B]">
                    Tournaments
                  </p>
                </div>

              </div>

              <div className="hidden h-10 w-px bg-slate-300 sm:block" />

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-11 w-11 items-center
                    justify-center rounded-full
                    border border-white
                    bg-white/70
                    shadow-sm
                    backdrop-blur
                  "
                >
                  <Globe2 className="h-5 w-5 text-[#368AE4]" />
                </div>

                <div>
                  <p className="text-lg font-black text-[#0B1528]">
                    Africa
                  </p>

                  <p className="text-[11px] font-medium text-[#64748B]">
                    Growing together
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Bottom fade */}

        <div
          className="
            absolute bottom-0 left-0 right-0
            h-24
            bg-gradient-to-t
            from-[#F8FAFD]
            to-transparent
            pointer-events-none
          "
        />

      </section>


      {/* =========================================================
          TRUST STRIP
      ========================================================== */}

      <section className="border-y border-slate-200/70 bg-white">

        <div
          className="
            mx-auto max-w-7xl
            px-5 py-7
            sm:px-8
            lg:px-12
          "
        >

          <div
            className="
              flex flex-col gap-5
              sm:flex-row sm:items-center
              sm:justify-between
            "
          >

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                A community of learners
              </p>

              <p className="mt-1 text-sm font-bold text-[#0B1528]">
                A legacy of champions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">

              {[
                "Schools",
                "Chess Clubs",
                "Coaches",
                "Communities",
                "Players",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex items-center gap-2
                    text-xs font-bold
                    text-slate-400
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-[#368AE4]/40" />
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          WHY ACA
      ========================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-3xl text-center">

          <div
            className="
              mx-auto mb-4 flex h-11 w-11
              items-center justify-center
              rounded-2xl bg-[#368AE4]/10
            "
          >
            <Sparkles className="h-5 w-5 text-[#368AE4]" />
          </div>

          <p
            className="
              text-xs font-extrabold
              uppercase tracking-[0.15em]
              text-[#368AE4]
            "
          >
            Why ACA exists
          </p>

          <h2
            className="
              mt-3 text-3xl font-black
              tracking-tight text-[#0B1528]
              sm:text-4xl
            "
          >
            From potential to global performance.
          </h2>

          <p
            className="
              mt-5 text-sm leading-7
              text-[#64748B] sm:text-base
            "
          >
            African Chess Academy bridges the gap between potential
            and global performance. We provide structured training,
            verified FIDE coaches, and competitive opportunities
            to nurture champions.
          </p>

        </div>


        {/* Journey cards */}

        <div className="mt-14">

          <div className="mb-7">

            <p className="text-xs font-extrabold uppercase tracking-wider text-[#368AE4]">
              The ACA experience
            </p>

            <h3 className="mt-2 text-2xl font-black text-[#0B1528] sm:text-3xl">
              Built for every chess journey.
            </h3>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {journey.map(({ title, desc, iconBg, Icon }) => (

              <div
                key={title}
                className="
                  group rounded-[1.5rem]
                  border border-slate-200/80
                  bg-white p-6
                  shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]
                "
              >

                <div
                  className={`
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl
                    ${iconBg}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h4 className="mt-5 text-base font-black text-[#0B1528]">
                  {title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {desc}
                </p>

                <div
                  className="
                    mt-6 h-1 w-8
                    rounded-full
                    bg-[#368AE4]/20
                    transition-all
                    group-hover:w-14
                    group-hover:bg-[#368AE4]
                  "
                />

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          WHAT WE DEVELOP
      ========================================================== */}

      <section className="bg-[#F1F6FC]">

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

          <div className="max-w-2xl">

            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#368AE4]">
              Beyond the board
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#0B1528] sm:text-4xl">
              Skills that last beyond chess.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#64748B]">
              Chess becomes a framework for developing the thinking,
              discipline, and decision-making skills students can
              carry into every part of life.
            </p>

          </div>


          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {skills.map((item, index) => (

              <GlassCard
                key={item.t}
                className="
                  border-white/80
                  bg-white/80
                  p-6
                  transition-all
                  hover:-translate-y-1
                "
              >

                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-[#368AE4]/10
                  "
                >
                  <Award className="h-5 w-5 text-[#368AE4]" />
                </div>

                <p className="mt-5 text-sm font-black text-[#0B1528]">
                  {item.t}
                </p>

                <p className="mt-2 text-xs leading-6 text-[#64748B]">
                  {item.d}
                </p>

                <span className="mt-5 block text-[10px] font-black text-[#368AE4]">
                  0{index + 1}
                </span>

              </GlassCard>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          DEVELOPMENT PATH
      ========================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="text-center">

          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#368AE4]">
            Your progression
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#0B1528] sm:text-4xl">
            The ACA Development Path
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#64748B]">
            A clear progression from learning the fundamentals
            to mastering advanced strategic concepts.
          </p>

        </div>


        <div className="relative mt-14 grid gap-5 md:grid-cols-3">

          {/* Connecting line */}

          <div
            className="
              absolute left-[16.5%]
              right-[16.5%]
              top-16 hidden
              h-px bg-slate-200
              md:block
            "
          />

          {path.map((step) => (

            <div
              key={step.n}
              className="
                relative z-10
                rounded-[1.5rem]
                border border-slate-200
                bg-white
                p-7
                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-[#368AE4]
                    text-lg font-black text-white
                    shadow-lg
                    shadow-[#368AE4]/20
                  "
                >
                  {step.n}
                </div>

                <span className="text-5xl leading-none opacity-20">
                  {step.icon}
                </span>

              </div>

              <p className="mt-8 text-[10px] font-black uppercase tracking-[0.15em] text-[#368AE4]">
                {step.level}
              </p>

              <h3 className="mt-2 text-xl font-black text-[#0B1528]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                {step.d}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Structured learning
              </div>

            </div>

          ))}

        </div>


        <div className="mt-9 flex justify-center">

          <Link
            href="/programs"
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-slate-200
              bg-white
              px-6 py-3
              text-sm font-bold
              text-[#0B1528]
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            View All Programs
            <ArrowRight className="h-4 w-4 text-[#368AE4]" />
          </Link>

        </div>

      </section>


      {/* =========================================================
          FOR SCHOOLS / PARENTS / ONLINE
      ========================================================== */}

      <section className="bg-[#0B1528]">

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

          <div className="max-w-2xl">

            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#72B3FF]">
              Built for everyone
            </p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Chess education without limits.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Whether you are a school, parent, coach, or player,
              ACA provides the tools and opportunities to grow.
            </p>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <DarkFeatureCard
              icon={<Building className="h-6 w-6" />}
              title="For Schools"
              description="Integrate structured chess curricula into your school academic programs."
              href="/contact"
              linkText="School Programs"
            />

            <DarkFeatureCard
              icon={<HeartHandshake className="h-6 w-6" />}
              title="For Parents"
              description="Track your child's development, ratings, progress, and certificates."
              href="/register"
              linkText="Parent Portal"
            />

            <DarkFeatureCard
              icon={<Globe2 className="h-6 w-6" />}
              title="Experience Online"
              description="Play AI, challenge friends, solve puzzles, and join online events."
              href="/register"
              linkText="Join ACA Online"
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          FAQ + CTA
      ========================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="grid gap-6 lg:grid-cols-12">

          {/* FAQ */}

          <GlassCard className="lg:col-span-7 p-7 sm:p-8">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  bg-[#368AE4]/10
                "
              >
                <HelpCircle className="h-5 w-5 text-[#368AE4]" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#368AE4]">
                  FAQ
                </p>

                <h3 className="mt-1 text-xl font-black text-[#0B1528]">
                  Frequently Asked Questions
                </h3>
              </div>

            </div>


            <div className="mt-8 space-y-3">

              <FAQItem
                question="Is ACA suitable for complete beginners?"
                answer="Yes. Our Level 1 path assumes zero previous chess knowledge."
              />

              <FAQItem
                question="How do online multiplayer games work?"
                answer="Games use real-time technology with live clocks and instant move syncing."
              />

              <FAQItem
                question="Can students participate in tournaments?"
                answer="Yes. Students can participate in ACA tournaments and competitive events."
              />

            </div>

          </GlassCard>


          {/* CTA */}

          <div
            className="
              relative overflow-hidden
              rounded-[1.7rem]
              bg-[#368AE4]
              p-8
              text-white
              lg:col-span-5
            "
          >

            <div
              className="
                absolute -right-20 -top-20
                h-56 w-56 rounded-full
                bg-white/10 blur-2xl
              "
            />

            <div
              className="
                absolute -bottom-24 -left-20
                h-64 w-64 rounded-full
                bg-white/10 blur-2xl
              "
            />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>

                <Badge variant="blue">
                  Get Started Today
                </Badge>

                <h3 className="mt-6 text-3xl font-black leading-tight">
                  Ready to elevate your game?
                </h3>

                <p className="mt-4 text-sm leading-6 text-blue-50">
                  Create your account to unlock interactive lessons,
                  play against AI, and join tournaments.
                </p>

              </div>

              <Link
                href="/register"
                className="
                  mt-10 inline-flex
                  items-center justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5 py-4
                  text-sm font-black
                  text-[#0B1528]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-blue-50
                "
              >
                Start Your Chess Journey
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


/* =============================================================
   DARK FEATURE CARD
============================================================= */

function DarkFeatureCard({
  icon,
  title,
  description,
  href,
  linkText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div
      className="
        rounded-[1.5rem]
        border border-white/10
        bg-white/[0.04]
        p-7
        transition
        hover:-translate-y-1
        hover:bg-white/[0.07]
      "
    >

      <div
        className="
          flex h-11 w-11
          items-center justify-center
          rounded-xl
          bg-[#368AE4]
          text-white
        "
      >
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-black text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <Link
        href={href}
        className="
          mt-6 inline-flex
          items-center gap-2
          text-xs font-bold
          text-[#72B3FF]
          transition
          hover:text-white
        "
      >
        {linkText}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>

    </div>
  );
}


/* =============================================================
   FAQ ITEM
============================================================= */

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-slate-50/70
        p-5
      "
    >

      <p className="text-sm font-black text-[#0B1528]">
        {question}
      </p>

      <p className="mt-2 text-xs leading-6 text-[#64748B]">
        {answer}
      </p>

    </div>
  );
}