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
// GLASS NAVBAR
//
// The glass effect uses three CSS properties together:
//   1. background: rgba(255,255,255,0.75)  → semi-transparent
//   2. backdropFilter: blur(16px)           → blurs page content behind it
//   3. border-bottom: rgba(255,255,255,0.2) → subtle frosted edge
//
// It looks best because your dot-grid background and hero image
// give the blur something interesting to render through.
//
// scroll state increases blur from 12px → 20px as you scroll down,
// making the navbar feel more "solid" the deeper you go.
// ─────────────────────────────────────────────────────────

// Brand green tokens — matches Landing.jsx C object
const GREEN        = "rgb(22,163,74)";
const GREEN_DARK   = "rgb(21,128,61)";
const GREEN_GLOW   = "rgba(22,163,74,0.15)";
const GREEN_SOFT   = "rgba(22,163,74,0.08)";
const GREEN_BORDER = "rgba(22,163,74,0.25)";

// ─────────────────────────────────────────────────────────
// NavLink — single desktop nav link
//
// Active state:   green dot + green text + green tinted bg
// Inactive state: muted text, green on hover
// isActive prop comes from comparing pathname === to
// ─────────────────────────────────────────────────────────
const NavLink = ({ to, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    role="menuitem"
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 13,
      fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.01em",
      padding: "6px 12px",
      borderRadius: 8,
      textDecoration: "none",
      color: isActive ? GREEN : "var(--text-secondary, #6b7280)",
      background: isActive ? GREEN_SOFT : "transparent",
      border: `1px solid ${isActive ? GREEN_BORDER : "transparent"}`,
      transition: "color 0.2s, background 0.2s, border-color 0.2s",
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
        e.currentTarget.style.color = "var(--text-secondary, #6b7280)";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }
    }}
  >
    {/* Pulsing green dot — only on active link */}
    {isActive && (
      <span style={{
        width: 5, height: 5,
        borderRadius: "50%",
        background: GREEN,
        flexShrink: 0,
        animation: "navPulse 2s ease infinite",
      }} />
    )}
    {label}
  </Link>
);

// ─────────────────────────────────────────────────────────
// DropdownLink — item inside profile dropdown panel
// Hover: green text + green tinted background
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
      fontSize: 12,
      fontFamily: "'DM Sans', sans-serif",
      color: "var(--text-secondary, #6b7280)",
      textDecoration: "none",
      transition: "color 0.15s, background 0.15s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.color = GREEN;
      e.currentTarget.style.background = GREEN_SOFT;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.color = "var(--text-secondary, #6b7280)";
      e.currentTarget.style.background = "transparent";
    }}
  >
    <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.45 }}>→</span>
    {label}
  </Link>
);

