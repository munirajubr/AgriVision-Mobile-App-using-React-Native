import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
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
    </Stack>
  );
}
