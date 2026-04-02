# DevTrack - Frontend 
* A React-based frontend for the DevTrack productivity system. Built for students and developers who want one structured place to manage projects, skills, assignments, and ideas. 

* LIVE Demo: devtrack-app.vercel.app
* Backend Repository: https://github.com/roymulinge/DevTrack.git

# What It Does
* DevTrack solves the problem of fragmented workflows.Instead of managing learning, projects, ideas and assignments across disconnected tools,everything lives in one system with structure enforced between them.

# The Frontend Provides: 
* Secure Login and registration with JWT authentication
* Dashboard showing active projects, overdue assignments, and inactive skills at a glance
* Project management with skills linked to each project 
* Skill tracking with depth levels and practice history 
* Assignment tracking with deadlines and status progression 
* Idea vault for capturing and evaluating startup or product ideas
* Weekly priority planning to structure execution 
* Weekly priority planning to structure execution 
* Daily focus widget surfacing the most important tasks for today
* light and dark theme toggle
* Fully responsive design mobile, tablet, and desktop 

# Tech Stack
* Technology       | Purpose
__________________ | ____________________
* React18          | UI component library
* Vite             | Build tool and development server
* TailWind CSS     | Utility- first styling 
* React Router DOM | Client-side routing and navigation 
* Axios            | HTTP client for API communication 
* Context API      | Global authentication state management

# Project Structure 
src/
├── api/
│   └── axios.js              # Axios instance with base URL and JWT interceptor
├── Components/
│   ├── Navbar.jsx            # Global navigation with role-aware rendering
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
│   ├── Profile.jsx           # User profile and account settings
│   ├── Login.jsx             # Authentication entry point
│   └── Register.jsx          # New user registration
└── main.jsx                  # App entry point with router setup

# Architecture Decisions
* Why Vite instead of Create React App?
Vite provides significantly faster development server startup and hot module replacement. It is the current industry standard for new React projects.

* Why Context API instead of Redux?
The application's global state is limited to authentication data — the current user and their JWT token. Context API handles this cleanly without the boilerplate that Redux requires. Redux would be appropriate if the state logic became significantly more complex across many interconnected modules.

* Why Axios instead of fetch?
Axios allows a centralised configuration file that automatically attaches the JWT token to every outgoing request via an interceptor. This means authentication logic is written once, not repeated on every API call throughout the codebase.
Why Tailwind CSS?

* Tailwind's utility classes allow rapid UI development without context-switching between CSS files. The design system is consistent because all styling uses the same constrained set of values.

# Getting Started
* Prerequisites

  * Node.js v18 or higher
  * npm or yarn
  * The DevTrack Django backend running locally or deployed

# Installation

# Clone the repository
git clone https://github.com/roymulinge/DevTrack.git
cd DevTrack/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env


# Environment Variables
* Create a .env file in the root of the frontend directory:
    VITE_API_BASE_URL=http://localhost:8000/api
* For production, set this to your deployed backend URL:
    VITE_API_BASE_URL=https://your-backend.onrender.com/api

# Running the Development Server
* npm run dev

# Preview Production Build
* npm run preview 

# Key Implementation Details

# Authentication Flow
* Authentication is handled entirely through JWT tokens. When a user logs in, the backend returns an access token and a refresh token. The access token is stored and sent in the Authorization header of every API request. When the access token expires, the refresh token is used to silently obtain a new one without requiring the user to log in again.

* The Axios interceptor in src/api/axios.js handles this automatically — no component needs to think about token management.

# Protected Routes
* All pages except Login and Register require authentication. React Router is used to redirect unauthenticated users to the login page. The auth state from Context determines which routes are accessible.

# State Management Pattern
* Each page manages its own local state using useState for data that only that page needs. Global state — specifically the authenticated user and token — lives in AuthContext and is available to any component without prop drilling.

# API Communication 

* All API calls use the centralised Axios instance from src/api/axios.js. This instance:

    * Has the backend base URL pre-configured from the environment variable
    * Automatically attaches the JWT token to every request header
    * Handles token refresh on 401 responses

# Deployment 
* The frontend is deployed on Vercel with automatic deployments on every push to the main branch 

# Deploy Your Own Instance 
* Fork this respository
* Connect to Vercel via vercel.com 
* Set the environment variable VITE_API_BASE_URL in     Vercel's Project settings 
* Deploy 

# Future Improvements
* Intelligent recommendations - skills suggesting related projects, projects requiring certain skills 
* Real-time notifications via WebSockets for deadline reminders
* Offline support using service workers and local caching 
* Advanced analytics dashboard showing learning velocity and project completion rates
* Mobile app using React Native sharing the same backend

# Author
* Roy Mulinge
* Email: mutuaroymulinge@gmail.com
* GitHub: github.com/roymulinge
* Backend: github.com/roymulinge/DevTrack 

# License
* ISC License — see LICENSE file for details.

