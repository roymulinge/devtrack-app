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

// ─────────────────────────────────────────────────────────
// LIQUID GLASS NAVBAR
//
// "Liquid glass" = glassmorphism + inset highlight shadows
// The inset box-shadows simulate light hitting a curved
// glass surface from above — top highlight + bottom shadow.
// This is what makes it feel liquid rather than just frosted.
//
// Layout: position:fixed, floating pill with margin from edges
// Rounded corners via borderRadius:999 (full pill shape)
// ─────────────────────────────────────────────────────────

const GREEN        = "rgb(22,163,74)";
const GREEN_DARK   = "rgb(21,128,61)";
const GREEN_GLOW   = "rgba(22,163,74,0.2)";
const GREEN_SOFT   = "rgba(22,163,74,0.12)";
const GREEN_BORDER = "rgba(22,163,74,0.3)";

// ─────────────────────────────────────────────────────────
// NavLink — desktop nav pill link
// ─────────────────────────────────────────────────────────
const NavLink = ({ to, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    role="menuitem"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.01em",
      padding: "5px 13px",
      borderRadius: 999,
      textDecoration: "none",
      // Always dark text — readable on the glass pill
      color: isActive ? "#fff" : "rgba(15,23,42,0.85)",
      background: isActive
        ? GREEN
        : "transparent",
      boxShadow: isActive
        ? `0 2px 10px ${GREEN_GLOW}`
        : "none",
      border: "1px solid transparent",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={e => {
      if (!isActive) {
        e.currentTarget.style.color = GREEN;
        e.currentTarget.style.background = GREEN_SOFT;
        e.currentTarget.style.borderColor = GREEN_BORDER;
      }
    }}
    onMouseLeave={e => {
      if (!isActive) {
        e.currentTarget.style.color = "rgba(15,23,42,0.85)";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }
    }}
  >
    {isActive && (
      <span style={{
        width: 5, height: 5,
        borderRadius: "50%",
        background: "#fff",
        flexShrink: 0,
        animation: "navPulse 2s ease infinite",
      }} />
    )}
    {label}
  </Link>
);

// ─────────────────────────────────────────────────────────
// DropdownLink
// ─────────────────────────────────────────────────────────
const DropdownLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    role="menuitem"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 16px",
      fontSize: 13,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500,
      // Dark readable text
      color: "rgba(15,23,42,0.7)",
      textDecoration: "none",
      transition: "color 0.15s, background 0.15s",
      borderRadius: 8,
      margin: "0 4px",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.color = GREEN;
      e.currentTarget.style.background = GREEN_SOFT;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.color = "rgba(15,23,42,0.7)";
      e.currentTarget.style.background = "transparent";
    }}
  >
    <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.4 }}>→</span>
    {label}
  </Link>
);

