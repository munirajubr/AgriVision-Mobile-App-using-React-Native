import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

const { width } = Dimensions.get("window");

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { email } = useLocalSearchParams();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, verifyEmail, resendOTP } = useAuthStore();
  const router = useRouter();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code.");
      return;
    }

    const result = await verifyEmail(email, otp);

    if (result.success) {
      Alert.alert("Success", "Email verified successfully!", [
        { text: "Continue", onPress: () => router.replace("/(auth)/setup") }
      ]);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleResend = async () => {
    const result = await resendOTP(email);
    if (result.success) {
      Alert.alert("Success", "A new code has been sent to your email.");
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
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: COLORS.background }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.circle1, { backgroundColor: COLORS.primary + "08" }]} />
          
          <View style={styles.topSection}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={[styles.backButton, { backgroundColor: COLORS.cardBackground }]}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
              <Ionicons name="mail-open" size={32} color={COLORS.primary} />
            </View>
            <Text style={[styles.title, { color: COLORS.textPrimary }]}>Verify Email</Text>
            <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
              We've sent a 6-digit code to {email}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: COLORS.textTertiary }]}>VERIFICATION CODE</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons
                  name="keypad-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  placeholder="123456"
                  placeholderTextColor={COLORS.textTertiary}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  letterSpacing={10}
                  textAlign="center"
                  style={{ flex:1, fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.primary }]}
              onPress={handleVerify}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={[styles.buttonText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>Verify & Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color={isDarkMode ? COLORS.black : COLORS.white} style={styles.btnIcon} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
              disabled={isLoading}
            >
              <Text style={[styles.resendText, { color: COLORS.textSecondary }]}>
                Didn't receive a code? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Resend</Text>
              </Text>
            </TouchableOpacity>
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
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
  },
  button: {
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  btnIcon: {
    marginLeft: 10,
  },
  resendButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 15,
  },
});
