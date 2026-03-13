import { useEffect, useState } from "react";
import api from "../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/");
      const data = res.data;

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.results)) {
        setProjects(data.results);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/projects/", {
        name,
        vision,
        priority,
        status
      });

      setProjects([...projects, res.data]);

      setName("");
      setVision("");
      setPriority(1);
      setStatus("active");
    } catch (err) {
      console.error("Error creating project:", err);
      setError(JSON.stringify(err.response?.data || "Unknown error"));
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>

      <form onSubmit={createProject} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          min="1"
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit">Create Project</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong> — {project.vision} | Priority: {project.priority} | Status: {project.status}

              <button
                onClick={() => deleteProject(project.id)}
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

export default Projects;