import { useEffect, useState } from "react";
import api from "../api/axios";

// Returns days until deadline (negative = overdue)
const getDaysUntil = (deadlineStr) => {
  if (!deadlineStr) return null;
  return Math.ceil((new Date(deadlineStr) - Date.now()) / 86400000);
};

const deadlineStatus = (days) => {
  if (days === null) return null;
  if (days < 0)  return { label: `${Math.abs(days)}d overdue`,  badge: "bg-red-500/10 text-red-400 border-red-500/30",    card: "border-red-500/20 bg-red-500/[0.03]", accent: "#f87171" };
  if (days <= 3) return { label: `due in ${days}d`,             badge: "bg-amber-500/10 text-amber-400 border-amber-500/30", card: "",                                    accent: "#fbbf24" };
  return          { label: `due in ${days}d`,                   badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", card: "",                              accent: "#34d399" };
};

const Assignments = () => {
  const [assignments, setAssignments]     = useState([]);
  const [projects, setProjects]           = useState([]);
  const [title, setTitle]                 = useState("");
  const [subject, setSubject]             = useState("");
  const [projectId, setProjectId]         = useState("");
  const [deadline, setDeadline]           = useState("");
  const [effortEstimate, setEffortEstimate] = useState("");
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState("");

  const fetchData = async () => {
    try {
      const [assignRes, projRes] = await Promise.all([
        api.get("/assignments/"),
        api.get("/projects/"),
      ]);
      setAssignments(assignRes.data.results ?? assignRes.data ?? []);
      setProjects(projRes.data.results     ?? projRes.data    ?? []);
    } catch (err) {
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const createAssignment = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/assignments/", {
        title,
        subject,
        project:         projectId || null,
        deadline:        deadline  || null,
        effort_estimate: effortEstimate || null,
      });
      setAssignments([res.data, ...assignments]);
      setTitle("");
      setSubject("");
      setProjectId("");
      setDeadline("");
      setEffortEstimate("");
    } catch (err) {
      console.error("Error creating assignment:", err);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to create assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}/`);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-xs font-mono text-pink-400 tracking-widest uppercase">
          // loading assignments...
        </p>
      </div>
    );
  }

  // Sort: overdue first, then soonest deadline
  const sorted = [...assignments].sort((a, b) => {
    const da = getDaysUntil(a.deadline) ?? 9999;
    const db = getDaysUntil(b.deadline) ?? 9999;
    return da - db;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-pink-400 tracking-widest uppercase mb-1">
            // assignments
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Assignments</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track deadlines and manage your academic workload.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <p className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-5">
            + new assignment
          </p>

          <form onSubmit={createAssignment} className="space-y-4">

            {/* Title — full width */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Assignment Title
              </label>
              <input
                type="text"
                placeholder="What is the assignment?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/50 transition"
              />
            </div>

            {/* Subject + Project */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Link to Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-pink-500/50 transition"
                >
                  <option value="">No project (optional)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline + Effort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-pink-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Effort Estimate (hours)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  min="0"
                  value={effortEstimate}
                  onChange={(e) => setEffortEstimate(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/50 transition"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-pink-400 hover:bg-pink-300 disabled:bg-pink-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide"
            >
              {submitting ? "creating..." : "create assignment"}
            </button>

          </form>
        </div>

        {/* Count */}
        {assignments.length > 0 && (
          <p className="text-xs font-mono text-slate-600 mb-4">
            {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
            {sorted.filter(a => (getDaysUntil(a.deadline) ?? 1) < 0).length > 0 && (
              <span className="text-red-500 ml-2">
                · {sorted.filter(a => (getDaysUntil(a.deadline) ?? 1) < 0).length} overdue
              </span>
            )}
          </p>
        )}

        {/* Assignments list */}
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs font-mono text-slate-700 uppercase tracking-widest">
              // no assignments yet
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Add your first assignment using the form above.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {sorted.map((a) => {
              const days   = getDaysUntil(a.deadline);
              const status = deadlineStatus(days);
              const linked = projects.find((p) => p.id === a.project);

              return (
                <li
                  key={a.id}
                  className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex items-start gap-4 relative overflow-hidden ${status?.card ?? ""}`}
                >
                  {/* Top accent */}
                  {status && (
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: status.accent }}
                    />
                  )}

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] mb-1 truncate">
                      {a.title}
                    </h2>

                    {a.subject && (
                      <p className="text-xs font-mono text-slate-600 mb-3">
                        {a.subject}
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-2">
                      {status && (
                        <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${status.badge}`}>
                          {status.label}
                        </span>
                      )}
                      {a.deadline && (
                        <span className="text-xs font-mono text-slate-700">
                          {new Date(a.deadline).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      )}
                      {linked && (
                        <span className="text-xs text-slate-600">
                          · {linked.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {a.effort_estimate && (
                      <span className="text-xs font-mono text-slate-600 bg-white/[0.03] border border-[var(--border)] px-2 py-0.5 rounded-full">
                        {a.effort_estimate}h est.
                      </span>
                    )}
                    <button
                      onClick={() => deleteAssignment(a.id)}
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

export default Assignments;