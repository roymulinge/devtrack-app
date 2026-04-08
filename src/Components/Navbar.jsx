import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "../Components/ThemeToggle";
import logo from "../assets/logo.png";
import {
  NAV_LINKS,
  PUBLIC_NAV_LINKS,
  DROPDOWN_MENU_ITEMS,
  MOBILE_ACCOUNT_ITEMS,
  getAvatarColor,
} from "./navbarData";

// ────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ────────────────────────────────────────────────────────

/**
 * Reusable nav link component with active state styling
 */
const NavLink = ({ to, label, isActive, className = "", onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`text-xs font-medium px-3 py-1.5 rounded-md border transition tracking-wide
      ${isActive
        ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
        : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border)]"
      } ${className}`}
    role="menuitem"
  >
    {label}
  </Link>
);

/**
 * Dropdown menu link component
 */
const DropdownLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
    role="menuitem"
  >
    <span className="font-mono text-[var(--text-muted)]">→</span>
    {label}
  </Link>
);

/**
 * Avatar badge component
 */
const AvatarBadge = ({ user, size = "sm" }) => {
  const letter = user?.full_name?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? user?.username?.[0]?.toUpperCase()
    ?? "U";

  const color = getAvatarColor(user?.email ?? user?.username ?? "");
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const textSizeClasses = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div
      style={{ backgroundColor: color.bg }}
      className={`${sizeClasses} rounded-full flex items-center justify-center shrink-0`}
      aria-label={`Avatar for ${user?.full_name || user?.email}`}
    >
      <span
        style={{ color: color.text }}
        className={`${textSizeClasses} font-bold font-mono`}
      >
        {letter}
      </span>
    </div>
  );
};

/**
 * Desktop navigation menu
 */
const DesktopNav = ({ user, pathname }) => {
  const links = user ? NAV_LINKS : PUBLIC_NAV_LINKS;

  return (
    <div className="hidden md:flex items-center gap-0.5" role="menu">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          label={label}
          isActive={pathname === to}
        />
      ))}
    </div>
  );
};

/**
 * Profile dropdown menu (desktop)
 */
const ProfileDropdown = ({ user, dropOpen, setDropOpen, dropRef, onLogout }) => {
  // Keyboard navigation: ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && dropOpen) {
        setDropOpen(false);
      }
    };
    if (dropOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [dropOpen, setDropOpen]);

  const handleLogout = () => {
    onLogout();
    setDropOpen(false);
  };

  const userDisplay = user?.full_name ?? user?.email ?? user?.username;

  return (
    <div className="relative hidden md:block" ref={dropRef}>
      <button
        onClick={() => setDropOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={dropOpen}
        aria-label={`User menu for ${userDisplay}`}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition
          ${dropOpen
            ? "bg-[var(--bg-surface)] border-[var(--border)]"
            : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--bg-surface-hover)]"
          }`}
      >
        <AvatarBadge user={user} size="sm" />
        <span className="text-xs font-mono text-[var(--text-secondary)] max-w-[140px] truncate">
          {userDisplay}
        </span>
        <svg
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${
            dropOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden"
          role="menu"
          aria-label="Profile menu"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-xs font-mono text-[var(--text-muted)] mb-0.5">signed in as</p>
            <p className="text-xs text-[var(--text-primary)] font-medium truncate">
              {userDisplay}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {DROPDOWN_MENU_ITEMS.map(({ to, label }) => (
              <DropdownLink
                key={to}
                to={to}
                label={label}
                onClick={() => setDropOpen(false)}
              />
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border)] py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/5 transition"
              role="menuitem"
            >
              <span className="font-mono">→</span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Mobile hamburger menu
 */
const MobileMenu = ({ user, menuOpen, setMenuOpen, pathname, onLogout }) => {
  const userDisplay = user?.full_name ?? user?.email ?? user?.username;

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border)] transition"
      >
        {menuOpen ? (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile menu drawer */}
      {menuOpen && user && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border)] z-30 relative"
          role="navigation"
          aria-label="Mobile menu"
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
            <AvatarBadge user={user} size="md" />
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {userDisplay}
            </p>
          </div>

          {/* Navigation links */}
          <div className="px-3 py-2">
            <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1">
              Navigate
            </p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={handleMenuItemClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-0.5
                  ${pathname === to
                    ? "text-sky-400 bg-sky-400/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                  }`}
                role="menuitem"
              >
                <span className="font-mono text-[var(--text-muted)] text-xs">→</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Account links */}
          <div className="px-3 py-2 border-t border-[var(--border)]">
            <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1">
              Account
            </p>
            {MOBILE_ACCOUNT_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={handleMenuItemClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition mb-0.5"
                role="menuitem"
              >
                <span className="font-mono text-[var(--text-muted)] text-xs">→</span>
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                onLogout();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition mt-1"
              role="menuitem"
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

/**
 * Main Navbar Component
 */
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdowns when route changes
  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className="bg-[var(--bg-primary)] border-b border-[var(--border)] relative z-40"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            aria-label="DevTrack Home"
          >
            <img src={logo} alt="DevTrack" className="h-25 w-auto" />
          </Link>

          {/* Desktop navigation */}
          <DesktopNav user={user} pathname={pathname} />

          {/* Right side: Theme toggle, auth buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <>
                <ProfileDropdown
                  user={user}
                  dropOpen={dropOpen}
                  setDropOpen={setDropOpen}
                  dropRef={dropRef}
                  onLogout={logout}
                />
                <MobileMenu
                  user={user}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  pathname={pathname}
                  onLogout={logout}
                />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-sky-400 hover:bg-sky-300 text-[#090d13] font-mono font-bold text-sm px-6 py-3 rounded-lg transition tracking-wide"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;