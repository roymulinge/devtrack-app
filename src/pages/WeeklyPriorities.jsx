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

const WeeklyPriorities = () => {
  const [focus, setFocus]                       = useState(null);
  const [summary, setSummary]                   = useState(null);
  const [priorities, setPriorities]             = useState([]);
  const [weeklyPriorityId, setWeeklyPriorityId] = useState(null);
  const [notes, setNotes]                       = useState("");
  const [newPriority, setNewPriority]           = useState("");
  const [loading, setLoading]                   = useState(true);
  const [submitting, setSubmitting]             = useState(false);
  const [error, setError]                       = useState("");

  const fetchData = async () => {
    const [focusRes, summaryRes, prioritiesRes] = await Promise.allSettled([
      api.get("/planning/daily-focus/"),
      api.get("/planning/weekly-summary/"),
      api.get("/weekly-priorities/"),
    ]);

    if (focusRes.status === "fulfilled")   setFocus(focusRes.value.data);
    if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);

    if (prioritiesRes.status === "fulfilled") {
      const monday  = getMonday();
      const all     = prioritiesRes.value.data.results ?? prioritiesRes.value.data ?? [];
      const current = all.find((p) => p.week_start === monday);
      if (current) {
        setWeeklyPriorityId(current.id);
        setPriorities(current.items ?? []);
        setNotes(current.notes ?? "");
      }
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const ensureWeeklyPriority = async () => {
    if (weeklyPriorityId) return weeklyPriorityId;

    const monday = getMonday();
    try {
      const res     = await api.get("/weekly-priorities/");
      const all     = res.data.results ?? res.data ?? [];
      const existing = all.find((p) => p.week_start === monday);
      if (existing) { setWeeklyPriorityId(existing.id); return existing.id; }
    } catch (_) {}

    const res = await api.post("/weekly-priorities/", { week_start: monday, notes: "" });
    setWeeklyPriorityId(res.data.id);
    return res.data.id;
  };

  const savePriority = async (e) => {
    e.preventDefault();
    if (!newPriority.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const wpId = await ensureWeeklyPriority();
      const res  = await api.post("/planning/priority-items/", {
        weekly_priority: wpId,
        order:           priorities.length + 1,
        text:            newPriority.trim(),
      });
      setPriorities((prev) => [...prev, res.data]);
      setNewPriority("");
    } catch (_) {
      setError("Failed to save priority. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const removePriority = async (itemId) => {
    try {
      await api.delete(`/planning/priority-items/${itemId}/`);
      setPriorities((prev) => prev.filter((p) => p.id !== itemId));
    } catch (err) {
      console.error("Error removing priority:", err);
    }
  };

  const saveNotes = async () => {
    if (!weeklyPriorityId) return;
    try {
      await api.patch(`/weekly-priorities/${weeklyPriorityId}/`, { notes });
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#080b10] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Weekly Planner</h1>
            <p className="text-gray-400 text-sm mt-1">{getWeekRange()}</p>
          </div>
          <Link to="/dashboard" className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-all">
            Back to Dashboard
          </Link>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl bg-[#0f1217] border border-white/5 p-4 hover:bg-[#161b22] transition-all">
              <div className="text-2xl font-bold text-red-400">{summary.overdue_assignments}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Overdue</div>
            </div>
            <div className="rounded-xl bg-[#0f1217] border border-white/5 p-4 hover:bg-[#161b22] transition-all">
              <div className="text-2xl font-bold text-blue-400">{summary.active_projects}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Active Projects</div>
            </div>
            <div className="rounded-xl bg-[#0f1217] border border-white/5 p-4 hover:bg-[#161b22] transition-all">
              <div className="text-2xl font-bold text-violet-400">{summary.skills_practiced_this_week}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Skills Practiced</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl bg-[#0f1217] border border-white/5 p-5 hover:bg-[#161b22] transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Due this week</h2>
              <Link to="/assignments" className="text-xs text-gray-400 hover:text-white">View all</Link>
            </div>
            {!focus?.urgent_assignments?.length ? (
              <p className="text-sm text-gray-500 text-center py-6">No urgent assignments 🎉</p>
            ) : (
              <div className="space-y-3">
                {focus.urgent_assignments.map((a) => {
                  const days        = a.days;
                  const urgencyClass = days < 0 ? "text-red-400" : days <= 3 ? "text-amber-400" : "text-emerald-400";
                  const dotClass     = days < 0 ? "bg-red-400"   : days <= 3 ? "bg-amber-400"   : "bg-emerald-400";
                  return (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${dotClass}`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{a.title}</p>
                        <p className={`text-xs ${urgencyClass} mt-0.5`}>
                          {days === null ? "No deadline" : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today!" : `Due in ${days}d`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#0f1217] border border-white/5 p-5 hover:bg-[#161b22] transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Skills to practice</h2>
              <Link to="/skills" className="text-xs text-gray-400 hover:text-white">Go practice</Link>
            </div>
            {!focus?.stale_skills?.length ? (
              <p className="text-sm text-gray-500 text-center py-6">All skills fresh ✨</p>
            ) : (
              <div className="space-y-3">
                {focus.stale_skills.map((s) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-amber-400 mt-0.5">
                        {s.days_ago === null ? "Never practiced" : `${s.days_ago}d ago`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-5 mb-6 hover:bg-[#161b22] transition-all">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">My priorities this week</h2>
          {priorities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No priorities set yet. Add one below.</p>
          ) : (
            <ol className="space-y-3 mb-5">
              {priorities.map((item, i) => (
                <li key={item.id} className="flex items-center gap-3 group">
                  <span className="text-lg font-bold text-gray-500 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-sm flex-1 ${item.is_done ? "line-through text-gray-500" : "text-gray-200"}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => removePriority(item.id)}
                    className="text-xs text-gray-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ol>
          )}
          <form onSubmit={savePriority} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a priority for this week..."
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !newPriority.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-sm font-medium transition-all active:scale-95"
            >
              {submitting ? "..." : "Add"}
            </button>
          </form>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>

        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-5 mb-6 hover:bg-[#161b22] transition-all">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Notes for this week</h2>
          <textarea
            rows={3}
            placeholder="Any extra context or intention for this week..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">Notes auto-save when you click away</p>
        </div>

        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-5 hover:bg-[#161b22] transition-all">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">Weekly review</h2>
          {summary ? (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-black/40 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-400">{summary.overdue_assignments}</div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <div className="text-2xl font-bold text-violet-400">{summary.skills_practiced_this_week}</div>
                  <div className="text-xs text-gray-500">Practiced</div>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{summary.active_projects}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
              </div>
              {summary.overdue_assignments === 0 ? (
                <p className="text-xs text-gray-500 text-center mt-4">✨ Clean slate – no overdue assignments!</p>
              ) : (
                <p className="text-xs text-amber-400 text-center mt-4">Alert: {summary.overdue_assignments} assignment(s) pending. Let's clear them.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Loading summary...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default WeeklyPriorities;