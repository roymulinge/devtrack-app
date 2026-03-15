
import React from "react";
import WeeklyPriorities from "./pages/WeeklyPriorities";
import Assignment from "./pages/Assignment";
import Ideas from "./pages/Ideas";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import About   from "./pages/About";


function App() {
  const location = useLocation();

  const hideNavbar =
  location.pathname === "/login" ||
  location.pathname === "/register";
  return (
    <>
    
      {!hideNavbar && <Navbar />}
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about"   element={<About />} />
        
        <Route path="/" element={<Landing />} />

                {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ideas"
          element={
            <ProtectedRoute>
              <Ideas />
            </ProtectedRoute>
          }
        />

          <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weekly-planner"
          element={
            <ProtectedRoute>
              <WeeklyPriorities />
            </ProtectedRoute>
          }
        />





       </Routes>


    
      
    </>
  )
}

export default App
