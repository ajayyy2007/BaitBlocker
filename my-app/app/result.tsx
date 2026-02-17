import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

/* ================= THREAT ANALYSIS LOGIC ================= */

function analyzeThreat(input: string) {
  const text = input.toLowerCase();

  let urgency = 10;
  let trust = 90;
  let link = 90;

  if (text.match(/urgent|immediately|now|blocked|suspended|hurry/))
    urgency += 60;

  if (text.match(/pin|otp|password|cvv|bank|account/))
    trust -= 50;

  if (text.match(/http|https|bit\.ly|login|verify/))
    link -= 60;

  return {
    urgency: Math.min(urgency, 100),
    trust: Math.max(trust, 0),
    link: Math.max(link, 0),
  };
}

/* ================= LINK INSPECTOR ================= */

function inspectLink(input: string) {
  const text = input.toLowerCase();

  const linkMatch = text.match(/https?:\/\/[^\s]+/);

  if (!linkMatch) return null;

  const url = linkMatch[0];

  const shortener = url.match(/bit\.ly|tinyurl|t\.co/);

  return {
    url,
    isShortened: !!shortener,
  };
}

/* ================= RESULT PAGE ================= */

export default function ResultPage() {
  const { status = 'safe', confidence = 80, input = '' } = useLocalSearchParams();

  const isDanger = status === 'dangerous';

  const gauges = analyzeThreat(String(input));
  const linkInfo = inspectLink(String(input));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>
          {isDanger ? '⚠ Security Threat Detected' : '✅ No Threat Detected'}
        </Text>

        <Text style={[styles.status, { color: isDanger ? '#E74C3C' : '#2ECC71' }]}>
          {isDanger ? 'High Risk Message Identified' : 'Message Appears Safe'}
        </Text>

        {/* Confidence */}
        <View style={styles.card}>
          <Text style={styles.label}>Confidence Score</Text>
          <Text style={styles.value}>{confidence}%</Text>
        </View>

        {/* Threat Gauges */}
        <View style={styles.card}>
          <Text style={styles.label}>Threat Gauges</Text>

          <Text style={styles.meterLabel}>Urgency Level</Text>
          <View style={styles.meterBg}>
            <View style={[styles.meterFill, { width: `${gauges.urgency}%`, backgroundColor: '#E74C3C' }]} />
          </View>

          <Text style={styles.meterLabel}>Sender Trust</Text>
          <View style={styles.meterBg}>
            <View style={[styles.meterFill, { width: `${gauges.trust}%`, backgroundColor: '#F1C40F' }]} />
          </View>

          <Text style={styles.meterLabel}>Link Safety</Text>
          <View style={styles.meterBg}>
            <View style={[styles.meterFill, { width: `${gauges.link}%`, backgroundColor: '#2ECC71' }]} />
          </View>
        </View>

        {/* Link Inspector */}
        {linkInfo && (
          <View style={styles.card}>
            <Text style={styles.label}>Link Inspector</Text>

            <Text style={styles.point}>Detected URL:</Text>
            <Text style={styles.url}>{linkInfo.url}</Text>

            {linkInfo.isShortened ? (
              <Text style={styles.warning}>
                ⚠ Shortened link detected – Shortened links commonly hide malicious destinations
              </Text>
            ) : (
              <Text style={styles.safe}>
                ✅ No shortening patterns detected
              </Text>
            )}
          </View>
        )}

        {/* Analysis */}
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

        {/* Actions */}
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

        {isDanger && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              💡 Scam messages often attempt to steal sensitive data. Always verify via official channels.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/scan')}
        >
          <Text style={styles.buttonText}>SCAN ANOTHER</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B0F1A',
    padding: 24,
    alignItems: 'center',
    paddingBottom: 60,
  },

  content: {
    width: '100%',
    maxWidth: 900,
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
    marginBottom: 14,
    width: '100%',
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

  meterLabel: {
    color: 'white',
    fontSize: 13,
    marginTop: 10,
  },

  meterBg: {
    height: 8,
    backgroundColor: '#1C2833',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
  },

  meterFill: {
    height: 8,
    borderRadius: 10,
  },

  url: {
    color: '#5DADE2',
    fontSize: 13,
    marginTop: 4,
  },

  warning: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 6,
  },

  safe: {
    color: '#2ECC71',
    fontSize: 12,
    marginTop: 6,
  },

  warningBox: {
    backgroundColor: '#1C2833',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  warningText: {
    color: '#F4D03F',
    fontSize: 12,
  },

  button: {
    marginTop: 10,
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
