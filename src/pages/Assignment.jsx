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
    return <div className="text-center py-10">Loading assignments...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-700 mb-6">Assignments</h1>

      <form
        onSubmit={createAssignment}
        className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
      >
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
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
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="number"
          placeholder="Effort Estimate (hours)"
          value={effortEstimate}
          onChange={(e) => setEffortEstimate(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Create Assignment
        </button>
      </form>

      {assignments.length === 0 ? (
        <p className="text-center text-slate-500">No assignments yet.</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((assignment) => (
            <li
              key={assignment.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold">{assignment.title}</p>
                <p className="text-sm text-slate-500">
                  Effort: {assignment.effort_estimate}h
                </p>
              </div>

              <button
                onClick={() => deleteAssignment(assignment.id)}
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

export default Assignments;