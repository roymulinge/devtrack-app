import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "../Components/ThemeToggle";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout }        = useContext(AuthContext);
  const { pathname }            = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef                 = useRef(null);

  const navLinks = [
    { to: "/dashboard",      label: "Dashboard"   },
    { to: "/projects",       label: "Projects"    },
    { to: "/skills",         label: "Skills"      },
    { to: "/ideas",          label: "Ideas"       },
    { to: "/assignments",    label: "Assignments" },
    { to: "/weekly-planner", label: "Planner"     },
  ];

  const avatarLetter = user?.email?.[0]?.toUpperCase()
    ?? user?.username?.[0]?.toUpperCase()
    ?? "D";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setDropOpen(false); }, [pathname]);

  return (
    <nav className="bg-[var(--bg-primary)] border-b border-[var(--border)] relative">

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="DevTrack"
            className="h-8 w-auto"
          />
        </Link>

        {/* Nav links — logged in */}
        {user && (
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs font-medium px-3 py-1.5 rounded-md border transition tracking-wide
                  ${pathname === to
                    ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                    : "text-[var(--text-secondary)] border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-slate-700"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Public links — logged out */}
        {!user && (
          <div className="hidden md:flex items-center gap-0.5">
            {[{ to: "/about", label: "About" }, { to: "/contact", label: "Contact" }].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs font-medium px-3 py-1.5 rounded-md border transition tracking-wide
                  ${pathname === to
                    ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                    : "text-[var(--text-secondary)] border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-slate-700"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            /* Profile dropdown */
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition
                  ${dropOpen
                    ? "bg-white/[0.06] border-slate-700"
                    : "bg-white/[0.03] border-[var(--border)] hover:border-slate-700 hover:bg-white/[0.05]"
                  }`}
              >
                <div className="w-6 h-6 rounded-full bg-sky-400/20 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold font-mono text-sky-400">
                    {avatarLetter}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--text-secondary)] hidden sm:block max-w-[140px] truncate">
                  {user.email ?? user.username}
                </span>
                <svg
                  className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">

                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-xs font-mono text-slate-600 mb-0.5">signed in as</p>
                    <p className="text-xs text-[var(--text-primary)] font-medium truncate">
                      {user.email ?? user.username}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition"
                    >
                      <span className="font-mono text-slate-700">→</span>
                      Dashboard
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition"
                    >
                      <span className="font-mono text-slate-700">→</span>
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition"
                    >
                      <span className="font-mono text-slate-700">→</span>
                      Contact
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-[var(--border)] py-1">
                    <button
                      onClick={() => { logout(); setDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/5 transition"
                    >
                      <span className="font-mono">→</span>
                      Sign out
                    </button>
                  </div>

                </div>
              )}
            </div>

          ) : (
            /* Logged out buttons */
            <>
              <Link
                to="/login"
                className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-[11px] font-mono font-semibold text-[var(--bg-primary)] bg-sky-400 hover:bg-sky-300 px-3.5 py-1.5 rounded-md transition tracking-wide"
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