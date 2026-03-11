import { useEffect, useState } from "react";
import api from "../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
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
        title,
        description,
      });

      setProjects([...projects, res.data]);
      setTitle("");
      setDescription("");
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
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create Project</button>
      </form>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} style={{ marginBottom: "10px" }}>
              <strong>{project.title}</strong> — {project.description}

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