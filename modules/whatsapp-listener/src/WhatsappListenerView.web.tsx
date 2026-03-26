import * as React from 'react';

import { WhatsappListenerViewProps } from './WhatsappListener.types';

export default function WhatsappListenerView(props: WhatsappListenerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
