
import React from "react";
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

       </Routes>


    </Router>
      
    </>
  )
}

export default App
