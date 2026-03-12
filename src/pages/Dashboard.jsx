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

         // If response has "results", use that, else fallback to empty array
      setProjects(projectsRes.data.results || []);
      setSkills(skillsRes.data.results || []);
      setWeeklyPriorities(prioritiesRes.data.results || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setProjects([]);
      setSkills([]);
      setWeeklyPriorities([]);
    } finally {
      setLoading(false);
    }
  };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>DevTrack Dashboard</h1>

      <section>
        <h2>Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.title || project.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Skills</h2>
        {skills.length === 0 ? (
          <p>No skills tracked.</p>
        ) : (
          <ul>
            {skills.map((skill) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>This Week's Priorities</h2>
        {weeklyPriorities.length === 0 ? (
          <p>No priorities set.</p>
        ) : (
          <ul>
            {weeklyPriorities.map((priority) => (
              <li key={priority.id}>{priority.top_three_text}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;