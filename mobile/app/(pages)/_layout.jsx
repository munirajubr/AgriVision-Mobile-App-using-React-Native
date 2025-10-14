import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#037B21',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="connectdevicepage" 
        options={{
          title: 'Connect Device',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="cropguide" 
        options={{
          title: 'Crop Guide',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="diagnosis" 
        options={{
          title: 'Diagnosis',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="npkanalysis" 
        options={{
          title: 'NPK Analysis',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="npkupload" 
        options={{
          title: 'Upload NPK Data',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="fertilizerguide" 
        options={{
          title: 'Fertilizer Guide',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{
          title: 'About Us',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{
          title: 'Settings',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="helpsupport" 
        options={{
          title: 'Help & Support',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="terms" 
        options={{
          title: 'Terms & Conditions',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="diseasediagnosis" 
        options={{
          title: 'Disease Diagnosis',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
