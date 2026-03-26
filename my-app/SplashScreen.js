import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

const ORANGE = '#FF8C00';

export default function SplashScreen() {
  /* ───────── Logo scale & opacity ───────── */
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);

  /* ───────── Ripple animations ───────── */
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);

  /* ───────── Text animations ───────── */
  const letters = 'BAITBLOCK'.split('');
  const textAnimations = letters.map(() => ({
    opacity: useSharedValue(0),
    translateY: useSharedValue(10),
  }));

  useEffect(() => {
    /* Logo pop */
    logoScale.value = withSpring(1, {
      damping: 8,
      stiffness: 120,
    });
    logoOpacity.value = withTiming(1, { duration: 600 });

    /* Ripples */
    ripple1.value = withRepeat(
      withTiming(1, { duration: 1800 }),
      -1,
      false
    );
    ripple2.value = withDelay(
      600,
      withRepeat(withTiming(1, { duration: 1800 }), -1, false)
    );

    /* Staggered text */
    textAnimations.forEach((anim, index) => {
      anim.opacity.value = withDelay(
        800 + index * 80,
        withTiming(1, { duration: 400 })
      );
      anim.translateY.value = withDelay(
        800 + index * 80,
        withTiming(0, { duration: 400 })
      );
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const rippleStyle = (progress) =>
    useAnimatedStyle(() => ({
      opacity: 1 - progress.value,
      transform: [{ scale: 1 + progress.value * 2 }],
    }));

  return (
    <View style={styles.container}>
      {/* Ripples */}
      <Animated.View style={[styles.ripple, rippleStyle(ripple1)]} />
      <Animated.View style={[styles.ripple, rippleStyle(ripple2)]} />

      {/* Logo */}
      <Animated.View style={[styles.logoCircle, logoStyle]}>
        <Text style={styles.logoText}>A</Text>
        <View style={styles.cutBar} />
      </Animated.View>

      {/* Animated Text */}
      <View style={styles.textRow}>
        {letters.map((letter, index) => {
          const anim = textAnimations[index];
          const letterStyle = useAnimatedStyle(() => ({
            opacity: anim.opacity.value,
            transform: [{ translateY: anim.translateY.value }],
          }));
          return (
            <Animated.Text
              key={index}
              style={[styles.title, letterStyle]}
            >
              {letter}
            </Animated.Text>
          );
        })}
      </View>
    </View>
  );
}

/* ───────── Styles ───────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A', // deep modern dark
    alignItems: 'center',
    justifyContent: 'center',
  },

  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: ORANGE,
    opacity: 0.15,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 12,
  },

  logoText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#fff',
  },

  /* hides the center bar of A */
  cutBar: {
    position: 'absolute',
    width: 46,
    height: 8,
    backgroundColor: ORANGE,
    top: 54,
  },

  textRow: {
    flexDirection: 'row',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});
