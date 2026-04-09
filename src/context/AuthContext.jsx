import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import logo from "../assets/logo.png";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUser = async () => {
    try{
      const res = await api.get("/auth/me/");
      setUser(res.data);
    } catch (err){
      //token exists but is invalid - clear everything
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }

  };


  useEffect(() => {
    const restoreSession = async () => {
      const access  = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (!access || !refresh) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/token/refresh/", { refresh });
        localStorage.setItem("access_token", res.data.access);
        
        await fetchUser();
      } catch (err) {
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
    
    await fetchUser();
  };
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const googleLogin = async (credential) => {
    const response = await api.post("/auth/google/", { credential });
    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    // Same here — fetch full profile after Google login.
    await fetchUser();
  };
  if (loading) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-sky-400 animate-spin" />

        {/* Logo */}
        <img
          src={logo}
          alt="DevTrack"
          className="h-25 w-auto"
        />

      </div>
    </div>
  );
}


  return (
    <AuthContext.Provider value={{ user, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};