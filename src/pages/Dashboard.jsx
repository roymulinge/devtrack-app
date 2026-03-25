import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import PageLoader from "../Components/PageLoader";  
const depthToPercent = (depth) => {
  if (depth === null || depth === undefined) return 40;
  
  if (typeof depth === "number") {
    const map = { 1: 25, 2: 50, 3: 75, 4: 100 };
    return map[depth] ?? 40;
  }
  
  const map = { beginner: 25, intermediate: 60, advanced: 85, expert: 100 };
  return map[String(depth).toLowerCase()] ?? 40;
};

const depthColor = (depth) => {
  if (depth === null || depth === undefined) return "#38bdf8";
  
  if (typeof depth === "number") {
    const map = { 1: "#fbbf24", 2: "#a78bfa", 3: "#38bdf8", 4: "#34d399" };
    return map[depth] ?? "#38bdf8";
  }
  
  const map = { beginner: "#fbbf24", intermediate: "#a78bfa", advanced: "#38bdf8", expert: "#34d399" };
  return map[String(depth).toLowerCase()] ?? "#38bdf8";
};

const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
};
const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [weeklyPriorities, setWeeklyPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overdueAssignments, setOverdueAssignments] = useState([]);
  const [staleSkills, setStaleSkills] = useState([]);

 useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [ideasRes, projectsRes, skillsRes, staleRes, overdueRes, prioritiesRes] =
        await Promise.all([
          api.get("/ideas/"),
          api.get("/projects/"),
          api.get("/skills/"),
          api.get("/skills/stale/"),
          api.get("/assignments/overdue/"),
          api.get("/weekly-priorities/"),
        ]);

      setIdeas(ideasRes.data.results        ?? ideasRes.data        ?? []);
      setProjects(projectsRes.data.results  ?? projectsRes.data     ?? []);
      setSkills(skillsRes.data.results      ?? skillsRes.data       ?? []);
      setStaleSkills(staleRes.data.results  ?? staleRes.data        ?? []);
      setOverdueAssignments(overdueRes.data.results ?? overdueRes.data ?? []);
      setWeeklyPriorities(prioritiesRes.data.results ?? prioritiesRes.data ?? []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  if (loading) return <PageLoader />;
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)] font-mono">{today}</p>
            <p className="text-xs text-slate-700 font-mono mt-0.5">
              Week {getWeekNumber()} of 52
            </p>
          </div>
        </div>

        {/* ── Stat Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { num: projects.length,           label: "Projects",      color: "sky",    border: "border-sky-500/30",    text: "text-sky-400"   },
            { num: skills.length,             label: "Skills tracked", color: "emerald", border: "border-emerald-500/30", text: "text-emerald-400" },
            { num: staleSkills.length,        label: "Stale skills",  color: "amber",  border: "border-amber-500/30",  text: "text-amber-400" },
            { num: overdueAssignments.length, label: "Overdue",       color: "red",    border: "border-red-500/30",    text: "text-red-400"   },
          ].map(({ num, label, border, text }) => (
            <div
              key={label}
              className={`bg-[var(--bg-surface)] border ${border} rounded-xl p-4 relative overflow-hidden`}
            >
              <div className={`text-3xl font-bold font-mono ${text} mb-1`}>{num}</div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Projects — 2 cols */}
          <div className="md:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Projects
              </span>
              <span className="text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                {projects.length} total
              </span>
            </div>

            {projects.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No projects yet.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {projects.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span className="text-sm text-slate-300 flex-1 truncate">{p.name}</span>
                    {p.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0
                        ${p.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : p.status === "paused"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-violet-500/10 text-violet-400"}`}>
                        {p.status}
                      </span>
                    )}
                    {p.tech_stack && (
                      <span className="text-xs font-mono text-slate-600 shrink-0">{p.tech_stack}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/projects"
              className="block text-right text-xs text-sky-400 mt-4 hover:text-sky-300 transition"
            >
              View all projects →
            </Link>
          </div>

          {/* Overdue Assignments */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Overdue
              </span>
              {overdueAssignments.length > 0 && (
                <span className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                  {overdueAssignments.length} urgent
                </span>
              )}
            </div>

            {overdueAssignments.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No overdue assignments</p>
            ) : (
              <ul className="space-y-2">
                {overdueAssignments.slice(0, 4).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/15 rounded-lg p-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-red-300 font-medium">{a.title}</p>
                      {a.due_date && (
                        <p className="text-xs font-mono text-red-500 mt-0.5">
                          Due: {new Date(a.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/assignments"
              className="block text-right text-xs text-sky-400 mt-4 hover:text-sky-300 transition"
            >
              View assignments →
            </Link>
          </div>

          {/* Skills */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Skills
              </span>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {skills.length} tracked
              </span>
            </div>

            {skills.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No skills tracked.</p>
            ) : (
              <ul className="space-y-3">
                {skills.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-300 font-medium">{s.name}</span>
                      <span className="text-xs font-mono text-slate-600">{s.depth_level}</span>
                    </div>
                    <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${depthToPercent(s.depth_level)}%`,
                          background: depthColor(s.depth_level),
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/skills"
              className="block text-right text-xs text-sky-400 mt-4 hover:text-sky-300 transition"
            >
              View all skills →
            </Link>
          </div>

          {/* Stale Skills */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Stale Skills
              </span>
              {staleSkills.length > 0 && (
                <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  needs practice
                </span>
              )}
            </div>

            {staleSkills.length === 0 ? (
              <p className="text-xs text-slate-600 italic">All skills recently practiced</p>
            ) : (
              <ul className="space-y-2">
                {staleSkills.slice(0, 5).map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg p-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-xs text-amber-200 flex-1">{s.name}</span>
                    {s.last_practiced && (
                      <span className="text-xs font-mono text-amber-700 shrink-0">
                        {Math.floor(
                          (Date.now() - new Date(s.last_practiced)) / 86400000
                        )}d ago
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/skills"
              className="block text-right text-xs text-sky-400 mt-4 hover:text-sky-300 transition"
            >
              Go practice →
            </Link>
          </div>

          {/* Weekly Priorities */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                This Week
              </span>
              <span className="text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                priorities
              </span>
            </div>

            {weeklyPriorities.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No priorities set yet.</p>
            ) : (
              <ol className="divide-y divide-slate-800">
                {weeklyPriorities.slice(0, 3).map((p, i) => (
                  <li key={p.id} className="flex items-start gap-3 py-2.5">
                    <span className="text-xl font-bold font-mono text-slate-800 leading-tight w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {p.top_three_text}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            <Link
              to="/weekly-planner"
              className="block text-right text-xs text-sky-400 mt-4 hover:text-sky-300 transition"
            >
              Open planner →
            </Link>
          </div>

          {/* Ideas — 2 cols */}
          <div className="md:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Idea Vault
              </span>
              <span className="text-xs font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
                {ideas.length} ideas
              </span>
            </div>

            {ideas.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No ideas captured yet.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {ideas.slice(0, 4).map((idea) => (
                  <li key={idea.id} className="flex items-start gap-3 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    <span className="text-sm text-slate-300 flex-1 truncate">
                      {idea.problem_statement}
                    </span>
                    {idea.potential && (
                      <span className="text-xs font-mono text-slate-600 shrink-0">{idea.potential}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/ideas"
              className="block text-right text-xs text-sky-400 mt-4 hover:text-sky-300 transition"
            >
              View all ideas →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;