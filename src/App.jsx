
import React from "react";
import Assignments from "./pages/Assignments";
import Ideas from "./pages/Ideas";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
function App() {
 
  return (
    <>
    <Router>
      <Navbar />
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
        <Route
          path="/"
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
              <Assignments />
            </ProtectedRoute>
          }
        />




       </Routes>


    </Router>
      
    </>
  )
}

export default App
