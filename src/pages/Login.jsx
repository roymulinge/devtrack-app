import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const navigate               = useNavigate();
  const { login, googleLogin } = useContext(AuthContext);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-sky-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 relative z-10">

        {/* Logo */}
        <img
          src={logo}
          alt="DevTrack"
          className="h-16 sm:h-20 w-auto mx-auto mb-6 sm:mb-8"
        />

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1">Welcome back</h1>
          <p className="text-xs font-mono text-[var(--text-muted)]">// sign in to your workspace</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide mt-2"
          >
            {loading ? "signing in..." : "sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--text-muted)]/50">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Google login — full width on mobile */}
        <div className="flex justify-center w-full overflow-hidden mb-5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed. Please try again.")}
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
            width="320"
          />
        </div>

        {/* Register link */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">No account yet?</span>
          <Link to="/register" className="text-xs font-mono text-sky-400 hover:text-sky-300 transition">
            register →
          </Link>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs font-mono text-[var(--text-muted)]/50 hover:text-[var(--text-muted)] transition">
            ← return to home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;