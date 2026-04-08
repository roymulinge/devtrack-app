import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";

const complexityColors = {
  1: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  2: { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/30"   },
  3: { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30"  },
  4: { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30"   },
  5: { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/30"     },
};

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [problemStatement, setProblemStatement] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [revenueModel, setRevenueModel] = useState("");
  const [complexityScore, setComplexityScore] = useState(3);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        target_user: targetUser,
        revenue_model: revenueModel,
        complexity_score: complexityScore,
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
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
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
    <div className="min-h-screen bg-[#080b10] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
            <p className="text-gray-400 text-sm mt-1">
              Capture, evaluate, and track your startup and product ideas.
            </p>
          </div>
          <Link to="/projects" className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-all">
            View projects
          </Link>
        </div>

        {/* Create Idea Form */}
        <div className="rounded-xl bg-[#0f1217] border border-white/5 p-6 mb-10 hover:bg-[#161b22] transition-all">
          <h2 className="text-md font-semibold mb-4">Capture new idea</h2>
          <form onSubmit={createIdea} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300">Problem statement *</label>
              <input
                type="text"
                placeholder="What problem does this solve?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
                className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Target user *</label>
                <input
                  type="text"
                  placeholder="Who is it for?"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  required
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Revenue model *</label>
                <input
                  type="text"
                  placeholder="How does it make money?"
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  required
                  className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Complexity (1-5)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = n <= complexityScore;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setComplexityScore(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "bg-violet-500/20 border border-violet-500/30 text-violet-400"
                          : "bg-transparent border border-white/10 text-gray-500 hover:bg-white/5"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <span className="text-sm text-gray-400 ml-2">/{complexityScore}5</span>
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
              {submitting ? "Adding..." : "Add idea"}
            </button>
          </form>
        </div>

        {/* Ideas count */}
        {ideas.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Captured ideas</h2>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
              {ideas.length} total
            </span>
          </div>
        )}

        {/* Ideas grid */}
        {ideas.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-[#0f1217] border border-white/5">
            <p className="text-sm text-gray-500">No ideas yet.</p>
            <p className="text-xs text-gray-600 mt-1">Add your first idea using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ideas.map((idea) => {
              const c = complexityColors[idea.complexity_score] ?? complexityColors[3];
              return (
                <div
                  key={idea.id}
                  className="rounded-xl bg-[#0f1217] border border-white/5 p-5 hover:bg-[#161b22] transition-all card-hover"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <p className="text-sm font-medium text-white leading-snug flex-1">
                      {idea.problem_statement}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                      lvl {idea.complexity_score}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 w-16 shrink-0">User</span>
                      <span className="text-sm text-gray-300">{idea.target_user}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 w-16 shrink-0">Revenue</span>
                      <span className="text-sm text-gray-300">{idea.revenue_model}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {idea.created_at
                        ? new Date(idea.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : ""}
                    </span>
                    <div className="flex gap-2">
                      {!idea.related_project ? (
                        <button
                          onClick={() => convertToProject(idea.id)}
                          disabled={converting === idea.id}
                          className="text-xs text-blue-400 border border-blue-400/20 px-2.5 py-1 rounded-md hover:bg-blue-400/10 hover:border-blue-400/40 transition-all disabled:opacity-40"
                        >
                          {converting === idea.id ? "..." : "Convert"}
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                          Converted
                        </span>
                      )}
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="text-xs text-red-400 border border-red-400/20 px-2.5 py-1 rounded-md hover:bg-red-400/10 hover:border-red-400/40 transition-all"
                      >
                        Delete
                      </button>
                    </div>
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

export default Ideas;