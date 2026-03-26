import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { startWhatsAppListener } from './NotificationListener';

export default function RootLayout() {

  useEffect(() => {
    startWhatsAppListener();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="result" />
    </Stack>
  );
}