import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

const ChangePassword = () => {
  const { logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.new_password !== formData.new_password2) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password/", formData);
      setSuccess(true);
      setTimeout(() => logout(), 2000);
    } catch (err) {
      const data = err.response?.data;
      if (data?.error)              setError(data.error);
      else if (data?.old_password)  setError(data.old_password[0]);
      else if (data?.new_password)  setError(data.new_password[0]);
      else if (data?.new_password2) setError(data.new_password2[0]);
      else if (data?.non_field_errors) setError(data.non_field_errors[0]);
      else setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-sky-400/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 relative z-10">

        <img src={logo} alt="DevTrack" className="h-25 w-auto mx-auto mb-8" />

        {success ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] mb-2">Password changed!</h1>
            <p className="text-xs text-[var(--text-muted)]">Signing you out for security...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <h1 className="text-base font-bold text-[var(--text-primary)] mb-1">Change Password</h1>
              <p className="text-xs font-mono text-[var(--text-muted)]">update your credentials</p>
            </div>

            {error && (
              <div className="mb-5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  name="old_password"
                  placeholder="••••••••"
                  value={formData.old_password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  placeholder="••••••••"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="new_password2"
                  placeholder="••••••••"
                  value={formData.new_password2}
                  onChange={handleChange}
                  required
                  className={`w-full bg-[var(--bg-primary)] border rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition
                    ${formData.new_password2 && formData.new_password !== formData.new_password2
                      ? "border-red-500/50"
                      : formData.new_password2 && formData.new_password === formData.new_password2
                      ? "border-emerald-500/50"
                      : "border-[var(--border)] focus:border-sky-500/50"
                    }`}
                />
                {formData.new_password2 && (
                  <p className={`text-xs font-mono mt-1 ${
                    formData.new_password === formData.new_password2 ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {formData.new_password === formData.new_password2 ? "passwords match" : "passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-2.5 rounded-lg transition tracking-wide mt-2"
              >
                {loading ? "updating..." : "update password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/dashboard"
                className="text-xs font-mono text-[var(--text-muted)]/50 hover:text-[var(--text-muted)] transition"
              >
                ← back to dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;