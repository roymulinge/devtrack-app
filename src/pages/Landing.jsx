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

// ─────────────────────────────────────────────
// ANIMATION HOOK — watches when element enters viewport
// Used to trigger animations only when user scrolls to them
// IntersectionObserver fires the callback when element is visible
// ─────────────────────────────────────────────
function useInView(options = {}) {
  // ref: attach to the DOM element we want to watch
  const ref = useRef(null);
  // inView: tracks whether element is currently visible
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Create observer — fires callback when visibility changes
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting = true when element enters viewport
        if (entry.isIntersecting) {
          setInView(true);
          // Once visible, stop watching — animation plays once
          observer.disconnect();
        }
      },
      // threshold: 0.15 = trigger when 15% of element is visible
      { threshold: 0.15, ...options }
    );

    // Start watching the element
    if (ref.current) observer.observe(ref.current);

    // Cleanup: stop observer when component unmounts
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// ─────────────────────────────────────────────
// ANIMATED WRAPPER — wraps any section with fade+slide animation
// children: what to animate
// delay: milliseconds before animation starts (staggering effect)
// direction: which direction to slide from
// ─────────────────────────────────────────────
function Animate({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();

  // Map direction to starting transform position
  const transforms = {
    up: "translateY(32px)",      // starts 32px below
    down: "translateY(-32px)",   // starts 32px above
    left: "translateX(32px)",    // starts 32px to the right
    right: "translateX(-32px)",  // starts 32px to the left
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        // Start invisible and offset
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0)" : transforms[direction],
        // Smooth transition for both opacity and position
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// TYPEWRITER — animates text character by character
// text: the string to type out
// delay: how many ms to wait before starting
// ─────────────────────────────────────────────
function Typewriter({ text, delay = 800 }) {
  // displayed: how many characters to show so far
  const [displayed, setDisplayed] = useState(0);
  // started: whether the delay has passed
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Wait for the delay before starting to type
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed >= text.length) return;

    // Add one character every 45ms
    const timer = setTimeout(() => {
      setDisplayed((d) => d + 1);
    }, 45);

    return () => clearTimeout(timer);
  }, [started, displayed, text]);

  return (
    <span>
      {/* Show only the characters typed so far */}
      {text.slice(0, displayed)}
      {/* Blinking cursor — hides when typing is done */}
      {displayed < text.length && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "0.9em",
            background: "currentColor",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "blink 1s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

// ─────────────────────────────────────────────
// COUNTER — animates a number counting up from 0
// end: target number
// duration: total time in ms
// suffix: text after number (like "+" or "%")
// ─────────────────────────────────────────────
function Counter({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!inView) return;

    let startTime = null;
    const startValue = 0;

    // requestAnimationFrame gives us smooth 60fps animation
    function animate(currentTime) {
      if (!startTime) startTime = currentTime;

      // progress: 0 to 1 over the duration
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOut: starts fast, slows at end — feels natural
      // Formula: 1 - (1-progress)^3
      const eased = 1 - Math.pow(1 - progress, 3);

      // Calculate current count value
      setCount(Math.floor(startValue + (end - startValue) * eased));

      // Keep animating until progress reaches 1
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────
// FLOATING PARTICLE — single animated dot in background
// style: CSS position/size/color overrides
// ─────────────────────────────────────────────
function Particle({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        pointerEvents: "none",
        // Each particle has a random float animation
        animation: `float ${style.duration || "6s"} ease-in-out infinite`,
        animationDelay: style.delay || "0s",
        ...style,
      }}
    />
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
const HeroSection = () => {
  // Track mouse position for the spotlight glow effect
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  function handleMouseMove(e) {
    // Convert pixel position to percentage of window
    setMouse({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{ position: "relative", padding: "7rem 1.5rem 5rem", overflow: "hidden" }}
    >
      {/* Mouse-following spotlight — follows cursor smoothly */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          // Radial gradient centered on mouse position
          background: `radial-gradient(ellipse 60% 50% at ${mouse.x}% ${mouse.y}%, rgba(59,130,246,0.08) 0%, transparent 70%)`,
          pointerEvents: "none",
          // Smooth transition so it doesn't jump
          transition: "background 0.1s ease",
          zIndex: 0,
        }}
      />

      {/* Floating background particles */}
      <Particle style={{ width: 6, height: 6, background: "rgba(59,130,246,0.25)", top: "20%", left: "10%", duration: "7s", delay: "0s" }} />
      <Particle style={{ width: 4, height: 4, background: "rgba(99,102,241,0.2)", top: "60%", left: "5%", duration: "9s", delay: "1s" }} />
      <Particle style={{ width: 5, height: 5, background: "rgba(59,130,246,0.15)", top: "30%", right: "8%", duration: "8s", delay: "2s" }} />
      <Particle style={{ width: 3, height: 3, background: "rgba(139,92,246,0.2)", top: "70%", right: "15%", duration: "6s", delay: "0.5s" }} />
      <Particle style={{ width: 6, height: 6, background: "rgba(59,130,246,0.1)", top: "80%", left: "20%", duration: "10s", delay: "3s" }} />

      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Badge — slides down from above */}
        <div
          className="animate-hero-badge"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontFamily: "DM Mono, monospace",
              color: "rgb(59,130,246)",
              border: "1px solid rgba(59,130,246,0.25)",
              background: "rgba(59,130,246,0.06)",
              padding: "5px 14px",
              borderRadius: 999,
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgb(59,130,246)",
                display: "inline-block",
                // Pulse animation — draws attention
                animation: "pulse 2s ease infinite",
              }}
            />
            Built for focused developers
          </span>
        </div>

        {/* Main headline — fades up */}
        <h1
          className="animate-hero-h1"
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "var(--hero-text, #111)",
            margin: "0 0 1.5rem",
          }}
        >
          See exactly how you're{" "}
          <span
            style={{
              color: "rgb(59,130,246)",
              // Shimmer animation on the blue word
              backgroundImage: "linear-gradient(90deg, rgb(59,130,246), rgb(99,102,241), rgb(59,130,246))",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite",
            }}
          >
            <Typewriter text="improving" delay={400} />
          </span>
          <br />
          as a developer
        </h1>

        {/* Subtitle — slightly delayed fade */}
        <p
          className="animate-hero-sub"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            color: "#6b7280",
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto 2.5rem",
          }}
        >
          DevTrack connects your projects, skills, and ideas into one system so
          you can track real progress and stay focused on what matters.
        </p>

        {/* CTA buttons — staggered pop-in */}
        <div
          className="animate-hero-cta"
          style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}
        >
          <Link
            to="/register"
            style={{
              background: "rgb(37,99,235)",
              color: "#fff",
              fontWeight: 500,
              padding: "11px 28px",
              borderRadius: 10,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,99,235,0.3)";
            }}
          >
            Start tracking free
          </Link>
          <Link
            to="/login"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              color: "#374151",
              fontWeight: 500,
              padding: "11px 28px",
              borderRadius: 10,
              fontSize: 14,
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Scroll indicator arrow */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.4,
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 11, fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}>
            scroll
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// PRODUCT MOCK — dashboard preview with staggered card reveals
// ─────────────────────────────────────────────
const ProductMockSection = () => {
  const [ref, inView] = useInView();

  return (
    <section style={{ padding: "0 1.5rem 5rem" }}>
      <div
        ref={ref}
        style={{
          maxWidth: 860,
          margin: "0 auto",
          // Slide up and fade in when in view
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.98)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Window chrome — the fake browser bar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Top bar with traffic light dots */}
          <div
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#f9fafb",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fc615d" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fdbc40" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#34c749" }} />
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 11,
                color: "#9ca3af",
                marginLeft: 10,
              }}
            >
              devtrack — dashboard
            </span>
          </div>

          {/* Dashboard content */}
          <div style={{ padding: "20px 20px 24px" }}>

            {/* Stats row — each card staggered */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {MOCK_STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    // Each card delays 100ms more than previous
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${300 + i * 100}ms, transform 0.5s ease ${300 + i * 100}ms`,
                  }}
                >
                  <p style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af", marginBottom: 4 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Two column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 10 }}>

              {/* Activity feed */}
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 10,
                  padding: 16,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(-16px)",
                  transition: "opacity 0.6s ease 600ms, transform 0.6s ease 600ms",
                }}
              >
                <p style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Recent activity
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {MOCK_ACTIVITY.map((item, i) => (
                    <div
                      key={item.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.4s ease ${700 + i * 80}ms`,
                      }}
                    >
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

              {/* Skill bars */}
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 10,
                  padding: 16,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(16px)",
                  transition: "opacity 0.6s ease 700ms, transform 0.6s ease 700ms",
                }}
              >
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
                      {/* Skill bar — animates width when in view */}
                      <div style={{ background: "rgba(0,0,0,0.06)", height: 4, borderRadius: 999, overflow: "hidden" }}>
                        <div
                          className={skill.color}
                          style={{
                            height: "100%",
                            borderRadius: 999,
                            // Width animates from 0 to actual % when section enters view
                            width: inView ? `${skill.pct}%` : "0%",
                            transition: `width 1s ease ${800 + i * 150}ms`,
                            opacity: 0.8,
                          }}
                        />
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
// STATS HIGHLIGHTS — counting numbers animate up
// ─────────────────────────────────────────────
const StatsHighlights = () => (
  <div
    style={{
      borderTop: "1px solid rgba(0,0,0,0.06)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      background: "rgba(249,250,251,0.8)",
      padding: "20px 1.5rem",
    }}
  >
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        gap: "clamp(1.5rem, 5vw, 3.5rem)",
        flexWrap: "wrap",
      }}
    >
      {STATS_HIGHLIGHTS.map((label) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgb(59,130,246)" }} />
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "#6b7280", margin: 0 }}>{label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// FEATURES — cards animate in with stagger
// ─────────────────────────────────────────────
const FeaturesSection = () => (
  <section style={{ padding: "5rem 1.5rem" }}>
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Animate direction="up">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 11,
              color: "rgb(59,130,246)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 12,
            }}
          >
            built for clarity
          </p>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
            Everything you need. Nothing you don't.
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 400, margin: "0 auto" }}>
            Four modules that work together to keep you moving.
          </p>
        </div>
      </Animate>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {FEATURES.map(({ icon, title, desc }, i) => (
          <Animate key={title} delay={i * 100} direction="up">
            <FeatureCard icon={icon} title={title} desc={desc} />
          </Animate>
        ))}
      </div>
    </div>
  </section>
);

