import { Link } from "react-router-dom";

// Updated feature set (4 items, outcome‑focused)
const features = [
  {
    icon: "📊",
    title: "Unified Dashboard",
    desc: "See projects, skills, and deadlines in one place. Know what needs your attention right now.",
  },
  {
    icon: "🎯",
    title: "Progress Tracking",
    desc: "Measure real improvement over time. Get streaks, completion rates, and skill level changes.",
  },
  {
    icon: "💡",
    title: "Smart Idea Capture",
    desc: "Never lose a startup idea. Add market, complexity, and revenue model – then connect it to a project.",
  },
  {
    icon: "⚡",
    title: "Weekly Focus",
    desc: "Set your top 3 priorities each week. DevTrack automatically links them to your goals and deadlines.",
  },
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
    <div className="bg-white dark:bg-[#0b0f14] text-gray-900 dark:text-white min-h-screen antialiased font-sans">
      {/* Background decorations */}
      <div className="relative overflow-hidden">
        {/* Light mode subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-gray-100/30 dark:hidden pointer-events-none" />
        {/* Dark mode grid + glows */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl -top-24 left-1/2 -translate-x-1/2" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-3xl bottom-0 right-[10%]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
              See exactly how you're improving as a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                developer
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed mt-6 max-w-2xl mx-auto">
              DevTrack connects your projects, skills, and ideas into one system so you can track real progress and stay focused.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 max-w-md mx-auto">
              Most developers are busy — but don’t know if they’re actually improving.
            </p>
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md shadow-blue-600/20"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="border border-gray-300 dark:border-[#1f2630] hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-3 rounded-lg transition-colors"
              >
                Sign in →
              </Link>
            </div>
          </div>
        </section>

        {/* Product Preview Section (MANDATORY) */}
        <section className="px-4 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-xl border border-gray-200 dark:border-[#1f2630] shadow-lg shadow-gray-200/30 dark:shadow-none overflow-hidden bg-white dark:bg-[#11161c]">
              {/* Placeholder dashboard image / styled mockup */}
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1a202c] dark:to-[#0f131a] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-3xl">📊</span>
                  </div>
                  <p className="text-sm font-mono">Dashboard preview</p>
                  <p className="text-xs mt-2 opacity-60">Projects · Skills · Deadlines</p>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
              Your entire dev system in one place
            </p>
          </div>
        </section>

        {/* Stats Bar (updated content) */}
        <div className="border-y border-gray-200 dark:border-[#1f2630] bg-gray-50/50 dark:bg-[#0d1117]/60 py-6 px-4">
          <div className="max-w-4xl mx-auto flex justify-center gap-8 md:gap-16 flex-wrap">
            {[
              { label: "Track real progress" },
              { label: "Stay consistent with streaks" },
              { label: "Never lose ideas" },
              { label: "Focus on what matters" },
            ].map(({ label }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid (4 features) */}
        <section className="px-4 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 dark:text-blue-500 text-sm font-mono uppercase tracking-wider mb-2">
                built for clarity
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Everything you need. Nothing you don't.
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                Four core modules that work together to keep you focused and on track.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-gray-50 dark:bg-[#11161c] rounded-xl border border-gray-200 dark:border-[#1f2630] p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-md"
                >
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (3 steps) */}
        <section className="px-4 py-16 bg-gray-50 dark:bg-[#0d1117]/50 border-y border-gray-200 dark:border-[#1f2630]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Track your work",
                  desc: "Log projects, skills, ideas, and assignments in one place.",
                },
                {
                  step: "2",
                  title: "DevTrack connects everything",
                  desc: "Our engine links your activities to show real relationships.",
                },
                {
                  step: "3",
                  title: "You get clarity and direction",
                  desc: "See what needs attention, what's improving, and what's next.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem / Solution (improved spacing & readability) */}
        <section className="px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-[#11161c] rounded-xl border border-gray-200 dark:border-[#1f2630] p-6 md:p-8">
              <p className="text-blue-600 dark:text-blue-500 text-sm font-mono uppercase tracking-wider mb-5">
                The problem
              </p>
              <ul className="space-y-3">
                {problems.map((problem) => (
                  <li key={problem} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <span className="text-blue-500 mt-0.5">◉</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-[#11161c] rounded-xl border border-gray-200 dark:border-[#1f2630] p-6 md:p-8">
              <p className="text-blue-600 dark:text-blue-500 text-sm font-mono uppercase tracking-wider mb-5">
                The solution
              </p>
              <ul className="space-y-3">
                {solutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA (rewritten) */}
        <section className="px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center bg-gray-50 dark:bg-[#11161c] rounded-2xl border border-gray-200 dark:border-[#1f2630] p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Take control of your dev growth
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start tracking your real progress today.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-md shadow-blue-600/20"
              >
                Get started free
              </Link>
              <Link
                to="/about"
                className="border border-gray-300 dark:border-[#1f2630] hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-2.5 rounded-lg transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer (new) */}
        <footer className="border-t border-gray-200 dark:border-[#1f2630] bg-gray-50/30 dark:bg-transparent px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight">DevTrack</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs">
                  A system for focused developers
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <h4 className="text-sm font-medium mb-2">Explore</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><Link to="/about" className="hover:text-gray-900 dark:hover:text-white">About</Link></li>
                    <li><Link to="/contact" className="hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Account</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><Link to="/login" className="hover:text-gray-900 dark:hover:text-white">Login</Link></li>
                    <li><Link to="/register" className="hover:text-gray-900 dark:hover:text-white">Register</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-[#1f2630] mt-8 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
              © 2026 DevTrack. Built for developers.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;