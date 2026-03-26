import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { addScan, getPlatforms, getSettings } from './store';
import { addMessageListener } from '../modules/whatsapp-listener';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.134.175.158:5000';

const fetchWithTimeout = (url: string, options: any, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), timeout)
    )
  ]);
};

export function startWhatsAppListener() {
  if (Platform.OS !== 'android') return;

  addMessageListener(async (event) => {
    try {
      const platforms = getPlatforms();
      if (!platforms['whatsapp']) return;

      const text = event.message;
      if (!text) return;

      const settings = getSettings();
      const response = await fetchWithTimeout(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text, sensitivity: settings.sensitivity }),
      }, 5000) as Response;
      
      if (!response.ok) return;

      const data = await response.json();

      if (data.status === 'dangerous') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🚨 Scam detected in WhatsApp",
            body: "Do NOT click links or share personal information.",
          },
          trigger: null,
        });
      }

      addScan({
        input: text,
        status: data.status,
        scamType: data.scamType,
        threatType: data.threatType,
        riskLevel: data.riskLevel,
      });

    } catch (err) {
      console.log('Automated scan error:', err);
    }
  });
}
