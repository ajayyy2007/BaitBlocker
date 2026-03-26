import { NativeModule, requireNativeModule } from 'expo';

import { WhatsappListenerModuleEvents } from './WhatsappListener.types';

declare class WhatsappListenerModule extends NativeModule<WhatsappListenerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WhatsappListenerModule>('WhatsappListener');
