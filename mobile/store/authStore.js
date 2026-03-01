import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  // Register
  register: async (fullName, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "Invalid response");
      });
      if (!response.ok) {
        const error = new Error(data.error || data.message || "Register failed");
        error.email = data.email;
        throw error;
      }
      set({ isLoading: false });
      return { success: true, message: data.message, email: data.email || email };
    } catch (error) {
      console.error("[Register] Error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message, email: error.email || email };
    }
  },

  // Verify Email
  verifyEmail: async (email, otp) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Resend failed");
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login (Supports email or username)
  login: async (identifier, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "Invalid response");
      });
      if (!response.ok) {
        const error = new Error(data.error || data.message || "Login failed");
        error.email = data.email;
        throw error;
      }
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("[Login] Error:", error);
      set({ isLoading: false });
      
      // If the error contains email (from not verified case), pass it back
      return { 
        success: false, 
        error: error.message, 
        notVerified: error.message === 'Email not verified',
        email: error.email // We need to make sure this is available
      };
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      set({ isLoading: false });
      if (!response.ok) throw new Error(data.error || "Request failed");
      return { success: true, message: data.message };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Verify Reset OTP
  verifyResetOTP: async (email, otp) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      set({ isLoading: false });
      if (!response.ok) throw new Error(data.error || "OTP verification failed");
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      set({ isLoading: false });
      if (!response.ok) throw new Error(data.error || "Password reset failed");
      return { success: true, message: data.message };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Profile setup
  setupProfile: async (profileDetails) => {
    set({ isLoading: true });
    try {
      const token = get().token;
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`${API_URL}/api/auth/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileDetails),
      });
      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "Invalid response");
      });
      if (!response.ok) throw new Error(data.error || "Setup failed");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("[SetupProfile] Error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update Profile
  updateProfile: async (profileDetails) => {
    set({ isLoading: true });
    try {
      const token = get().token;
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileDetails),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) throw new Error(data.error || data.message || "Update failed");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("[UpdateProfile] Error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      set({ token, user });
    } catch (error) {
      console.error("[Auth Check] Failed:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("[Logout] Error:", error);
    }
    set({ token: null, user: null });
  },
}));
