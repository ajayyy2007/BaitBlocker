import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* This tells Expo Router to load app/index.tsx first */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
