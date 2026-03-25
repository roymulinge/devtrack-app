import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";

const getMonday = () => {
  const now    = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return monday.toISOString().split("T")[0];
};

const getWeekRange = () => {
  const monday = new Date(getMonday());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(monday)} — ${fmt(sunday)}`;
};

const getDaysUntil = (deadlineStr) => {
  if (!deadlineStr) return null;
  return Math.ceil((new Date(deadlineStr) - Date.now()) / 86400000);
};

const WeeklyPriorities = () => {
  const [focus, setFocus]               = useState(null);
  const [summary, setSummary]           = useState(null);
  const [priorities, setPriorities]     = useState([]);
  const [newPriority, setNewPriority]   = useState("");
  const [notes, setNotes]               = useState("");
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  const fetchData = async () => {
    try {
      const [focusRes, summaryRes, prioritiesRes] = await Promise.all([
        api.get("/planning/daily-focus/"),
        api.get("/planning/weekly-summary/"),
        api.get("/weekly-priorities/"),
      ]);
      setFocus(focusRes.data);
      setSummary(summaryRes.data);
      const monday = getMonday();
      const all    = prioritiesRes.data.results ?? prioritiesRes.data ?? [];
      const current = all.find((p) => p.week_start === monday);
      if (current) {
        setPriorities(
          current.top_three_text
            ? current.top_three_text.split("\n").filter(Boolean)
            : []
        );
        setNotes(current.notes ?? "");
      }
    } catch (err) {
      console.error("Error fetching planner data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const savePriority = async (e) => {
    e.preventDefault();
    if (!newPriority.trim()) return;
    const updated = [...priorities, newPriority.trim()];
    setSubmitting(true);
    setError("");
    try {
      const monday = getMonday();
      const res = await api.get("/weekly-priorities/");
      const all  = res.data.results ?? res.data ?? [];
      const current = all.find((p) => p.week_start === monday);

      if (current) {
        await api.patch(`/weekly-priorities/${current.id}/`, {
          top_three_text: updated.join("\n"),
          notes,
        });
      } else {
        await api.post("/weekly-priorities/", {
          week_start:     monday,
          top_three_text: updated.join("\n"),
          notes,
        });
      }
      setPriorities(updated);
      setNewPriority("");
    } catch (err) {
      setError("Failed to save priority.");
    } finally {
      setSubmitting(false);
    }
  };

  const removePriority = async (index) => {
    const updated = priorities.filter((_, i) => i !== index);
    try {
      const monday = getMonday();
      const res    = await api.get("/weekly-priorities/");
      const all    = res.data.results ?? res.data ?? [];
      const current = all.find((p) => p.week_start === monday);
      if (current) {
        await api.patch(`/weekly-priorities/${current.id}/`, {
          top_three_text: updated.join("\n"),
        });
      }
      setPriorities(updated);
    } catch (err) {
      console.error("Error removing priority:", err);
    }
  };

  if (loading) return <PageLoader />;

  const weekRange = getWeekRange();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Weekly Planner</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{weekRange}</p>
        </div>

        {/* Weekly Summary Bar */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Completed",      value: summary.completed_assignments,    color: "text-emerald-400", border: "border-emerald-500/20" },
              { label: "Overdue",        value: summary.overdue_assignments,       color: "text-red-400",     border: "border-red-500/20"     },
              { label: "Active Projects",value: summary.active_projects,           color: "text-sky-400",     border: "border-sky-500/20"     },
              { label: "Skills Practiced",value: summary.skills_practiced_this_week, color: "text-violet-400", border: "border-violet-500/20" },
            ].map(({ label, value, color, border }) => (
              <div key={label} className={`bg-[var(--bg-surface)] border ${border} rounded-xl p-4`}>
                <div className={`text-2xl font-bold font-mono ${color} mb-1`}>{value}</div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* This Week's Assignments */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-4">
              Assignments Due
            </p>
            {focus?.urgent_assignments?.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No urgent assignments</p>
            ) : (
              <ul className="space-y-2">
                {focus?.urgent_assignments?.map((a) => {
                  const days = a.days;
                  return (
                    <li key={a.id} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                        days < 0 ? "bg-red-400" : days <= 3 ? "bg-amber-400" : "bg-emerald-400"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 truncate">{a.title}</p>
                        <p className="text-xs font-mono mt-0.5">
                          {days === null
                            ? <span className="text-slate-600">no deadline</span>
                            : days < 0
                            ? <span className="text-red-400">{Math.abs(days)}d overdue</span>
                            : days === 0
                            ? <span className="text-red-400">due today!</span>
                            : <span className="text-amber-400">due in {days}d</span>
                          }
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link to="/assignments" className="block text-right text-xs text-sky-400 mt-3 hover:text-sky-300 transition">
              manage assignments →
            </Link>
          </div>

          {/* Skills to Practice */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
              Skills to Practice
            </p>
            {focus?.stale_skills?.length === 0 ? (
              <p className="text-xs text-slate-600 italic">All skills practiced recently</p>
            ) : (
              <ul className="space-y-2">
                {focus?.stale_skills?.map((s) => (
                  <li key={s.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">{s.name}</p>
                      <p className="text-xs font-mono text-amber-600 mt-0.5">
                        {s.days_ago === null ? "never practiced" : `${s.days_ago}d ago`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/skills" className="block text-right text-xs text-sky-400 mt-3 hover:text-sky-300 transition">
              go practice →
            </Link>
          </div>

        </div>

        {/* My Priorities */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
            My Priorities This Week
          </p>

          {/* Current priorities */}
          {priorities.length === 0 ? (
            <p className="text-xs text-slate-600 italic mb-4">No custom priorities yet — add one below.</p>
          ) : (
            <ol className="space-y-2 mb-4">
              {priorities.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-lg font-bold font-mono text-slate-800 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-slate-300 flex-1">{item}</span>
                  <button
                    onClick={() => removePriority(i)}
                    className="text-xs font-mono text-slate-700 hover:text-red-400 transition shrink-0"
                  >
                    x
                  </button>
                </li>
              ))}
            </ol>
          )}

          {/* Add priority form */}
          <form onSubmit={savePriority} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a priority for this week..."
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
            />
            <button
              type="submit"
              disabled={submitting || !newPriority.trim()}
              className="bg-indigo-400 hover:bg-indigo-300 disabled:bg-indigo-400/40 text-[#090d13] font-mono font-bold text-xs px-4 py-3 rounded-lg transition"
            >
              {submitting ? "..." : "add"}
            </button>
          </form>

          {error && (
            <p className="text-xs text-red-400 mt-2">{error}</p>
          )}
        </div>

        {/* Notes */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">
            Notes for this week
          </p>
          <textarea
            rows={3}
            placeholder="Any extra context or intention for this week..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={async () => {
              try {
                const monday  = getMonday();
                const res     = await api.get("/weekly-priorities/");
                const all     = res.data.results ?? res.data ?? [];
                const current = all.find((p) => p.week_start === monday);
                if (current) {
                  await api.patch(`/weekly-priorities/${current.id}/`, { notes });
                }
              } catch (err) {
                console.error("Error saving notes:", err);
              }
            }}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition resize-none"
          />
          <p className="text-xs text-slate-700 mt-1.5">Notes auto-save when you click away</p>
       </div>

        {/* Weekly Review */}
        <div className="mt-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Weekly Review
            </p>
            <span className="text-xs font-mono text-slate-600">last 7 days</span>
          </div>

          {summary ? (
            <>
              {/* Execution score */}
              {(() => {
                const total     = summary.completed_assignments + summary.overdue_assignments;
                const percent   = total === 0 ? 100 : Math.round((summary.completed_assignments / total) * 100);
                const scoreColor = percent >= 80 ? "text-emerald-400" : percent >= 50 ? "text-amber-400" : "text-red-400";
                const barColor   = percent >= 80 ? "bg-emerald-400" : percent >= 50 ? "bg-amber-400" : "bg-red-400";
                const label      = percent >= 80 ? "Great week" : percent >= 50 ? "Decent progress" : "Needs improvement";
                return (
                  <div className="mb-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Execution Score</p>
                      <span className={`text-xl font-bold font-mono ${scoreColor}`}>{percent}%</span>
                    </div>
                    <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600">{label}</p>
                  </div>
                );
              })()}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bg-primary)] border border-emerald-500/20 rounded-lg p-3">
                  <div className="text-xl font-bold font-mono text-emerald-400 mb-0.5">
                    {summary.completed_assignments}
                  </div>
                  <div className="text-xs text-slate-600 uppercase tracking-widest">
                    Assignments completed
                  </div>
                </div>
                <div className="bg-[var(--bg-primary)] border border-red-500/20 rounded-lg p-3">
                  <div className="text-xl font-bold font-mono text-red-400 mb-0.5">
                    {summary.overdue_assignments}
                  </div>
                  <div className="text-xs text-slate-600 uppercase tracking-widest">
                    Still overdue
                  </div>
                </div>
                <div className="bg-[var(--bg-primary)] border border-violet-500/20 rounded-lg p-3">
                  <div className="text-xl font-bold font-mono text-violet-400 mb-0.5">
                    {summary.skills_practiced_this_week}
                  </div>
                  <div className="text-xs text-slate-600 uppercase tracking-widest">
                    Skills practiced
                  </div>
                </div>
                <div className="bg-[var(--bg-primary)] border border-sky-500/20 rounded-lg p-3">
                  <div className="text-xl font-bold font-mono text-sky-400 mb-0.5">
                    {summary.active_projects}
                  </div>
                  <div className="text-xs text-slate-600 uppercase tracking-widest">
                    Active projects
                  </div>
                </div>
              </div>

              {/* Motivational message */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-700 font-mono">
                  {summary.overdue_assignments === 0
                    ? "no overdue assignments, clean slate"
                    : `${summary.overdue_assignments} assignment${summary.overdue_assignments > 1 ? "s" : ""} still pending, let's clear them`
                  }
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-600 italic">No data available yet.</p>
          )}

        </div>

      </div>
   </div>
  );
};

export default WeeklyPriorities;