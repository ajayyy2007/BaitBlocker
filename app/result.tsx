import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getSettings } from "./store";

export default function ResultPage() {

  const params = useLocalSearchParams();
  const settings = getSettings();
  const showConfidence = settings.showConfidence;
  const detailedAnalysis = settings.detailedAnalysis;

  const status = params.status === "dangerous";
  const confidence = Number(params.confidence) || 0;
  
  const threatType = params.threatType ? String(params.threatType) : (status ? "Unknown Threat" : "Safe");
  const riskLevel = params.riskLevel ? String(params.riskLevel) : (status ? "high" : "low");
  const recommendedAction = params.recommendedAction ? String(params.recommendedAction) : (status ? "Do not click links" : "No action needed");

  const detectedURL = params.detectedURL ? String(params.detectedURL) : null;

  let redirectChain: string[] = [];
  try {
    redirectChain = params.redirectChain ? JSON.parse(String(params.redirectChain)) : [];
  } catch {
    redirectChain = [];
  }

  let brandResult: any = null;
  try {
    brandResult = params.brandResult ? JSON.parse(String(params.brandResult)) : null;
  } catch {
    brandResult = null; 
  }

  return (
    <ScrollView
      style={{ backgroundColor: "#070C18" }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.content}>

        {/* HEADER / STATUS */}

        <View style={styles.header}>
          <Text style={styles.title}>
            {status ? "⚠ Threat Detected" : "✅ Message is Safe"}
          </Text>
          <Text style={[styles.status, { color: status ? "#E74C3C" : "#2ECC71" }]}>
            {status ? "High Risk Identified" : "No Suspicious Patterns"}
          </Text>
        </View>

        {/* THREAT INFO GRID */}

        {detailedAnalysis && (
          <View style={styles.grid}>
            <View style={[styles.gridItem, { borderColor: status ? "#E74C3C" : "#2ECC71" }]}>
              <Text style={styles.label}>Threat Type</Text>
              <Text style={[styles.gridValue, { color: "white" }]}>{threatType}</Text>
            </View>
            <View style={[styles.gridItem, { borderColor: status ? "#E74C3C" : "#2ECC71" }]}>
              <Text style={styles.label}>Risk Level</Text>
              <View style={[styles.badge, { backgroundColor: riskLevel === 'high' ? '#E74C3C' : riskLevel === 'medium' ? '#FACC15' : '#2ECC71' }]}>
                <Text style={styles.badgeText}>{riskLevel.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* CONFIDENCE SCORE */}

        {showConfidence && (
          <View style={styles.card}>
            <Text style={styles.label}>AI Confidence Score</Text>
            <Text style={styles.value}>{confidence}%</Text>
          </View>
        )}

        {/* REDIRECT CHAIN & URLs */}

        {detailedAnalysis && detectedURL && (
          <View style={styles.card}>
            <Text style={styles.label}>Detected URL</Text>
            <Text style={styles.url}>{detectedURL}</Text>
          </View>
        )}

        {detailedAnalysis && redirectChain.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.label}>Redirect Chain (Hidden destinations)</Text>
            {redirectChain.map((link, index) => (
              <Text key={index} style={styles.point}>
                {index + 1}. {link}
              </Text>
            ))}
          </View>
        )}

        {/* BRAND WARNING */}

        {detailedAnalysis && brandResult?.impersonation && (
          <View style={styles.card}>
            <Text style={styles.label}>Brand Impersonation Warning</Text>
            <Text style={styles.warning}>
              ⚠ Attackers are attempting to impersonate {brandResult.brandDetected}
            </Text>
          </View>
        )}

        {/* RECOMMENDED ACTION */}

        {detailedAnalysis && (
          <View style={[styles.card, { borderColor: status ? "#E74C3C" : "#00C896", borderWidth: 2 }]}>
            <Text style={[styles.label, { color: status ? "#E74C3C" : "#00C896" }]}>Action Recommended</Text>
            <Text style={[styles.point, { fontSize: 16, color: "white", marginTop: 10 }]}>
              {recommendedAction}
            </Text>
          </View>
        )}

        {/* BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/scan")}
        >
          <Text style={styles.buttonText}>SCAN ANOTHER</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#070C18",
    padding: 24,
    alignItems: "center",
    paddingBottom: 80,
  },

  content: {
    width: "100%",
    maxWidth: 900,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  status: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  header: {
    alignItems: 'center',
    marginVertical: 20,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },

  gridItem: {
    width: "48%",
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
  },
  
  gridValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6
  },
  
  badgeText: {
    color: "#070C18",
    fontSize: 14,
    fontWeight: "bold"
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#1F2937",
  },

  label: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 8,
  },

  value: {
    color: "#00C896",
    fontSize: 22,
    fontWeight: "bold",
  },

  point: {
    color: "#E5E7EB",
    fontSize: 14,
    marginTop: 6,
  },

  url: {
    color: "#38BDF8",
    fontSize: 13,
    marginTop: 6,
  },

  warning: {
    color: "#FF5C5C",
    fontSize: 13,
    marginTop: 8,
  },

  button: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: "#00C896",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#070C18",
    fontWeight: "bold",
    fontSize: 15,
  }

});