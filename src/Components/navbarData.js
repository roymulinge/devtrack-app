// ─────────────────────────────────────────────────────────
// navbarData.js — all navbar static data in one place
//
// WHY a separate data file?
// Keeps the component file (Navbar.jsx) focused on UI logic.
// When you add/remove routes, you only touch this file.
// This pattern is called "data/view separation" — used in every
// professional React codebase.
// ─────────────────────────────────────────────────────────

// Authenticated user navigation — shown when logged in
export const NAV_LINKS = [
  { to: "/dashboard",     label: "Dashboard"  },
  { to: "/projects",      label: "Projects"   },
  { to: "/skills",        label: "Skills"     },
  { to: "/ideas",         label: "Ideas"      },
  { to: "/assignments",   label: "Assignments"},
  { to: "/weekly-planner",label: "Planner"    },
];

// Public navigation — shown when NOT logged in
export const PUBLIC_NAV_LINKS = [
  { to: "/about",   label: "About"   },
  { to: "/contact", label: "Contact" },
];

// Desktop profile dropdown items
export const DROPDOWN_MENU_ITEMS = [
  { to: "/profile",         label: "Profile"         },
  { to: "/dashboard",       label: "Dashboard"       },
  { to: "/about",           label: "About"           },
  { to: "/contact",         label: "Contact"         },
  { to: "/change-password", label: "Change Password" },
];

// Mobile menu account section items
export const MOBILE_ACCOUNT_ITEMS = [
  { to: "/profile",         label: "Profile"         },
  { to: "/change-password", label: "Change Password" },
  { to: "/about",           label: "About"           },
  { to: "/contact",         label: "Contact"         },
];

// ─────────────────────────────────────────────────────────
// Avatar color palette
//
// Each entry has:
//   bg:   semi-transparent background for the circle
//   text: solid color for the letter inside
//
// Colors are intentionally soft/muted — too vivid looks cheap.
// They pair well with both the green brand and dark glass UI.
// ─────────────────────────────────────────────────────────
export const AVATAR_COLORS = [
  { bg: "rgba(56,189,248,0.18)",  text: "#38bdf8" }, // sky
  { bg: "rgba(167,139,250,0.18)", text: "#a78bfa" }, // violet
  { bg: "rgba(52,211,153,0.18)",  text: "#34d399" }, // emerald
  { bg: "rgba(251,113,133,0.18)", text: "#fb7185" }, // rose
  { bg: "rgba(251,191,36,0.18)",  text: "#fbbf24" }, // amber
  { bg: "rgba(244,114,182,0.18)", text: "#f472b6" }, // pink
  { bg: "rgba(45,212,191,0.18)",  text: "#2dd4bf" }, // teal
  { bg: "rgba(251,146,60,0.18)",  text: "#fb923c" }, // orange
];

// ─────────────────────────────────────────────────────────
// getAvatarColor — deterministic color from user identifier
//
// Algorithm: djb2 hash (simple, fast, good distribution)
//   hash = charCode + (hash << 5) - hash
//   (hash << 5) = hash * 32, so this is hash * 33 + charCode
//
// Result: same email always → same color across sessions.
// No randomness, no storage needed.
//
// Example:
//   "roy@example.com" → hash → index 3 → rose color
//   Every time, consistently.
// ─────────────────────────────────────────────────────────
export const getAvatarColor = (identifier = "") => {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    // djb2 hash step: accumulate char codes with bit shift
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Math.abs prevents negative index, % wraps within array bounds
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};