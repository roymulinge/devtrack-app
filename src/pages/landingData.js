// Landing page constants and data

export const FEATURES = [
  {
    icon: "▣",
    title: "Unified Dashboard",
    desc: "Projects, skills, and deadlines in one place. Know what needs your attention right now.",
  },
  {
    icon: "◎",
    title: "Progress Tracking",
    desc: "Measure real improvement over time. Completion rates, skill depth, and streak history.",
  },
  {
    icon: "◈",
    title: "Smart Idea Capture",
    desc: "Never lose a startup idea. Add market size, complexity, and revenue model — then convert it to a project.",
  },
  {
    icon: "◬",
    title: "Weekly Focus",
    desc: "Set your top priorities each week. DevTrack links them to your active goals and upcoming deadlines.",
  },
];

export const PROBLEMS = [
  "Disconnected tools for notes, tasks, and code",
  "Learning not linked to real projects you're building",
  "Assignments and side projects competing for attention",
  "Ideas lost without a structured capture system",
  "No unified view of your progress or priorities",
];

export const SOLUTIONS = [
  "One dashboard with all activities linked together",
  "Skills tied directly to the projects you build",
  "Deadline tracking with live overdue alerts",
  "Structured idea vault with evaluation fields",
  "Weekly priority generator for focused execution",
];

export const MOCK_STATS = [
  { label: "Active projects", value: "4" },
  { label: "Skills tracked", value: "12" },
  { label: "This week", value: "3 tasks" },
  { label: "Ideas captured", value: "7" },
];

export const MOCK_ACTIVITY = [
  { type: "skill", text: "Django REST Framework", level: "Level 4", color: "bg-blue-500" },
  { type: "project", text: "DevTrack Backend", status: "Active", color: "bg-emerald-500" },
  { type: "idea", text: "School Fee SaaS", complexity: "lvl 3", color: "bg-violet-500" },
  { type: "assignment", text: "API documentation", due: "Tomorrow", color: "bg-amber-500" },
];

export const MOCK_SKILLS = [
  { name: "Django", pct: 80, color: "bg-blue-500" },
  { name: "React", pct: 65, color: "bg-violet-500" },
  { name: "PostgreSQL", pct: 50, color: "bg-emerald-500" },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Track your work", desc: "Log projects, skills, ideas, and assignments in one place." },
  { step: "02", title: "DevTrack connects everything", desc: "The system links your activities to surface real relationships and gaps." },
  { step: "03", title: "You get clarity", desc: "See what needs attention, what's improving, and what to do next." },
];

export const STATS_HIGHLIGHTS = [
  "Track real progress",
  "Stay consistent with streaks",
  "Never lose ideas",
  "Focus on what matters",
];