// ─────────────────────────────────────────────────────────
// AvatarBadge
// ─────────────────────────────────────────────────────────
const AvatarBadge = ({ user, size = "sm" }) => {
  const letter =
    user?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    user?.username?.[0]?.toUpperCase() ??
    "U";
  const color = getAvatarColor(user?.email ?? user?.username ?? "");
  const dim = size === "sm" ? 26 : 34;

  return (
    <div
      aria-label={`Avatar for ${user?.full_name || user?.email}`}
      style={{
        width: dim, height: dim,
        borderRadius: "50%",
        background: color.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 0 0 2px ${color.text}44`,
      }}
    >
      <span style={{
        fontSize: size === "sm" ? 11 : 13,
        fontWeight: 700,
        fontFamily: "DM Mono, monospace",
        color: color.text,
      }}>
        {letter}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// DesktopNav
// ─────────────────────────────────────────────────────────
const DesktopNav = ({ user, pathname }) => {
  const links = user ? NAV_LINKS : PUBLIC_NAV_LINKS;
  return (
    <div className="hidden md:flex" style={{ alignItems: "center", gap: 2 }} role="menu">
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to} label={label} isActive={pathname === to} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// ProfileDropdown — liquid glass dropdown panel
// ─────────────────────────────────────────────────────────
const ProfileDropdown = ({ user, dropOpen, setDropOpen, dropRef, onLogout }) => {
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "Escape" && dropOpen) setDropOpen(false);
    };
    if (dropOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [dropOpen, setDropOpen]);

  const userDisplay = user?.full_name ?? user?.email ?? user?.username;

  return (
    <div className="hidden md:block" ref={dropRef} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setDropOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={dropOpen}
        aria-label={`User menu for ${userDisplay}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px 4px 5px",
          borderRadius: 999,
          border: `1px solid ${dropOpen ? GREEN_BORDER : "rgba(255,255,255,0.5)"}`,
          background: dropOpen
            ? GREEN_SOFT
            : "rgba(255,255,255,0.35)",
          // Inset highlight — the liquid glass touch
          boxShadow: dropOpen
            ? `inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px ${GREEN_GLOW}`
            : "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => {
          if (!dropOpen) {
            e.currentTarget.style.borderColor = GREEN_BORDER;
            e.currentTarget.style.background = GREEN_SOFT;
            e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px ${GREEN_GLOW}`;
          }
        }}
        onMouseLeave={e => {
          if (!dropOpen) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            e.currentTarget.style.background = "rgba(255,255,255,0.35)";
            e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.06)";
          }
        }}
      >
        <AvatarBadge user={user} size="sm" />
        <span style={{
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          // Dark readable text — not relying on CSS vars
          color: "rgba(15,23,42,0.8)",
          maxWidth: 110,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {userDisplay}
        </span>
        <svg
          style={{
            width: 12, height: 12,
            color: "rgba(15,23,42,0.5)",
            transition: "transform 0.2s ease",
            transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Liquid glass dropdown panel
          Light version — readable dark text on frosted white
          Inset shadows create the curved glass surface illusion */}
      {dropOpen && (
        <div
          role="menu"
          aria-label="Profile menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            width: 230,
            borderRadius: 18,
            overflow: "hidden",
            zIndex: 50,
            // Liquid glass — light version
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.6)",
            // ── LIQUID GLASS SHADOW STACK ──────────────────
            // 1. inset top: bright highlight = light hitting glass
            // 2. inset bottom: dark edge = depth at base
            // 3. outer: floating depth shadow
            // 4. outer green ring: brand accent
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.9)",
              "inset 0 -1px 0 rgba(0,0,0,0.04)",
              "0 20px 60px rgba(0,0,0,0.12)",
              `0 0 0 0.5px ${GREEN_BORDER}`,
            ].join(", "),
            animation: "dropdownSlide 0.2s ease both",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "13px 16px 11px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}>
            <p style={{
              fontSize: 10,
              fontFamily: "DM Mono, monospace",
              color: "rgba(15,23,42,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              marginBottom: 3, margin: "0 0 3px",
            }}>
              signed in as
            </p>
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(15,23,42,0.85)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
            }}>
              {userDisplay}
            </p>
          </div>

          <div style={{ padding: "6px 0" }}>
            {DROPDOWN_MENU_ITEMS.map(({ to, label }) => (
              <DropdownLink key={to} to={to} label={label} onClick={() => setDropOpen(false)} />
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "6px 0" }}>
            <button
              onClick={() => { onLogout(); setDropOpen(false); }}
              role="menuitem"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                color: "rgb(220,38,38)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "color 0.15s, background 0.15s",
                textAlign: "left",
                borderRadius: 8,
                margin: "0 4px",
                width: "calc(100% - 8px)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.color = "rgb(185,28,28)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgb(220,38,38)";
              }}
            >
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.5 }}>→</span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// MobileMenu — hamburger + full-width glass drawer
// ─────────────────────────────────────────────────────────
const MobileMenu = ({ user, menuOpen, setMenuOpen, pathname, onLogout }) => {
  const userDisplay = user?.full_name ?? user?.email ?? user?.username;
  const close = () => setMenuOpen(false);

  return (
    <>
      <button
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="md:hidden"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36, height: 36,
          borderRadius: 999,
          border: `1px solid ${menuOpen ? GREEN_BORDER : "rgba(255,255,255,0.5)"}`,
          background: menuOpen ? GREEN_SOFT : "rgba(255,255,255,0.35)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.06)",
          color: menuOpen ? GREEN : "rgba(15,23,42,0.65)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = GREEN;
          e.currentTarget.style.borderColor = GREEN_BORDER;
          e.currentTarget.style.background = GREEN_SOFT;
        }}
        onMouseLeave={e => {
          if (!menuOpen) {
            e.currentTarget.style.color = "rgba(15,23,42,0.65)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            e.currentTarget.style.background = "rgba(255,255,255,0.35)";
          }
        }}
      >
        {menuOpen ? (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {menuOpen && user && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile menu"
          className="md:hidden"
          style={{
            position: "fixed",
            top: 80,
            left: 12,
            right: 12,
            zIndex: 39,
            borderRadius: 20,
            overflow: "hidden",
            // Light liquid glass — matches navbar style
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.9)",
              "inset 0 -1px 0 rgba(0,0,0,0.04)",
              "0 20px 60px rgba(0,0,0,0.14)",
              `0 0 0 0.5px ${GREEN_BORDER}`,
            ].join(", "),
            animation: "drawerSlide 0.22s ease both",
          }}
        >
          {/* User info */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <AvatarBadge user={user} size="md" />
            <p style={{
              fontSize: 13, fontWeight: 600,
              color: "rgba(15,23,42,0.8)", margin: 0,
            }}>
              {userDisplay}
            </p>
          </div>

          {/* Nav links */}
          <div style={{ padding: "8px 12px" }}>
            <p style={{
              fontSize: 10, fontFamily: "DM Mono, monospace",
              color: "rgba(15,23,42,0.35)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "4px 8px", marginBottom: 4,
            }}>
              Navigate
            </p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to} to={to} onClick={close} role="menuitem"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, textDecoration: "none", marginBottom: 2,
                  color: pathname === to ? "#fff" : "rgba(15,23,42,0.75)",
                  background: pathname === to ? GREEN : "transparent",
                  boxShadow: pathname === to ? `0 2px 10px ${GREEN_GLOW}` : "none",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => {
                  if (pathname !== to) {
                    e.currentTarget.style.color = GREEN;
                    e.currentTarget.style.background = GREEN_SOFT;
                  }
                }}
                onMouseLeave={e => {
                  if (pathname !== to) {
                    e.currentTarget.style.color = "rgba(15,23,42,0.75)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.4 }}>→</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{
              fontSize: 10, fontFamily: "DM Mono, monospace",
              color: "rgba(15,23,42,0.35)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "4px 8px", marginBottom: 4,
            }}>
              Account
            </p>
            {MOBILE_ACCOUNT_ITEMS.map(({ to, label }) => (
              <Link
                key={to} to={to} onClick={close} role="menuitem"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  fontSize: 14, color: "rgba(15,23,42,0.65)",
                  textDecoration: "none", marginBottom: 2,
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = GREEN;
                  e.currentTarget.style.background = GREEN_SOFT;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(15,23,42,0.65)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.35 }}>→</span>
                {label}
              </Link>
            ))}
            <button
              onClick={() => { onLogout(); close(); }}
              role="menuitem"
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                fontSize: 14, color: "rgb(220,38,38)",
                background: "transparent", border: "none",
                cursor: "pointer", marginTop: 4,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                transition: "color 0.15s, background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.4 }}>→</span>
              Sign out
            </button>
          </div>
          <div style={{ height: 8 }} />
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN NAVBAR
//
// position:fixed — detaches from page flow, floats above content
// top:12px + horizontal margin = floating pill effect
// borderRadius:999 = full pill / rounded capsule shape
//
// The liquid glass shadow stack:
//   inset 0 1px 0 rgba(255,255,255,0.85)  → top light catch
//   inset 0 -1px 0 rgba(0,0,0,0.06)       → bottom depth
//   0 8px 32px rgba(0,0,0,0.1)            → floating shadow
//   0 1px 0 rgba(255,255,255,0.5)         → outer top rim
// ─────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [dropOpen, setDropOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onMouseDown = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes navPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes drawerSlide {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Spacer — pushes page content down so it's not hidden under fixed navbar */}
      <div style={{ height: 72 }} aria-hidden="true" />

      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          // Fixed positioning — floats above all page content
          position: "fixed",
          top: 12,
          // Floating pill with margin from edges
          left: "50%",
          transform: "translateX(-50%)",
          // Responsive width — max 1200px, shrinks on small screens
          width: "min(calc(100% - 24px), 1200px)",
          zIndex: 40,

          // ── LIQUID GLASS ──────────────────────────────────
          // Gradient bg = light hits top, fades to slightly darker bottom
          // This is what makes it look curved/liquid vs flat glass
          background: scrolled
            ? "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.58) 100%)",

          // saturate(180%) = makes colors behind it more vivid through glass
          backdropFilter: `blur(${scrolled ? "24px" : "16px"}) saturate(180%)`,
          WebkitBackdropFilter: `blur(${scrolled ? "24px" : "16px"}) saturate(180%)`,

          // Full pill shape — 999 = always fully rounded regardless of height
          borderRadius: 999,

          // Outer border — glass edge
          border: "1px solid rgba(255,255,255,0.55)",

          // ── SHADOW STACK ──────────────────────────────────
          // Layer 1: inset top highlight = light catching top of glass
          // Layer 2: inset bottom edge = depth at base of glass curve
          // Layer 3: outer floating shadow = elevation above page
          // Layer 4: outer top rim = extra light on the very top edge
          // Layer 5: green accent glow (stronger when scrolled)
          boxShadow: [
            "inset 0 1.5px 0 rgba(255,255,255,0.85)",
            "inset 0 -1px 0 rgba(0,0,0,0.05)",
            `0 ${scrolled ? "12px 40px" : "8px 28px"} rgba(0,0,0,${scrolled ? "0.12" : "0.08"})`,
            "0 1px 0 rgba(255,255,255,0.6)",
            scrolled ? `0 0 0 1px ${GREEN_BORDER}` : "none",
          ].join(", "),

          transition: "background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          padding: "0 8px 0 6px",
          // Relative so mobile drawer positions from this container
          position: "relative",
        }}>

          {/* ── LOGO ──────────────────────────────────────────
              Logo has black background — we use mix-blend-mode:multiply
              which makes black areas transparent on light backgrounds.
              On a white/glass navbar, black becomes invisible.
              The colored parts of the logo remain fully visible. */}
          <Link
            to="/"
            aria-label="DevTrack Home"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              textDecoration: "none",
              padding: "0 6px",
            }}
          >
            <img
              src={logo}
              alt="DevTrack"
              style={{
                // Tall enough to see logo + text clearly
                height: 42,
                width: "auto",
                // mix-blend-mode:multiply = black pixels become transparent
                // This removes the black background from your logo PNG
                // without needing a transparent PNG file
                mixBlendMode: "multiply",
              }}
              onError={e => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "inline";
              }}
            />
            {/* Text fallback if logo fails */}
            <span style={{
              display: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 18,
              letterSpacing: "-0.02em", color: "#0a0a0a",
            }}>
              Dev<span style={{ color: GREEN }}>Track</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ─────────────────────────────────── */}
          <DesktopNav user={user} pathname={pathname} />

          {/* ── RIGHT SIDE ──────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: 13, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    // Dark readable text — hardcoded, not CSS var
                    color: "rgba(15,23,42,0.75)",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: 999,
                    transition: "color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = GREEN;
                    e.currentTarget.style.background = GREEN_SOFT;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(15,23,42,0.75)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Login
                </Link>

                {/* Green CTA pill — matches Landing.jsx */}
                <Link
                  to="/register"
                  style={{
                    fontSize: 13, fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "7px 20px",
                    borderRadius: 999,
                    background: GREEN,
                    boxShadow: `0 2px 12px ${GREEN_GLOW}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = GREEN_DARK;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = `0 4px 18px rgba(22,163,74,0.4), inset 0 1px 0 rgba(255,255,255,0.25)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = GREEN;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 2px 12px ${GREEN_GLOW}, inset 0 1px 0 rgba(255,255,255,0.25)`;
                  }}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;