import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';


export default function Dashboard() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <Text style={styles.header}>Bait Blocker</Text>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Status</Text>
        <Text style={styles.statusValue}>✅ You are Protected</Text>
        <Text style={styles.statusSub}>
          No phishing threats detected
        </Text>
      </View>

      {/* Scan Button */}
       <TouchableOpacity
  style={styles.scanButton}
  onPress={() => router.push('/scan')}
>
  <Text style={styles.scanButtonText}>SCAN FOR SCAM</Text>
</TouchableOpacity>




      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Threats Blocked</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0F1A',
    marginBottom: 20,
  },

  statusCard: {
    backgroundColor: '#F2F8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },

  statusTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },

  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B0F1A',
  },

  statusSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },

  scanButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },

  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B0F1A',
  },

  statLabel: {
    fontSize: 13,
    color: '#777',
    marginTop: 6,
  },
});
