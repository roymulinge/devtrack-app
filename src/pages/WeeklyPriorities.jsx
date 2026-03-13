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

  if (loading) return <div className="text-center py-10">Loading weekly priorities...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-700 mb-6">Weekly Priorities</h1>

      <form
        onSubmit={createPriority}
        className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
      >
        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="text"
          placeholder="Top 3 priorities"
          value={topThreeText}
          onChange={(e) => setTopThreeText(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Add Weekly Plan
        </button>
      </form>

      {priorities.length === 0 ? (
        <p className="text-center text-slate-500">No weekly priorities yet.</p>
      ) : (
        <ul className="space-y-4">
          {priorities.map((priority) => (
            <li
              key={priority.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold">{priority.week_start}</p>
                <p>{priority.top_three_text}</p>
                {priority.notes && <p className="text-sm text-slate-500">{priority.notes}</p>}
              </div>

              <button
                onClick={() => deletePriority(priority.id)}
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

export default WeeklyPriorities;