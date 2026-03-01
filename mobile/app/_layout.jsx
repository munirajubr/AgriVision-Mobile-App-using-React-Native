import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useEffect, useState, useRef } from "react";
import { getColors } from "../constants/colors";

SplashScreen.preventAutoHideAsync();

function CustomSplashScreen({ colors }) {
  return (
    <View style={[styles.splashContainer, { backgroundColor: colors.primary }]}>
      <View style={styles.splashContent}>
        <Ionicons name="leaf" size={80} color="#FFF" />
        <Text style={styles.splashText}>AgriVision</Text>
      </View>
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
        warmupServer();
        await checkAuth();
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

  // handle navigation based on the auth state
  useEffect(() => {
    if (!fontsLoaded || !appIsReady || isCheckingAuth) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inRootIndex = segments.length === 0 || (segments.length === 1 && segments[0] === "index");
    const isSignedIn = user && token;

    if (!isSignedIn) {
      if (!inAuthGroup && !inRootIndex) {
        router.replace("/");
      }
    } else {
      if (inAuthGroup || inRootIndex) {
        router.replace("/(tabs)");
      }
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
      </Stack>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={backgroundColor} />
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