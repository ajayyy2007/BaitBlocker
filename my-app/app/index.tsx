import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.logoCircle}>
  
  {/* Stylized A */}
  <Text style={styles.logoA}>A</Text>

  {/* This hides the middle bar of A */}
  <View style={styles.hideBar}></View>

</View>


      {/* Title */}
      <Text style={styles.title}>Bait Blocker</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        AI‑Powered Phishing Detection System
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        An intelligent Android application designed to detect and block phishing 
        messages, protecting users from online fraud and malicious links.
      </Text>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Secure • Smart • Reliable
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  logoA: {
  fontSize: 70,
  fontWeight: 'bold',
  color: '#ffffff',
},

hideBar: {
  position: 'absolute',
  width: 40,
  height: 8,
  backgroundColor: '#1E90FF', // same as circle color
  top: 55,   // adjust if needed
},


  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0B0F1A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  tagline: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: '600',
  },
});
