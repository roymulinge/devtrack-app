import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "../Components/ThemeToggle";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout }          = useContext(AuthContext);
  const { pathname }              = useLocation();
  const [dropOpen, setDropOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const dropRef                   = useRef(null);

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

  // Close everything on route change
  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="bg-[var(--bg-primary)] border-b border-[var(--border)] relative z-40">

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="DevTrack" className="h-25 w-auto" />
          </Link>

          {/* Nav links — desktop only */}
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

          {/* Public links — desktop only */}
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
              <>
                {/* Profile dropdown — desktop */}
                <div className="relative hidden md:block" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen((v) => !v)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition
                      ${dropOpen
                        ? "bg-white/[0.06] border-slate-700"
                        : "bg-white/[0.03] border-[var(--border)] hover:border-slate-700 hover:bg-white/[0.05]"
                      }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-sky-400/20 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold font-mono text-sky-400">{avatarLetter}</span>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-secondary)] max-w-[140px] truncate">
                      {user.email ?? user.username}
                    </span>
                    <svg className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-xs font-mono text-slate-600 mb-0.5">signed in as</p>
                        <p className="text-xs text-[var(--text-primary)] font-medium truncate">{user.email ?? user.username}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { to: "/profile",         label: "Profile"          },
                          { to: "/dashboard",       label: "Dashboard"        },
                          { to: "/about",           label: "About"            },
                          { to: "/contact",         label: "Contact"          },
                          { to: "/change-password", label: "Change Password"  },
                        ].map(({ to, label }) => (
                          <Link key={to} to={to}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition"
                          >
                            <span className="font-mono text-slate-700">→</span>
                            {label}
                          </Link>
                        ))}
                      </div>
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

                {/* Hamburger — mobile only */}
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border)] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
                >
                  {menuOpen ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md transition"
                >
                  Login
                </Link>
                <Link to="/register"
                  className="text-[11px] font-mono font-semibold text-[var(--bg-primary)] bg-sky-400 hover:bg-sky-300 px-3.5 py-1.5 rounded-md transition tracking-wide"
                >
                  get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu — slides down */}
      {menuOpen && user && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border)] z-30 relative">

          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-400/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold font-mono text-sky-400">{avatarLetter}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] truncate">{user.email ?? user.username}</p>
          </div>

          {/* Nav links */}
          <div className="px-3 py-2">
            <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest px-2 mb-1">Navigate</p>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-0.5
                  ${pathname === to
                    ? "text-sky-400 bg-sky-400/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                  }`}
              >
                <span className="font-mono text-slate-700 text-xs">→</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Account links */}
          <div className="px-3 py-2 border-t border-[var(--border)]">
            <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest px-2 mb-1">Account</p>
            {[
              { to: "/profile",         label: "Profile"           },
              { to: "/change-password", label: "Change Password" },
              { to: "/about",           label: "About"           },
              { to: "/contact",         label: "Contact"         },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition mb-0.5"
              >
                <span className="font-mono text-slate-700 text-xs">→</span>
                {label}
              </Link>
            ))}
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition mt-1"
            >
              <span className="font-mono text-xs">→</span>
              Sign out
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;