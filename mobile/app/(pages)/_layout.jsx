import { Stack } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import { getColors } from '../../constants/colors';

export default function PagesLayout() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 400,
        gestureEnabled: true,
        contentStyle: { backgroundColor: COLORS.background }
      }}
    >
      <Stack.Screen name="connectdevicepage" />
      <Stack.Screen name="cropguide" />
      <Stack.Screen name="diagnosis" />
      <Stack.Screen name="npkanalysis" />
      <Stack.Screen name="npkupload" />
      <Stack.Screen name="fertilizerguide" />
      <Stack.Screen name="about" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="helpsupport" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="diseasediagnosis" />
      <Stack.Screen name="editprofile" />
      <Stack.Screen name="growthblueprint" />
    </Stack>
  );
}
