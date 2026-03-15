import { Link } from "react-router-dom";

const features = [
  { icon: "🗂", title: "Project Management", desc: "Track everything you're building with status, vision, and priority.",          accent: "bg-sky-400"     },
  { icon: "🧠", title: "Skill Tracking",      desc: "Log depth levels and last practiced dates. Know what's going stale.",         accent: "bg-emerald-400" },
  { icon: "💡", title: "Idea Vault",           desc: "Capture startup ideas with target user, revenue model, and complexity.",      accent: "bg-violet-400"  },
  { icon: "📚", title: "Assignment Tracker",   desc: "Monitor academic deadlines with overdue alerts and effort estimates.",        accent: "bg-amber-400"   },
  { icon: "📅", title: "Weekly Planner",       desc: "Set your top 3 priorities per week and track them against your goals.",      accent: "bg-pink-400"    },
  { icon: "📊", title: "Dashboard",            desc: "See overdue tasks, stale skills, and active projects at a single glance.",   accent: "bg-indigo-400"  },
];

const problems = [
  "Disconnected tools for notes, tasks, and code",
  "Learning not linked to real projects you're building",
  "Assignments and side projects competing for attention",
  "Ideas lost without a structured capture system",
  "No unified view of your progress or priorities",
];

const solutions = [
  "One dashboard with all activities linked together",
  "Skills tied directly to the projects you build",
  "Deadline tracking with live overdue alerts",
  "Structured idea vault with evaluation fields",
  "Weekly priority generator for focused execution",
];

const Landing = () => {
  return (
    <div className="bg-[#090d13] text-slate-200 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#1e293b22 1px, transparent 1px), linear-gradient(90deg, #1e293b22 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glows */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-sky-400/5 blur-3xl -top-24 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-400/5 blur-3xl bottom-0 right-[10%] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-400 bg-sky-400/10 border border-sky-400/20 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            // now in beta
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-100 leading-[1.1] tracking-tight mb-5">
            One system for your{" "}
            <span className="text-sky-400">entire dev life</span>
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed mb-9 max-w-lg mx-auto">
            DevTrack connects your projects, skills, assignments, and ideas into
            one focused workspace. Stop context-switching. Start shipping.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              to="/register"
              className="bg-sky-400 hover:bg-sky-300 text-[#090d13] font-mono font-bold text-sm px-6 py-3 rounded-lg transition tracking-wide"
            >
              get started free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-mono text-sm px-6 py-3 rounded-lg transition"
            >
              sign in →
            </Link>
          </div>

          <p className="text-xs font-mono text-slate-800 mt-12 tracking-widest">
            ↓ scroll to learn more
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="border-y border-slate-800 bg-slate-950/60 py-5 px-6">
        <div className="max-w-3xl mx-auto flex justify-center gap-12 flex-wrap">
          {[
            { num: "6",    label: "core modules"   },
            { num: "JWT",  label: "secure auth"     },
            { num: "100%", label: "your data"       },
            { num: "∞",    label: "ideas captured"  },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold font-mono text-sky-400">{num}</p>
              <p className="text-xs text-slate-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono text-sky-400 tracking-widest uppercase text-center mb-2">
            // what devtrack does
          </p>
          <h2 className="text-3xl font-bold text-slate-100 text-center mb-2">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-sm text-slate-500 text-center mb-12">
            Six modules that work together to keep you focused and on track.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map(({ icon, title, desc, accent }) => (
              <div
                key={title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden hover:border-slate-700 transition"
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
                <div className="text-xl mb-3">{icon}</div>
                <h3 className="text-sm font-bold text-slate-100 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section className="px-6 py-16 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Problem */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">
              The problem
            </p>
            <ul className="space-y-2.5">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
                  <span className="text-slate-700 mt-0.5 shrink-0">→</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
              The solution
            </p>
            <ul className="space-y-2.5">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                  <span className="text-emerald-600 mt-0.5 shrink-0">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── Tech stack strip ── */}
      <section className="px-6 py-10 border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-mono text-slate-700 uppercase tracking-widest mb-5">
            // built with
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            {["React", "Django", "PostgreSQL", "Django REST Framework", "Simple JWT", "Render"].map((t) => (
              <span
                key={t}
                className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20">
        <div className="max-w-lg mx-auto text-center bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-slate-100 mb-3">
            Ready to get organised?
          </h2>
          <p className="text-sm text-slate-500 mb-7">
            Create your free account and start tracking your progress today.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              to="/register"
              className="bg-sky-400 hover:bg-sky-300 text-[#090d13] font-mono font-bold text-sm px-6 py-2.5 rounded-lg transition tracking-wide"
            >
              get started free
            </Link>
            <Link
              to="/about"
              className="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 font-mono text-sm px-6 py-2.5 rounded-lg transition"
            >
              learn more →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;