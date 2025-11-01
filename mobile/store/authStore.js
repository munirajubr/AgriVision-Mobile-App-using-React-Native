import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  // Register
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "Invalid response");
      });
      if (!response.ok) throw new Error(data.error || data.message || "Register failed");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("[Register] Error:", error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "Invalid response");
      });
      if (!response.ok) throw new Error(data.error || data.message || "Login failed");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("[Login] Error:", error);
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
