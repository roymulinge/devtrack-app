import { useEffect, useState } from "react";
import api from "../api/axios";

const DEPTH_CONFIG = {
  1: { label: "lvl 1", color: "#fbbf24", bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/30",  bar: "25%",  accent: "border-t-amber-400/50"  },
  2: { label: "lvl 2", color: "#38bdf8", bg: "bg-sky-500/10",    text: "text-sky-400",    border: "border-sky-500/30",    bar: "50%",  accent: "border-t-sky-400/50"    },
  3: { label: "lvl 3", color: "#a78bfa", bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30", bar: "75%",  accent: "border-t-violet-400/50" },
  4: { label: "lvl 4", color: "#34d399", bg: "bg-emerald-500/10",text: "text-emerald-400",border: "border-emerald-500/30",bar: "100%", accent: "border-t-emerald-400/50" },
};

const getDaysAgo = (dateStr) => {
  if (!dateStr) return null;
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  return days;
};

const Skills = () => {
  const [skills, setSkills]             = useState([]);
  const [name, setName]                 = useState("");
  const [category, setCategory]         = useState("");
  const [depthLevel, setDepthLevel]     = useState(2);
  const [lastPracticed, setLastPracticed] = useState("");
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results ?? [];
      setSkills(data);
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
        depth_level:    depthLevel,
        last_practiced: lastPracticed || null,
      });
      setSkills([res.data, ...skills]);
      setName("");
      setCategory("");
      setDepthLevel(2);
      setLastPracticed("");
    } catch (err) {
      console.error("Error creating skill:", err);
      setError(JSON.stringify(err.response?.data ?? "Unknown error"));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d13] flex items-center justify-center">
        <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase">
          // loading skills...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d13] text-slate-200 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-1">
            // skills
          </p>
          <h1 className="text-3xl font-bold text-slate-100">Skills</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your technical skills and depth of knowledge.
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-5">
            + new skill
          </p>

          <form onSubmit={createSkill} className="space-y-4">

            {/* Name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Django REST Framework"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#090d13] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Backend, Frontend, DevOps"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full bg-[#090d13] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
            </div>

            {/* Last Practiced */}
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1.5">
                Last Practiced
              </label>
              <input
                type="date"
                value={lastPracticed}
                onChange={(e) => setLastPracticed(e.target.value)}
                className="w-full bg-[#090d13] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-400 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            {/* Depth level picker */}
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
                Depth Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => {
                  const cfg = DEPTH_CONFIG[n];
                  const active = depthLevel === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDepthLevel(n)}
                      className={`py-2 rounded-lg text-xs font-mono font-semibold border transition flex flex-col items-center gap-0.5
                        ${active
                          ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                          : "bg-transparent border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"
                        }`}
                    >
                      <span>{n}</span>
                      <span className="text-[9px] opacity-60">
                        {["Beginner","Intermediate","Advanced","Expert"][n - 1]}
                      </span>
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
              className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide"
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
              const level = typeof skill.depth_level === "number"
                ? skill.depth_level
                : parseInt(skill.depth_level) || 1;
              const cfg     = DEPTH_CONFIG[level] ?? DEPTH_CONFIG[1];
              const daysAgo = getDaysAgo(skill.last_practiced);
              const isStale = daysAgo !== null && daysAgo > 7;

              return (
                <li
                  key={skill.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden"
                >
                  {/* Top accent line coloured by depth */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: cfg.color }}
                  />

                  {/* Name + depth badge */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h2 className="text-sm font-bold text-slate-100 leading-snug flex-1">
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
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-auto">
                    <span className={`text-xs font-mono ${isStale ? "text-amber-600" : "text-slate-700"}`}>
                      {daysAgo === null
                        ? "never practiced"
                        : daysAgo === 0
                        ? "practiced today"
                        : isStale
                        ? `stale — ${daysAgo}d ago`
                        : `${daysAgo}d ago`}
                    </span>
                    <button
                      onClick={() => deleteSkill(skill.id)}
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

export default Skills;