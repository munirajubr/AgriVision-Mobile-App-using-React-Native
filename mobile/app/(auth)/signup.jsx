import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

const { width } = Dimensions.get("window");

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, register, verifyEmail, finalizeRegistration } = useAuthStore();
  const router = useRouter();

  const handleAction = async () => {
    // Phase 1: Request OTP
    if (!showOtpInput) {
      if (!fullName || !email || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields before verifying.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters.");
        return;
      }

      const result = await register(email);

      if (result.success) {
        setShowOtpInput(true);
        Alert.alert("OTP Sent", "A 6-digit code has been sent to your email.");
      } else {
        Alert.alert("Error", result.error);
      }
      return;
    }

    // Phase 2: Verify & Finalize
    if (!isEmailVerified) {
      if (otp.length !== 6) {
        Alert.alert("Error", "Please enter the 6-digit OTP.");
        return;
      }

      const verifyResult = await verifyEmail(email, otp);
      if (verifyResult.success) {
        setIsEmailVerified(true);
        // Automatically try to finalize
        const finalizeResult = await finalizeRegistration(email, fullName, password);
        if (finalizeResult.success) {
          Alert.alert("Success", "Account created successfully!", [
            { text: "Continue", onPress: () => router.replace("/(auth)/setup") }
          ]);
        } else {
          Alert.alert("Error", finalizeResult.error);
        }
      } else {
        Alert.alert("Error", verifyResult.error);
      }
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={[styles.container, { backgroundColor: COLORS.background }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Top Logo Section */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={[styles.logoIconCircle, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="leaf" size={28} color="#FFF" />
              </View>
              <Text style={[styles.logoText, { color: COLORS.primary }]}>AgriVision</Text>
            </View>
            <Text style={[styles.subTitle, { color: COLORS.textPrimary }]}>
              {isEmailVerified ? "Registration Complete!" : "Create your Account"}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Full Name"
                placeholderTextColor={COLORS.placeholderText}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!isEmailVerified}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Email Address"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!showOtpInput}
              />
            </View>

            {/* OTP Input - Visible after sending */}
            {showOtpInput && !isEmailVerified && (
              <View style={[styles.inputGroup, { marginTop: 10 }]}>
                <View style={[styles.otpWrapper, { borderBottomColor: COLORS.primary }]}>
                  <Ionicons name="keypad" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { flex: 1, color: COLORS.primary, letterSpacing: 8, fontWeight: '700' }]}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor={COLORS.placeholderText}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity onPress={() => register(email)} style={{ marginTop: 8 }}>
                   <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: '600', textAlign: 'right' }}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={[styles.passwordWrapper, { borderBottomColor: COLORS.border }]}>
                <TextInput
                  style={[styles.input, { flex: 1, color: COLORS.textPrimary, borderBottomWidth: 0 }]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isEmailVerified}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  style={{ padding: 8 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={22} 
                    color={showPassword ? COLORS.primary : COLORS.textTertiary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.placeholderText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                editable={!isEmailVerified}
              />
            </View>

            <TouchableOpacity 
              style={[styles.signupBtn, { backgroundColor: isEmailVerified ? COLORS.primary : (showOtpInput ? COLORS.primary : COLORS.primary) }]}
              onPress={handleAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.signupBtnText}>
                  {!showOtpInput ? "Verify Email" : (isEmailVerified ? "Success" : "Confirm OTP & Sign Up")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={[styles.signinLink, { color: COLORS.primary }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backBtn: {
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  logoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    height: 55,
    borderBottomWidth: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderBottomWidth: 1,
  },
  otpWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderBottomWidth: 2,
    marginTop: 5,
  },
  signupBtn: {
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signupBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 30,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "500",
  },
  signinLink: {
    fontSize: 15,
    fontWeight: "700",
  },
});
