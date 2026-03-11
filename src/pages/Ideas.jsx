import { useEffect, useState } from "react";
import api from "../api/axios";

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIdeas = async () => {
    try {
      const res = await api.get("/ideas/");
      setIdeas(res.data);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const createIdea = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/ideas/", {
        title,
        description,
      });

      setIdeas([...ideas, res.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating idea:", error);
    }
  };

  const deleteIdea = async (id) => {
    try {
      await api.delete(`/ideas/${id}/`);
      setIdeas(ideas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  if (loading) {
    return <div>Loading ideas...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ideas</h1>

      <form onSubmit={createIdea} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Idea title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Idea description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Idea</button>
      </form>

      {ideas.length === 0 ? (
        <p>No ideas yet.</p>
      ) : (
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id} style={{ marginBottom: "10px" }}>
              <strong>{idea.title}</strong> — {idea.description}

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