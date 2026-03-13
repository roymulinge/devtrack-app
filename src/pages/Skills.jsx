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
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSkills(data);
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
        name,
        category,
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

  if (loading) return <div className="text-center py-10">Loading skills...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-700 mb-6">Skills</h1>

      <form
        onSubmit={createSkill}
        className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
      >
        <input
          type="text"
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="number"
          placeholder="Depth level"
          value={depthLevel}
          onChange={(e) => setDepthLevel(Number(e.target.value))}
          min={1}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="date"
          value={lastPracticed}
          onChange={(e) => setLastPracticed(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Add Skill
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {skills.length === 0 ? (
        <p className="text-center text-slate-500">No skills yet.</p>
      ) : (
        <ul className="space-y-4">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold">{skill.name}</p>
                <p>{skill.category} — Depth: {skill.depth_level}</p>
                {skill.last_practiced && (
                  <p className="text-sm text-slate-500">
                    Last practiced: {skill.last_practiced}
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteSkill(skill.id)}
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

export default Skills;