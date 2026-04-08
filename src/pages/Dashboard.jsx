import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [weeklyPriorities, setWeeklyPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overdueAssignments, setOverdueAssignments] = useState([]);
  const [staleSkills, setStaleSkills] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [settingPriority, setSettingPriority] = useState(false);

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

      setIdeas(ideasRes.data.results ?? ideasRes.data ?? []);
      setProjects(projectsRes.data.results ?? projectsRes.data ?? []);
      setSkills(skillsRes.data.results ?? skillsRes.data ?? []);
      setStaleSkills(staleRes.data.results ?? staleRes.data ?? []);
      setOverdueAssignments(overdueRes.data.results ?? overdueRes.data ?? []);
      setWeeklyPriorities(prioritiesRes.data.results ?? prioritiesRes.data ?? []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 1. Share insights
  const handleShareInsights = async () => {
    const summary = `DevTrack Dashboard - ${new Date().toLocaleDateString()}\n` +
      `Projects: ${projects.length}\n` +
      `Skills: ${skills.length}\n` +
      `Overdue: ${overdueAssignments.length}\n` +
      `Stale skills: ${staleSkills.length}\n` +
      `Ideas: ${ideas.length}\n` +
      `Weekly priorities: ${weeklyPriorities.length}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My DevTrack Progress", text: summary });
      } catch (err) { console.log("Share cancelled"); }
    } else {
      await navigator.clipboard.writeText(summary);
      alert("Dashboard summary copied to clipboard!");
    }
  };

  // 2. Focus Mode toggle
  const toggleFocusMode = () => setFocusMode(!focusMode);

  // 3. Resume Work – uses backend /next-action/
  const handleResumeWork = async () => {
    try {
      const res = await api.get("/next-action/");
      const action = res.data;
      if (action.type === "project") {
        navigate(`/projects/${action.id}`);
      } else if (action.type === "assignment") {
        navigate(`/assignments/${action.id}`);
      } else {
        navigate("/projects"); // fallback
      }
    } catch (err) {
      console.error("Failed to get next action", err);
      navigate("/projects");
    }
  };

  // 4. Set current focus as a weekly priority
  const handleSetPriority = async () => {
    if (projects.length === 0) return;
    setSettingPriority(true);
    try {
      const focusProject = projects[0];
      await api.post("/weekly-priorities/", {
        top_three_text: `Complete ${focusProject.name}`,
        week_start: new Date().toISOString().split('T')[0],
      });
      alert("Added to weekly priorities!");
      const prioritiesRes = await api.get("/weekly-priorities/");
      setWeeklyPriorities(prioritiesRes.data.results ?? prioritiesRes.data ?? []);
    } catch (err) {
      console.error("Failed to set priority", err);
      alert("Could not set priority. Please try again.");
    } finally {
      setSettingPriority(false);
    }
  };

  if (loading) return <PageLoader />;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const getDaysAgo = (lastPracticed) => {
    if (!lastPracticed) return null;
    return Math.floor((Date.now() - new Date(lastPracticed)) / 86400000);
  };

  // Focus Mode: show only the focus card full-screen
  if (focusMode) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] z-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 p-8">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                FOCUS MODE
              </span>
              <h2 className="text-3xl font-bold mt-4 text-[var(--text-primary)]">
                {projects.length > 0 ? projects[0]?.name : "Start your first project"}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-2">
                {projects.length > 0
                  ? "Only this matters right now. Close everything else."
                  : "Create a project to focus."}
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

  // Normal dashboard view
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
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium shadow-sm transition-all flex items-center gap-1 text-white"
            >
              Focus Mode →
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Active projects</div>
            <div className="text-2xl font-bold mt-1">{projects.length}</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Skills tracked</div>
            <div className="text-2xl font-bold mt-1">{skills.length}</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">This week</div>
            <div className="text-2xl font-bold mt-1">{weeklyPriorities.length}</div>
            <div className="text-xs text-green-500 mt-1">+{Math.min(weeklyPriorities.length, 2)} from last</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-4 hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Ideas captured</div>
            <div className="text-2xl font-bold mt-1">{ideas.length}</div>
          </div>
        </div>

        {/* TODAY'S FOCUS */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Next action
              </span>
              <span className="text-xs text-[var(--text-muted)]">• Recommended</span>
            </div>
            <Link to="/weekly-planner" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1">
              Open planner <span>→</span>
            </Link>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/15 to-violet-600/15 border border-blue-500/25 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_20px_-8px_rgba(0,0,0,0.5)] hover:bg-[var(--bg-surface-hover)] transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold">
                  HIGHEST IMPACT
                </div>
                <h2 className="text-2xl font-bold mt-3 tracking-tight">
                  {projects.length > 0 ? projects[0]?.name || "Complete Top Project" : "Start your first project"}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1 max-w-xl">
                  {projects.length > 0
                    ? "Focus on this to make the biggest progress this week."
                    : "Create a project to begin tracking your development journey."}
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  {projects.length > 0 ? (
                    <button
                      onClick={handleResumeWork}
                      className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all active:scale-95 text-white"
                    >
                      Resume Work →
                    </button>
                  ) : (
                    <Link
                      to="/projects"
                      className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all active:scale-95 text-white"
                    >
                      Create Project →
                    </Link>
                  )}
                  <button
                    onClick={handleSetPriority}
                    disabled={settingPriority || projects.length === 0}
                    className="border border-[var(--border)] hover:bg-[var(--bg-surface)] px-5 py-2.5 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
                  >
                    {settingPriority ? "Adding..." : "Set as priority"}
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-right min-w-[100px]">
                <div className="text-4xl font-black text-blue-400/40">
                  {skills.length > 0 ? depthToPercent(skills[0]?.depth_level) : 0}%
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {skills.length > 0 ? skills[0]?.name : "Skill depth"}
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                  <div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${skills.length > 0 ? depthToPercent(skills[0]?.depth_level) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
              <Link to="/projects" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                View all →
              </Link>
            </div>
            <div className="space-y-2.5">
              {projects.slice(0, 2).map((project) => (
                <div key={`project-${project.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-hover)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">🚀</div>
                    <div>
                      <span className="font-medium">{project.name}</span>
                      <span className="text-[var(--text-muted)] text-xs ml-2 bg-white/5 px-1.5 py-0.5 rounded">Project</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-[var(--text-secondary)]">{project.status === "active" ? "In progress" : project.status || "Active"}</div>
                    <div className={`text-xs flex items-center gap-1 ${project.status === "active" ? "text-amber-500" : "text-green-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${project.status === "active" ? "bg-amber-500" : "bg-green-500"}`} />
                      {project.status === "active" ? "In progress" : "Active"}
                    </div>
                    <Link to={`/projects/${project.id}`} className="text-xs text-blue-400 hover:text-blue-300">Resume</Link>
                  </div>
                </div>
              ))}
              {overdueAssignments.slice(0, 2).map((assignment) => (
                <div key={`overdue-${assignment.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-hover)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">⚠️</div>
                    <div>
                      <span className="font-medium">{assignment.title}</span>
                      <span className="text-[var(--text-muted)] text-xs ml-2 bg-white/5 px-1.5 py-0.5 rounded">Assignment</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-red-400">Overdue</div>
                    <div className="text-xs text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />Urgent</div>
                    <Link to={`/assignments/${assignment.id}`} className="text-xs text-red-400 hover:text-red-300">Review →</Link>
                  </div>
                </div>
              ))}
              {staleSkills.slice(0, 1).map((skill) => (
                <div key={`stale-${skill.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-hover)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">📘</div>
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-[var(--text-muted)] text-xs ml-2 bg-white/5 px-1.5 py-0.5 rounded">Skill</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-amber-400">Stale</div>
                    <div className="text-xs text-amber-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />{getDaysAgo(skill.last_practiced)}d ago</div>
                    <Link to="/skills" className="text-xs text-blue-400 hover:text-blue-300">Practice</Link>
                  </div>
                </div>
              ))}
              {projects.length === 0 && overdueAssignments.length === 0 && staleSkills.length === 0 && (
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center text-[var(--text-muted)] text-sm">
                  No recent activity. Start by creating a project or adding a skill.
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-5 mb-6 hover:bg-[var(--bg-surface-hover)] transition-all">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Skill Depth</h3>
              <div className="mt-3 space-y-4">
                {skills.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">No skills tracked yet.</p>
                ) : (
                  skills.slice(0, 3).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="text-[var(--text-muted)]">{depthToPercent(skill.depth_level)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                        <div className="h-1.5 rounded-full" style={{ width: `${depthToPercent(skill.depth_level)}%`, backgroundColor: depthColor(skill.depth_level) }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/skills" className="mt-5 w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] border-t border-[var(--border)] pt-3 flex items-center justify-center gap-1">
                Go practice →
              </Link>
            </div>

            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-5 hover:bg-[var(--bg-surface-hover)] transition-all">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                <span className="text-sm font-semibold">Stale skills</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">{staleSkills.length === 0 ? "All skills recently practiced — great!" : `${staleSkills.length} skill${staleSkills.length > 1 ? "s" : ""} need practice`}</p>
              <div className="h-px bg-[var(--border)] my-4" />
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                <span className="text-sm font-semibold">Overdue</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">{overdueAssignments.length === 0 ? "No overdue assignments — clear." : `${overdueAssignments.length} assignment${overdueAssignments.length > 1 ? "s" : ""} overdue`}</p>
              <Link to="/assignments" className="mt-4 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">Manage assignments →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;