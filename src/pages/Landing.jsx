import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FEATURES,
  PROBLEMS,
  SOLUTIONS,
  MOCK_STATS,
  MOCK_ACTIVITY,
  MOCK_SKILLS,
  HOW_IT_WORKS,
  STATS_HIGHLIGHTS,
} from "./landingData";
import herodeveloper from "../assets/hero-developer.png";

// ─────────────────────────────────────────────
// DESIGN TOKENS — change colors in ONE place
// Primary green: #16a34a (green-600)
// Dark green:    #15803d (green-700)  — hover states
// Accent green:  #22c55e (green-500)  — shimmer/glow
// Black:         #0a0a0a             — dark mode bg
// ─────────────────────────────────────────────
const C = {
  primary:     "rgb(22,163,74)",       // green-600
  primaryDark: "rgb(21,128,61)",       // green-700 — hover
  primaryGlow: "rgba(22,163,74,0.15)", // for shadows/glows
  primarySoft: "rgba(22,163,74,0.08)", // for backgrounds
  primaryBorder:"rgba(22,163,74,0.25)",// for borders
};

// ─────────────────────────────────────────────
// useInView — triggers animation when element enters viewport
// IntersectionObserver watches the DOM element attached via ref
// Once visible, sets inView=true and stops watching (plays once)
// ─────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ─────────────────────────────────────────────
// Animate — reusable fade+slide wrapper
// direction: "up" | "down" | "left" | "right"
// delay: ms to wait before starting (for staggering)
// ─────────────────────────────────────────────
function Animate({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const transforms = {
    up:    "translateY(28px)",
    down:  "translateY(-28px)",
    left:  "translateX(28px)",
    right: "translateX(-28px)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0)" : transforms[direction],
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Typewriter — types text char by char
// Uses setTimeout chain — each char adds 45ms
// Blinking cursor shows while typing, hides when done
// ─────────────────────────────────────────────
function Typewriter({ text, delay = 500 }) {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted]     = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!started || displayed >= text.length) return;
    const t = setTimeout(() => setDisplayed(d => d + 1), 48);
    return () => clearTimeout(t);
  }, [started, displayed, text]);
  return (
    <span>
      {text.slice(0, displayed)}
      {displayed < text.length && (
        <span style={{
          display: "inline-block", width: 2, height: "0.85em",
          background: "currentColor", marginLeft: 2,
          verticalAlign: "middle", animation: "blink 1s step-end infinite",
        }} />
      )}
    </span>
  );
}

// ─────────────────────────────────────────────
// Particle — floating dot for background depth
// Absolutely positioned, never blocks clicks
// ─────────────────────────────────────────────
function Particle({ style }) {
  return (
    <div style={{
      position: "absolute", borderRadius: "50%", pointerEvents: "none",
      animation: `float ${style.duration || "6s"} ease-in-out infinite`,
      animationDelay: style.delay || "0s",
      ...style,
    }} />
  );
}

