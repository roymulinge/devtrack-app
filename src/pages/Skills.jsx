import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";

const DEPTH_CONFIG = {
  beginner:     { label: "Beginner",     color: "#fbbf24", bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",   bar: "25%"  },
  intermediate: { label: "Intermediate", color: "#38bdf8", bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30",     bar: "50%"  },
  advanced:     { label: "Advanced",     color: "#a78bfa", bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30",  bar: "75%"  },
  expert:       { label: "Expert",       color: "#34d399", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", bar: "100%" },
};

const DEPTH_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

const getDaysAgo = (dateStr) => {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr)) / 86400000);
};

const Skills = () => {
  const [skills, setSkills]               = useState([]);
  const [name, setName]                   = useState("");
  const [category, setCategory]           = useState("");
  const [depthLevel, setDepthLevel]       = useState("beginner");
  const [lastPracticed, setLastPracticed] = useState("");
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState("");
  const [practicing, setPracticing] = useState(null);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills/");
      setSkills(res.data.results ?? res.data ?? []);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const createSkill = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/skills/", {
        name,
        category,
        depth_level:    depthLevel,       // ✅ now sends "beginner" not 2
        last_practiced: lastPracticed || null,
      });
      setSkills([res.data, ...skills]);
      setName("");
      setCategory("");
      setDepthLevel("beginner");
      setLastPracticed("");
    } catch (err) {
      console.error("Error creating skill:", err);
      const data = err.response?.data;
      if (data?.name)        setError(data.name[0]);
      else if (data?.category) setError(data.category[0]);
      else setError("Failed to create skill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}/`);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  const practiceSkill = async (id) => {
    setPracticing(id);
    try {
      const res = await api.post(`/skills/${id}/practice/`);
      setSkills(skills.map((s) => s.id === id ? res.data : s));
    } catch (err) {
      console.error("Error practicing skill:", err);
    } finally {
      setPracticing(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Skills</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track your technical skills and depth of knowledge.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-5">
            + new skill
          </p>

          <form onSubmit={createSkill} className="space-y-4">

            {/* Name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Django REST Framework"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Backend, Frontend, DevOps"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
            </div>

            {/* Last Practiced */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Last Practiced
              </label>
              <input
                type="date"
                value={lastPracticed}
                onChange={(e) => setLastPracticed(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            {/* Depth level picker */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-2">
                Depth Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DEPTH_LEVELS.map((level) => {
                  const cfg    = DEPTH_CONFIG[level];
                  const active = depthLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDepthLevel(level)}
                      className={`py-2 rounded-lg text-xs font-mono font-semibold border transition
                        ${active
                          ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                          : "bg-transparent border-[var(--border)] text-slate-600 hover:border-slate-700 hover:text-[var(--text-secondary)]"
                        }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
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
              className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-400/40 text-[#090d13] font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
            >
              {submitting ? "adding..." : "add skill"}
            </button>

          </form>
        </div>

        {/* Count */}
        {skills.length > 0 && (
          <p className="text-xs font-mono text-slate-600 mb-4">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} tracked
          </p>
        )}

        {/* Skills grid */}
        {skills.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs font-mono text-slate-700 uppercase tracking-widest">
              // no skills yet
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Add your first skill using the form above.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const cfg     = DEPTH_CONFIG[skill.depth_level] ?? DEPTH_CONFIG.beginner;
              const daysAgo = getDaysAgo(skill.last_practiced);
              const isStale = daysAgo !== null && daysAgo > 7;

              return (
                <li
                  key={skill.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: cfg.color }}
                  />

                  {/* Name + depth badge */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] leading-snug flex-1">
                      {skill.name}
                    </h2>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Category */}
                  <p className="text-xs font-mono text-slate-600 mb-3">
                    {skill.category}
                  </p>

                  {/* Depth bar */}
                  <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: cfg.bar, background: cfg.color }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
                    <span className={`text-xs font-mono ${isStale ? "text-amber-600" : "text-slate-700"}`}>
                      {daysAgo === null
                        ? "never practiced"
                        : daysAgo === 0
                        ? "practiced today"
                        : isStale
                        ? `stale — ${daysAgo}d ago`
                        : `${daysAgo}d ago`}
                    </span>
                    <div className="flex items-center gap-2">
                      {daysAgo !== 0 && (
                        <button
                          onClick={() => practiceSkill(skill.id)}
                          disabled={practicing === skill.id}
                          className="text-xs font-mono text-emerald-400 border border-emerald-400/20 px-2.5 py-1 rounded-md hover:bg-emerald-400/10 hover:border-emerald-400/40 transition disabled:opacity-40"
                        >
                          {practicing === skill.id ? "..." : "✓ practiced"}
                        </button>
                      )}
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="text-xs font-mono text-red-400 border border-red-400/20 px-2.5 py-1 rounded-md hover:bg-red-400/10 hover:border-red-400/40 transition"
                      >
                        delete
                      </button>
                    </div>
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

export default Skills;