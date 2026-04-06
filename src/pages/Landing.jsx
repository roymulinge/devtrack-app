import { Link } from "react-router-dom";

const features = [
  { icon: "🗂", title: "Project Management", desc: "Track everything you're building with status, vision, and priority." },
  { icon: "🧠", title: "Skill Tracking", desc: "Log depth levels and last practiced dates. Know what's going stale." },
  { icon: "💡", title: "Idea Vault", desc: "Capture startup ideas with target user, revenue model, and complexity." },
  { icon: "📚", title: "Assignment Tracker", desc: "Monitor academic deadlines with overdue alerts and effort estimates." },
  { icon: "📅", title: "Weekly Planner", desc: "Set your top 3 priorities per week and track them against your goals." },
  { icon: "📊", title: "Dashboard", desc: "See overdue tasks, stale skills, and active projects at a single glance." },
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
    <div className="bg-[#0b0f14] text-white min-h-screen antialiased font-sans">

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-6 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl -top-24 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-3xl bottom-0 right-[10%] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            One system for your <span className="text-blue-500 bg-clip-text">entire dev life</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            DevTrack connects your projects, skills, assignments, and ideas into
            one focused workspace. Stop context-switching. Start shipping.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-600/20"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="border border-[#1f2630] hover:border-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Sign in →
            </Link>
          </div>
          <p className="text-xs font-mono text-gray-500 mt-16 tracking-widest">
            ↓ scroll to learn more
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="border-y border-[#1f2630] bg-[#0d1117]/60 py-6 px-4">
        <div className="max-w-3xl mx-auto flex justify-center gap-12 flex-wrap">
          {[
            { num: "6", label: "core modules" },
            { num: "JWT", label: "secure auth" },
            { num: "100%", label: "your data" },
            { num: "∞", label: "ideas captured" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-blue-500">{num}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="px-4 md:px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-500 text-sm font-mono uppercase tracking-wider mb-2">what devtrack does</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need. Nothing you don't.</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Six modules that work together to keep you focused and on track.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#11161c] rounded-xl border border-[#1f2630] p-6 hover:border-gray-700 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="border-y border-[#1f2630] bg-[#0d1117]/30 px-4 md:px-6 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="bg-[#11161c] rounded-xl border border-[#1f2630] p-6 shadow-sm">
            <p className="text-blue-500 text-sm font-mono uppercase tracking-wider mb-5">The problem</p>
            <ul className="space-y-3">
              {problems.map((problem) => (
                <li key={problem} className="flex items-start gap-3 text-gray-300 text-sm">
                  <span className="text-blue-500 mt-0.5">◉</span>
                  {problem}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-[#11161c] rounded-xl border border-[#1f2630] p-6 shadow-sm">
            <p className="text-blue-500 text-sm font-mono uppercase tracking-wider mb-5">The solution</p>
            <ul className="space-y-3">
              {solutions.map((solution) => (
                <li key={solution} className="flex items-start gap-3 text-gray-300 text-sm">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  {solution}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 md:px-6 py-16 border-b border-[#1f2630]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-6">built with modern tools</p>
          <div className="flex justify-center flex-wrap gap-3">
            {["React", "Django", "PostgreSQL", "Django REST Framework", "Simple JWT", "Render"].map((tech) => (
              <span
                key={tech}
                className="text-gray-400 text-sm bg-[#11161c] border border-[#1f2630] px-4 py-1.5 rounded-full hover:border-gray-600 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-6 py-24">
        <div className="max-w-2xl mx-auto text-center bg-[#11161c] rounded-2xl border border-[#1f2630] p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Ready to get organised?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Create your free account and start tracking your progress today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Get started free
            </Link>
            <Link
              to="/about"
              className="border border-[#1f2630] hover:border-gray-600 text-gray-300 hover:text-white px-6 py-2.5 rounded-lg transition-colors"
            >
              Learn more →
            </Link>
            <Link
              to="/contact"
              className="border border-[#1f2630] hover:border-gray-600 text-gray-300 hover:text-white px-6 py-2.5 rounded-lg transition-colors"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;