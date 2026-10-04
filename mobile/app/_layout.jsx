import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useDashboardStore } from "../store/dashboardStore";
import { useEffect, useState, useRef } from "react";
import { getColors } from "../constants/colors";
import Toast from "../components/Toast";

SplashScreen.preventAutoHideAsync();

function CustomSplashScreen({ colors }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.splashContainer, { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="leaf" size={100} color="#FFF" />
        <Animated.Text style={[styles.splashText, { opacity: textFadeAnim, marginTop: 15 }]}>
          AgriVision
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [appIsReady, setAppIsReady] = useState(false);

  const { checkAuth, user, token, warmupServer, isCheckingAuth } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth();
        const user = useAuthStore.getState().user;
        useDashboardStore.getState().fetchWeather(user?.farmLocation || 'Bangalore');
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && appIsReady) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500);
    }
  }, [fontsLoaded, appIsReady]);

  // Handle default navigation to main tabs
  useEffect(() => {
    if (!fontsLoaded || !appIsReady || isCheckingAuth) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inRootIndex = segments.length === 0 || (segments.length === 1 && segments[0] === "index");
    
    // Always navigate to tabs if in onboarding/auth/root index
    if (inAuthGroup || inRootIndex) {
      const timer = setTimeout(() => {
        router.replace("/(tabs)");
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [user, token, segments, fontsLoaded, appIsReady, isCheckingAuth]);

  const backgroundColor = isDarkMode ? "#000000" : "#FFFFFF";

  if (!fontsLoaded || !appIsReady || isCheckingAuth) {
    return <CustomSplashScreen colors={COLORS} />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ 
        headerShown: false, 
        contentStyle: { backgroundColor },
        animation: 'slide_from_right',
        animationDuration: 400,
        gestureEnabled: true,
      }}>
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(pages)" />
        <Stack.Screen name="(dashboard)" />
      </Stack>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={backgroundColor} />
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashContent: {
    alignItems: "center",
    gap: 15,
  },
  splashText: {
    color: "#FFF",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
});