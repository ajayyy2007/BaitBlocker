import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './WhatsappListener.types';

type WhatsappListenerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class WhatsappListenerModule extends NativeModule<WhatsappListenerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(WhatsappListenerModule, 'WhatsappListenerModule');
