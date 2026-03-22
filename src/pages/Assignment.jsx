import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";

const getDaysUntil = (deadlineStr) => {
  if (!deadlineStr) return null;
  return Math.ceil((new Date(deadlineStr) - Date.now()) / 86400000);
};

const deadlineStyle = (days) => {
  if (days === null) return null;
  if (days < 0)  return { label: `${Math.abs(days)}d overdue`, badge: "bg-red-500/10 text-red-400 border-red-500/30",       accent: "#f87171" };
  if (days <= 3) return { label: `due in ${days}d`,            badge: "bg-amber-500/10 text-amber-400 border-amber-500/30", accent: "#fbbf24" };
  return           { label: `due in ${days}d`,                 badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", accent: "#34d399" };
};

const STATUS_CONFIG = {
  not_started: { label: "Not Started", bg: "bg-slate-500/10",   text: "text-slate-400",   border: "border-slate-500/30"   },
  in_progress: { label: "In Progress", bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30"     },
  completed:   { label: "Completed",   bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
};

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects]       = useState([]);
  const [skills, setSkills]           = useState([]);
  const [title, setTitle]             = useState("");
  const [subject, setSubject]         = useState("");
  const [projectId, setProjectId]     = useState("");
  const [skillId, setSkillId]         = useState("");
  const [deadline, setDeadline]       = useState("");
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");

  const fetchData = async () => {
    try {
      const [assignRes, projRes, skillsRes] = await Promise.all([
        api.get("/assignments/"),
        api.get("/projects/"),
        api.get("/skills/"),
      ]);
      setAssignments(assignRes.data.results ?? assignRes.data ?? []);
      setProjects(projRes.data.results      ?? projRes.data   ?? []);
      setSkills(skillsRes.data.results      ?? skillsRes.data ?? []);
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
        subject:       subject    || "",
        project:       projectId  || null,
        related_skill: skillId    || null,
        deadline:      deadline   || null,
        status:        "not_started",
      });
      setAssignments([res.data, ...assignments]);
      setTitle("");
      setSubject("");
      setProjectId("");
      setSkillId("");
      setDeadline("");
    } catch (err) {
      console.error("Error creating assignment:", err);
      const data = err.response?.data;
      if (data?.title)          setError(data.title[0]);
      else if (data?.deadline)  setError(data.deadline[0]);
      else                      setError("Failed to create assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/assignments/${id}/`, { status: newStatus });
      setAssignments(assignments.map((a) => a.id === id ? res.data : a));
    } catch (err) {
      console.error("Error updating status:", err);
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

  if (loading) return <PageLoader />;

  const sorted = [...assignments].sort((a, b) => {
    const da = getDaysUntil(a.deadline) ?? 9999;
    const db = getDaysUntil(b.deadline) ?? 9999;
    return da - db;
  });

  const overdueCount = sorted.filter(a => (getDaysUntil(a.deadline) ?? 1) < 0 && a.status !== "completed").length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Assignments</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track deadlines and link your work to skills and projects.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-5">
            + new assignment
          </p>

          <form onSubmit={createAssignment} className="space-y-4">

            {/* Title */}
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
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/50 transition"
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
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Link to Project
                  <span className="text-slate-700 normal-case ml-1">(optional)</span>
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-pink-500/50 transition"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skill + Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Related Skill
                  <span className="text-slate-700 normal-case ml-1">(optional)</span>
                </label>
                <select
                  value={skillId}
                  onChange={(e) => setSkillId(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-pink-500/50 transition"
                >
                  <option value="">No skill</option>
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-pink-500/50 transition"
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
              className="w-full bg-pink-400 hover:bg-pink-300 disabled:bg-pink-400/40 text-[#090d13] font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
            >
              {submitting ? "creating..." : "create assignment"}
            </button>

          </form>
        </div>

        {/* Count */}
        {assignments.length > 0 && (
          <p className="text-xs font-mono text-slate-600 mb-4">
            {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
            {overdueCount > 0 && (
              <span className="text-red-500 ml-2">· {overdueCount} overdue</span>
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
              const days    = getDaysUntil(a.deadline);
              const dl      = deadlineStyle(days);
              const sc      = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.not_started;
              const linked  = projects.find((p) => p.id === a.project);
              const skill   = skills.find((s) => s.id === a.related_skill);
              const isDone  = a.status === "completed";

              return (
                <li
                  key={a.id}
                  className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden transition ${isDone ? "opacity-60" : ""}`}
                >
                  {/* Top accent */}
                  {dl && (
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: dl.accent }} />
                  )}

                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">

                      {/* Title */}
                      <h2 className={`text-sm font-bold mb-1 truncate ${isDone ? "line-through text-slate-600" : "text-[var(--text-primary)]"}`}>
                        {a.title}
                      </h2>

                      {/* Subject */}
                      {a.subject && (
                        <p className="text-xs font-mono text-slate-600 mb-2">{a.subject}</p>
                      )}

                      {/* Tags row */}
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        {/* Assignment status */}
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.label}
                        </span>
                        {/* Deadline badge */}
                        {dl && a.status !== "completed" && (
                          <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${dl.badge}`}>
                            {dl.label}
                          </span>
                        )}
                        {/* Linked project */}
                        {linked && (
                          <span className="text-xs font-mono text-slate-600 bg-white/[0.03] border border-[var(--border)] px-2 py-0.5 rounded-full">
                            {linked.name}
                          </span>
                        )}
                        {/* Linked skill */}
                        {skill && (
                          <span className="text-xs font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                            {skill.name}
                          </span>
                        )}
                      </div>

                      {/* Status buttons */}
                      {!isDone && (
                        <div className="flex gap-2">
                          {a.status === "not_started" && (
                            <button
                              onClick={() => updateStatus(a.id, "in_progress")}
                              className="text-xs font-mono text-sky-400 border border-sky-400/20 px-2.5 py-1 rounded-md hover:bg-sky-400/10 transition"
                            >
                              start →
                            </button>
                          )}
                          {a.status === "in_progress" && (
                            <button
                              onClick={() => updateStatus(a.id, "completed")}
                              className="text-xs font-mono text-emerald-400 border border-emerald-400/20 px-2.5 py-1 rounded-md hover:bg-emerald-400/10 transition"
                            >
                              mark done ✓
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteAssignment(a.id)}
                      className="text-xs font-mono text-red-400 border border-red-400/20 px-2.5 py-1 rounded-md hover:bg-red-400/10 hover:border-red-400/40 transition shrink-0"
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