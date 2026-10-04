import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

const DEFAULT_USER = {
  id: "user_default_01",
  fullName: "Raj Gowda",
  username: "raj_gowda",
  email: "raj.gowda@gmail.com",
  phone: "+91 98765 43210",
  farmLocation: "Bangalore",
  farmSize: "12 Acres",
  cropType: "Eggplant & Tomato",
  soilType: "Red Loam",
  experience: "8",
  bio: "Progressive farmer practicing modern organic & precision agriculture.",
  isVerified: true,
  profileImage: null,
};

export const useAuthStore = create((set, get) => ({
  user: DEFAULT_USER,
  token: "default_mock_token_12345",
  isLoading: false,
  isCheckingAuth: false,

  // Step 1: Request OTP (Offline mock)
  register: async (email) => {
    set({ isLoading: true });
    setTimeout(() => set({ isLoading: false }), 300);
    return { success: true, message: "OTP sent successfully (Mock)", email };
  },

  // Step 2: Verify OTP (Offline mock)
  verifyEmail: async (email, otp) => {
    set({ isLoading: true });
    setTimeout(() => set({ isLoading: false }), 300);
    return { success: true, message: "Email verified (Mock)" };
  },

  // Step 3: Finalize (Name & Pass) (Offline mock)
  finalizeRegistration: async (email, fullName, password) => {
    set({ isLoading: true });
    const newUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      fullName: fullName || DEFAULT_USER.fullName,
      username: (fullName || "farmer").toLowerCase().replace(/\s+/g, '_'),
    };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    await AsyncStorage.setItem("token", "default_mock_token_12345");
    set({ user: newUser, token: "default_mock_token_12345", isLoading: false });
    return { success: true };
  },

  // Resend OTP (Offline mock)
  resendOTP: async (email) => {
    return { success: true, message: "OTP resent (Mock)" };
  },

  // Login (Offline mock)
  login: async (identifier, password) => {
    set({ isLoading: true });
    const loggedUser = {
      ...DEFAULT_USER,
      fullName: identifier?.includes('@') ? DEFAULT_USER.fullName : (identifier || DEFAULT_USER.fullName),
    };
    await AsyncStorage.setItem("user", JSON.stringify(loggedUser));
    await AsyncStorage.setItem("token", "default_mock_token_12345");
    set({ user: loggedUser, token: "default_mock_token_12345", isLoading: false });
    return { success: true };
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return { success: true, message: "Password reset link sent (Mock)" };
  },

  // Verify Reset OTP
  verifyResetOTP: async (email, otp) => {
    return { success: true };
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    return { success: true, message: "Password reset successfully (Mock)" };
  },

  // Profile setup
  setupProfile: async (profileDetails) => {
    const updatedUser = { ...get().user, ...profileDetails };
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser, isLoading: false });
    return { success: true };
  },

  // Update Profile
  updateProfile: async (profileDetails) => {
    set({ isLoading: true });
    try {
      const updatedUser = { ...(get().user || DEFAULT_USER), ...profileDetails };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : DEFAULT_USER;
      set({ token: token || "default_mock_token_12345", user });
    } catch (error) {
      console.error("[Auth Check] Failed:", error);
      set({ token: "default_mock_token_12345", user: DEFAULT_USER });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      const { useToastStore } = require("./toastStore");
      useToastStore.getState().showToast("Session reset to default user", "info");
    } catch (error) {
      console.error("[Logout] Error:", error);
    }
    set({ token: "default_mock_token_12345", user: DEFAULT_USER });
  },

  // Warmup server (No-op in offline mode)
  warmupServer: async () => {
    // No-op
  },
}));
