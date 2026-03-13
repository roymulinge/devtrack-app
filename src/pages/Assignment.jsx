import { useEffect, useState } from "react";
import api from "../api/axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [project, setProject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [effortEstimate, setEffortEstimate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      const res = await api.get("/assignments/");
      const data = res.data;

      if (Array.isArray(data)) {
        setAssignments(data);
      } else if (Array.isArray(data.results)) {
        setAssignments(data.results);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/");
      const data = res.data;

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.results)) {
        setProjects(data.results);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchProjects();
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/assignments/", {
        title,
        subject,
        project,
        deadline,
        effort_estimate: effortEstimate
      });

      setAssignments([...assignments, res.data]);

      setTitle("");
      setSubject("");
      setProject("");
      setDeadline("");
      setEffortEstimate("");
    } catch (err) {
      console.error("Error creating assignment:", err);
      setError(JSON.stringify(err.response?.data || "Unknown error"));
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}/`);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assignments</h1>

      <form onSubmit={createAssignment} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <select value={project} onChange={(e) => setProject(e.target.value)} required>
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <input
          type="number"
          placeholder="Effort estimate"
          value={effortEstimate}
          onChange={(e) => setEffortEstimate(e.target.value)}
        />

        <button type="submit">Create Assignment</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        <ul>
          {assignments.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> | Subject: {a.subject} | Deadline: {a.deadline} | Effort: {a.effort_estimate}

              <button
                onClick={() => deleteAssignment(a.id)}
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

export default Assignments;