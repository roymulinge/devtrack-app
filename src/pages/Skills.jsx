import { useEffect, useState } from "react";
import api from "../api/axios";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [depthLevel, setDepthLevel] = useState(1);
  const [lastPracticed, setLastPracticed] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills/");
      const data = res.data;

      if (Array.isArray(data)) {
        setSkills(data);
      } else if (Array.isArray(data.results)) {
        setSkills(data.results);
      } else {
        console.error("Unexpected API response:", data);
        setSkills([]);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const createSkill = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/skills/", {
        name: name,
        category: category,
        depth_level: depthLevel,
        last_practiced: lastPracticed || null,
      });

      setSkills([...skills, res.data]);

      setName("");
      setCategory("");
      setDepthLevel(1);
      setLastPracticed("");
    } catch (err) {
      console.error("Error creating skill:", err);
      setError(JSON.stringify(err.response?.data || "Unknown error"));
    }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}/`);
      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  if (loading) {
    return <div>Loading skills...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Skills</h1>

      <form onSubmit={createSkill} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Depth level"
          value={depthLevel}
          onChange={(e) => setDepthLevel(Number(e.target.value))}
          min="1"
          required
        />

        <input
          type="date"
          value={lastPracticed}
          onChange={(e) => setLastPracticed(e.target.value)}
        />

        <button type="submit">Add Skill</button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {skills.length === 0 ? (
        <p>No skills yet.</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id} style={{ marginBottom: "10px" }}>
              <strong>{skill.name}</strong> — {skill.category} — Depth: {skill.depth_level}
              {skill.last_practiced && ` — Last practiced: ${skill.last_practiced}`}

              <button
                onClick={() => deleteSkill(skill.id)}
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

export default Skills;