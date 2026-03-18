import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
// Returns week number of the year for a given date string
const getWeekNumber = (dateStr) => {
  if (!dateStr) return null;
  const date  = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7);
};

// Returns "10 Mar — 16 Mar" style range from week start
const getWeekRange = (dateStr) => {
  if (!dateStr) return "";
  const start = new Date(dateStr);
  const end   = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(start)} — ${fmt(end)}`;
};

const isCurrentWeek = (dateStr) => {
  if (!dateStr) return false;
  const start   = new Date(dateStr);
  const now     = new Date();
  const monday  = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday  = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return start >= monday && start <= sunday;
};

// Split top_three_text into individual lines for numbered display
const parsePriorities = (text) => {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(Boolean);
};

const WeeklyPriorities = () => {
  const [priorities, setPriorities]     = useState([]);
  const [weekStart, setWeekStart]       = useState("");
  const [topThreeText, setTopThreeText] = useState("");
  const [notes, setNotes]               = useState("");
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  const fetchPriorities = async () => {
    try {
      const res = await api.get("/weekly-priorities/");
      const data = res.data.results ?? res.data ?? [];
      // Sort most recent first
      const sorted = [...data].sort(
        (a, b) => new Date(b.week_start) - new Date(a.week_start)
      );
      setPriorities(sorted);
    } catch (err) {
      console.error("Error fetching priorities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPriorities(); }, []);

  const createPriority = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/weekly-priorities/", {
        week_start:     weekStart,
        top_three_text: topThreeText,
        notes:          notes || null,
      });
      setPriorities([res.data, ...priorities]);
      setWeekStart("");
      setTopThreeText("");
      setNotes("");
    } catch (err) {
      console.error("Error creating priority:", err);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to save week plan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deletePriority = async (id) => {
    try {
      await api.delete(`/weekly-priorities/${id}/`);
      setPriorities(priorities.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting priority:", err);
    }
  };

  if (loading) return <PageLoader />;
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-indigo-400 tracking-widest uppercase mb-1">
            // weekly planner
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Weekly Planner</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Set your top 3 priorities for the week and stay focused.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-5">
            + plan this week
          </p>

          <form onSubmit={createPriority} className="space-y-4">

            {/* Week start */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Week Start (Monday)
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-indigo-500/50 transition"
              />
            </div>

            {/* Top 3 textarea */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Top 3 Priorities
              </label>
              <p className="text-xs text-slate-700 mb-2">
                Write each priority on a new line. They will be numbered automatically.
              </p>
              <textarea
                rows={4}
                placeholder={`1. Complete the assignments module\n2. Practice Docker containerisation\n3. Submit database design report`}
                value={topThreeText}
                onChange={(e) => setTopThreeText(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition resize-none leading-relaxed"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Notes <span className="normal-case text-slate-700">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Any extra context or intention for this week..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-400 hover:bg-indigo-300 disabled:bg-indigo-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide"
            >
              {submitting ? "saving..." : "save week plan"}
            </button>

          </form>
        </div>

        {/* Count */}
        {priorities.length > 0 && (
          <p className="text-xs font-mono text-slate-600 mb-4">
            {priorities.length} week{priorities.length !== 1 ? "s" : ""} planned
          </p>
        )}

        {/* Priority cards */}
        {priorities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs font-mono text-slate-700 uppercase tracking-widest">
              // no plans yet
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Plan your first week using the form above.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {priorities.map((p) => {
              const current  = isCurrentWeek(p.week_start);
              const weekNum  = getWeekNumber(p.week_start);
              const range    = getWeekRange(p.week_start);
              const items    = parsePriorities(p.top_three_text);
              const weekDate = p.week_start
                ? new Date(p.week_start).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })
                : "";

              return (
                <li
                  key={p.id}
                  className={`bg-[var(--bg-surface)] rounded-xl overflow-hidden relative
                    ${current
                      ? "border border-indigo-500/25 bg-indigo-500/[0.03]"
                      : "border border-[var(--border)]"
                    }`}
                >
                  {/* Accent top line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5
                      ${current ? "bg-gradient-to-r from-indigo-400 to-violet-400" : "bg-indigo-400/30"}`}
                  />

                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold font-mono text-slate-800 leading-none">
                        {weekNum ? String(weekNum).padStart(2, "0") : "--"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">
                          Week of {weekDate}
                        </p>
                        <p className="text-xs font-mono text-slate-600 mt-0.5">
                          {range}
                        </p>
                      </div>
                    </div>
                    {current && (
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded-full">
                        current week
                      </span>
                    )}
                  </div>

                  {/* Priorities body */}
                  <div className="px-5 py-4">
                    {items.length > 0 ? (
                      <ol className="flex flex-col gap-3">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-xl font-bold font-mono text-slate-800 leading-tight w-6 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm text-slate-400 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-slate-500">{p.top_three_text}</p>
                    )}

                    {/* Notes */}
                    {p.notes && (
                      <div className="mt-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {p.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end px-5 py-3 border-t border-[var(--border)]">
                    <button
                      onClick={() => deletePriority(p.id)}
                      className="text-xs font-mono text-red-400 border border-red-400/20 px-2.5 py-1 rounded-md hover:bg-red-400/10 hover:border-red-400/40 transition"
                    >
                      delete
                    </button>
                  </div>

                </li>
              );
            })}
          </ul>
        )}

      </div>
    </div>
  );
};

export default WeeklyPriorities;