import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";

const getDaysUntil = (deadlineStr) => {
  if (!deadlineStr) return null;
  return Math.ceil((new Date(deadlineStr) - Date.now()) / 86400000);
};

const deadlineStyle = (days) => {
  if (days === null) return null;
  if (days < 0)  return { label: `${Math.abs(days)}d overdue`, badge: "bg-red-500/20 text-red-400 border-red-500/30", accent: "#f87171" };
  if (days <= 3) return { label: `due in ${days}d`,            badge: "bg-amber-500/20 text-amber-400 border-amber-500/30", accent: "#fbbf24" };
  return           { label: `due in ${days}d`,                 badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", accent: "#34d399" };
};

const STATUS_CONFIG = {
  not_started: { label: "Not Started", bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" },
  in_progress: { label: "In Progress", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  completed:   { label: "Completed",   bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
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
      // ← refetch instead of prepending res.data
    await fetchData();
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
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
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
    <div className="min-h-screen bg-[#080b10] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-gray-400 text-sm mt-1">
              Track deadlines and link your work to skills and projects.
            </p>
          </div>
          <Link to="/projects" className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-all">
            View projects
          </Link>
        </div>

        {/* Create Assignment Form */}
        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-6 mb-10 hover:bg-[#161b22] transition-all">
          <h2 className="text-md font-semibold mb-4">Add new assignment</h2>
          <form onSubmit={createAssignment} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300">Assignment title *</label>
              <input
                type="text"
                placeholder="What is the assignment?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Link to project (optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Related skill (optional)</label>
                <select
                  value={skillId}
                  onChange={(e) => setSkillId(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">No skill</option>
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95"
            >
              {submitting ? "Creating..." : "Create assignment"}
            </button>
          </form>
        </div>

        {/* Assignments count */}
        {assignments.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Your assignments</h2>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
              {assignments.length} total
              {overdueCount > 0 && (
                <span className="text-red-400 ml-1">· {overdueCount} overdue</span>
              )}
            </span>
          </div>
        )}

        {/* Assignments list */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-[#0f1217] border border-white/5">
            <p className="text-sm text-gray-500">No assignments yet.</p>
            <p className="text-xs text-gray-600 mt-1">Add your first assignment using the form above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((a) => {
              const days    = getDaysUntil(a.deadline);
              const dl      = deadlineStyle(days);
              const sc      = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.not_started;
              const linked  = projects.find((p) => p.id === a.project);
              const skill   = skills.find((s) => s.id === a.related_skill);
              const isDone  = a.status === "completed";

              return (
                <div
                  key={a.id}
                  className={`rounded-xl bg-[#0f1217] border border-white/5 p-5 relative overflow-hidden transition-all hover:bg-[#161b22] ${isDone ? "opacity-60" : ""}`}
                >
                  {/* Top accent for deadline urgency */}
                  {dl && !isDone && (
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: dl.accent }} />
                  )}

                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className={`text-base font-semibold ${isDone ? "line-through text-gray-500" : "text-white"}`}>
                          {a.title}
                        </h3>
                      </div>
                      {a.subject && (
                        <p className="text-sm text-gray-400 mt-0.5">{a.subject}</p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.label}
                        </span>
                        {dl && a.status !== "completed" && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${dl.badge}`}>
                            {dl.label}
                          </span>
                        )}
                        {linked && (
                          <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                            {linked.name}
                          </span>
                        )}
                        {skill && (
                          <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-full">
                            {skill.name}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      {!isDone && (
                        <div className="flex gap-2 mt-4">
                          {a.status === "not_started" && (
                            <button
                              onClick={() => updateStatus(a.id, "in_progress")}
                              className="text-xs text-blue-400 border border-blue-400/20 px-3 py-1 rounded-md hover:bg-blue-400/10 hover:border-blue-400/40 transition-all"
                            >
                              Start →
                            </button>
                          )}
                          {a.status === "in_progress" && (
                            <button
                              onClick={() => updateStatus(a.id, "completed")}
                              className="text-xs text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-md hover:bg-emerald-400/10 hover:border-emerald-400/40 transition-all"
                            >
                              Mark done
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteAssignment(a.id)}
                      className="text-xs text-red-400 border border-red-400/20 px-2.5 py-1 rounded-md hover:bg-red-400/10 hover:border-red-400/40 transition-all shrink-0 self-start"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;