import { Link } from "react-router-dom";
import {
  FEATURES,
  PROBLEMS,
  SOLUTIONS,
  MOCK_STATS,
  MOCK_ACTIVITY,
  MOCK_SKILLS,
  HOW_IT_WORKS,
  STATS_HIGHLIGHTS,
} from "./landingData";

// ────────────────────────────────────────────────────────
// SECTION COMPONENTS
// ────────────────────────────────────────────────────────

const HeroSection = () => (
  <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <p className="mono animate-fade-up delay-1 inline-flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/8 px-3 py-1 rounded-full mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
        Built for focused developers
      </p>

      <h1 className="animate-fade-up delay-2 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
        See exactly how you're{" "}
        <span className="text-blue-600 dark:text-blue-400">improving</span>
        <br className="hidden sm:block" /> as a developer
      </h1>

      <p className="animate-fade-up delay-3 text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed mt-5 max-w-xl mx-auto">
        DevTrack connects your projects, skills, and ideas into one system so
        you can track real progress and stay focused on what matters.
      </p>

      <div className="animate-fade-up delay-4 flex justify-center gap-3 mt-8 flex-wrap">
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm shadow-lg shadow-blue-600/20"
        >
          Start tracking free
        </Link>
        <Link
          to="/login"
          className="text-sm border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  </section>
);

const ProductMockSection = () => (
  <section className="px-4 pb-20">
    <div className="max-w-4xl mx-auto">
      <div className="rounded-xl border border-gray-200 dark:border-white/8 shadow-2xl shadow-gray-200/40 dark:shadow-black/40 overflow-hidden bg-white dark:bg-[#0f1318]">
        {/* Mock window bar */}
        <div className="border-b border-gray-100 dark:border-white/6 px-4 py-2.5 flex items-center gap-2 bg-gray-50 dark:bg-[#0d1117]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="mono text-xs text-gray-400 dark:text-gray-600 ml-2">devtrack — dashboard</span>
        </div>

        {/* Mock dashboard content */}
        <div className="p-5 md:p-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {MOCK_STATS.map((s) => (
              <div key={s.label} className="bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 rounded-lg p-3">
                <p className="mono text-xs text-gray-400 dark:text-gray-500 mb-1">{s.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Two column mock */}
          <div className="grid md:grid-cols-5 gap-3">
            {/* Activity feed — 3 cols */}
            <div className="md:col-span-3 bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 rounded-lg p-4">
              <p className="mono text-xs text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">Recent activity</p>
              <div className="space-y-2.5">
                {MOCK_ACTIVITY.map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color} flex-shrink-0`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{item.text}</span>
                    <span className="mono text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">
                      {item.level || item.status || item.complexity || item.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill progress — 2 cols */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 rounded-lg p-4">
              <p className="mono text-xs text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">Skill depth</p>
              <div className="space-y-3">
                {MOCK_SKILLS.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{skill.name}</span>
                      <span className="mono text-xs text-gray-400">{skill.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/8 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color} opacity-70 rounded-full`} style={{ width: `${skill.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mono text-center text-gray-400 dark:text-gray-600 text-xs mt-3">
        your entire dev system in one place
      </p>
    </div>
  </section>
);

const StatsHighlights = () => (
  <div className="border-y border-gray-200 dark:border-white/6 bg-gray-50/80 dark:bg-white/2 py-5 px-4">
    <div className="max-w-4xl mx-auto flex justify-center gap-6 md:gap-14 flex-wrap">
      {STATS_HIGHLIGHTS.map((label) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-blue-500" />
          <p className="mono text-xs text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

const FeaturesSection = () => (
  <section className="px-4 py-20 md:py-24">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="mono text-xs text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-3">
          built for clarity
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Everything you need. Nothing you don't.
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 max-w-md mx-auto">
          Four modules that work together to keep you moving.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="card-hover bg-gray-50 dark:bg-[#0f1318] rounded-xl border border-gray-200 dark:border-white/7 p-6 hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
          >
            <span className="mono text-xl text-blue-600 dark:text-blue-400 block mb-4">{icon}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="px-4 py-16 bg-gray-50/80 dark:bg-white/2 border-y border-gray-200 dark:border-white/6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">How it works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {HOW_IT_WORKS.map((item) => (
          <div key={item.step} className="text-center">
            <p className="mono text-3xl font-medium text-blue-600/30 dark:text-blue-500/30 mb-3">{item.step}</p>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProblemSolutionSection = () => (
  <section className="px-4 py-20 md:py-24">
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
      <div className="bg-gray-50 dark:bg-[#0f1318] rounded-xl border border-gray-200 dark:border-white/7 p-6 md:p-7">
        <p className="mono text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">The problem</p>
        <ul className="space-y-3">
          {PROBLEMS.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0">—</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-blue-600 rounded-xl border border-blue-500 p-6 md:p-7">
        <p className="mono text-xs text-blue-200 uppercase tracking-widest mb-4">The solution</p>
        <ul className="space-y-3">
          {SOLUTIONS.map((s) => (
            <li key={s} className="flex items-start gap-3 text-sm text-blue-50">
              <span className="text-blue-300 mt-0.5 flex-shrink-0">✔</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="px-4 pb-24">
    <div className="max-w-2xl mx-auto text-center bg-gray-50 dark:bg-[#0f1318] rounded-2xl border border-gray-200 dark:border-white/7 p-10 md:p-14">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
        Take control of your dev growth
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-sm mx-auto">
        Start tracking your real progress today. Free forever.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm shadow-lg shadow-blue-600/20"
        >
          Get started free
        </Link>
        <Link
          to="/about"
          className="border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Learn more
        </Link>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-white/6 px-4 py-10">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
      <div>
        <h3 className="font-semibold tracking-tight text-gray-900 dark:text-white">
          Dev<span className="text-blue-600">Track</span>
        </h3>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">A system for focused developers</p>
      </div>
      <div className="flex gap-10">
        <div>
          <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">Explore</h4>
          <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-500">
            <li><Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">Account</h4>
          <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-500">
            <li><Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">Register</Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="max-w-5xl mx-auto border-t border-gray-100 dark:border-white/5 mt-8 pt-6 flex justify-between items-center">
      <p className="mono text-xs text-gray-400 dark:text-gray-600">© 2026 DevTrack</p>
      <p className="mono text-xs text-gray-400 dark:text-gray-600">Built by Roy Mulinge</p>
    </div>
  </footer>
);

// ────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────

const Landing = () => {
  return (
    <div className="bg-white dark:bg-[#080b10] text-gray-900 dark:text-white min-h-screen antialiased">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .landing-root { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        .animate-fade-up   { animation: fade-up 0.6s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.35s; opacity: 0; }
        .delay-4 { animation-delay: 0.5s; opacity: 0; }
        .glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }

        .hero-glow-light {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%);
        }
        .hero-glow-dark {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .card-hover {
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .card-hover:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="landing-root relative overflow-hidden">

        {/* ── BACKGROUND ───────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Light mode */}
          <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-white" />
          <div className="dark:hidden absolute inset-0 hero-glow-light" />
          {/* Dark mode */}
          <div className="hidden dark:block absolute inset-0 grid-bg" />
          <div className="hidden dark:block absolute inset-0 hero-glow-dark glow-pulse" />
        </div>

        {/* ── CONTENT ───────────────────────────────────── */}
        <div className="relative z-10">
          <HeroSection />
          <ProductMockSection />
          <StatsHighlights />
          <FeaturesSection />
          <HowItWorksSection />
          <ProblemSolutionSection />
          <CTASection />
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Landing;