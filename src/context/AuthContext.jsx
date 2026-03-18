import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const access  = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (!access || !refresh) {
        setLoading(false);
        return;
      }

      try {
        // Try to refresh the access token using the refresh token
        const res = await api.post("/token/refresh/", { refresh });
        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);
        setUser({ token: newAccess });
      } catch (err) {
        // Refresh token is also expired — force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/token/", { email, password });
    const { access, refresh } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setUser({ token: access });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  // Don't render children until we know if user is logged in
  if (loading) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-sky-400 animate-spin" />

        {/* Logo */}
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-500">
          <span className="text-sky-400">[</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
          <span>DevTrack</span>
          <span className="text-sky-400">]</span>
        </div>

      </div>
    </div>
  );
}


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};