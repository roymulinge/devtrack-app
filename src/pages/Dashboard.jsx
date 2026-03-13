import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [weeklyPriorities, setWeeklyPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsRes = await api.get("/projects/");
        const skillsRes = await api.get("/skills/");
        const prioritiesRes = await api.get("/weekly-priorities/");

        setProjects(projectsRes.data.results || []);
        setSkills(skillsRes.data.results || []);
        setWeeklyPriorities(prioritiesRes.data.results || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">

      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>

          {projects.length === 0 ? (
            <p className="text-slate-400">No projects yet.</p>
          ) : (
            <ul className="space-y-2">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="text-slate-300">
                  {project.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>

          {skills.length === 0 ? (
            <p className="text-slate-400">No skills tracked.</p>
          ) : (
            <ul className="space-y-2">
              {skills.slice(0, 5).map((skill) => (
                <li key={skill.id} className="text-slate-300">
                  {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weekly Priorities */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Priorities</h2>

          {weeklyPriorities.length === 0 ? (
            <p className="text-slate-400">No priorities set.</p>
          ) : (
            <ul className="space-y-2">
              {weeklyPriorities.slice(0, 3).map((priority) => (
                <li key={priority.id} className="text-slate-300">
                  {priority.top_three_text}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;