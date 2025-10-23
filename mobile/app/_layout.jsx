import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { useAuthStore } from "../store/authStore";
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

  // handle navigation based on the auth state and user profile completion
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      // User not signed in and not in auth route, redirect to auth
      router.replace("/(auth)");
    } else if (isSignedIn) {
      if (!user.isProfileComplete) {
        // User signed in but profile incomplete => redirect to setup page
        if (!segments.includes("setup")) {
          router.replace("/(auth)/setup");
        }
      } else {
        // User signed in and profile complete => redirect away from auth screens
        if (inAuthScreen) {
          router.replace("/(tabs)");
        }
      }
    }
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}



// import { SplashScreen, Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import SafeScreen from "../components/SafeScreen";
// import { StatusBar } from "expo-status-bar";
// import { useFonts } from "expo-font";
// import { useEffect } from "react";

// // Keep the splash screen visible while we load fonts and assets
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
//   });

//   useEffect(() => {
//     // Hide the splash screen once the fonts are loaded
//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded]);

//   // Prevent rendering anything until the fonts have loaded
//   if (!fontsLoaded) {
//     return null;
//   }

//   // With the authentication logic removed, the Stack navigator will now
//   // default to its first screen, which is "(tabs)".
//   return (
//     <SafeAreaProvider>
//       <SafeScreen>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="(tabs)" />
//           <Stack.Screen name="(auth)" />
//         </Stack>
//       </SafeScreen>
//       <StatusBar style="dark" />
//     </SafeAreaProvider>
//   );
// }
