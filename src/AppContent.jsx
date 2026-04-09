import {Routes, Route, useLocation} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
//Layout

import Navbar from "./Components/Navbar";
import DailyFocusWidget from "./Components/DailyFocusWidget";

// Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Ideas from "./pages/Ideas";
import Assignment from "./pages/Assignment";
import WeeklyPriorities from "./pages/WeeklyPriorities";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";

// Route guard
import ProtectedRoute from "./routes/ProtectedRoute";


function AppContent(){
  const location = useLocation();
  const { user } = useContext(AuthContext);


  const hideNavbar =
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  location.pathname === "/forgot-password" ||
  location.pathname === "/reset-password";
  return (
    <>
    
      {!hideNavbar && <Navbar />}
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
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
         
         <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />




       </Routes>


    
      {user && <DailyFocusWidget />} 
    </>
  )
}

export default AppContent;