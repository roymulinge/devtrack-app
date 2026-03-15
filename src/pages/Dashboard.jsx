import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const depthToPercent = (depth) => {
  const map = { beginner: 25, intermediate: 60, advanced: 85, expert: 100 };
  return map[depth?.toLowerCase()] ?? 40;
};

const depthColor = (depth) => {
  const map = {
    beginner: "#fbbf24",
    intermediate: "#a78bfa",
    advanced: "#38bdf8",
    expert: "#34d399",
  };
  return map[depth?.toLowerCase()] ?? "#38bdf8";
};

const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
};
const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [weeklyPriorities, setWeeklyPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overdueAssignments, setOverdueAssignments] = useState([]);
  const [staleSkills, setStaleSkills] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ideasRes = await api.get("/ideas/");
        const projectsRes = await api.get("/projects/");
        const skillsRes = await api.get("/skills/");
        const staleSkillsRes = await api.get("/skills/stale/");
        const overdueRes = await api.get("/assignments/overdue/");
        const prioritiesRes = await api.get("/weekly-priorities/");

        setIdeas(ideasRes.data.results || ideasRes.data || []);

        setProjects(projectsRes.data.results || []);

        setWeeklyPriorities(prioritiesRes.data.results || []);

        setOverdueAssignments(overdueRes.data.results || []);

        setSkills(skillsRes.data.results || skillsRes.data || []);

        setStaleSkills(staleSkillsRes.data.results || staleSkillsRes.data || []);
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

        {/* Ideas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Ideas</h2>

          {ideas.length === 0 ? (
            <p className="text-slate-400">No ideas yet.</p>
          ) : (
            <ul className="space-y-2">
              {ideas.slice(0, 5).map((idea) => (
                <li key={idea.id} className="text-slate-300">
                  {idea.problem_statement}
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

        {/* Overdue Assignments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Overdue Assignments</h2>

          {overdueAssignments.length === 0 ? (
            <p className="text-slate-400">No overdue assignments.</p>
          ) : (
            <ul className="space-y-2">
              {overdueAssignments.slice(0,5).map((a) => (
                <li key={a.id} className="text-slate-300">
                  {a.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Stale Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Stale Skills</h2>

          {staleSkills.length === 0 ? (
            <p className="text-slate-400">All skills recently practiced.</p>
          ) : (
            <ul className="space-y-2">
              {staleSkills.slice(0,5).map((skill) => (
                <li key={skill.id} className="text-slate-300">
                  {skill.name}
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