import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import SplashScreen from './SplashScreen';

/* Dummy dashboard for now */
function Dashboard() {
  return (
    <View style={styles.dashboard}>
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {showSplash ? (
        <Animated.View
          style={{ flex: 1 }}
          exiting={FadeOut.duration(600)}
        >
          <SplashScreen />
        </Animated.View>
      ) : (
        <Animated.View
          style={{ flex: 1 }}
          entering={FadeIn.duration(600)}
        >
          <Dashboard />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
