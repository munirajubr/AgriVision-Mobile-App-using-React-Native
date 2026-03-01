import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

const { width } = Dimensions.get("window");

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, register } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const result = await register(fullName, email, password);

    if (!result.success && !result.email) {
      Alert.alert("Error", result.error);
    } else {
      // Navigate to verification even if error but email is present (e.g. unverified account exists)
      router.push({
        pathname: "/verify-email",
        params: { email: result.email || email }
      });
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: COLORS.background }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative Elements */}
          <View style={[styles.circle1, { backgroundColor: COLORS.primary + "08" }]} />
          <View style={[styles.circle2, { backgroundColor: COLORS.primary + "05" }]} />

          <View style={styles.topSection}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={[styles.backButton, { backgroundColor: COLORS.cardBackground }]}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
              <Ionicons name="person-add" size={32} color={COLORS.primary} />
            </View>
            <Text style={[styles.title, { color: COLORS.textPrimary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
              Start your journey with AgriVision today
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: COLORS.textTertiary }]}>FULL NAME</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="John Doe"
                  placeholderTextColor={COLORS.textTertiary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: COLORS.textTertiary }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="example@mail.com"
                  placeholderTextColor={COLORS.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
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
                  placeholder="Min. 6 characters"
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
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.primary }]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={[styles.buttonText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>Sign Up</Text>
                  <Ionicons name="checkmark-circle" size={20} color={isDarkMode ? COLORS.black : COLORS.white} style={styles.btnIcon} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.link, { color: COLORS.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
  },
  circle1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  circle2: {
    position: "absolute",
    top: 200,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  topSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
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
  btnIcon: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 8,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: "700",
  },
});
