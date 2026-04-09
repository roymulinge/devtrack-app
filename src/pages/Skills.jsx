import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";

const DEPTH_CONFIG = {
  beginner:     { label: "Beginner",     color: "#fbbf24", bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",  bar: "25%"  },
  intermediate: { label: "Intermediate", color: "#38bdf8", bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30",   bar: "50%"  },
  advanced:     { label: "Advanced",     color: "#a78bfa", bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30", bar: "75%"  },
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
  const [practicing, setPracticing]       = useState(null);

  // Edit state — editingId tracks which card is open for editing
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});
  const [editSaving, setEditSaving] = useState(false);

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
        depth_level:    depthLevel,
        last_practiced: lastPracticed || null,
      });
      setSkills([res.data, ...skills]);
      setName("");
      setCategory("");
      setDepthLevel("beginner");
      setLastPracticed("");
    } catch (err) {
      const data = err.response?.data;
      if (data?.name)          setError(data.name[0]);
      else if (data?.category) setError(data.category[0]);
      else                     setError("Failed to create skill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
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
      // Replace old skill object with updated one from backend
      setSkills(skills.map((s) => s.id === id ? res.data : s));
    } catch (err) {
      console.error("Error practicing skill:", err);
    } finally {
      setPracticing(null);
    }
  };

  // Opens edit mode — pre-populates editData with current skill values
  const startEdit = (skill) => {
    setEditingId(skill.id);
    setEditData({
      name:          skill.name,
      category:      skill.category,
      depth_level:   skill.depth_level,
      notes:         skill.notes ?? "",
    });
  };

  // Sends PATCH request with only the changed fields
  const saveEdit = async (id) => {
    setEditSaving(true);
    try {
      const res = await api.patch(`/skills/${id}/`, editData);
      // Swap old skill with updated response in state — no full refetch needed
      setSkills(skills.map((s) => s.id === id ? res.data : s));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error("Error updating skill:", err);
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
            <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
            <p className="text-gray-400 text-sm mt-1">Track your technical skills and depth of knowledge.</p>
          </div>
          <Link to="/projects" className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-all">
            View projects
          </Link>
        </div>

        {/* Create Skill Form */}
        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-6 mb-10 hover:bg-[#161b22] transition-all">
          <h2 className="text-md font-semibold mb-4">Add new skill</h2>
          <form onSubmit={createSkill} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Skill name *</label>
                <input
                  type="text"
                  placeholder="e.g. Django REST Framework"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Backend, Frontend, DevOps"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Last practiced</label>
                <input
                  type="date"
                  value={lastPracticed}
                  onChange={(e) => setLastPracticed(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Depth level</label>
                <div className="flex gap-2">
                  {DEPTH_LEVELS.map((level) => {
                    const cfg    = DEPTH_CONFIG[level];
                    const active = depthLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDepthLevel(level)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? `${cfg.bg} border ${cfg.border} ${cfg.text}`
                            : "bg-transparent border border-white/10 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95"
            >
              {submitting ? "Adding..." : "Add skill"}
            </button>
          </form>
        </div>

        {/* Skills count */}
        {skills.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Tracked skills</h2>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{skills.length} total</span>
          </div>
        )}

        {/* Skills grid */}
        {skills.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-[#0f1217] border border-white/5">
            <p className="text-sm text-gray-500">No skills yet.</p>
            <p className="text-xs text-gray-600 mt-1">Add your first skill using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skills.map((skill) => {
              const cfg       = DEPTH_CONFIG[skill.depth_level] ?? DEPTH_CONFIG.beginner;
              const daysAgo   = getDaysAgo(skill.last_practiced);
              const isStale   = daysAgo !== null && daysAgo > 7;
              const isEditing = editingId === skill.id;

              return (
                <div key={skill.id} className="rounded-xl bg-[#0f1217] border border-white/5 p-5 hover:bg-[#161b22] transition-all">

                  {isEditing ? (
                    // ── EDIT MODE ──────────────────────────────────────
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Skill name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Category</label>
                        <input
                          type="text"
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Depth level</label>
                        <div className="flex gap-1.5">
                          {DEPTH_LEVELS.map((level) => {
                            const c      = DEPTH_CONFIG[level];
                            const active = editData.depth_level === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setEditData({ ...editData, depth_level: level })}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  active
                                    ? `${c.bg} border ${c.border} ${c.text}`
                                    : "bg-transparent border border-white/10 text-gray-400 hover:bg-white/5"
                                }`}
                              >
                                {c.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                        <textarea
                          rows={2}
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          placeholder="Any notes about this skill..."
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      {/* Save / Cancel buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => saveEdit(skill.id)}
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
                    // ── VIEW MODE ──────────────────────────────────────
                    <>
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h3 className="font-semibold text-base">{skill.name}</h3>
                          <p className="text-gray-400 text-xs mt-0.5">{skill.category}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Depth bar */}
                      <div className="mt-3">
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: cfg.bar, backgroundColor: cfg.color }}
                          />
                        </div>
                      </div>

                      {/* Notes preview */}
                      {skill.notes && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-1">{skill.notes}</p>
                      )}

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className={`text-xs ${isStale ? "text-amber-400" : "text-gray-400"}`}>
                          {daysAgo === null
                            ? "Never practiced"
                            : daysAgo === 0
                            ? "Practiced today"
                            : isStale
                            ? `Stale — ${daysAgo}d ago`
                            : `${daysAgo}d ago`}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(skill)}
                            className="text-xs text-gray-400 border border-white/10 px-2.5 py-1 rounded-md hover:bg-white/5 transition-all"
                          >
                            Edit
                          </button>
                          {daysAgo !== 0 && (
                            <button
                              onClick={() => practiceSkill(skill.id)}
                              disabled={practicing === skill.id}
                              className="text-xs text-blue-400 border border-blue-400/20 px-2.5 py-1 rounded-md hover:bg-blue-400/10 transition-all disabled:opacity-40"
                            >
                              {practicing === skill.id ? "..." : "Practice"}
                            </button>
                          )}
                          <button
                            onClick={() => deleteSkill(skill.id)}
                            className="text-xs text-red-400 border border-red-400/20 px-2.5 py-1 rounded-md hover:bg-red-400/10 transition-all"
                          >
                            Delete
                          </button>
                        </div>
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

export default Skills;