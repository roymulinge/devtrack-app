
import React from "react";
import WeeklyPriorities from "./pages/WeeklyPriorities";
import Assignment from "./pages/Assignment";
import Ideas from "./pages/Ideas";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import About   from "./pages/About";
import Contact from "./pages/Contact";
import VerifyEmail from "./pages/VerifyEmail";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DailyFocusWidget from "./Components/DailyFocusWidget";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
