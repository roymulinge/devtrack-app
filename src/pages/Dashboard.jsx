import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "../Components/PageLoader";

/* ─── helpers ──────────────────────────────────────────── */
const depthToPercent = (depth) => {
  const map = { beginner: 25, intermediate: 60, advanced: 85, expert: 100 };
  return map[String(depth).toLowerCase()] ?? 40;
};

const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
};

const formattedDate = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

/* ─── sub-components ────────────────────────────────────── */

/** Animated counter that ticks up from 0 */
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const step = Math.ceil(value / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
};

/** Single stat card */
const StatCard = ({ label, value, accent, icon, link }) => (
  <Link to={link} className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0d1117] p-5 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at top left, ${accent}08, transparent 70%)` }} />
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="text-lg" aria-hidden>{icon}</span>
    </div>
    <div className="text-3xl font-bold tracking-tight text-white">
      <AnimatedNumber value={value} />
    </div>
    <div className="mt-2 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-16" style={{ backgroundColor: accent }} />
  </Link>
);

/** Focus level badge */
const FocusBadge = ({ level }) => {
  const map = {
    critical: { label: "CRITICAL", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-400" },
    high:     { label: "HIGH",     bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
    medium:   { label: "FOCUS",    bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", dot: "bg-blue-400" },
    clear:    { label: "CLEAR",    bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  };
  const cfg = map[level] ?? map.clear;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
};

/** Activity row item */
const ActivityRow = ({ icon, title, subtitle, badge, badgeColor, action, actionLink, onClick }) => (
  <div className="group flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 bg-white/5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {badge && (
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
      )}
      {action && (
        <Link
          to={actionLink}
          onClick={onClick}
          className="text-xs text-blue-400 hover:text-blue-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {action} →
        </Link>
      )}
    </div>
  </div>
);

/** Skill depth bar */
const SkillBar = ({ name, depth, lastPracticed }) => {
  const pct = depthToPercent(depth);
  const colors = { beginner: "#fbbf24", intermediate: "#38bdf8", advanced: "#a78bfa", expert: "#34d399" };
  const color = colors[depth] ?? "#38bdf8";
  const today = new Date();
  const lastDate = lastPracticed ? new Date(lastPracticed) : null;
  const daysAgo = lastDate ? Math.floor((today - lastDate) / 86400000) : null;
  const isStale = daysAgo === null || daysAgo > 7;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-300 font-medium">{name}</span>
        <div className="flex items-center gap-2">
          {isStale && <span className="text-[10px] text-amber-400 font-mono">stale</span>}
          <span className="text-[10px] text-gray-500 font-mono">{pct}%</span>
        </div>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

/** Terminal-style command block */
const TerminalBlock = ({ children }) => (
  <div className="rounded-xl border border-white/5 bg-[#0a0d12] overflow-hidden">
    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
      <span className="font-mono text-[10px] text-gray-600 ml-2">devtrack ~ dashboard</span>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

/* ─── main component ────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [settingPriority, setSettingPriority] = useState(false);
  const [priorityToast, setPriorityToast] = useState("");
  const [mounted, setMounted] = useState(false);

  const fetchDashboardData = async () => {
    setError(false);
    try {
      const res = await api.get("/core/dashboard/");
      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMounted(true), 50);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleShareInsights = async () => {
    if (!dashboard) return;
    const summary =
      `DevTrack · ${new Date().toLocaleDateString()}\n` +
      `Projects: ${dashboard.counts.projects} · Skills: ${dashboard.counts.skills}\n` +
      `Overdue: ${dashboard.overdue_assignments.length} · Ideas: ${dashboard.counts.ideas}`;
    if (navigator.share) {
      try { await navigator.share({ title: "My DevTrack Progress", text: summary }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(summary);
    }
  };

  const handleResumeWork = async () => {
    try {
      const res = await api.get("/planning/next-action/");
      const action = res.data;
      if (action.type === "project") navigate("/projects");
      else if (action.type === "assignment") navigate("/assignments");
      else navigate("/projects");
    } catch (_) { navigate("/projects"); }
  };

  const handleSetPriority = async () => {
    if (!dashboard?.active_projects?.length) return;
    setSettingPriority(true);
    try {
      const focusProject = dashboard.active_projects[0];
      const monday = new Date();
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      const weekStart = monday.toISOString().split("T")[0];

      const listRes = await api.get("/weekly-priorities/");
      const all = listRes.data.results ?? listRes.data ?? [];
      const existing = all.find((p) => p.week_start === weekStart);

      if (existing) {
        await api.post("/planning/priority-items/", {
          weekly_priority: existing.id,
          order: (existing.items?.length ?? 0) + 1,
          text: focusProject.name,
        });
      } else {
        const created = await api.post("/weekly-priorities/", { week_start: weekStart, notes: "" });
        await api.post("/planning/priority-items/", {
          weekly_priority: created.data.id,
          order: 1,
          text: focusProject.name,
        });
      }

      setPriorityToast("Added to this week's priorities ✓");
      setTimeout(() => setPriorityToast(""), 3000);
      fetchDashboardData();
    } catch (err) {
      setPriorityToast("Could not set priority");
      setTimeout(() => setPriorityToast(""), 3000);
    } finally {
      setSettingPriority(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error || !dashboard) return (
    <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center gap-4 text-gray-500">
      <div className="font-mono text-sm text-red-400">ERR: failed to fetch /core/dashboard/</div>
      <p className="text-xs text-gray-600">Server may be waking up. Retry in a moment.</p>
      <button
        onClick={() => { setLoading(true); fetchDashboardData(); }}
        className="mt-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
      >
        Retry
      </button>
    </div>
  );

  const { counts, overdue_assignments, stale_skills, active_projects, focus } = dashboard;

  /* ── focus mode overlay ── */
  if (focusMode) {
    return (
      <div className="fixed inset-0 bg-[#080b10] z-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <TerminalBlock>
            <p className="font-mono text-xs text-blue-400 mb-2">$ devtrack focus --mode=deep</p>
            <p className="font-mono text-2xl font-bold text-white mb-1">{focus?.message ?? "System nominal."}</p>
            <p className="font-mono text-xs text-gray-600 mb-6">Close everything else. This is your one thing.</p>
            <div className="flex gap-3">
              <button
                onClick={handleResumeWork}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-mono text-white transition-all"
              >
                resume_work()
              </button>
              <button
                onClick={() => setFocusMode(false)}
                className="border border-white/10 hover:bg-white/5 px-5 py-2 rounded-lg text-sm font-mono text-gray-400 transition-all"
              >
                exit()
              </button>
            </div>
          </TerminalBlock>
        </div>
        <button onClick={() => setFocusMode(false)} className="absolute top-5 right-5 text-gray-600 hover:text-white font-mono text-xs">
          [esc]
        </button>
      </div>
    );
  }

  const focusLevel = focus?.level ?? "clear";
  const focusGradients = {
    critical: "from-red-950/30 via-transparent to-transparent border-red-500/20",
    high:     "from-amber-950/30 via-transparent to-transparent border-amber-500/20",
    medium:   "from-blue-950/30 via-transparent to-transparent border-blue-500/20",
    clear:    "from-emerald-950/20 via-transparent to-transparent border-emerald-500/15",
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-white">

      {/* subtle grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* ── header ───────────────────────────────── */}
        <div
          className={`flex justify-between items-start mb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FocusBadge level={focusLevel} />
              <span className="font-mono text-[10px] text-gray-600">WK{getWeekNumber()}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">{formattedDate}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShareInsights}
              className="px-3 py-1.5 rounded-lg border border-white/8 hover:bg-white/5 text-xs font-mono text-gray-500 hover:text-gray-300 transition-all"
            >
              share
            </button>
            <button
              onClick={() => setFocusMode(true)}
              className="px-4 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-mono text-blue-400 hover:text-blue-300 transition-all"
            >
              focus_mode()
            </button>
          </div>
        </div>

        {/* ── stat cards ───────────────────────────── */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <StatCard label="Projects"   value={counts.projects}   accent="#38bdf8" icon="🚀" link="/projects" />
          <StatCard label="Skills"     value={counts.skills}     accent="#a78bfa" icon="⚡" link="/skills" />
          <StatCard label="Assignments" value={counts.assignments} accent="#fb923c" icon="📋" link="/assignments" />
          <StatCard label="Ideas"      value={counts.ideas}      accent="#34d399" icon="💡" link="/ideas" />
        </div>

        {/* ── focus block ──────────────────────────── */}
        <div
          className={`mb-8 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className={`rounded-2xl border bg-gradient-to-br ${focusGradients[focusLevel] ?? focusGradients.clear} p-6`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex-1">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  $ devtrack analyze --user=self
                </p>
                <h2 className="text-xl font-bold text-white leading-snug">
                  {focus?.message ?? "You're on track. Plan your week."}
                </h2>
                {overdue_assignments?.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1 font-mono">
                    <span className="text-red-400">{overdue_assignments.length}</span> overdue · 
                    <span className="text-amber-400 ml-1">{stale_skills?.length ?? 0}</span> stale skills
                  </p>
                )}
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <button
                    onClick={handleResumeWork}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-mono text-white transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                  >
                    resume_work()
                  </button>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={handleSetPriority}
                      disabled={settingPriority || !active_projects?.length}
                      className="px-5 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-mono text-gray-400 hover:text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {settingPriority ? "adding..." : "set_priority()"}
                    </button>
                    {priorityToast && (
                      <span className={`text-xs font-mono ${priorityToast.startsWith("Added") ? "text-emerald-400" : "text-red-400"}`}>
                        {priorityToast}
                      </span>
                    )}
                  </div>
                  <Link
                    to="/weekly-planner"
                    className="px-5 py-2 rounded-lg border border-white/8 hover:bg-white/5 text-sm font-mono text-gray-500 hover:text-gray-300 transition-all"
                  >
                    open_planner →
                  </Link>
                </div>
              </div>

              {/* mini skill radar */}
              {stale_skills?.length > 0 && (
                <div className="shrink-0 w-full md:w-56 space-y-3">
                  <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">skill_depth.json</p>
                  {stale_skills.slice(0, 3).map((s) => (
                    <SkillBar key={s.id} name={s.name} depth={s.depth_level} lastPracticed={s.last_practiced} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── main grid ───────────────────────────── */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >

          {/* activity feed — 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">activity_feed.log</p>
              <Link to="/projects" className="font-mono text-xs text-blue-400 hover:text-blue-300 transition-colors">
                view_all →
              </Link>
            </div>

            {active_projects?.slice(0, 2).map((project) => (
              <ActivityRow
                key={`proj-${project.id}`}
                icon="🚀"
                title={project.name}
                subtitle="active project"
                badge={project.status}
                badgeColor="bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                action="resume"
                actionLink="/projects"
              />
            ))}

            {overdue_assignments?.slice(0, 3).map((a) => (
              <ActivityRow
                key={`overdue-${a.id}`}
                icon="⚠️"
                title={a.title}
                subtitle={a.subject || "assignment"}
                badge="overdue"
                badgeColor="bg-red-500/15 text-red-400 border-red-500/25"
                action="review"
                actionLink="/assignments"
              />
            ))}

            {stale_skills?.slice(0, 2).map((s) => (
              <ActivityRow
                key={`skill-${s.id}`}
                icon="📘"
                title={s.name}
                subtitle={s.last_practiced ? `last practiced ${Math.floor((Date.now() - new Date(s.last_practiced)) / 86400000)}d ago` : "never practiced"}
                badge="stale"
                badgeColor="bg-amber-500/15 text-amber-400 border-amber-500/25"
                action="practice"
                actionLink="/skills"
              />
            ))}

            {!active_projects?.length && !overdue_assignments?.length && !stale_skills?.length && (
              <TerminalBlock>
                <p className="font-mono text-xs text-emerald-400">$ devtrack status</p>
                <p className="font-mono text-sm text-white mt-1">All systems clear. Start a project or add a skill.</p>
              </TerminalBlock>
            )}
          </div>

          {/* sidebar — 1 col */}
          <div className="space-y-4">

            {/* system status */}
            <TerminalBlock>
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-3">sys.status</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-400">overdue</span>
                  <span className={`font-mono text-sm font-bold ${overdue_assignments?.length ? "text-red-400" : "text-emerald-400"}`}>
                    {overdue_assignments?.length ?? 0}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-400">stale_skills</span>
                  <span className={`font-mono text-sm font-bold ${stale_skills?.length ? "text-amber-400" : "text-emerald-400"}`}>
                    {stale_skills?.length ?? 0}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-400">active_projects</span>
                  <span className="font-mono text-sm font-bold text-blue-400">
                    {active_projects?.length ?? 0}
                  </span>
                </div>
              </div>
            </TerminalBlock>

            {/* quick nav */}
            <div className="rounded-xl border border-white/5 bg-[#0d1117] p-4">
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-3">quick_nav</p>
              <div className="space-y-1">
                {[
                  { label: "projects",       link: "/projects",       color: "text-blue-400" },
                  { label: "skills",         link: "/skills",         color: "text-violet-400" },
                  { label: "assignments",    link: "/assignments",    color: "text-orange-400" },
                  { label: "ideas",          link: "/ideas",          color: "text-emerald-400" },
                  { label: "weekly_planner", link: "/weekly-planner", color: "text-pink-400" },
                ].map(({ label, link, color }) => (
                  <Link
                    key={link}
                    to={link}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <span className={`font-mono text-xs ${color} group-hover:translate-x-0.5 transition-transform`}>→</span>
                    <span className="font-mono text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* week progress */}
            <div className="rounded-xl border border-white/5 bg-[#0d1117] p-4">
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-3">week.progress</p>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => {
                  const days = ["M", "T", "W", "T", "F", "S", "S"];
                  const today = new Date().getDay();
                  const dayIndex = i === 0 ? 1 : i;
                  const isToday = dayIndex === today;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-sm transition-all ${isToday ? "bg-blue-500" : "bg-white/8"}`}
                        style={{ height: `${h}%` }}
                      />
                      <span className={`font-mono text-[9px] ${isToday ? "text-blue-400" : "text-gray-700"}`}>
                        {days[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="font-mono text-[10px] text-gray-700 mt-2">activity this week</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;