import { EventEmitter, EventSubscription } from 'expo-modules-core';
import { Platform } from 'react-native';

const WhatsappListenerModule = Platform.OS === 'android' ? require('expo-modules-core').requireNativeModule('WhatsappListener') : null;
const emitter = WhatsappListenerModule ? new EventEmitter(WhatsappListenerModule) : null;

export function addMessageListener(listener: (event: { message: string, sender: string }) => void): EventSubscription | null {
  if (!emitter || Platform.OS !== 'android') return null;
  // @ts-ignore
  return emitter.addListener('onWhatsAppMessage', listener);
}

export async function requestPermissionsAsync(): Promise<boolean> {
  if (Platform.OS !== 'android' || !WhatsappListenerModule) return false;
  return await WhatsappListenerModule.requestPermissionsAsync();
}

export async function checkPermissionsAsync(): Promise<boolean> {
  if (Platform.OS !== 'android' || !WhatsappListenerModule) return false;
  return await WhatsappListenerModule.checkPermissionsAsync();
}
