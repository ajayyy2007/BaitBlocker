import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ResultPage() {
  const { status, confidence, reasons } = useLocalSearchParams();

  const isDanger = status === 'dangerous';

  return (
    <View style={styles.container}>

      {/* Status */}
      <Text style={styles.icon}>{isDanger ? '🚨' : '✅'}</Text>
      <Text style={[styles.title, { color: isDanger ? '#D35400' : '#2ECC71' }]}>
        {isDanger ? 'Phishing Detected' : 'Message is Safe'}
      </Text>

      {/* Confidence */}
      <View style={styles.card}>
        <Text style={styles.label}>Confidence</Text>
        <Text style={styles.value}>{confidence}%</Text>
      </View>

      {/* Reasons */}
      <View style={styles.card}>
        <Text style={styles.label}>Analysis Report</Text>
        {Array.isArray(reasons)
          ? reasons.map((r, i) => (
              <Text key={i} style={styles.reason}>• {r}</Text>
            ))
          : <Text style={styles.reason}>• {reasons}</Text>}
      </View>

      {/* Scan Time */}
      <Text style={styles.time}>
        Scanned at: {new Date().toLocaleTimeString()}
      </Text>

      {/* Action */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/scan')}
      >
        <Text style={styles.buttonText}>SCAN ANOTHER</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 48,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  reason: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },

  time: {
    fontSize: 12,
    color: '#999',
    marginVertical: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
