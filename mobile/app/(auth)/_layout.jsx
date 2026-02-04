import { Stack } from "expo-router";
import { useThemeStore } from "../../store/themeStore";
import { getColors } from "../../constants/colors";

export default function AuthLayout() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  return <Stack screenOptions={{ 
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 400,
    gestureEnabled: true,
    contentStyle: { backgroundColor: COLORS.background }
  }} />;
}
