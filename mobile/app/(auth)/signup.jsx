import React, { useState, useEffect } from "react";
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
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

// Required for web browser to work
WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { isLoading, register, continueWithGoogle } = useAuthStore();
  const router = useRouter();

  // Google Login Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSuccess(authentication.accessToken);
    }
  }, [response]);

  const handleGoogleSuccess = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();
      
      const result = await continueWithGoogle({
        email: userInfo.email,
        fullName: userInfo.name,
        sub: userInfo.sub,
        picture: userInfo.picture
      });

      if (result.success) {
        if (result.needsVerification) {
          router.push({
            pathname: "/verify-email",
            params: { email: result.email }
          });
        } else {
          router.replace("/(tabs)");
        }
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (e) {
      Alert.alert("Google Signup Error", "Failed to get user data from Google");
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const result = await register(fullName, email, password);

    if (!result.success && !result.email) {
      Alert.alert("Error", result.error);
    } else {
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
            <Text style={[styles.subTitle, { color: COLORS.textPrimary }]}>Create your Account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Full Name"
                placeholderTextColor={COLORS.placeholderText}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Email"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { color: COLORS.textPrimary, borderBottomColor: COLORS.border }]}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.placeholderText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.signupBtn, { backgroundColor: COLORS.primary }]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.signupBtnText}>Sign up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: COLORS.border }]} />
              <Text style={[styles.dividerText, { color: COLORS.textSecondary }]}>Or sign up with</Text>
              <View style={[styles.line, { backgroundColor: COLORS.border }]} />
            </View>

            <TouchableOpacity 
              style={[styles.googleButton, { borderColor: COLORS.border, backgroundColor: "#FFF" }]}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              <Image 
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" }} 
                style={styles.googleIcon} 
                resizeMode="contain"
              />
              <Text style={[styles.googleButtonText, { color: "#000" }]}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/")}>
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 35,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  googleButton: {
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
    }),
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "700",
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
