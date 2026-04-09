import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const DailyFocusWidget = () => {
  const { user }              = useContext(AuthContext);
  const location              = useLocation();
  const [open, setOpen]       = useState(false);
  const [focus, setFocus]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed]   = useState(false);   // ← tracks 502/network errors

  const hide = ["/login", "/register", "/", "/about", "/contact"].includes(location.pathname)
    || location.pathname.startsWith("/verify-email");

  useEffect(() => {
    if (!user || hide) return;

    let cancelled = false;

    const fetchFocus = async () => {
      setFailed(false);
      try {
        const res = await api.get("/planning/daily-focus/");
        if (!cancelled) setFocus(res.data);
      } catch (err) {
        console.error("Focus fetch error:", err);
        // 502 = server sleeping on Render free tier — fail silently, don't crash
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFocus();
    return () => { cancelled = true; };
  }, [user, location.pathname]);

  // Don't render anything if hidden, loading, or fetch failed (502 etc.)
  if (!user || hide || loading || failed) return null;

  const totalUrgent = focus?.total_urgent ?? 0;
  const hasItems    = totalUrgent > 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {open && focus && (
        <div className="w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">

          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-sky-400 uppercase tracking-widest">daily focus</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Here's what needs your attention</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">

            {focus.urgent_assignments?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
                  Urgent Assignments
                </p>
                <ul className="space-y-2">
                  {focus.urgent_assignments.map((a) => (
                    <li key={a.id} className="flex items-start gap-2 bg-red-500/5 border border-red-500/15 rounded-lg p-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[var(--text-primary)] font-medium truncate">{a.title}</p>
                        <p className="text-xs font-mono mt-0.5">
                          {a.days === null
                            ? <span className="text-[var(--text-muted)]">no deadline</span>
                            : a.days < 0
                            ? <span className="text-red-400">{Math.abs(a.days)}d overdue</span>
                            : a.days === 0
                            ? <span className="text-red-400">due today!</span>
                            : <span className="text-amber-400">due in {a.days}d</span>
                          }
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/assignments"
                  className="block text-right text-xs text-sky-400 mt-2 hover:text-sky-300 transition"
                  onClick={() => setOpen(false)}
                >
                  view assignments →
                </Link>
              </div>
            )}

            {focus.stale_skills?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                  Skills Needing Practice
                </p>
                <ul className="space-y-2">
                  {focus.stale_skills.map((s) => (
                    <li key={s.id} className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 rounded-lg p-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[var(--text-primary)] font-medium truncate">{s.name}</p>
                        <p className="text-xs font-mono text-amber-600 mt-0.5">
                          {s.days_ago === null ? "never practiced" : `${s.days_ago}d ago`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/skills"
                  className="block text-right text-xs text-sky-400 mt-2 hover:text-sky-300 transition"
                  onClick={() => setOpen(false)}
                >
                  view skills →
                </Link>
              </div>
            )}

            {focus.overdue_projects?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">
                  Projects Needing Attention
                </p>
                <ul className="space-y-2">
                  {focus.overdue_projects.map((p) => (
                    <li key={p.id} className="flex items-start gap-2 bg-violet-500/5 border border-violet-500/15 rounded-lg p-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1 shrink-0" />
                      <p className="text-xs text-[var(--text-primary)] font-medium truncate">{p.name}</p>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/projects"
                  className="block text-right text-xs text-sky-400 mt-2 hover:text-sky-300 transition"
                  onClick={() => setOpen(false)}
                >
                  view projects →
                </Link>
              </div>
            )}

            {!hasItems && (
              <div className="text-center py-4">
                <p className="text-sm font-bold text-emerald-400 mb-1">All clear!</p>
                <p className="text-xs text-[var(--text-muted)]">No urgent tasks right now.</p>
              </div>
            )}

          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
          ${open
            ? "bg-sky-400 text-[#090d13]"
            : hasItems
            ? "bg-[var(--bg-surface)] border border-red-500/30 text-red-400 hover:border-red-500/60"
            : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border)]"
          }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>

        {hasItems && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold font-mono flex items-center justify-center">
            {totalUrgent > 9 ? "9+" : totalUrgent}
          </span>
        )}
      </button>

    </div>
  );
};

export default DailyFocusWidget;