import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ResultPage() {
  const { status = 'safe', confidence = 80 } = useLocalSearchParams();

  const isDanger = status === 'dangerous';

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>
        {isDanger ? '⚠ Security Threat Detected' : '✅ No Threat Detected'}
      </Text>

      <Text style={[styles.status, { color: isDanger ? '#E74C3C' : '#2ECC71' }]}>
        {isDanger ? 'High Risk Message Identified' : 'Message Appears Safe'}
      </Text>

      {/* Confidence Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Confidence Score</Text>
        <Text style={styles.value}>{confidence}%</Text>
      </View>

      {/* Analysis Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Analysis Summary</Text>

        {isDanger ? (
          <>
            <Text style={styles.point}>• Sensitive information request detected</Text>
            <Text style={styles.point}>• Message shows scam-like patterns</Text>
            <Text style={styles.point}>• Potential phishing / social engineering risk</Text>
          </>
        ) : (
          <Text style={styles.point}>• No suspicious patterns detected</Text>
        )}
      </View>

      {/* Recommended Action */}
      <View style={styles.card}>
        <Text style={styles.label}>Recommended Action</Text>

        {isDanger ? (
          <>
            <Text style={styles.point}>• Do NOT respond or click links</Text>
            <Text style={styles.point}>• Block & report sender if unknown</Text>
            <Text style={styles.point}>• Never share OTP / PIN / Password</Text>
          </>
        ) : (
          <Text style={styles.point}>• No immediate action required</Text>
        )}
      </View>

      {/* Educational Note */}
      {isDanger && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            💡 Scam messages often attempt to steal sensitive data like
            passwords, OTPs, and ATM PINs. Always verify through official channels.
          </Text>
        </View>
      )}

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/scan')}
      >
        <Text style={styles.buttonText}>SCAN ANOTHER</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#121826',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  label: {
    color: '#8892A6',
    fontSize: 13,
    marginBottom: 6,
  },

  value: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  point: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },

  warningBox: {
    backgroundColor: '#1C2833',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  warningText: {
    color: '#F4D03F',
    fontSize: 12,
  },

  button: {
    marginTop: 18,
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
