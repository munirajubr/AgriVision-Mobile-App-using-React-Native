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

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter your email/username and password.");
      return;
    }
    const result = await login(identifier, password);
    if (!result.success) {
      if (result.notVerified) {
        Alert.alert(
          "Email Not Verified",
          "Your email is not verified. Please verify your email to log in.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Verify Now", 
              onPress: () => router.push({
                pathname: "/verify-email",
                params: { email: result.email }
              }) 
            }
          ]
        );
      } else {
        Alert.alert("Login Failed", result.error || "Unknown error");
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
          {/* Top Logo Section */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={[styles.logoIconCircle, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="leaf" size={28} color="#FFF" />
              </View>
              <Text style={[styles.logoText, { color: COLORS.primary }]}>AgriVision</Text>
            </View>
            <Text style={[styles.subTitle, { color: COLORS.textPrimary }]}>Login to your Account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Email/Username"
                placeholderTextColor={COLORS.placeholderText}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.passwordWrapper, { borderBottomColor: COLORS.border }]}>
                <TextInput
                  style={[styles.input, { flex: 1, color: COLORS.textPrimary, borderBottomWidth: 0 }]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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

            <TouchableOpacity 
              style={[styles.loginBtn, { backgroundColor: COLORS.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginBtnText}>Sign in</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/forgot-password")}
              style={styles.forgotBtn}
            >
              <Text style={[styles.forgotPasswordText, { color: COLORS.textTertiary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={[styles.signupLink, { color: COLORS.primary }]}>Sign up</Text>
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
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
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
    marginBottom: 20,
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
  loginBtn: {
    height: 55,
    borderRadius: 12,    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  forgotBtn: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
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
  signupLink: {
    fontSize: 15,
    fontWeight: "700",
  },
});
