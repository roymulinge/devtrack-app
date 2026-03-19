import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

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
    <div className="min-h-screen bg-[#090d13] flex items-center justify-center px-4">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-sky-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-1.5 font-mono text-sm font-bold mb-8">
          <span className="text-sky-400">[</span>
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
          <span className="text-slate-100 tracking-wide">DevTrack</span>
          <span className="text-sky-400">]</span>
        </div>

        {status === "loading" && (
          <>
            <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-sky-400 animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono text-slate-500">// verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-slate-100 mb-2">Email verified</h1>
            <p className="text-xs text-slate-500 mb-6">{message}</p>
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
            <h1 className="text-lg font-bold text-slate-100 mb-2">
              {status === "expired" ? "Link expired" : "Verification failed"}
            </h1>
            <p className="text-xs text-slate-500 mb-6">{message}</p>
            <Link
              to="/register"
              className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-sm py-2.5 rounded-lg transition"
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