// ─────────────────────────────────────────────
// HERO SECTION — split layout, text left, image right
// ─────────────────────────────────────────────
const HeroSection = () => {
  const [mouse, setMouse] = useState({ x: 30, y: 50 });
  function handleMouseMove(e) {
    setMouse({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{ position: "relative", overflow: "hidden", padding: "6rem 1.5rem 4rem" }}
    >
      {/* Mouse spotlight — green tint follows cursor */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 55% 60% at ${mouse.x}% ${mouse.y}%, ${C.primaryGlow} 0%, transparent 70%)`,
        transition: "background 0.1s ease",
      }} />

      {/* Floating particles — left side only, don't compete with image */}
      <Particle style={{ width: 5, height: 5, background: "rgba(22,163,74,0.3)",  top: "20%", left: "3%",  duration: "7s",  delay: "0s"   }} />
      <Particle style={{ width: 3, height: 3, background: "rgba(22,163,74,0.2)",  top: "55%", left: "7%",  duration: "9s",  delay: "1.2s" }} />
      <Particle style={{ width: 4, height: 4, background: "rgba(22,163,74,0.15)", top: "75%", left: "12%", duration: "11s", delay: "2.5s" }} />

      {/* ── SPLIT GRID ──
          Two equal columns on desktop.
          auto-fit + minmax(300px) = stacks to 1 column on mobile
          alignItems:center = both columns vertically centered
      ── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "3rem",
        alignItems: "center",
      }}>

        {/* LEFT — text content */}
        <div style={{ textAlign: "left" }}>

          {/* Badge */}
          <div className="animate-hero-badge" style={{ marginBottom: 22 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 12, fontFamily: "DM Mono, monospace",
              color: C.primary,
              border: `1px solid ${C.primaryBorder}`,
              background: C.primarySoft,
              padding: "5px 14px", borderRadius: 999, letterSpacing: "0.02em",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: C.primary, display: "inline-block",
                animation: "pulse 2s ease infinite",
              }} />
              Built for focused developers
            </span>
          </div>

          {/* Headline
              clamp(min, vw-based, max) = responsive without media queries
              letterSpacing: -0.03em = premium tight headline feel */}
          <h1 className="animate-hero-h1" style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#0a0a0a",
            margin: "0 0 1.2rem",
          }}>
            See exactly how{" "}
            <br />
            you're{" "}
            {/* Gradient text trick:
                backgroundImage sets the gradient
                WebkitBackgroundClip:"text" clips gradient to text shape
                WebkitTextFillColor:"transparent" makes text show gradient
                shimmer animation moves the gradient horizontally */}
            <span style={{
              backgroundImage: `linear-gradient(90deg, ${C.primary}, #86efac, ${C.primary})`,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite",
            }}>
              <Typewriter text="improving" delay={400} />
            </span>
            <br />
            as a developer
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-sub" style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            color: "#4b5563",
            lineHeight: 1.75,
            margin: "0 0 2.25rem",
          }}>
            DevTrack connects your projects, skills, and ideas into one
            system so you can track real progress and stay focused on
            what matters.
          </p>

          {/* CTAs — left aligned to match text */}
          <div className="animate-hero-cta" style={{
            display: "flex", justifyContent: "flex-start",
            gap: 12, flexWrap: "wrap",
          }}>
            <Link
              to="/register"
              style={{
                background: C.primary, color: "#fff", fontWeight: 600,
                padding: "11px 28px", borderRadius: 10, fontSize: 14,
                textDecoration: "none",
                boxShadow: `0 4px 20px ${C.primaryGlow}`,
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = C.primaryDark;
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(22,163,74,0.35)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = C.primary;
                e.currentTarget.style.boxShadow = `0 4px 20px ${C.primaryGlow}`;
              }}
            >
              Start tracking free
            </Link>
            <Link
              to="/login"
              style={{
                border: "1px solid rgba(0,0,0,0.12)", color: "#374151",
                fontWeight: 500, padding: "11px 28px", borderRadius: 10,
                fontSize: 14, textDecoration: "none",
                transition: "border-color 0.2s, transform 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.color = C.primary;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                e.currentTarget.style.color = "#374151";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Sign in
            </Link>
          </div>

          {/* Scroll indicator */}
          <div style={{
            marginTop: 48, display: "flex", alignItems: "center",
            gap: 8, opacity: 0.35,
            animation: "bounce 2s ease-in-out infinite",
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 11, fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}>scroll</span>
          </div>
        </div>

        {/* RIGHT — hero image with gradient fades */}
        <div className="animate-hero-img" style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
        }}>
          <img
            src={herodeveloper}
            alt="Developer at desk tracking progress with DevTrack"
            width={720}
            height={540}
            style={{
              width: "100%", height: "auto", display: "block",
              transition: "transform 0.6s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          />

          {/* Left fade — blends image into white page bg seamlessly */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
            background: "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none", zIndex: 1,
          }} />

          {/* Bottom fade — removes hard bottom edge */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, width: "100%", height: "35%",
            background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none", zIndex: 1,
          }} />

          {/* Green glow behind image — adds depth */}
          <div style={{
            position: "absolute", bottom: -20, right: -20, width: 200, height: 200,
            borderRadius: "50%", background: "rgba(22,163,74,0.08)",
            pointerEvents: "none", zIndex: 0,
            filter: "blur(40px)",
          }} />
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// PRODUCT MOCK — browser window preview
// Each inner card staggered with increasing transition-delay
// ─────────────────────────────────────────────
const ProductMockSection = () => {
  const [ref, inView] = useInView();
  return (
    <section style={{ padding: "0 1.5rem 5rem" }}>
      <div ref={ref} style={{
        maxWidth: 860, margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(36px) scale(0.98)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          {/* Browser chrome */}
          <div style={{
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            padding: "10px 16px", display: "flex", alignItems: "center",
            gap: 6, background: "#f9fafb",
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fc615d" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fdbc40" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#34c749" }} />
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#9ca3af", marginLeft: 10 }}>
              devtrack — dashboard
            </span>
          </div>

          <div style={{ padding: "20px 20px 24px" }}>
            {/* Stats row — staggered delay per card */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: 10, marginBottom: 16,
            }}>
              {MOCK_STATS.map((s, i) => (
                <div key={s.label} style={{
                  background: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 10, padding: "12px 14px",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${300 + i * 100}ms, transform 0.5s ease ${300 + i * 100}ms`,
                }}>
                  <p style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af", marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Activity + Skills
                FIX: "repeat(auto-fit, minmax(180px, 1fr))" replaces hardcoded "3fr 2fr"
                This stacks properly on mobile screens under 400px */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}>
              {/* Activity feed */}
              <div style={{
                background: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 10, padding: 16,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-16px)",
                transition: "opacity 0.6s ease 600ms, transform 0.6s ease 600ms",
              }}>
                <p style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Recent activity
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {MOCK_ACTIVITY.map((item, i) => (
                    <div key={item.text} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ease ${700 + i * 80}ms`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0 }} className={item.color} />
                      <span style={{ fontSize: 12, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.text}
                      </span>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af", flexShrink: 0 }}>
                        {item.level || item.status || item.complexity || item.due}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill bars — widths animate from 0 to actual % */}
              <div style={{
                background: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 10, padding: 16,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(16px)",
                transition: "opacity 0.6s ease 700ms, transform 0.6s ease 700ms",
              }}>
                <p style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Skill depth
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {MOCK_SKILLS.map((skill, i) => (
                    <div key={skill.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "#6b7280" }}>{skill.name}</span>
                        <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af" }}>{skill.pct}%</span>
                      </div>
                      <div style={{ background: "rgba(0,0,0,0.06)", height: 4, borderRadius: 999, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 999,
                          // Green skill bars — override Tailwind color classes
                          background: C.primary,
                          width: inView ? `${skill.pct}%` : "0%",
                          transition: `width 1s ease ${800 + i * 150}ms`,
                          opacity: 0.85,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "DM Mono, monospace", textAlign: "center", color: "#9ca3af", fontSize: 11, marginTop: 12 }}>
          your entire dev system in one place
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// STATS HIGHLIGHTS
// ─────────────────────────────────────────────
const StatsHighlights = () => (
  <div style={{
    borderTop: "1px solid rgba(0,0,0,0.06)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(249,250,251,0.9)", padding: "20px 1.5rem",
  }}>
    <div style={{
      maxWidth: 860, margin: "0 auto",
      display: "flex", justifyContent: "center",
      gap: "clamp(1.5rem, 5vw, 3.5rem)", flexWrap: "wrap",
    }}>
      {STATS_HIGHLIGHTS.map(label => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary }} />
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "#6b7280", margin: 0 }}>{label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// FEATURES — hover lift cards
// ─────────────────────────────────────────────
const FeaturesSection = () => (
  <section style={{ padding: "5rem 1.5rem" }}>
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Animate direction="up">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{
            fontFamily: "DM Mono, monospace", fontSize: 11,
            color: C.primary, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 12,
          }}>
            built for clarity
          </p>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
            Everything you need. Nothing you don't.
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 400, margin: "0 auto" }}>
            Four modules that work together to keep you moving.
          </p>
        </div>
      </Animate>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {FEATURES.map(({ icon, title, desc }, i) => (
          <Animate key={title} delay={i * 90} direction="up">
            <FeatureCard icon={icon} title={title} desc={desc} />
          </Animate>
        ))}
      </div>
    </div>
  </section>
);

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fff" : "#fafafa",
        border: hovered ? `1px solid ${C.primaryBorder}` : "1px solid rgba(0,0,0,0.07)",
        borderRadius: 14, padding: "24px 22px",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 40px ${C.primaryGlow}` : "none",
        transition: "all 0.25s ease", cursor: "default",
        // min-height so cards are equal height in a row
        height: "100%", boxSizing: "border-box",
      }}
    >
      <span style={{
        fontSize: 22, display: "inline-block", marginBottom: 16,
        padding: "8px 10px",
        background: hovered ? C.primarySoft : "rgba(0,0,0,0.04)",
        borderRadius: 10, transition: "background 0.25s",
      }}>
        {icon}
      </span>
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: "#111" }}>{title}</h3>
      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const HowItWorksSection = () => (
  <section style={{
    padding: "4rem 1.5rem",
    background: "rgba(249,250,251,0.9)",
    borderTop: "1px solid rgba(0,0,0,0.06)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  }}>
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <Animate direction="up">
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 40 }}>
          How it works
        </h2>
      </Animate>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
        {HOW_IT_WORKS.map((item, i) => (
          <Animate key={item.step} delay={i * 120} direction="up">
            <div style={{ textAlign: "center", padding: "0 12px" }}>
              <p style={{
                fontFamily: "DM Mono, monospace", fontSize: 42, fontWeight: 500,
                // Green faded step number
                color: "rgba(22,163,74,0.2)", marginBottom: 12, lineHeight: 1,
              }}>
                {item.step}
              </p>
              <h3 style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          </Animate>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// PROBLEM / SOLUTION
// ─────────────────────────────────────────────
const ProblemSolutionSection = () => (
  <section style={{ padding: "5rem 1.5rem" }}>
    <div style={{
      maxWidth: 860, margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 14,
    }}>
      <Animate direction="right">
        <div style={{
          background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: 14, padding: "28px 26px", height: "100%", boxSizing: "border-box",
        }}>
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            The problem
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {PROBLEMS.map(p => (
              <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "#6b7280" }}>
                <span style={{ color: "#d1d5db", marginTop: 2, flexShrink: 0 }}>—</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Animate>
      <Animate direction="left">
        {/* Solution card — black background for dark contrast */}
        <div style={{
          background: "#0a0a0a",
          borderRadius: 14, padding: "28px 26px", height: "100%", boxSizing: "border-box",
        }}>
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "rgba(134,239,172,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            The solution
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {SOLUTIONS.map(s => (
              <li key={s} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                {/* Green checkmark on dark bg */}
                <span style={{ color: C.primary, marginTop: 2, flexShrink: 0, fontWeight: 700 }}>✔</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Animate>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────
const CTASection = () => (
  <section style={{ padding: "0 1.5rem 6rem" }}>
    <Animate direction="up">
      <div style={{
        maxWidth: 600, margin: "0 auto", textAlign: "center",
        background: "#0a0a0a",
        borderRadius: 20,
        padding: "clamp(2rem, 5vw, 3.5rem)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Green glow top-right corner decoration */}
        <div style={{
          position: "absolute", top: -40, right: -40, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(22,163,74,0.12)",
          pointerEvents: "none", filter: "blur(30px)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(22,163,74,0.08)",
          pointerEvents: "none", filter: "blur(24px)",
        }} />

        <h2 style={{
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 700,
          letterSpacing: "-0.02em", marginBottom: 12,
          color: "#fff",
        }}>
          Take control of your dev growth
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", maxWidth: 320, margin: "0 auto 32px" }}>
          Start tracking your real progress today. Free forever.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link
            to="/register"
            style={{
              background: C.primary, color: "#fff", fontWeight: 600,
              padding: "11px 28px", borderRadius: 10, fontSize: 14,
              textDecoration: "none",
              boxShadow: `0 4px 20px rgba(22,163,74,0.4)`,
              transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = C.primaryDark;
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(22,163,74,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = C.primary;
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(22,163,74,0.4)`;
            }}
          >
            Get started free
          </Link>
          <Link
            to="/about"
            style={{
              border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)",
              padding: "11px 28px", borderRadius: 10, fontSize: 14, fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.primaryBorder;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Learn more
          </Link>
        </div>
      </div>
    </Animate>
  </section>
);

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    borderTop: "1px solid rgba(0,0,0,0.06)",
    background: "#0a0a0a",
    padding: "2.5rem 1.5rem",
  }}>
    <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div>
          <h3 style={{ fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 4px", color: "#fff" }}>
            Dev<span style={{ color: C.primary }}>Track</span>
          </h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>A system for focused developers</p>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {[["Explore", [["About", "/about"], ["Contact", "/contact"]]], ["Account", [["Login", "/login"], ["Register", "/register"]]]].map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontSize: 11, fontWeight: 500, marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>{heading}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to}
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = C.primary; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20,
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
      }}>
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 DevTrack</p>
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>Built by Roy Mulinge</p>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
const Landing = () => {
  return (
    <div style={{
      background: "#fff", color: "#111",
      minHeight: "100vh", fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        /* ── DOT GRID BACKGROUND ─────────────────────────
           Creates subtle dot pattern on the page background.
           radial-gradient makes a dot, background-size tiles it.
           This is the same technique used by Linear, Vercel. */
        body {
          background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── HERO ENTRANCE ANIMATIONS ───────────────────── */
        @keyframes heroFadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPop {
          from { opacity: 0; transform: scale(0.95) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes heroFadeLeft {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .animate-hero-badge { animation: heroFadeDown 0.6s ease 0.1s both; }
        .animate-hero-h1    { animation: heroFadeUp   0.7s ease 0.25s both; }
        .animate-hero-sub   { animation: heroFadeUp   0.7s ease 0.4s both; }
        .animate-hero-cta   { animation: heroPop      0.6s ease 0.55s both; }
        .animate-hero-img   { animation: heroFadeLeft 0.9s ease 0.3s both; }

        /* ── REPEATING ANIMATIONS ───────────────────────── */
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── MOBILE FIXES ───────────────────────────────── */

        /* On small screens, reduce hero padding */
        @media (max-width: 640px) {
          section { padding-left: 1rem !important; padding-right: 1rem !important; }
        }

        /* Skill bar color override — uses green instead of Tailwind classes */
        .bg-blue-500, .bg-green-500, .bg-purple-500, .bg-amber-500, .bg-red-500 {
          background-color: rgb(22,163,74);
        }
        .bg-blue-400, .bg-green-400, .bg-purple-400, .bg-amber-400, .bg-red-400 {
          background-color: rgb(74,222,128);
        }
      `}</style>

      <HeroSection />
      <ProductMockSection />
      <StatsHighlights />
      <FeaturesSection />
      <HowItWorksSection />
      <ProblemSolutionSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;