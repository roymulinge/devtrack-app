import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate        = useNavigate();
  const { login }       = useContext(AuthContext);
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

  return (
    <div className="min-h-screen bg-[#090d13] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-sky-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <span className="text-sky-400 font-mono font-bold text-base">[</span>
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
          <span className="font-mono font-bold text-base text-slate-100 tracking-wide">DevTrack</span>
          <span className="text-sky-400 font-mono font-bold text-base">]</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-xl font-bold text-slate-100 mb-1">Welcome back</h1>
          <p className="text-xs font-mono text-slate-600">// sign in to your workspace</p>
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
            <label className="block text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#090d13] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#090d13] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide mt-2"
          >
            {loading ? "signing in..." : "sign in"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs font-mono text-slate-700">or</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Register link */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">No account yet?</span>
          <Link
            to="/register"
            className="text-xs font-mono text-sky-400 hover:text-sky-300 transition"
          >
            register →
          </Link>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-mono text-slate-700 hover:text-slate-500 transition"
          >
            ← return to home
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Login;