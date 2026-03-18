import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";  
const PRIORITY_OPTIONS = [
  { label: "High",   value: "high",   active: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" },
  { label: "Medium", value: "medium", active: "bg-sky-500/10     border-sky-500/40     text-sky-400"     },
  { label: "Low",    value: "low",    active: "bg-amber-500/10   border-amber-500/40   text-amber-400"   },
];

const priorityStyle = (p) => {
  const map = {
    // string values
    high:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    medium: { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30"     },
    low:    { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
    // numeric values
    1:      { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    2:      { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30"     },
    3:      { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
  };
  if (p === null || p === undefined) return map.medium;
  if (typeof p === "number") return map[p] ?? map.medium;
  return map[String(p).toLowerCase()] ?? map.medium;
};

const statusDot = (status) => {
  const map = {
    active:    "bg-emerald-400",
    paused:    "bg-amber-400",
    completed: "bg-sky-400",
  };
  if (!status) return "bg-slate-600";
  return map[String(status).toLowerCase()] ?? "bg-slate-600";
};

const Projects = () => {
  const [projects, setProjects]   = useState([]);
  const [name, setName]           = useState("");
  const [vision, setVision]       = useState("");
  const [priority, setPriority]   = useState("high");
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/");
      setProjects(res.data.results ?? res.data ?? []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e) => {
  e.preventDefault();
  setError("");
  setSubmitting(true);
  try {
    const res = await api.post("/projects/", {
      name,
      vision,
      priority,
      status: "active",   // ← always start as active
    });
    setProjects([res.data, ...projects]);
    setName("");
    setVision("");
    setPriority("high");
  } catch (err) {
    console.error("Error creating project:", err);
    const data = err.response?.data;
    if (data?.name)     setError(data.name[0]);
    else if (data?.priority) setError(data.priority[0]);
    else if (data?.vision)   setError(data.vision[0]);
    else setError("Failed to create project. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-sky-400 tracking-widest uppercase mb-1">
            // projects
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage and track everything you are building.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <p className="text-xs font-mono text-sky-400 uppercase tracking-widest mb-5">
            + new project
          </p>

          <form onSubmit={createProject} className="space-y-4">

            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                placeholder="What are you building?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Vision
              </label>
              <input
                type="text"
                placeholder="What does success look like?"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
            </div>

            {/* Priority picker */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {PRIORITY_OPTIONS.map(({ label, value, active }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold border transition
                      ${priority === value
                        ? active
                        : "bg-transparent border-[var(--border)] text-slate-600 hover:border-slate-700 hover:text-[var(--text-secondary)]"
                      }`}
                  >
                    {label}
                  </button>
                ))}
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
              className="w-full bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide"
            >
              {submitting ? "creating..." : "create project"}
            </button>

          </form>
        </div>

        {/* Count */}
        {projects.length > 0 && (
          <p className="text-xs font-mono text-slate-600 mb-4">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs font-mono text-slate-700 uppercase tracking-widest">
              // no projects yet
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Create your first project using the form above.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const p = priorityStyle(project.priority);
              return (
                <li
                  key={project.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-400/50" />

                  {/* Name + priority badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] leading-snug flex-1">
                      {project.name}
                    </h2>
                    {project.priority && (
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full border shrink-0 ${p.bg} ${p.text} ${p.border}`}>
                        {project.priority}
                      </span>
                    )}
                  </div>

                  {/* Vision */}
                  {project.vision ? (
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1 mb-4">
                      {project.vision}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-700 italic flex-1 mb-4">No vision set.</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(project.status)}`} />
                      <span className="text-xs font-mono text-slate-600">
                        {project.status ?? "active"}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
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

export default Projects;