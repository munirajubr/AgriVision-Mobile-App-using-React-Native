import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    checkAuth();
  }, []);

  // handle navigation based on the auth state
  useEffect(() => {
    if (!fontsLoaded) return;

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
  }, [user, token, segments, fontsLoaded]);

  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode ? "#000000" : "#FFFFFF";

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