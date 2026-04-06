// Navbar navigation links and menu items

export const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/ideas", label: "Ideas" },
  { to: "/assignments", label: "Assignments" },
  { to: "/weekly-planner", label: "Planner" },
];

export const PUBLIC_NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const DROPDOWN_MENU_ITEMS = [
  { to: "/profile", label: "Profile" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/change-password", label: "Change Password" },
];

export const MOBILE_ACCOUNT_ITEMS = [
  { to: "/profile", label: "Profile" },
  { to: "/change-password", label: "Change Password" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Avatar color palette
export const AVATAR_COLORS = [
  { bg: "rgba(56,189,248,0.2)", text: "#38bdf8" },
  { bg: "rgba(167,139,250,0.2)", text: "#a78bfa" },
  { bg: "rgba(52,211,153,0.2)", text: "#34d399" },
  { bg: "rgba(251,113,133,0.2)", text: "#fb7185" },
  { bg: "rgba(251,191,36,0.2)", text: "#fbbf24" },
  { bg: "rgba(244,114,182,0.2)", text: "#f472b6" },
  { bg: "rgba(45,212,191,0.2)", text: "#2dd4bf" },
  { bg: "rgba(251,146,60,0.2)", text: "#fb923c" },
];

/**
 * Generate consistent avatar color based on email/username hash
 */
export const getAvatarColor = (identifier = "") => {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};
