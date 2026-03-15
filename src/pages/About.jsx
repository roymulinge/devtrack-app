import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "🗂",
    title: "Project Management",
    desc: "Organize and track your personal dev projects from idea to completion.",
  },
  {
    icon: "🧠",
    title: "Skill Tracking",
    desc: "Log skills with depth levels and last practice dates to stay sharp.",
  },
  {
    icon: "📚",
    title: "Assignment Monitor",
    desc: "Never miss a deadline — track academic assignments with due date alerts.",
  },
  {
    icon: "💡",
    title: "Idea Vault",
    desc: "Capture and evaluate startup or product ideas in a structured way.",
  },
  {
    icon: "📅",
    title: "Weekly Planner",
    desc: "Generate weekly priorities that connect your skills, projects, and tasks.",
  },
  {
    icon: "📊",
    title: "Dashboard Overview",
    desc: "See overdue tasks, stale skills, and active projects at a glance.",
  },
];

const stack = [
  { label: "Frontend", items: ["React", "Axios", "Context API", "Tailwind CSS"] },
  { label: "Backend",  items: ["Django", "Django REST Framework", "PostgreSQL"] },
  { label: "Auth",     items: ["Simple JWT", "Token-based sessions"] },
  { label: "Deploy",   items: ["Render", "GitHub"] },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-sky-500/10 text-sky-400 text-sm font-medium px-4 py-1 rounded-full mb-6 border border-sky-500/20">
          About DevTrack
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          One platform for everything a{" "}
          <span className="text-sky-400">developer-student</span> needs
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          DevTrack is a personal productivity system built specifically for students
          and developers who are tired of juggling disconnected tools. It connects
          your learning, projects, assignments, and ideas into one structured workflow.
        </p>
      </section>

      {/* Problem / Solution */}
      <section className="max-w-4xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-red-400 font-semibold text-sm uppercase tracking-widest mb-3">
            The Problem
          </h2>
          <ul className="space-y-2 text-slate-400 text-sm leading-relaxed">
            <li>→ Disconnected tools for notes, tasks, and projects</li>
            <li>→ Learning not linked to real project practice</li>
            <li>→ Assignments and personal work competing for attention</li>
            <li>→ Ideas lost without a structured capture system</li>
            <li>→ No unified view of progress or priorities</li>
          </ul>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sky-400 font-semibold text-sm uppercase tracking-widest mb-3">
            The Solution
          </h2>
          <ul className="space-y-2 text-slate-400 text-sm leading-relaxed">
            <li>→ Centralized dashboard with all activities linked</li>
            <li>→ Skills tied to actual projects you are building</li>
            <li>→ Deadline tracking with overdue alerts</li>
            <li>→ Structured idea vault with evaluation fields</li>
            <li>→ Weekly priority generator for focused execution</li>
          </ul>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-white text-2xl font-bold text-center mb-10">
          What DevTrack does
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-sky-500/40 transition"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-1">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-white text-2xl font-bold text-center mb-10">
          Built with
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stack.map((s) => (
            <div
              key={s.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
                {s.label}
              </p>
              <ul className="space-y-1">
                {s.items.map((item) => (
                  <li key={item} className="text-slate-300 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <h2 className="text-white text-2xl font-bold mb-3">
            Ready to get organised?
          </h2>
          <p className="text-slate-400 mb-6 text-sm">
            Create your free account and start tracking your progress today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Get started
            </Link>
            <Link
              to="/contact"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;