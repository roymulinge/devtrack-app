import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-sky-400 tracking-wide"
        >
          DevTrack
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-slate-300">
          <Link className="hover:text-white transition" to="/dashboard">
            Dashboard
          </Link>

          <Link className="hover:text-white transition" to="/projects">
            Projects
          </Link>

          <Link className="hover:text-white transition" to="/skills">
            Skills
          </Link>

          <Link className="hover:text-white transition" to="/ideas">
            Ideas
          </Link>

          <Link className="hover:text-white transition" to="/assignments">
            Assignments
          </Link>

          <Link className="hover:text-white transition" to="/weekly-planner">
            Planner
          </Link>

          <Link className="hover:text-white transition" to="/about">
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;