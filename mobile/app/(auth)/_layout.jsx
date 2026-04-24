import { Stack } from "expo-router";
import { useThemeStore } from "../../store/themeStore";
import { getColors } from "../../constants/colors";

export default function AuthLayout() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
        gestureEnabled: true,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signup-verify" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="finalize-signup" />
      <Stack.Screen name="setup" options={{ gestureEnabled: false }} />
      <Stack.Screen name="setupaccount" />
    </Stack>
  );
}
