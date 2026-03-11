import { useEffect, useState } from "react";
import api from "../api/axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [effortEstimate, setEffortEstimate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const res = await api.get("/assignments/");
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/assignments/", {
        title,
        deadline,
        effort_estimate: effortEstimate,
      });

      setAssignments([...assignments, res.data]);
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
        <input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <input
          type="number"
          placeholder="Effort estimate (hours)"
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
            <li key={assignment.id} style={{ marginBottom: "10px" }}>
              <strong>{assignment.title}</strong> | Deadline: {assignment.deadline} | Effort: {assignment.effort_estimate}h

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