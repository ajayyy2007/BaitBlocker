import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ResultPage() {
  const { status, message } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        {status === 'dangerous' ? '⚠️' : '✅'}
      </Text>

      <Text style={styles.title}>
        {status === 'dangerous' ? 'Phishing Detected' : 'Message Safe'}
      </Text>

      <Text style={styles.desc}>{message}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.btnText}>GO HOME</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  desc: { marginTop: 10, color: '#555' },
  btn: { marginTop: 30, backgroundColor: '#FF8C00', padding: 15, borderRadius: 30 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
