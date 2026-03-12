import { useEffect, useState } from "react";
import api from "../api/axios";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);

 const fetchSkills = async () => {
  try {
    const response = await api.get("/skills/");
    // Use results array if it exists
    setSkills(response.data.results || []);
  } catch (error) {
    console.error("Error fetching skills:", error);
    setSkills([]);
  }
};

  useEffect(() => {
    fetchSkills();
  }, []);

  const createSkill = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/skills/", {
        name,
        level,
      });

      setSkills([...skills, res.data]);
      setName("");
      setLevel("");
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}/`);
      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
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
          placeholder="Skill level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <button type="submit">Add Skill</button>
      </form>

      {skills.length === 0 ? (
        <p>No skills yet.</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id} style={{ marginBottom: "10px" }}>
              <strong>{skill.name}</strong> — {skill.level}

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