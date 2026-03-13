import { useEffect, useState } from "react";
import api from "../api/axios";

const WeeklyPriorities = () => {
  const [priorities, setPriorities] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [topThreeText, setTopThreeText] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPriorities = async () => {
    try {
      const res = await api.get("/weekly-priorities/");
      setPriorities(res.data.results || []);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

  const createPriority = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/weekly-priorities/", {
        week_start: weekStart,
        top_three_text: topThreeText,
        notes,
      });

      setPriorities([...priorities, res.data]);

      setWeekStart("");
      setTopThreeText("");
      setNotes("");
    } catch (error) {
      console.error("Error creating weekly priority:", error);
    }
  };

  const deletePriority = async (id) => {
    try {
      await api.delete(`/weekly-priorities/${id}/`);
      setPriorities(priorities.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting priority:", error);
    }
  };

  if (loading) {
    return <div>Loading weekly priorities...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weekly Priorities</h1>

      <form onSubmit={createPriority} style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Top 3 priorities"
          value={topThreeText}
          onChange={(e) => setTopThreeText(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Add Weekly Plan</button>
      </form>

      {priorities.length === 0 ? (
        <p>No weekly priorities yet.</p>
      ) : (
        <ul>
          {priorities.map((priority) => (
            <li key={priority.id}>
              <strong>{priority.week_start}</strong> — {priority.top_three_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeeklyPriorities;