import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";

const PRIORITY_OPTIONS = [
  { label: "High",   value: "high",   active: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" },
  { label: "Medium", value: "medium", active: "bg-sky-500/10     border-sky-500/40     text-sky-400"     },
  { label: "Low",    value: "low",    active: "bg-amber-500/10   border-amber-500/40   text-amber-400"   },
];

const DEPTH_COLORS = {
  beginner:     { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
  intermediate: { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30"     },
  advanced:     { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30"  },
  expert:       { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
};

const priorityStyle = (p) => {
  const map = {
    high:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    medium: { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30"     },
    low:    { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
  };
  return map[String(p).toLowerCase()] ?? map.medium;
};

const statusDot = (status) => {
  const map = { active: "bg-emerald-400", paused: "bg-amber-400", completed: "bg-sky-400" };
  return map[String(status).toLowerCase()] ?? "bg-slate-600";
};

const Projects = () => {
  const [projects, setProjects]     = useState([]);
  const [allSkills, setAllSkills]   = useState([]);
  const [name, setName]             = useState("");
  const [vision, setVision]         = useState("");
  const [priority, setPriority]     = useState("high");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes] = await Promise.all([
        api.get("/projects/"),
        api.get("/skills/"),
      ]);
      setProjects(projectsRes.data.results ?? projectsRes.data ?? []);
      setAllSkills(skillsRes.data.results ?? skillsRes.data ?? []);
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
        name,
        vision,
        priority,
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
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage and track everything you are building.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
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
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
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
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
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

            {/* Skills picker */}
            {allSkills.length > 0 && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-2">
                  Skills used in this project
                  <span className="text-slate-700 normal-case ml-1">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => {
                    const selected = selectedSkills.includes(skill.id);
                    const d = DEPTH_COLORS[skill.depth_level] ?? DEPTH_COLORS.beginner;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-full border transition
                          ${selected
                            ? `${d.bg} ${d.text} ${d.border}`
                            : "bg-transparent border-[var(--border)] text-slate-600 hover:border-slate-700"
                          }`}
                      >
                        {selected ? "✓ " : ""}{skill.name}
                      </button>
                    );
                  })}
                </div>
                {allSkills.length === 0 && (
                  <p className="text-xs text-slate-700 italic">
                    No skills yet — add some in the Skills page first.
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
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
              Create your first project above.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const p = priorityStyle(project.priority);
              const isExpanded = expandedId === project.id;
              return (
                <li
                  key={project.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-400/50" />

                  {/* Name + priority */}
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
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                      {project.vision}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-700 italic mb-3">No vision set.</p>
                  )}

                  {/* Skills */}
                  {project.skills_detail?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1.5">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills_detail.map((skill) => {
                          const d = DEPTH_COLORS[skill.depth_level] ?? DEPTH_COLORS.beginner;
                          return (
                            <span
                              key={skill.id}
                              className={`text-xs font-mono px-2 py-0.5 rounded-full border ${d.bg} ${d.text} ${d.border}`}
                            >
                              {skill.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Progress — assignments */}
                  {project.assignments?.length > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
                          Progress
                        </p>
                        <p className="text-xs font-mono text-slate-600">
                          {project.assignments.filter(a => a.status === "completed").length}/
                          {project.assignments.length} done
                        </p>
                      </div>
                      <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.round(
                              (project.assignments.filter(a => a.status === "completed").length /
                              project.assignments.length) * 100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
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