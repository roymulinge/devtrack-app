import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
const complexityColors = {
  1: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  2: { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/20"     },
  3: { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20"  },
  4: { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20"   },
  5: { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/20"     },
};

const Ideas = () => {
  const [ideas, setIdeas]                   = useState([]);
  const [problemStatement, setProblemStatement] = useState("");
  const [targetUser, setTargetUser]         = useState("");
  const [revenueModel, setRevenueModel]     = useState("");
  const [complexityScore, setComplexityScore] = useState(3);
  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(null);                 

  const fetchIdeas = async () => {
    try {
      const res = await api.get("/ideas/");
      setIdeas(res.data.results ?? res.data ?? []);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIdeas(); }, []);

  const createIdea = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/ideas/", {
        problem_statement: problemStatement,
        target_user:       targetUser,
        revenue_model:     revenueModel,
        complexity_score:  complexityScore,
      });
      setIdeas([res.data, ...ideas]);
      setProblemStatement("");
      setTargetUser("");
      setRevenueModel("");
      setComplexityScore(3);
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteIdea = async (id) => {
    try {
      await api.delete(`/ideas/${id}/`);
      setIdeas(ideas.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting idea:", err);
    }
  };

  const convertToProject = async (id) => {
    setConverting(id);
    try {
      await api.post(`/ideas/${id}/convert/`);
      // Update idea status locally
      setIdeas(ideas.map((i) =>
        i.id === id ? { ...i, status: "in_progress", related_project: true } : i
      ));
    } catch (err) {
      const msg = err.response?.data?.error ?? "Failed to convert idea.";
      alert(msg);
    } finally {
      setConverting(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Ideas</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Capture, evaluate, and track your startup and product ideas.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
          <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-5">
            + new idea
          </p>

          <form onSubmit={createIdea} className="space-y-4">

            {/* Problem Statement — full width */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                Problem Statement
              </label>
              <input
                type="text"
                placeholder="What problem does this solve?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition"
              />
            </div>

            {/* Target User + Revenue Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Target User
                </label>
                <input
                  type="text"
                  placeholder="Who is it for?"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Revenue Model
                </label>
                <input
                  type="text"
                  placeholder="How does it make money?"
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition"
                />
              </div>
            </div>

            {/* Complexity dot picker */}
            <div>
              <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-2">
                Complexity
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = n <= complexityScore;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setComplexityScore(n)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold border transition
                        ${active
                          ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
                          : "bg-transparent border-[var(--border)] text-slate-700 hover:border-slate-600"
                        }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <span className="text-xs font-mono text-slate-600 ml-1">
                  {complexityScore} / 5
                </span>
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
              className="w-full bg-violet-500 hover:bg-violet-400 disabled:bg-violet-500/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide"
            >
              {submitting ? "adding..." : "add idea"}
            </button>

          </form>
        </div>

        {/* Count */}
        {ideas.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-slate-600">
              {ideas.length} idea{ideas.length !== 1 ? "s" : ""} captured
            </p>
          </div>
        )}

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs font-mono text-slate-700 uppercase tracking-widest">
              // no ideas yet
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Add your first idea using the form above.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ideas.map((idea) => {
              const c = complexityColors[idea.complexity_score] ?? complexityColors[3];
              return (
                <li
                  key={idea.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500/50" />

                  {/* Problem + complexity badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <p className="text-sm font-semibold text-slate-200 leading-snug flex-1">
                      {idea.problem_statement}
                    </p>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                      lvl {idea.complexity_score}
                    </span>
                  </div>

                  {/* Meta rows */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-700 uppercase tracking-widest font-semibold w-14 shrink-0">
                        User
                      </span>
                      <span className="text-xs text-slate-400">{idea.target_user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-700 uppercase tracking-widest font-semibold w-14 shrink-0">
                        Revenue
                      </span>
                      <span className="text-xs text-slate-400">{idea.revenue_model}</span>
                    </div>
                  </div>

                  {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
                      <span className="text-xs font-mono text-slate-700">
                        {idea.created_at
                          ? new Date(idea.created_at).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : ""}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Convert to project button — hidden if already converted */}
                        {!idea.related_project && (
                          <button
                            onClick={() => convertToProject(idea.id)}
                            disabled={converting === idea.id}
                            className="text-xs font-mono text-violet-400 border border-violet-400/20 px-2.5 py-1 rounded-md hover:bg-violet-400/10 hover:border-violet-400/40 transition disabled:opacity-40"
                          >
                            {converting === idea.id ? "..." : "→ project"}
                          </button>
                        )}
                        {/* Already converted badge */}
                        {idea.related_project && (
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                            ✓ converted
                          </span>
                        )}
                        <button
                          onClick={() => deleteIdea(idea.id)}
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

export default Ideas;