// ─────────────────────────────────────────────────────────
// AvatarBadge — colored circle with user initial
//
// getAvatarColor hashes the email/username string into a
// consistent index into AVATAR_COLORS array.
// This means the same user always gets the same color.
//
// Ring: box-shadow with color.text at 20% opacity
// ─────────────────────────────────────────────────────────
const AvatarBadge = ({ user, size = "sm" }) => {
  const letter =
    user?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    user?.username?.[0]?.toUpperCase() ??
    "U";
  const color = getAvatarColor(user?.email ?? user?.username ?? "");
  const dim = size === "sm" ? 24 : 32;

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
        // Subtle ring using the avatar's own accent color
        boxShadow: `0 0 0 1.5px ${color.text}33`,
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
// DesktopNav — horizontal link row
// Hidden on mobile via className="hidden md:flex"
// Shows user links when logged in, public links when not
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
// ProfileDropdown — avatar button + glass dropdown panel
//
// Three closing mechanisms:
//   1. Click outside (mousedown listener on document)
//   2. ESC key (keydown listener, only active when open)
//   3. Route change (useEffect watching pathname in Navbar)
//
// Dropdown uses same glass style as navbar:
//   backdrop-filter:blur + dark semi-transparent bg
// ─────────────────────────────────────────────────────────
const ProfileDropdown = ({ user, dropOpen, setDropOpen, dropRef, onLogout }) => {
  // ESC to close — standard keyboard accessibility pattern
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

      {/* Trigger button — glass pill */}
      <button
        onClick={() => setDropOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={dropOpen}
        aria-label={`User menu for ${userDisplay}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 10px 5px 6px",
          borderRadius: 10,
          border: `1px solid ${dropOpen ? GREEN_BORDER : "rgba(0,0,0,0.1)"}`,
          background: dropOpen ? GREEN_SOFT : "rgba(255,255,255,0.5)",
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => {
          if (!dropOpen) {
            e.currentTarget.style.borderColor = GREEN_BORDER;
            e.currentTarget.style.background = GREEN_SOFT;
          }
        }}
        onMouseLeave={e => {
          if (!dropOpen) {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
            e.currentTarget.style.background = "rgba(255,255,255,0.5)";
          }
        }}
      >
        <AvatarBadge user={user} size="sm" />
        <span style={{
          fontSize: 12,
          fontFamily: "DM Mono, monospace",
          color: "var(--text-secondary, #6b7280)",
          maxWidth: 120,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {userDisplay}
        </span>
        {/* Chevron rotates 180deg when open — CSS transform via inline style */}
        <svg
          style={{
            width: 12, height: 12,
            color: "var(--text-muted, #9ca3af)",
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

      {/* Glass dropdown panel
          Slides down with dropdownSlide animation
          Dark glass: rgba(10,10,10,0.88) + blur(20px)
          Subtle green ring via box-shadow */}
      {dropOpen && (
        <div
          role="menu"
          aria-label="Profile menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 220,
            borderRadius: 14,
            overflow: "hidden",
            zIndex: 50,
            background: "rgba(10,10,10,0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: `0 16px 48px rgba(0,0,0,0.25), 0 0 0 0.5px ${GREEN_BORDER}`,
            animation: "dropdownSlide 0.18s ease both",
          }}
        >
          {/* User header */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <p style={{
              fontSize: 10,
              fontFamily: "DM Mono, monospace",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 3,
            }}>
              signed in as
            </p>
            <p style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
            }}>
              {userDisplay}
            </p>
          </div>

          {/* Nav items */}
          <div style={{ padding: "4px 0" }}>
            {DROPDOWN_MENU_ITEMS.map(({ to, label }) => (
              <DropdownLink
                key={to}
                to={to}
                label={label}
                onClick={() => setDropOpen(false)}
              />
            ))}
          </div>

          {/* Sign out — red, visually separated */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "4px 0" }}>
            <button
              onClick={() => { onLogout(); setDropOpen(false); }}
              role="menuitem"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(248,113,113,0.9)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "color 0.15s, background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.color = "rgb(252,165,165)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(248,113,113,0.9)";
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
// MobileMenu — hamburger button + slide-down drawer
//
// Drawer uses dark glass matching the dropdown panel.
// Position:absolute from the navbar so it overlays page content.
// Only renders when menuOpen === true AND user is logged in.
// ─────────────────────────────────────────────────────────
const MobileMenu = ({ user, menuOpen, setMenuOpen, pathname, onLogout }) => {
  const userDisplay = user?.full_name ?? user?.email ?? user?.username;
  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Hamburger / X toggle button — md:hidden = mobile only */}
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
          borderRadius: 9,
          border: `1px solid ${menuOpen ? GREEN_BORDER : "rgba(0,0,0,0.1)"}`,
          background: menuOpen ? GREEN_SOFT : "rgba(255,255,255,0.5)",
          color: menuOpen ? GREEN : "var(--text-muted, #9ca3af)",
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s, color 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = GREEN;
          e.currentTarget.style.borderColor = GREEN_BORDER;
        }}
        onMouseLeave={e => {
          if (!menuOpen) {
            e.currentTarget.style.color = "var(--text-muted, #9ca3af)";
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
          }
        }}
      >
        {/* Swap icon based on open state */}
        {menuOpen ? (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile drawer
          position:absolute from the navbar container
          Covers full width of screen, slides down
          Dark glass: same as dropdown but full-width */}
      {menuOpen && user && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile menu"
          className="md:hidden"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 30,
            background: "rgba(10,10,10,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            borderTop: `1px solid ${GREEN_BORDER}`,
            animation: "drawerSlide 0.22s ease both",
          }}
        >
          {/* User info strip */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <AvatarBadge user={user} size="md" />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              {userDisplay}
            </p>
          </div>

          {/* Nav links section */}
          <div style={{ padding: "8px 12px" }}>
            <p style={{
              fontSize: 10, fontFamily: "DM Mono, monospace",
              color: "rgba(255,255,255,0.22)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "4px 8px", marginBottom: 4,
            }}>
              Navigate
            </p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                role="menuitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: 2,
                  // Active = green, inactive = muted white
                  color: pathname === to ? GREEN : "rgba(255,255,255,0.65)",
                  background: pathname === to ? GREEN_SOFT : "transparent",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  if (pathname !== to) {
                    e.currentTarget.style.color = GREEN;
                    e.currentTarget.style.background = GREEN_SOFT;
                  }
                }}
                onMouseLeave={e => {
                  if (pathname !== to) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.35 }}>→</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Account section */}
          <div style={{
            padding: "8px 12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{
              fontSize: 10, fontFamily: "DM Mono, monospace",
              color: "rgba(255,255,255,0.22)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "4px 8px", marginBottom: 4,
            }}>
              Account
            </p>
            {MOBILE_ACCOUNT_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                role="menuitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  marginBottom: 2,
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = GREEN;
                  e.currentTarget.style.background = GREEN_SOFT;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.35 }}>→</span>
                {label}
              </Link>
            ))}

            {/* Sign out */}
            <button
              onClick={() => { onLogout(); close(); }}
              role="menuitem"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14,
                color: "rgba(248,113,113,0.85)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
                fontFamily: "'DM Sans', sans-serif",
                transition: "color 0.15s, background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.color = "rgb(252,165,165)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(248,113,113,0.85)";
              }}
            >
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, opacity: 0.35 }}>→</span>
              Sign out
            </button>
          </div>

          {/* Safe area spacer — prevents content touching screen edge */}
          <div style={{ height: 10 }} />
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN NAVBAR COMPONENT
//
// scroll state: window.scrollY > 10 triggers stronger glass
//   - blur increases: 12px → 20px
//   - bg opacity increases: 0.72 → 0.85
//   - shadow deepens
// This makes the navbar feel "heavier" as you scroll — natural.
//
// position:sticky + top:0 = stays fixed at top while scrolling
// position:relative on inner div = lets mobile drawer position from here
// ─────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [dropOpen, setDropOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const dropRef = useRef(null);

  // Detect scroll — passive:true is a performance hint to the browser
  // It tells the browser this listener won't call preventDefault()
  // so it can scroll without waiting for JS — smoother scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close both menus on route change
  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close dropdown when user clicks anywhere outside dropRef element
  useEffect(() => {
    const onMouseDown = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <>
      {/* Keyframe definitions — scoped here, applied via className/animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        /* Active nav dot breathing */
        @keyframes navPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.7); }
        }

        /* Dropdown panel slides down + fades in */
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Mobile drawer slides down + fades in */
        @keyframes drawerSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,

          // ── GLASS EFFECT ──────────────────────────────────
          // background opacity increases when scrolled
          background: scrolled
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.72)",

          // blur strengthens when scrolled — more frosted depth
          backdropFilter:         `blur(${scrolled ? "20px" : "12px"})`,
          WebkitBackdropFilter:   `blur(${scrolled ? "20px" : "12px"})`,

          // subtle white border = glass edge illusion
          borderBottom: "1px solid rgba(255,255,255,0.3)",

          // shadow deepens when scrolled
          boxShadow: scrolled
            ? `0 4px 24px rgba(0,0,0,0.07), 0 1px 0 ${GREEN_GLOW}`
            : "0 1px 0 rgba(0,0,0,0.04)",

          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Green shimmer line at the bottom edge
            Gradient: transparent → green → transparent
            Ties the navbar into the brand color consistently */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${GREEN_GLOW}, transparent)`,
          pointerEvents: "none",
        }} />

        {/* Inner row — position:relative lets mobile drawer use top:100% */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
            position: "relative",
          }}
        >

          {/* ── LOGO ──────────────────────────────────────── */}
          <Link
            to="/"
            aria-label="DevTrack Home"
            style={{ display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none" }}
          >
            <img
              src={logo}
              alt="DevTrack"
              style={{ height: 32, width: "auto" }}
              onError={e => {
                // If logo.png missing, hide img and show text wordmark
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "inline";
              }}
            />
            {/* Text fallback — hidden by default */}
            <span style={{
              display: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
            }}>
              Dev<span style={{ color: GREEN }}>Track</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ───────────────────────────────── */}
          <DesktopNav user={user} pathname={pathname} />

          {/* ── RIGHT SIDE ────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />

            {user ? (
              <>
                {/* Logged in: avatar dropdown (desktop) + hamburger (mobile) */}
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
              /* Not logged in: Login link + green Get Started CTA */
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--text-secondary, #6b7280)",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: 8,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = GREEN; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary, #6b7280)"; }}
                >
                  Login
                </Link>

                {/* Green CTA — was bg-blue-600, now matches brand */}
                <Link
                  to="/register"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "7px 18px",
                    borderRadius: 9,
                    background: GREEN,
                    boxShadow: `0 2px 12px ${GREEN_GLOW}`,
                    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = GREEN_DARK;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,163,74,0.35)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = GREEN;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 2px 12px ${GREEN_GLOW}`;
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