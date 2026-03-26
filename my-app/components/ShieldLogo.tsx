import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export default function ShieldLogo({ size = 160 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 200 220"
      fill="none"
    >
      {/* Shield outline */}
      <Path
        d="M100 5
           L185 35
           V120
           C185 165 145 200 100 215
           C55 200 15 165 15 120
           V35
           Z"
        fill="#FF8C00"
      />

      {/* Circuit pattern */}
      <G
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M100 30 V170" />
        <Path d="M60 60 H100 V100" />
        <Path d="M140 60 H100 V100" />
        <Path d="M60 120 H100 V150" />
        <Path d="M140 120 H100 V150" />

        {/* circuit dots */}
        <Path d="M60 60 L60 60" />
        <Path d="M140 60 L140 60" />
        <Path d="M60 120 L60 120" />
        <Path d="M140 120 L140 120" />
      </G>
    </Svg>
  );
}
