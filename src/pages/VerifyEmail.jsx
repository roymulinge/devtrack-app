import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";

const VerifyEmail = () => {
  const { token }           = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error | expired
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}/`);
        setMessage(res.data.message);
        setStatus("success");
      } catch (err) {
        const msg = err.response?.data?.error ?? "Verification failed.";
        setStatus(msg.includes("expired") ? "expired" : "error");
        setMessage(msg);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-sky-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 text-center relative z-10">

        {/* Logo */}
        <img
          src={logo}
          alt="DevTrack"
          className="h-25 w-auto mx-auto mb-8"
        />

        {status === "loading" && (
          <>
            <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-sky-400 animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono text-[var(--text-muted)]">// verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] mb-2">Email verified</h1>
            <p className="text-xs text-[var(--text-muted)] mb-6">{message}</p>
            <Link
              to="/login"
              className="block w-full bg-sky-400 hover:bg-sky-300 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition"
            >
              sign in →
            </Link>
          </>
        )}

        {(status === "error" || status === "expired") && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              {status === "expired" ? "Link expired" : "Verification failed"}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mb-6">{message}</p>
            <Link
              to="/register"
              className="block w-full bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] font-mono font-bold text-sm py-2.5 rounded-lg transition border border-[var(--border)]"
            >
              register again
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;