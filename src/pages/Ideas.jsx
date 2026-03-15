import { useEffect, useState } from "react";
import api from "../api/axios";

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [problemStatement, setProblemStatement] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [revenueModel, setRevenueModel] = useState("");
  const [complexityScore, setComplexityScore] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIdeas = async () => {
    try {
      const res = await api.get("/ideas/");
      setIdeas(res.data.results ||res.data || []);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const createIdea = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/ideas/", {
        problem_statement: problemStatement,
        target_user: targetUser,
        revenue_model: revenueModel,
        complexity_score: complexityScore,
      });

      setIdeas([...ideas, res.data]);
      setProblemStatement("");
      setTargetUser("");
      setRevenueModel("");
      setComplexityScore(1);
    } catch (err) {
      console.error("Error creating idea:", err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Unknown error");
    }
  };

  const deleteIdea = async (id) => {
    try {
      await api.delete(`/ideas/${id}/`);
      setIdeas(ideas.filter((idea) => idea.id !== id));
    } catch (err) {
      console.error("Error deleting idea:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading ideas...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-700 mb-6">Ideas</h1>

      <form
        onSubmit={createIdea}
        className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
      >
        <input
          type="text"
          placeholder="Problem Statement"
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="text"
          placeholder="Target User"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="text"
          placeholder="Revenue Model"
          value={revenueModel}
          onChange={(e) => setRevenueModel(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="number"
          placeholder="Complexity Score"
          value={complexityScore}
          onChange={(e) => setComplexityScore(Number(e.target.value))}
          min={1}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Add Idea
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {ideas.length === 0 ? (
        <p className="text-center text-slate-500">No ideas yet.</p>
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold">{idea.problem_statement}</p>
                <p className="text-sm text-slate-500">
                  Target: {idea.target_user} | Revenue: {idea.revenue_model} | Complexity: {idea.complexity_score}
                </p>
              </div>
              <button
                onClick={() => deleteIdea(idea.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ideas;