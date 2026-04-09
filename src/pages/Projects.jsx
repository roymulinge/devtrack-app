import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";

const PRIORITY_OPTIONS = [
  { label: "High",   value: "high",   active: "bg-red-500/20 text-red-400 border-red-500/30"     },
  { label: "Medium", value: "medium", active: "bg-blue-500/20 text-blue-400 border-blue-500/30"   },
  { label: "Low",    value: "low",    active: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
];

const STATUS_OPTIONS = [
  { label: "Active",    value: "active"    },
  { label: "Paused",    value: "paused"    },
  { label: "Completed", value: "completed" },
];

const DEPTH_COLORS = {
  beginner:     { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"  },
  intermediate: { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30"   },
  advanced:     { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30" },
  expert:       { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30"},
};

const priorityStyle = (p) => {
  const map = {
    high:   { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500/30"    },
    medium: { bg: "bg-blue-500/20",   text: "text-blue-400",   border: "border-blue-500/30"   },
    low:    { bg: "bg-amber-500/20",  text: "text-amber-400",  border: "border-amber-500/30"  },
  };
  return map[String(p).toLowerCase()] ?? map.medium;
};

const statusBadge = (status) => {
  const map = {
    active:    { label: "Active",    bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
    paused:    { label: "Paused",    bg: "bg-amber-500/20",   text: "text-amber-400",   dot: "bg-amber-400"   },
    completed: { label: "Completed", bg: "bg-blue-500/20",    text: "text-blue-400",    dot: "bg-blue-400"    },
  };
  return map[String(status).toLowerCase()] ?? { label: "Active", bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" };
};

const Projects = () => {
  const [projects, setProjects]         = useState([]);
  const [allSkills, setAllSkills]       = useState([]);
  const [name, setName]                 = useState("");
  const [vision, setVision]             = useState("");
  const [priority, setPriority]         = useState("high");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  // Edit state
  const [editingId, setEditingId]   = useState(null);
  const [editData, setEditData]     = useState({});
  const [editSaving, setEditSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes] = await Promise.all([
        api.get("/projects/"),
        api.get("/skills/"),
      ]);
      setProjects(projectsRes.data.results ?? projectsRes.data ?? []);
      setAllSkills(skillsRes.data.results  ?? skillsRes.data  ?? []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleSkill = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/projects/", {
        name, vision, priority,
        status: "active",
        skills: selectedSkills,
      });
      setProjects([res.data, ...projects]);
      setName("");
      setVision("");
      setPriority("high");
      setSelectedSkills([]);
    } catch (err) {
      const data = err.response?.data;
      if (data?.name)          setError(data.name[0]);
      else if (data?.priority) setError(data.priority[0]);
      else                     setError("Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // Pre-populates edit form with current project values
  const startEdit = (project) => {
    setEditingId(project.id);
    setEditData({
      name:     project.name,
      vision:   project.vision   ?? "",
      priority: project.priority ?? "medium",
      status:   project.status   ?? "active",
      skills:   project.skills   ?? [],
      // skills is array of IDs — backend skills field accepts IDs for writing
    });
  };

  // PATCHes only the changed fields — PATCH not PUT
  const saveEdit = async (id) => {
    setEditSaving(true);
    try {
      const res = await api.patch(`/projects/${id}/`, editData);
      setProjects(projects.map((p) => p.id === id ? res.data : p));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error("Error updating project:", err);
    } finally {
      setEditSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#080b10] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-gray-400 text-sm mt-1">Control panel for your builds — track, resume, complete.</p>
          </div>
          <Link to="/skills" className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-all">
            Manage skills
          </Link>
        </div>

        {/* Create Project Form */}
        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-6 mb-10 hover:bg-[#161b22] transition-all">
          <h2 className="text-md font-semibold mb-4">Quick project setup</h2>
          <form onSubmit={createProject} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Project name *</label>
                <input
                  type="text"
                  placeholder="What are you building?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Vision</label>
                <input
                  type="text"
                  placeholder="What does success look like?"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Priority</label>
                <div className="flex gap-2 mt-1">
                  {PRIORITY_OPTIONS.map(({ label, value, active }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPriority(value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        priority === value
                          ? active
                          : "bg-transparent border border-white/10 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95"
                >
                  {submitting ? "Creating..." : "Create project"}
                </button>
              </div>
            </div>

            {allSkills.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Skills used <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allSkills.map((skill) => {
                    const selected = selectedSkills.includes(skill.id);
                    const d = DEPTH_COLORS[skill.depth_level] ?? DEPTH_COLORS.beginner;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${
                          selected
                            ? `${d.bg} ${d.text} ${d.border}`
                            : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
            )}
          </form>
        </div>

        {projects.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Active projects</h2>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{projects.length} total</span>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-[#0f1217] border border-white/5">
            <p className="text-sm text-gray-500">No projects yet.</p>
            <p className="text-xs text-gray-600 mt-1">Create your first project above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => {
              const p          = priorityStyle(project.priority);
              const status     = statusBadge(project.status);
              const total      = project.assignments?.length || 0;
              const completed  = project.assignments?.filter(a => a.status === "completed").length || 0;
              const progress   = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isEditing  = editingId === project.id;

              return (
                <div key={project.id} className="rounded-xl bg-[#0f1217] border border-white/5 p-5 hover:bg-[#161b22] transition-all">

                  {isEditing ? (
                    // ── EDIT MODE ─────────────────────────────────────
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Project name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Vision</label>
                        <input
                          type="text"
                          value={editData.vision}
                          onChange={(e) => setEditData({ ...editData, vision: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                        <div className="flex gap-1.5">
                          {PRIORITY_OPTIONS.map(({ label, value, active }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setEditData({ ...editData, priority: value })}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                editData.priority === value
                                  ? active
                                  : "bg-transparent border border-white/10 text-gray-400 hover:bg-white/5"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Status</label>
                        <div className="flex gap-1.5">
                          {STATUS_OPTIONS.map(({ label, value }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setEditData({ ...editData, status: value })}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                editData.status === value
                                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                                  : "bg-transparent border border-white/10 text-gray-400 hover:bg-white/5"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => saveEdit(project.id)}
                          disabled={editSaving}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs py-2 rounded-lg transition-all"
                        >
                          {editSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 border border-white/10 text-gray-400 text-xs py-2 rounded-lg hover:bg-white/5 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                  ) : (
                    // ── VIEW MODE ─────────────────────────────────────
                    <>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base">{project.name}</h3>
                          {project.vision && (
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{project.vision}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border}`}>
                            {project.priority}
                          </span>
                          <span className={`text-xs flex items-center gap-1 ${status.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {total > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{completed}/{total} tasks</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}

                      {project.skills_detail?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.skills_detail.slice(0, 3).map((skill) => {
                            const d = DEPTH_COLORS[skill.depth_level] ?? DEPTH_COLORS.beginner;
                            return (
                              <span key={skill.id} className={`text-xs px-2 py-0.5 rounded-full border ${d.bg} ${d.text} ${d.border}`}>
                                {skill.name}
                              </span>
                            );
                          })}
                          {project.skills_detail.length > 3 && (
                            <span className="text-xs text-gray-500">+{project.skills_detail.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                        <button
                          onClick={() => startEdit(project)}
                          className="text-xs text-gray-400 border border-white/10 px-2.5 py-1 rounded-md hover:bg-white/5 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;