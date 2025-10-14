import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers since the parent handles the navigation
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="devices" />
    </Stack>
  );
}
