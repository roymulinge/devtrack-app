import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";

const toNum = (v) => (v == null ? null : Number(v));

const getDaysUntil = (deadlineStr) => {
  if (!deadlineStr) return null;
  return Math.ceil((new Date(deadlineStr) - Date.now()) / 86400000);
};

const deadlineInfo = (days) => {
  if (days === null) return null;
  if (days < 0)  return { label: `${Math.abs(days)}d overdue`, cls: "bg-red-500/15 text-red-400 border-red-500/25",      bar: "bg-red-500",    accent: "#f87171" };
  if (days <= 3) return { label: `due in ${days}d`,            cls: "bg-amber-500/15 text-amber-400 border-amber-500/25", bar: "bg-amber-500",  accent: "#fbbf24" };
  return           { label: `due in ${days}d`,                 cls: "bg-blue-500/15 text-blue-400 border-blue-500/25",    bar: "bg-blue-500",   accent: "#38bdf8" };
};

const STATUS = {
  not_started: { label: "not_started", cls: "bg-gray-500/15 text-gray-400 border-gray-500/25" },
  in_progress: { label: "in_progress", cls: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  completed:   { label: "completed",   cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
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
  const [editingId, setEditingId]     = useState(null);
  const [editData, setEditData]       = useState({});
  const [filter, setFilter]           = useState("all");

  const fetchData = async () => {
    const [assignRes, projRes, skillsRes] = await Promise.allSettled([
      api.get("/assignments/"),
      api.get("/projects/"),
      api.get("/skills/"),
    ]);
    if (assignRes.status === "fulfilled") setAssignments(assignRes.value.data.results ?? assignRes.value.data ?? []);
    if (projRes.status === "fulfilled")   setProjects(projRes.value.data.results ?? projRes.value.data ?? []);
    if (skillsRes.status === "fulfilled") setSkills(skillsRes.value.data.results ?? skillsRes.value.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const createAssignment = async (e) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    try {
      await api.post("/assignments/", { title, subject: subject || "", project: projectId || null, related_skill: skillId || null, deadline: deadline || null, status: "not_started" });
      await fetchData();
      setTitle(""); setSubject(""); setProjectId(""); setSkillId(""); setDeadline("");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.title?.[0] ?? data?.deadline?.[0] ?? "Failed to create assignment.");
    } finally { setSubmitting(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/assignments/${id}/`, { status: newStatus });
      setAssignments((prev) => prev.map((a) => a.id === id ? res.data : a));
    } catch (err) { console.error(err); }
  };

  const deleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}/`);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) { setError("Failed to delete."); }
  };

  const startEditing = (a) => {
    setEditingId(a.id);
    setEditData({ title: a.title, subject: a.subject, project: a.project, related_skill: a.related_skill, deadline: a.deadline });
  };

  const updateAssignment = async (e, id) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    try {
      const res = await api.patch(`/assignments/${id}/`, { title: editData.title, subject: editData.subject || "", project: editData.project || null, related_skill: editData.related_skill || null, deadline: editData.deadline || null });
      setAssignments((prev) => prev.map((a) => a.id === id ? res.data : a));
      setEditingId(null); setEditData({});
    } catch (err) {
      const data = err.response?.data;
      setError(data?.title?.[0] ?? data?.deadline?.[0] ?? "Failed to update.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <PageLoader />;

  const sorted = [...assignments].sort((a, b) => {
    const da = getDaysUntil(a.deadline) ?? 9999;
    const db = getDaysUntil(b.deadline) ?? 9999;
    return da - db;
  });

  const filtered = filter === "all" ? sorted : sorted.filter(a => a.status === filter);
  const overdueCount = sorted.filter(a => (getDaysUntil(a.deadline) ?? 1) < 0 && a.status !== "completed").length;

  return (
    <div className="min-h-screen bg-[#080b10] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">devtrack / assignments</span>
              {overdueCount > 0 && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                  {overdueCount} overdue
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">track deadlines · link to projects · stay accountable</p>
          </div>
          <Link to="/projects" className="px-3 py-1.5 rounded-lg border border-white/8 hover:bg-white/5 text-xs font-mono text-gray-500 hover:text-gray-300 transition-all">
            → projects
          </Link>
        </div>

        {/* create form */}
        <div className="rounded-xl border border-white/8 bg-[#0d1117] p-6 mb-8">
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest block mb-5">assignment.create()</span>
          <form onSubmit={createAssignment} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-500 mb-1.5">title *</label>
              <input
                type="text" placeholder="What is the assignment?"
                value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full bg-black/50 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">subject</label>
                <input type="text" placeholder="e.g. Software Engineering" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black/50 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">project</label>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-black/50 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                  <option value="">none</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">related_skill</label>
                <select value={skillId} onChange={(e) => setSkillId(e.target.value)}
                  className="w-full bg-black/50 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                  <option value="">none</option>
                  {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1.5">deadline</label>
                <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-black/50 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>
            {error && <p className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full bg-blue-600/80 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-mono text-white transition-all active:scale-[0.99] border border-blue-500/30">
              {submitting ? "creating..." : "assignment.save()"}
            </button>
          </form>
        </div>

        {/* filters */}
        {assignments.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">filter:</span>
              {["all", "not_started", "in_progress", "completed"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs transition-all border ${filter === f ? "bg-white/10 border-white/15 text-white" : "bg-transparent border-white/5 text-gray-600 hover:text-gray-400 hover:border-white/8"}`}>
                  {f}
                </button>
              ))}
            </div>
            <span className="font-mono text-xs text-gray-600">{filtered.length} items</span>
          </div>
        )}

        {/* list */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#0d1117] py-16 text-center">
            <p className="font-mono text-sm text-gray-600">no assignments found</p>
            <p className="font-mono text-xs text-gray-700 mt-1">add one above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => {
              const days = getDaysUntil(a.deadline);
              const dl = deadlineInfo(days);
              const sc = STATUS[a.status] ?? STATUS.not_started;
              const isDone = a.status === "completed";
              const linked = projects.find((p) => toNum(p.id) === toNum(a.project));
              const skill  = skills.find((s) => toNum(s.id) === toNum(a.related_skill));
              const isEditing = editingId === a.id;

              return (
                <div key={a.id}
                  className={`group relative rounded-xl border bg-[#0d1117] transition-all duration-200 overflow-hidden ${isDone ? "opacity-50 border-white/5" : "border-white/5 hover:border-white/10"}`}>
                  {/* urgency accent line */}
                  {dl && !isDone && (
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: dl.accent }} />
                  )}

                  <div className="p-5">
                    {isEditing ? (
                      <form onSubmit={(e) => updateAssignment(e, a.id)} className="space-y-3">
                        <input type="text" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} required
                          className="w-full bg-black/50 border border-white/8 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={editData.subject || ""} placeholder="subject" onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                            className="w-full bg-black/50 border border-white/8 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                          <input type="datetime-local" value={editData.deadline || ""} onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                            className="w-full bg-black/50 border border-white/8 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                          <select value={editData.project || ""} onChange={(e) => setEditData({ ...editData, project: e.target.value || null })}
                            className="w-full bg-black/50 border border-white/8 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                            <option value="">no project</option>
                            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <select value={editData.related_skill || ""} onChange={(e) => setEditData({ ...editData, related_skill: e.target.value || null })}
                            className="w-full bg-black/50 border border-white/8 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                            <option value="">no skill</option>
                            {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        {error && <p className="font-mono text-xs text-red-400">{error}</p>}
                        <div className="flex gap-2">
                          <button type="submit" disabled={submitting}
                            className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white font-mono text-xs py-2 rounded-lg border border-blue-500/30 disabled:opacity-50 transition-all">
                            {submitting ? "saving..." : "save()"}
                          </button>
                          <button type="button" onClick={() => { setEditingId(null); setEditData({}); }}
                            className="flex-1 border border-white/8 text-gray-500 font-mono text-xs py-2 rounded-lg hover:bg-white/5 transition-all">
                            cancel()
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-base ${isDone ? "line-through text-gray-600" : "text-white"}`}>{a.title}</h3>
                          {a.subject && <p className="font-mono text-xs text-gray-600 mt-0.5">{a.subject}</p>}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${sc.cls}`}>{sc.label}</span>
                            {dl && !isDone && (
                              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${dl.cls}`}>{dl.label}</span>
                            )}
                            {linked && (
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-500 border-white/10">{linked.name}</span>
                            )}
                            {skill && (
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border bg-violet-500/15 text-violet-400 border-violet-500/25">{skill.name}</span>
                            )}
                          </div>
                          {!isDone && (
                            <div className="flex gap-2 mt-3">
                              {a.status === "not_started" && (
                                <button onClick={() => updateStatus(a.id, "in_progress")}
                                  className="font-mono text-xs text-blue-400 border border-blue-400/20 px-3 py-1 rounded-md hover:bg-blue-400/10 transition-all">
                                  start()
                                </button>
                              )}
                              {a.status === "in_progress" && (
                                <button onClick={() => updateStatus(a.id, "completed")}
                                  className="font-mono text-xs text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-md hover:bg-emerald-400/10 transition-all">
                                  complete()
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditing(a)}
                            className="font-mono text-xs text-gray-500 hover:text-blue-400 px-2.5 py-1 rounded-md hover:bg-blue-400/10 border border-white/8 hover:border-blue-400/20 transition-all">
                            edit
                          </button>
                          <button onClick={() => deleteAssignment(a.id)}
                            className="font-mono text-xs text-red-400/60 hover:text-red-400 px-2.5 py-1 rounded-md hover:bg-red-400/10 border border-white/8 hover:border-red-400/20 transition-all">
                            rm
                          </button>
                        </div>
                      </div>
                    )}
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