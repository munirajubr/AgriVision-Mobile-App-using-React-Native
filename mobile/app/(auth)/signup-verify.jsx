import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import SafeScreen from "../../components/SafeScreen";

const { width } = Dimensions.get("window");

export default function SignupVerify() {
  const { email, fullName, password } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const hiddenInputRef = useRef(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, verifyEmail, finalizeRegistration, register } = useAuthStore();
  const { showToast } = useToastStore();
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(60)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(50)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(iconScale, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
        Animated.timing(iconRotate, { toValue: 1, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(cardSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(cardFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    // Pulse for the email icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const playSuccessAnimation = () => {
    setVerified(true);
    Animated.spring(successScale, {
      toValue: 1,
      tension: 60,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showToast("Please enter 6-digit code", "error");
      return;
    }

    const verifyResult = await verifyEmail(email, otp);
    if (verifyResult.success) {
      // Immediately finalize
      const finalizeResult = await finalizeRegistration(email, fullName, password);
      if (finalizeResult.success) {
        showToast("Email verified successfully", "success");
        playSuccessAnimation();
        setTimeout(() => {
          router.replace("/(auth)/setup");
        }, 1500);
      } else {
        showToast(finalizeResult.error || "Registration failed", "error");
      }
    } else {
      showToast(verifyResult.error || "Verification failed", "error");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    const result = await register(email);
    if (result.success) {
      showToast("Verification code resent", "success");
    } else {
      showToast(result.error || "Resend failed", "error");
      setCanResend(true);
    }
  };

  const spinIcon = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Mask email for display
  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, start, middle, domain) =>
        start + '•'.repeat(Math.min(middle.length, 6)) + domain
      )
    : '';

  if (verified) {
    return (
      <SafeScreen>
        <View style={[styles.successContainer, { backgroundColor: COLORS.background }]}>
          <Animated.View style={[styles.successContent, { transform: [{ scale: successScale }] }]}>
            <View style={[styles.successIconCircle, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="checkmark" size={60} color="#FFF" />
            </View>
            <Text style={[styles.successTitle, { color: COLORS.textPrimary }]}>Verified!</Text>
            <Text style={[styles.successSubtitle, { color: COLORS.textSecondary }]}>
              Your account has been created successfully
            </Text>
            <View style={styles.successDots}>
              {[0, 1, 2].map(i => (
                <Animated.View
                  key={i}
                  style={[styles.successDot, {
                    backgroundColor: COLORS.primary,
                    opacity: pulseAnim,
                    transform: [{ scale: pulseAnim }],
                  }]}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: COLORS.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: COLORS.cardBackground }]}
            >
              <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Animated Mail Icon */}
          <Animated.View style={[styles.iconSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideUp }],
          }]}>
            <Animated.View style={[styles.mailIconOuter, {
              backgroundColor: `${COLORS.primary}12`,
              transform: [{ scale: pulseAnim }],
            }]}>
              <Animated.View style={[styles.mailIconInner, {
                backgroundColor: `${COLORS.primary}20`,
                transform: [{ scale: iconScale }, { rotate: spinIcon }],
              }]}>
                <Ionicons name="mail-open" size={40} color={COLORS.primary} />
              </Animated.View>
            </Animated.View>
          </Animated.View>

          {/* Header Text */}
          <Animated.View style={[styles.headerSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideUp }],
          }]}>
            <Text style={[styles.title, { color: COLORS.textPrimary }]}>Verify Your Email</Text>
            <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
              We've sent a 6-digit code to
            </Text>
            <View style={[styles.emailBadge, { backgroundColor: `${COLORS.primary}10` }]}>
              <Ionicons name="mail" size={16} color={COLORS.primary} />
              <Text style={[styles.emailText, { color: COLORS.primary }]}>{maskedEmail}</Text>
            </View>
          </Animated.View>

          {/* OTP Input Section */}
          <Animated.View style={[styles.otpForm, {
            opacity: cardFade,
            transform: [{ translateY: cardSlide }],
          }]}>
            <Text style={[styles.otpLabel, { color: COLORS.textTertiary }]}>VERIFICATION CODE</Text>

            {/* 6 Individual Digit Boxes */}
            <TouchableOpacity
              style={styles.otpBoxRow}
              activeOpacity={1}
              onPress={() => hiddenInputRef.current?.focus()}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const digit = otp[i] || '';
                const isFocused = otp.length === i;
                return (
                  <View
                    key={i}
                    style={[
                      styles.otpBox,
                      {
                        borderBottomColor: isFocused ? COLORS.primary : COLORS.border,
                        borderBottomWidth: isFocused ? 2 : 1,
                      },
                    ]}
                  >
                    <Text style={[
                      styles.otpDigit,
                      { color: digit ? COLORS.primary : COLORS.placeholderText },
                    ]}>
                      {digit || (isFocused ? '|' : '–')}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            {/* Hidden input for keyboard */}
            <TextInput
              ref={hiddenInputRef}
              style={styles.hiddenInput}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              caretHidden
            />

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.verifyBtn, { backgroundColor: COLORS.primary }]}
              onPress={handleVerify}
              disabled={isLoading || otp.length < 6}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator color="#FFF" />
                  <Text style={styles.verifyBtnText}>Verifying...</Text>
                </View>
              ) : (
                <View style={styles.btnRow}>
                  <Text style={styles.verifyBtnText}>Verify & Create Account</Text>
                  <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={styles.resendRow}>
              <Text style={[styles.resendText, { color: COLORS.textTertiary }]}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                <Text style={[styles.resendAction, { color: canResend ? COLORS.primary : COLORS.textTertiary }]}>
                  {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Security note */}
          <Animated.View style={[styles.securityNote, {
            opacity: cardFade,
            backgroundColor: `${COLORS.info}08`,
          }]}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.info} />
            <Text style={[styles.securityText, { color: COLORS.textTertiary }]}>
              Your data is encrypted and secure
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  iconSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  mailIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  mailIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 12,
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emailText: {
    fontSize: 14,
    fontWeight: "700",
  },
  otpForm: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  otpBoxRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 40,
  },
  otpBox: {
    width: 45,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  otpDigit: {
    fontSize: 28,
    fontWeight: "700",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  verifyBtn: {
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  verifyBtnText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
  resendRow: {
    alignItems: "center",
    gap: 6,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
  resendAction: {
    fontSize: 15,
    fontWeight: "800",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  securityText: {
    fontSize: 13,
    fontWeight: "600",
  },
  // Success screen
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  successContent: {
    alignItems: "center",
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    ...Platform.select({
      ios: { shadowColor: "#2E7D32", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
      android: { elevation: 10 },
    }),
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  successDots: {
    flexDirection: "row",
    gap: 8,
  },
  successDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