// Single feature card with hover lift effect
function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fff" : "#fafafa",
        border: hovered ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(0,0,0,0.07)",
        borderRadius: 14,
        padding: "24px 22px",
        // Lift effect on hover
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(59,130,246,0.08)" : "none",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
    >
      {/* Icon with animated background */}
      <span
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 22,
          display: "inline-block",
          marginBottom: 16,
          padding: "8px 10px",
          background: hovered ? "rgba(59,130,246,0.08)" : "rgba(0,0,0,0.04)",
          borderRadius: 10,
          transition: "background 0.25s",
        }}
      >
        {icon}
      </span>
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: "#111" }}>{title}</h3>
      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// HOW IT WORKS — numbered steps with connecting line
// ─────────────────────────────────────────────
const HowItWorksSection = () => (
  <section
    style={{
      padding: "4rem 1.5rem",
      background: "rgba(249,250,251,0.8)",
      borderTop: "1px solid rgba(0,0,0,0.06)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
    }}
  >
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <Animate direction="up">
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 40 }}>
          How it works
        </h2>
      </Animate>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {HOW_IT_WORKS.map((item, i) => (
          <Animate key={item.step} delay={i * 120} direction="up">
            <div style={{ textAlign: "center", padding: "0 12px" }}>
              {/* Step number — large faded */}
              <p
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 42,
                  fontWeight: 500,
                  color: "rgba(59,130,246,0.2)",
                  marginBottom: 12,
                  lineHeight: 1,
                }}
              >
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
// PROBLEM / SOLUTION — side by side with reveal
// ─────────────────────────────────────────────
const ProblemSolutionSection = () => (
  <section style={{ padding: "5rem 1.5rem" }}>
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 14,
      }}
    >
      {/* Problem card — slides from left */}
      <Animate direction="right">
        <div
          style={{
            background: "#fafafa",
            border: "1px solid rgba(0,0,0,0.07)",
            borderRadius: 14,
            padding: "28px 26px",
          }}
        >
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            The problem
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {PROBLEMS.map((p) => (
              <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "#6b7280" }}>
                <span style={{ color: "#d1d5db", marginTop: 2, flexShrink: 0 }}>—</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Animate>

      {/* Solution card — slides from right, blue background */}
      <Animate direction="left">
        <div
          style={{
            background: "rgb(37,99,235)",
            borderRadius: 14,
            padding: "28px 26px",
          }}
        >
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "rgba(191,219,254,0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            The solution
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {SOLUTIONS.map((s) => (
              <li key={s} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "rgba(239,246,255,0.9)" }}>
                <span style={{ color: "rgba(147,197,253,0.9)", marginTop: 2, flexShrink: 0 }}>✔</span>
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
// CTA SECTION — final call to action
// ─────────────────────────────────────────────
const CTASection = () => (
  <section style={{ padding: "0 1.5rem 6rem" }}>
    <Animate direction="up">
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 20,
          padding: "clamp(2rem, 5vw, 3.5rem)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow in top corner */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.06)",
            pointerEvents: "none",
          }}
        />

        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 12 }}>
          Take control of your dev growth
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32, maxWidth: 320, margin: "0 auto 32px" }}>
          Start tracking your real progress today. Free forever.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link
            to="/register"
            style={{
              background: "rgb(37,99,235)",
              color: "#fff",
              fontWeight: 500,
              padding: "11px 28px",
              borderRadius: 10,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.3)";
            }}
          >
            Get started free
          </Link>
          <Link
            to="/about"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              color: "#374151",
              padding: "11px 28px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
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
  <footer style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "2.5rem 1.5rem" }}>
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div>
          <h3 style={{ fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
            Dev<span style={{ color: "rgb(59,130,246)" }}>Track</span>
          </h3>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>A system for focused developers</p>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 500, marginBottom: 10 }}>Explore</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {[["About", "/about"], ["Contact", "/contact"]].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#111"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 500, marginBottom: 10 }}>Account</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {[["Login", "/login"], ["Register", "/register"]].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#111"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.05)",
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#9ca3af", margin: 0 }}>© 2026 DevTrack</p>
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#9ca3af", margin: 0 }}>Built by Roy Mulinge</p>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
const Landing = () => {
  return (
    <div
      style={{
        background: "#fff",
        color: "#111",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        "--hero-text": "#0f172a",
      }}
    >
      {/* All keyframe animations defined once here */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        /* ── Hero entrance animations ─────────────────── */
        @keyframes heroFadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPop {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Badge slides down */
        .animate-hero-badge {
          animation: heroFadeDown 0.6s ease 0.1s both;
        }
        /* Headline fades up */
        .animate-hero-h1 {
          animation: heroFadeUp 0.7s ease 0.25s both;
        }
        /* Subtitle fades up after headline */
        .animate-hero-sub {
          animation: heroFadeUp 0.7s ease 0.4s both;
        }
        /* Buttons pop in last */
        .animate-hero-cta {
          animation: heroPop 0.6s ease 0.55s both;
        }

        /* ── Repeating animations ─────────────────────── */

        /* Dot pulse — breathing effect on the badge dot */
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }

        /* Shimmer — moves gradient across text */
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Float — particles drift up and down */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-12px) rotate(5deg); }
          66%       { transform: translateY(6px) rotate(-3deg); }
        }

        /* Bounce — scroll indicator arrow */
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }

        /* Blink — typewriter cursor */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Dark mode overrides ──────────────────────── */
        @media (prefers-color-scheme: dark) {
          /* These selectors override inline styles in dark mode */
        }

        /* ── Tailwind color classes for skill bars ────── */
        /* Keep compatibility with existing landingData */
        .bg-blue-500  { background-color: rgb(59,130,246); }
        .bg-green-500 { background-color: rgb(34,197,94); }
        .bg-purple-500{ background-color: rgb(168,85,247); }
        .bg-amber-500 { background-color: rgb(245,158,11); }
        .bg-red-500   { background-color: rgb(239,68,68); }

        /* Activity dot colors */
        .bg-blue-400  { background-color: rgb(96,165,250); }
        .bg-green-400 { background-color: rgb(74,222,128); }
        .bg-purple-400{ background-color: rgb(192,132,252); }
        .bg-amber-400 { background-color: rgb(251,191,36); }
        .bg-red-400   { background-color: rgb(248,113,113); }
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