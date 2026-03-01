import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';

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
  const {
    status = 'safe',
    confidence = 80,
    input = '',
    redirectChain = '[]'
  } = useLocalSearchParams();

  const isDanger = status === 'dangerous';
  const gauges = analyzeThreat(String(input));
  const linkInfo = inspectLink(String(input));
  const [showRedirects, setShowRedirects] = useState(false);

  /* ===== SAFE PARSE redirectChain ===== */
  let parsedRedirectChain: string[] = [];
  try {
    if (typeof redirectChain === 'string') {
      parsedRedirectChain = JSON.parse(redirectChain);
    } else if (Array.isArray(redirectChain)) {
      parsedRedirectChain = redirectChain as string[];
    }
  } catch {
    parsedRedirectChain = [];
  }

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

        {/* 🔍 Redirect Tracer Section */}
        {parsedRedirectChain.length > 0 && (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => setShowRedirects(!showRedirects)}
              style={styles.redirectButton}
            >
              <Text style={styles.redirectButtonText}>
                🔍 {showRedirects ? 'Hide Link Path' : 'View Link Path'}
              </Text>
            </TouchableOpacity>

            {showRedirects && (
              <View style={styles.redirectContainer}>
                {parsedRedirectChain.map((link: string, index: number) => {
                  let hostname = link;
                  try {
                    hostname = link.startsWith('http')
                      ? new URL(link).hostname
                      : link;
                  } catch {}

                  const isFinal = index === parsedRedirectChain.length - 1;

                  return (
                    <View key={index} style={styles.redirectItem}>
                      <Text
                        style={[
                          styles.redirectText,
                          isFinal && isDanger ? { color: '#FF5C5C' } : {}
                        ]}
                      >
                        {hostname}
                      </Text>

                      {!isFinal && <Text style={styles.arrow}>↓</Text>}
                    </View>
                  );
                })}
              </View>
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

        {/* Scan Again Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(tabs)/scan')}
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
    backgroundColor: '#070C18',
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
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  label: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 8,
  },

  value: {
    color: '#00C896',
    fontSize: 22,
    fontWeight: 'bold',
  },

  point: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 6,
  },

  meterLabel: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 12,
  },

  meterBg: {
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
  },

  meterFill: {
    height: 8,
    borderRadius: 10,
  },

  url: {
    color: '#38BDF8',
    fontSize: 13,
    marginTop: 6,
  },

  warning: {
    color: '#FF5C5C',
    fontSize: 12,
    marginTop: 8,
  },

  safe: {
    color: '#00C896',
    fontSize: 12,
    marginTop: 8,
  },

  redirectButton: {
    padding: 10,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    alignItems: 'center',
  },

  redirectButtonText: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 14,
  },

  redirectContainer: {
    marginTop: 15,
  },

  redirectItem: {
    alignItems: 'center',
  },

  redirectText: {
    color: '#00C896',
    fontSize: 13,
  },

  arrow: {
    color: '#6B7280',
    marginVertical: 4,
  },

  button: {
    marginTop: 14,
    backgroundColor: '#00C896',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#070C18',
    fontWeight: 'bold',
    fontSize: 15,
  },
});