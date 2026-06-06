# DevTrack — Frontend

> One structured workspace for developers and students to manage projects, skills, assignments, and ideas.

**Live Demo:** [devtrack-app.vercel.app](https://devtrack-app.vercel.app) · **Backend Repo:** [DevTrack API](https://github.com/roymulinge/DevTrack)

---

## The Problem It Solves

Most developers juggle 4–5 disconnected tools — a notes app for ideas, a spreadsheet for assignments, GitHub for projects, Notion for skills. DevTrack replaces all of them with one system where everything is linked: skills connect to projects, projects connect to priorities, priorities surface on a daily focus widget.

---

## Features

| Module | What it does |
|---|---|
| **Dashboard** | Live overview — active projects, overdue assignments, inactive skills |
| **Project Management** | Create projects and link the skills being practiced in each |
| **Skill Tracker** | Track skills with depth levels and practice history |
| **Assignment Tracker** | Deadlines, status progression, overdue alerts |
| **Idea Vault** | Capture and score startup/product ideas before they disappear |
| **Weekly Planning** | Set priorities at the start of each week |
| **Daily Focus** | Surfaces the most important tasks for today |
| **Auth** | JWT login/registration with silent token refresh |
| **Theme** | Light and dark mode toggle |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## Tech Stack

```
React 18          — UI components
Vite              — Build tool (faster than CRA, industry standard)
Tailwind CSS      — Utility-first styling
React Router DOM  — Client-side routing
Axios             — HTTP client with JWT interceptor
Context API       — Global auth state (no Redux needed at this scale)
```

---

## Architecture Decisions

**Why Vite over Create React App?**
Vite's dev server starts in under a second and hot module replacement is near-instant. It is the current industry standard for new React projects.

**Why Context API over Redux?**
Global state here is only the authenticated user and their JWT token. Context handles this cleanly without Redux boilerplate. Redux would make sense if state logic grew significantly more complex across many interconnected modules.

**Why Axios over fetch?**
A single centralised Axios instance in `src/api/axios.js` attaches the JWT token to every outgoing request via an interceptor. Authentication logic is written once, not repeated on every API call.

**Why Tailwind CSS?**
Utility classes allow rapid UI development without context-switching between files. The design system stays consistent because all styling uses the same constrained value set.

---

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with base URL and JWT interceptor
├── Components/
│   ├── Navbar.jsx            # Global navigation
│   ├── PageLoader.jsx        # Full-page loading spinner
│   ├── DailyFocus.jsx        # Daily priority widget
│   └── ThemeToggle.jsx       # Light/dark mode toggle
├── Context/
│   └── AuthContext.jsx       # Auth state, login, logout, token management
├── Pages/
│   ├── Dashboard.jsx         # Aggregated overview of all modules
│   ├── Projects.jsx          # Project CRUD with skills linking
│   ├── Skills.jsx            # Skill tracking and depth management
│   ├── Assignments.jsx       # Assignment tracking with deadlines
│   ├── Ideas.jsx             # Idea vault with complexity scoring
│   ├── Planning.jsx          # Weekly priority planning
│   ├── Profile.jsx           # User profile and settings
│   ├── Login.jsx             # Authentication entry
│   └── Register.jsx          # New user registration
└── main.jsx                  # App entry point with router setup
```

---

## Authentication Flow

1. User logs in → backend returns `access` + `refresh` tokens
2. Access token stored and attached to every request via Axios interceptor
3. On 401 response → interceptor silently uses refresh token to get a new access token
4. User never gets logged out unexpectedly

No component needs to think about token management — it's all handled in `src/api/axios.js`.

---

## Getting Started

**Prerequisites**
- Node.js v18+
- The [DevTrack Django backend](https://github.com/roymulinge/DevTrack) running locally or deployed

```bash
# Clone the repo
git clone https://github.com/roymulinge/DevTrack.git
cd DevTrack/frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000/api

# Start dev server
npm run dev
```

**Environment Variables**
```env
# Local development
VITE_API_BASE_URL=http://localhost:8000/api

# Production
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## Deployment

Frontend is deployed on **Vercel** with automatic deployments on every push to `main`.

To deploy your own instance:
1. Fork this repository
2. Connect to [vercel.com](https://vercel.com)
3. Set `VITE_API_BASE_URL` in Vercel project settings
4. Deploy

---

## Roadmap

- [ ] AI-powered skill and project recommendations
- [ ] Real-time deadline notifications via WebSockets
- [ ] Offline support with service workers
- [ ] Analytics dashboard — learning velocity, completion rates
- [ ] React Native mobile app sharing the same backend
- [ ] Multi-tenant SaaS deployment

---

## Author

**Roy Mulinge**
[GitHub](https://github.com/roymulinge) · [LinkedIn](https://www.linkedin.com/in/roy-mulinge-4b6a80251) · mutuaroymulinge@gmail.com

---

*ISC License — see LICENSE for details.*
