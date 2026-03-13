import { useEffect, useState } from "react";
import api from "../api/axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);

  const [projectId, setProjectId] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [effortEstimate, setEffortEstimate] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const assignmentsRes = await api.get("/assignments/");
      const projectsRes = await api.get("/projects/");

      setAssignments(assignmentsRes.data.results || []);
      setProjects(projectsRes.data.results || []);
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/assignments/", {
        project: projectId,
        subject,
        title,
        deadline,
        effort_estimate: effortEstimate,
      });

      setAssignments([...assignments, res.data]);

      setProjectId("");
      setSubject("");
      setTitle("");
      setDeadline("");
      setEffortEstimate("");
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}/`);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assignments</h1>

      <form onSubmit={createAssignment} style={{ marginBottom: "20px" }}>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

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

      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              <strong>{assignment.title}</strong> | Effort:{" "}
              {assignment.effort_estimate}

              <button
                onClick={() => deleteAssignment(assignment.id)}
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