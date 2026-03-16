import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const navLinks = [
    { to: "/dashboard",     label: "Dashboard"   },
    { to: "/projects",      label: "Projects"    },
    { to: "/skills",        label: "Skills"      },
    { to: "/ideas",         label: "Ideas"       },
    { to: "/assignments",   label: "Assignments" },
    { to: "/weekly-planner",label: "Planner"     },
  ];

  // First letter of email or username for avatar
  const avatarLetter = user?.email?.[0]?.toUpperCase()
    ?? user?.username?.[0]?.toUpperCase()
    ?? "D";

  return (
    <nav className="bg-[#090d13] border-b border-slate-800 relative">

      {/* Subtle glow line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-100 tracking-wide hover:text-white transition"
        >
          <span className="text-sky-400">[</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
          <span>DevTrack</span>
          <span className="text-sky-400">]</span>
        </Link>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`text-xs font-medium px-3 py-1.5 rounded-md border transition tracking-wide
                  ${active
                    ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                    : "text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-slate-700"
                  }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Divider before About */}
          <div className="w-px h-4 bg-slate-800 mx-1.5" />

          <Link
            to="/about"
            className={`text-xs font-medium px-3 py-1.5 rounded-md border transition tracking-wide
              ${pathname === "/about"
                ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                : "text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-slate-700"
              }`}
          >
            About
          </Link>

          <Link
            to="/contact"
            className={`text-xs font-medium px-3 py-1.5 rounded-md border transition tracking-wide
              ${pathname === "/contact"
                ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                : "text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-slate-700"
              }`}
          >
            Contact
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* User pill */}
              <div className="flex items-center gap-2 bg-white/[0.03] border border-slate-800 rounded-lg px-2.5 py-1">
                <div className="w-5 h-5 rounded-full bg-sky-400/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold font-mono text-sky-400">
                    {avatarLetter}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 hidden sm:block">
                  {user.email ?? user.username}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="text-[11px] font-mono font-semibold text-red-400 border border-red-400/20 px-3 py-1.5 rounded-md hover:bg-red-400/10 hover:border-red-400/40 transition tracking-wider"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-md transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-[11px] font-mono font-semibold text-[#090d13] bg-sky-400 hover:bg-sky-300 px-3.5 py-1.5 rounded-md transition tracking-wide"
              >
                get started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;