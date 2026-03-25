import api from "./axios";

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password/", { email });
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.detail ??
      error.response?.data?.email?.[0] ??
      "Failed to send reset link.";
    return { success: false, error: message };
  }
};

export const resetPassword = async (uid, token, password) => {
  try {
    const response = await api.post("/auth/reset-password/", { uid, token, password });
    return { success: true, data: response.data };
  } catch (error) {
    const data = error.response?.data ?? {};
    const message =
      data.detail ??
      data.password?.[0] ??
      data.error ??
      data.non_field_errors?.[0] ??
      "Failed to reset password.";
    return { success: false, error: message };
  }
};