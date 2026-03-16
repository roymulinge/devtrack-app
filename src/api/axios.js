import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Django backend
   headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If 401 and we haven't already retried this request
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh }
          );

          const newAccess = res.data.access;
          localStorage.setItem("access_token", newAccess);

          // Retry the original failed request with the new token
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        } catch (refreshError) {
          // Refresh also failed — clear everything and redirect
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;