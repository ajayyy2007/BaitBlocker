import { requireNativeView } from 'expo';
import * as React from 'react';

import { WhatsappListenerViewProps } from './WhatsappListener.types';

const NativeView: React.ComponentType<WhatsappListenerViewProps> =
  requireNativeView('WhatsappListener');

export default function WhatsappListenerView(props: WhatsappListenerViewProps) {
  return <NativeView {...props} />;
}
