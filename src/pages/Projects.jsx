import { useEffect, useState } from "react";
import api from "../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects/");
      setProjects(response.data.results || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
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

    try {
      const res = await api.post("/projects/", {
        name,
        vision,
        priority,
      });

      setProjects([...projects, res.data]);
      setName("");
      setVision("");
      setPriority("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

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
        />

        <input
          type="number"
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />

        <button type="submit">Create Project</button>
      </form>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} style={{ marginBottom: "10px" }}>
              <strong>{project.name}</strong> — {project.vision}

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