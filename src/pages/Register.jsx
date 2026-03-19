import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import logo from "../assets/logo.png";

// Password strength helper
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))     score++;
  const map = {
    0: { label: "",          color: "" },
    1: { label: "weak",      color: "bg-red-400"     },
    2: { label: "medium",    color: "bg-amber-400"   },
    3: { label: "strong",    color: "bg-sky-400"     },
    4: { label: "very strong", color: "bg-emerald-400" },
  };
  return { score, ...map[score] };
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", password2: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [registered, setRegistered] = useState(false);

  const { full_name, email, password, password2 } = formData;
  const strength = getStrength(password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    if (strength.score < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/register/", { full_name, email, password, password2 });
      setRegistered(true); 
    } catch (err) {
      const data = err.response?.data;
      if (data?.email)    setError(data.email[0]);
      else if (data?.password) setError(data.password[0]);
      else if (data?.full_name) setError(data.full_name[0]);
      else if (data?.password2) setError(data.password2[0]);
      else setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-sky-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 text-center relative z-10">

          {/* Logo */}
          <img
            src={logo}
            alt="DevTrack"
            className="h-25 w-auto mx-auto mb-5"
          />

          {/* Email icon */}
          <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            Check your email
          </h1>
          <p className="text-xs text-[var(--text-muted)] mb-1">
            We sent a verification link to
          </p>
          <p className="text-sm font-mono text-sky-400 mb-5">{email}</p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-7">
            Click the link in the email to activate your account.
            Check your spam folder if you don't see it within a few minutes.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs font-mono text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <Link
            to="/login"
            className="block w-full border border-[var(--border)] hover:border-slate-600 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-xs py-2.5 rounded-lg transition text-center"
          >
            ← back to sign in
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow — violet tint to differentiate from login */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 relative z-10">

        {/* Logo */}
        <img
          src={logo}
          alt="DevTrack"
          className="h-25 w-auto mx-auto mb-8"
        />

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">Create your account</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="John Doe"
              value={full_name}
              onChange={handleChange}
              required
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>

          {/* Password + strength meter */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
            {/* Strength bar */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`flex-1 h-[2px] rounded-full transition-all duration-300
                        ${n <= strength.score ? strength.color : "bg-[var(--border)]"}`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-mono ${
                  strength.score <= 1 ? "text-red-400"
                  : strength.score === 2 ? "text-amber-400"
                  : strength.score === 3 ? "text-sky-400"
                  : "text-emerald-400"
                }`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              placeholder="••••••••"
              value={password2}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className={`w-full bg-[var(--bg-primary)] border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition
                ${password2 && password !== password2
                  ? "border-red-500/50 focus:border-red-500/50"
                  : password2 && password === password2
                  ? "border-emerald-500/50 focus:border-emerald-500/50"
                  : "border-[var(--border)] focus:border-sky-500/50"
                }`}
            />
            {/* Match indicator */}
            {password2 && (
              <p className={`text-xs font-mono mt-1 ${
                password === password2 ? "text-emerald-400" : "text-red-400"
              }`}>
                {password === password2 ? "passwords match" : "passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide mt-2"
          >
            {loading ? "creating account..." : "create account"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--text-muted)]/50">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Login link */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Already have an account?</span>
          <Link
            to="/login"
            className="text-xs font-mono text-sky-400 hover:text-sky-300 transition"
          >
            sign in →
          </Link>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-mono text-[var(--text-muted)]/50 hover:text-[var(--text-muted)] transition"
          >
            ← return to home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;