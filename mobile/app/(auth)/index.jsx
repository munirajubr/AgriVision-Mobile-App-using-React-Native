import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
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
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
          {/* Decorative Elements */}
          <View style={[styles.circle1, { backgroundColor: COLORS.primary + "10" }]} />
          <View style={[styles.circle2, { backgroundColor: COLORS.primary + "05" }]} />

          <View style={styles.topSection}>
            <View style={[styles.logoContainer, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="leaf" size={40} color="#FFF" />
            </View>
            <Text style={[styles.title, { color: COLORS.textPrimary }]}>AgriVision</Text>
            <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
              Intelligence for sustainable farming
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: COLORS.textTertiary }]}>USERNAME/EMAIL</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="Email or Username"
                  placeholderTextColor={COLORS.textTertiary}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: COLORS.textTertiary }]}>PASSWORD</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.forgotPasswordContainer} 
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={[styles.buttonText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color={isDarkMode ? COLORS.black : COLORS.white} style={styles.btnArrow} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>New to AgriVision?</Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={[styles.link, { color: COLORS.primary }]}>Create an Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  circle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  circle2: {
    position: "absolute",
    bottom: -50,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.8,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  btnArrow: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 8,
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: "700",
  },
});
