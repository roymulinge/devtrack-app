import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "../Components/PageLoader";

// Maps depth_level string to a percentage for the skill bar display
const depthToPercent = (depth) => {
  const map = { beginner: 25, intermediate: 60, advanced: 85, expert: 100 };
  return map[String(depth).toLowerCase()] ?? 40;
};

// Maps depth_level string to a color for the skill bar
const depthColor = (depth) => {
  const map = { beginner: "#fbbf24", intermediate: "#a78bfa", advanced: "#38bdf8", expert: "#34d399" };
  return map[String(depth).toLowerCase()] ?? "#38bdf8";
};

// Gets current week number out of 52 for the header display
const getWeekNumber = () => {
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Single state object for all dashboard data from /core/dashboard/
  // Replaces the 6 separate useState calls that matched the 6 old API calls
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  // UI-only state — not data, these stay
  const [focusMode, setFocusMode]         = useState(false);
  const [settingPriority, setSettingPriority] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // ONE request replaces 6 — backend does all the aggregation
      const res = await api.get("/core/dashboard/");
      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Shares a text summary using Web Share API or clipboard fallback
  const handleShareInsights = async () => {
    if (!dashboard) return;
    const summary =
      `DevTrack Dashboard - ${new Date().toLocaleDateString()}\n` +
      `Projects: ${dashboard.counts.projects}\n` +
      `Skills: ${dashboard.counts.skills}\n` +
      `Overdue: ${dashboard.overdue_assignments.length}\n` +
      `Stale skills: ${dashboard.stale_skills.length}\n` +
      `Ideas: ${dashboard.counts.ideas}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "My DevTrack Progress", text: summary });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(summary);
      alert("Dashboard summary copied to clipboard!");
    }
  };

  const toggleFocusMode = () => setFocusMode(!focusMode);

  // Calls /next-action/ which returns the most important thing to work on
  const handleResumeWork = async () => {
    try {
      const res    = await api.get("/planning/next-action/");
      const action = res.data;
      // Navigate to list pages — detail routes don't exist yet
      if (action.type === "project")    navigate("/projects");
      else if (action.type === "assignment") navigate("/assignments");
      else navigate("/projects");
    } catch (err) {
      console.error("Failed to get next action", err);
      navigate("/projects");
    }
  };

  // Posts the first active project as this week's priority
  const handleSetPriority = async () => {
    if (!dashboard?.active_projects?.length) return;
    setSettingPriority(true);
    try {
      const focusProject = dashboard.active_projects[0];
      await api.post("/weekly-priorities/", {
        top_three_text: `Complete ${focusProject.name}`,
        week_start:     new Date().toISOString().split("T")[0],
      });
      alert("Added to weekly priorities!");
      // Re-fetch dashboard to update this_week data
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to set priority", err);
      alert("Could not set priority. Please try again.");
    } finally {
      setSettingPriority(false);
    }
  };

  if (loading) return <PageLoader />;

  if (!dashboard) return (
  <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
    Failed to load dashboard. Please refresh.
  </div>
);

  // Destructure dashboard data for cleaner JSX below
  // Each variable maps directly to a key in the /core/dashboard/ response
  const {
    counts,               // { projects, skills, assignments, ideas }
    overdue_assignments,  // list of AssignmentBriefSerializer objects
    stale_skills,         // list of SkillBriefSerializer objects
    active_projects,      // list of ProjectBriefSerializer objects
    this_week,            // WeeklyPrioritySerializer or null
    focus,                // { level, message, type, id }
  } = dashboard;

  const today         = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // Calculates how many days ago a skill was practiced for display
  const getDaysAgo = (lastPracticed) => {
    if (!lastPracticed) return null;
    return Math.floor((Date.now() - new Date(lastPracticed)) / 86400000);
  };

  // Focus mode — full screen single project view
  if (focusMode) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] z-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 p-8">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                FOCUS MODE
              </span>
              {/* Show the backend focus message in focus mode */}
              <h2 className="text-3xl font-bold mt-4 text-[var(--text-primary)]">
                {focus?.message ?? "You're on track"}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-2">
                Only this matters right now. Close everything else.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleResumeWork}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-sm font-medium text-white"
                >
                  Continue →
                </button>
                <button
                  onClick={toggleFocusMode}
                  className="border border-[var(--border)] hover:bg-[var(--bg-surface)] px-6 py-3 rounded-lg text-sm text-[var(--text-primary)]"
                >
                  Exit Focus
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={toggleFocusMode}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              {formattedDate} · Week {getWeekNumber()} of 52
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShareInsights}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-surface)] text-sm text-[var(--text-secondary)] transition-all"
            >
              Share insights
            </button>
            <button
              onClick={toggleFocusMode}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white shadow-sm transition-all flex items-center gap-1"
            >
              Focus Mode →
            </button>
          </div>
        </div>

        {/* Stats row — uses counts from /core/dashboard/ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Active projects</div>
            <div className="text-2xl font-bold mt-1">{counts.projects}</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Skills tracked</div>
            <div className="text-2xl font-bold mt-1">{counts.skills}</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Assignments</div>
            <div className="text-2xl font-bold mt-1">{counts.assignments}</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Ideas captured</div>
            <div className="text-2xl font-bold mt-1">{counts.ideas}</div>
          </div>
        </div>

        {/* FOCUS CARD — powered by backend _compute_focus() */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Focus
              </span>
              <span className="text-xs text-[var(--text-muted)]">· Recommended by DevTrack</span>
            </div>
            <Link to="/weekly-planner" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1">
              Open planner <span>→</span>
            </Link>
          </div>

          <div className={`rounded-2xl border p-6 shadow-lg transition-all ${
            focus?.level === "critical"
              ? "bg-gradient-to-r from-red-600/15 to-orange-600/15 border-red-500/25"
              : focus?.level === "high"
              ? "bg-gradient-to-r from-amber-600/15 to-orange-600/15 border-amber-500/25"
              : focus?.level === "medium"
              ? "bg-gradient-to-r from-blue-600/15 to-violet-600/15 border-blue-500/25"
              : "bg-gradient-to-r from-green-600/15 to-emerald-600/15 border-green-500/25"
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                {/* Focus level badge — critical/high/medium/clear */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  focus?.level === "critical" ? "bg-red-500/30 text-red-300" :
                  focus?.level === "high"     ? "bg-amber-500/30 text-amber-300" :
                  focus?.level === "medium"   ? "bg-blue-500/30 text-blue-300" :
                                               "bg-green-500/30 text-green-300"
                }`}>
                  {focus?.level?.toUpperCase() ?? "CLEAR"}
                </div>

                {/* Focus message from backend _compute_focus() */}
                <h2 className="text-2xl font-bold mt-3 tracking-tight">
                  {focus?.message ?? "You're on track. Plan your week."}
                </h2>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={handleResumeWork}
                    className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 text-white shadow-md transition-all active:scale-95"
                  >
                    Resume Work →
                  </button>
                  <button
                    onClick={handleSetPriority}
                    disabled={settingPriority || !active_projects?.length}
                    className="border border-[var(--border)] hover:bg-[var(--bg-surface)] px-5 py-2.5 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
                  >
                    {settingPriority ? "Adding..." : "Set as priority"}
                  </button>
                </div>
              </div>

              {/* Skill depth display — first stale skill or first active skill */}
              <div className="hidden md:block text-right min-w-[100px]">
                <div className="text-4xl font-black text-blue-400/40">
                  {stale_skills?.length > 0
                    ? depthToPercent(stale_skills[0]?.depth_level)
                    : 0}%
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {stale_skills?.length > 0 ? stale_skills[0]?.name : "All skills fresh"}
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                  <div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${stale_skills?.length > 0 ? depthToPercent(stale_skills[0]?.depth_level) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Activity — overdue + stale from dashboard response */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
              <Link to="/projects" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                View all →
              </Link>
            </div>
            <div className="space-y-2.5">

              {/* Active projects from dashboard */}
              {active_projects?.slice(0, 2).map((project) => (
                <div key={`project-${project.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-hover)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">🚀</div>
                    <div>
                      <span className="font-medium">{project.name}</span>
                      <span className="text-[var(--text-muted)] text-xs ml-2 bg-white/5 px-1.5 py-0.5 rounded">Project</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {project.status}
                    </div>
                    <Link to="/projects" className="text-xs text-blue-400 hover:text-blue-300">Resume</Link>
                  </div>
                </div>
              ))}

              {/* Overdue assignments from dashboard */}
              {overdue_assignments?.slice(0, 2).map((assignment) => (
                <div key={`overdue-${assignment.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-hover)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">⚠️</div>
                    <div>
                      <span className="font-medium">{assignment.title}</span>
                      <span className="text-[var(--text-muted)] text-xs ml-2 bg-white/5 px-1.5 py-0.5 rounded">Assignment</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-red-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      Overdue
                    </div>
                    <Link to="/assignments" className="text-xs text-red-400 hover:text-red-300">Review →</Link>
                  </div>
                </div>
              ))}

              {/* Stale skills from dashboard */}
              {stale_skills?.slice(0, 1).map((skill) => (
                <div key={`stale-${skill.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-hover)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">📘</div>
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-[var(--text-muted)] text-xs ml-2 bg-white/5 px-1.5 py-0.5 rounded">Skill</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      Stale
                    </div>
                    <Link to="/skills" className="text-xs text-blue-400 hover:text-blue-300">Practice</Link>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {!active_projects?.length && !overdue_assignments?.length && !stale_skills?.length && (
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center text-[var(--text-muted)] text-sm">
                  No recent activity. Start by creating a project or adding a skill.
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Skill depth card */}
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-5 mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Skill Depth</h3>
              <div className="mt-3 space-y-4">
                {!stale_skills?.length ? (
                  <p className="text-xs text-[var(--text-muted)] italic">All skills recently practiced.</p>
                ) : (
                  stale_skills.slice(0, 3).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="text-[var(--text-muted)]">{depthToPercent(skill.depth_level)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${depthToPercent(skill.depth_level)}%`, backgroundColor: depthColor(skill.depth_level) }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/skills" className="mt-5 w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] border-t border-[var(--border)] pt-3 flex items-center justify-center gap-1">
                Go practice →
              </Link>
            </div>

            {/* Alerts card */}
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-5">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                <span className="text-sm font-semibold">Stale skills</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                {!stale_skills?.length
                  ? "All skills recently practiced — great!"
                  : `${stale_skills.length} skill${stale_skills.length > 1 ? "s" : ""} need practice`}
              </p>

              <div className="h-px bg-[var(--border)] my-4" />

              <div className="flex items-center gap-2 text-red-400 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                <span className="text-sm font-semibold">Overdue</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                {!overdue_assignments?.length
                  ? "No overdue assignments — clear."
                  : `${overdue_assignments.length} assignment${overdue_assignments.length > 1 ? "s" : ""} overdue`}
              </p>
              <Link to="/assignments" className="mt-4 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Manage assignments →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;