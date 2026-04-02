import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../Components/PageLoader";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    projects_count: 0,
    skills_count: 0,
    assignments_count: 0,
    ideas_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/me/");
      setUserData(res.data);
      setFullName(res.data.full_name || "");
      setStats({
        projects_count: res.data.stats?.projects || 0,
        skills_count: res.data.stats?.skills || 0,
        assignments_count: res.data.stats?.assignments || 0,
        ideas_count: res.data.stats?.ideas || 0,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [location]);

  const updateFullName = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.patch("/auth/me/", { full_name: fullName });
      setUserData(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.full_name?.[0] || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      await api.delete("/auth/delete/");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  const avatarLetter = userData?.full_name?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase() || "U";
  const memberSince = userData?.member_since ? new Date(userData.member_since).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }) : "Unknown";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Profile</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your account settings and information.
          </p>
        </div>

        {/* User Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-[var(--border)]">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-sky-400/20 flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold font-mono text-sky-400">{avatarLetter}</span>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate">
                {userData?.full_name || "User"}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1 truncate">{userData?.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs font-mono text-slate-600">
                  Member since {memberSince}
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                  userData?.is_verified
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {userData?.is_verified ? "verified" : "unverified"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Projects", value: stats.projects_count, color: "text-sky-400" },
              { label: "Skills", value: stats.skills_count, color: "text-emerald-400" },
              { label: "Assignments", value: stats.assignments_count, color: "text-pink-400" },
              { label: "Ideas", value: stats.ideas_count, color: "text-violet-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-xs font-mono text-sky-400 uppercase tracking-widest mb-5">
            {editing ? "edit profile" : "account settings"}
          </p>

          {editing ? (
            <form onSubmit={updateFullName} className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  disabled
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 text-sm text-slate-600 cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-slate-700 mt-1.5">Email cannot be changed</p>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-sky-400 hover:bg-sky-300 disabled:bg-sky-400/40 text-[#090d13] font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
                >
                  {submitting ? "saving..." : "save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFullName(userData?.full_name || "");
                    setError("");
                  }}
                  className="flex-1 bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-700 hover:text-slate-200 font-mono font-bold text-sm py-3 rounded-lg transition"
                >
                  cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Full Name
                </label>
                <p className="text-sm text-[var(--text-primary)]">{userData?.full_name || "Not set"}</p>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1.5">
                  Email
                </label>
                <p className="text-sm text-[var(--text-primary)]">{userData?.email}</p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-700 hover:text-slate-200 hover:bg-white/5 font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
              >
                edit profile
              </button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-5">
            security
          </p>
          <div className="space-y-3">
            <a
              href="/change-password"
              className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg hover:border-slate-700 hover:bg-white/5 transition"
            >
              <span className="text-sm text-[var(--text-secondary)]">Change Password</span>
              <span className="text-[var(--text-muted)]">→</span>
            </a>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[var(--bg-surface)] border border-red-500/20 rounded-2xl p-4 sm:p-6">
          <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-4">
            danger zone
          </p>

          {deleteConfirm === "" ? (
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Deleting your account will remove all your data permanently. This action cannot be undone.
              </p>
              <button
                onClick={() => setDeleteConfirm("PENDING")}
                className="w-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
              >
                delete account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Type "DELETE" to confirm account deletion. This is permanent.
                </p>
                <input
                  type="text"
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirm === "PENDING" ? "" : deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value.toUpperCase())}
                  className="w-full bg-[var(--bg-primary)] border border-red-500/30 rounded-lg px-3 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/50 transition"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={deleteAccount}
                  disabled={deleteConfirm !== "DELETE" || deleting}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-600/40 text-white font-mono font-bold text-sm py-3 rounded-lg transition tracking-wide"
                >
                  {deleting ? "deleting..." : "permanently delete"}
                </button>
                <button
                  onClick={() => setDeleteConfirm("")}
                  className="flex-1 bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-700 hover:text-slate-200 font-mono font-bold text-sm py-3 rounded-lg transition"
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
