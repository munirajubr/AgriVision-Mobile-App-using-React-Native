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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

const { width } = Dimensions.get("window");

export default function FinalizeSignup() {
  const { email } = useLocalSearchParams();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, finalizeRegistration } = useAuthStore();
  const router = useRouter();

  const handleFinalize = async () => {
    if (!fullName || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
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

    const result = await finalizeRegistration(email, fullName, password);

    if (result.success) {
      Alert.alert("Success", "Account created successfully!", [
        { text: "Continue", onPress: () => router.replace("/(auth)/setup") }
      ]);
    } else {
      Alert.alert("Error", result.error);
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
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoIconCircle, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="person-add" size={28} color="#FFF" />
            </View>
            <Text style={[styles.title, { color: COLORS.textPrimary }]}>Complete Profile</Text>
            <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
              Just a few more details to set up your account for {email}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.textTertiary }]}>FULL NAME</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
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
              <Text style={[styles.label, { color: COLORS.textTertiary }]}>PASSWORD</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 5 }}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.textTertiary }]}>CONFIRM PASSWORD</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: COLORS.primary }]}
              onPress={handleFinalize}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  btn: {
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
