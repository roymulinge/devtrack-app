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

  // Fetch existing ideas
  const fetchIdeas = async () => {
    try {
      const res = await api.get("/ideas/");
      if (Array.isArray(res.data)) {
        setIdeas(res.data);
      } else {
        console.error("Unexpected data format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Create new idea
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
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  // Delete idea
  const deleteIdea = async (id) => {
    try {
      await api.delete(`/ideas/${id}/`);
      setIdeas(ideas.filter((idea) => idea.id !== id));
    } catch (err) {
      console.error("Error deleting idea:", err);
    }
  };

  if (loading) return <div>Loading ideas...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ideas</h1>

      <form onSubmit={createIdea} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Problem Statement"
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Target User"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Revenue Model"
          value={revenueModel}
          onChange={(e) => setRevenueModel(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Complexity Score"
          value={complexityScore}
          onChange={(e) => setComplexityScore(Number(e.target.value))}
          min={1}
          required
        />

        <button type="submit">Add Idea</button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {ideas.length === 0 ? (
        <p>No ideas yet.</p>
      ) : (
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id} style={{ marginBottom: "10px" }}>
              <strong>{idea.problem_statement}</strong> — Target: {idea.target_user} — Revenue: {idea.revenue_model} — Complexity: {idea.complexity_score}

              <button
                onClick={() => deleteIdea(idea.id)}
                style={{ marginLeft: "10px" }}
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