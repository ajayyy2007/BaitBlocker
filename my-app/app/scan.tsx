import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function ScanPage() {
  return (
    <View style={styles.container}>

      {/* URL Input */}
      <View style={styles.card}>
        <Text style={styles.icon}>🌐</Text>
        <TextInput
          placeholder="Enter URL or Link"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity style={styles.pasteBtn}>
          <Text style={styles.pasteText}>Paste</Text>
        </TouchableOpacity>
      </View>

      {/* Message Input */}
      <View style={styles.card}>
        <Text style={styles.icon}>💬</Text>
        <TextInput
          placeholder="Enter Message Text"
          placeholderTextColor="#999"
          style={styles.input}
        />
      </View>

      {/* Image Upload */}
      <View style={styles.card}>
        <Text style={styles.icon}>📷</Text>
        <View>
          <Text style={styles.uploadTitle}>Upload Image</Text>
          <Text style={styles.uploadSub}>Analyze Screenshot</Text>
        </View>
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanBtn}>
        <Text style={styles.scanText}>SCAN FOR SCAM</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFB26B',
    padding: 14,
    marginBottom: 16,
  },

  icon: {
    fontSize: 20,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },

  pasteBtn: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },

  pasteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  uploadTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  uploadSub: {
    fontSize: 12,
    color: '#777',
  },

  scanBtn: {
    marginTop: 30,
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },

  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
