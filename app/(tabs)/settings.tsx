import React, { useState, useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import { getSettings, updateSetting, getPlatforms, setPlatform } from '../store';
import { requestPermissionsAsync, checkPermissionsAsync } from '../../modules/whatsapp-listener';

/* ================= Types ================= */

type SectionProps = {
  title: string;
  children: ReactNode;
};

type SettingRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/* ================= Main Component ================= */

export default function SettingsPage() {

  const settings = getSettings();

  /* Active Monitoring */
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(getPlatforms()['whatsapp']);

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkPermissionsAsync().then(granted => {
        if (!granted && whatsappEnabled) {
          setWhatsappEnabled(false);
          setPlatform('whatsapp', false);
        }
      });
    }
  }, []);

  const handleWhatsappToggle = async (val: boolean) => {
    if (Platform.OS !== 'android') {
       Alert.alert("Feature Unavailable", "WhatsApp scanning is only supported on native Android.");
       return;
    }

    if (val) {
      const granted = await checkPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Permission Required", 
          "Guide: Go to Settings → Notification access and enable BaitBlocker scanner. Tap Continue to open OS settings.",
          [
            { text: "Cancel", style: "cancel" }, 
            { text: "Continue", onPress: () => requestPermissionsAsync() }
          ]
        );
        return; 
      }
    }
    setWhatsappEnabled(val);
    setPlatform('whatsapp', val);
  };

  /* Protection Engine */
  const [sensitivity, setSensitivityState] = useState<number>(
    settings.sensitivity === 'low' ? 0 : settings.sensitivity === 'high' ? 2 : 1
  );
  const [autoScan, setAutoScanState] = useState<boolean>(settings.autoScan);
  const [imageOCR, setImageOCR] = useState<boolean>(false);

  /* Privacy */
  const [incognito, setIncognito] = useState<boolean>(false);

  /* Results Display */
  const [showConfidence, setShowConfidenceState] = useState<boolean>(settings.showConfidence);
  const [deepLink, setDeepLink] = useState<boolean>(false);
  const [detailedAnalysis, setDetailedAnalysisState] = useState<boolean>(settings.detailedAnalysis);

  /* Notifications */
  const [soundEffects, setSoundEffects] = useState<boolean>(true);

  // Wrapper setters to update both local state and global store
  const setSensitivity = (val: number) => {
    setSensitivityState(val);
    updateSetting('sensitivity', val === 0 ? 'low' : val === 2 ? 'high' : 'medium');
  };
  const setAutoScan = (val: boolean) => {
    setAutoScanState(val);
    updateSetting('autoScan', val);
  };
  const setShowConfidence = (val: boolean) => {
    setShowConfidenceState(val);
    updateSetting('showConfidence', val);
  };
  const setDetailedAnalysis = (val: boolean) => {
    setDetailedAnalysisState(val);
    updateSetting('detailedAnalysis', val);
  };

  const sensitivityLabel =
    sensitivity === 0 ? 'Low' :
    sensitivity === 1 ? 'Medium' :
    'High';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Active Monitoring */}
      {Platform.OS === 'android' && (
        <Section title="Active Monitoring">
           <SettingRow
             label="Monitor WhatsApp"
             value={whatsappEnabled}
             onChange={handleWhatsappToggle}
           />
        </Section>
      )}

      {/* Protection Engine */}
      <Section title="Protection Engine">

        <Text style={styles.label}>
          Scanning Sensitivity: {sensitivityLabel}
        </Text>

        <Slider
          minimumValue={0}
          maximumValue={2}
          step={1}
          value={sensitivity}
          onValueChange={(value: number) => setSensitivity(value)}
          minimumTrackTintColor="#00C896"
          maximumTrackTintColor="#444"
        />

        <SettingRow
          label="Auto Scan"
          value={autoScan}
          onChange={setAutoScan}
        />

        <SettingRow
          label="Image OCR Analysis"
          value={imageOCR}
          onChange={setImageOCR}
        />
      </Section>

      {/* Privacy & Data */}
      <Section title="Privacy & Data">
        <SettingRow
          label="Incognito Scanning"
          value={incognito}
          onChange={setIncognito}
        />

        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerText}>
            CLEAR ALL SCAN DATA
          </Text>
        </TouchableOpacity>
      </Section>

      {/* Results Display */}
      <Section title="Results Display">
        <SettingRow
          label="Show Confidence Score"
          value={showConfidence}
          onChange={setShowConfidence}
        />

        <SettingRow
          label="Deep Link Analysis"
          value={deepLink}
          onChange={setDeepLink}
        />

        <SettingRow
          label="Detailed Analysis"
          value={detailedAnalysis}
          onChange={setDetailedAnalysis}
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SettingRow
          label="Sound Effects"
          value={soundEffects}
          onChange={setSoundEffects}
        />
      </Section>

    </ScrollView>
  );
}

/* ================= Reusable Components ================= */

const Section = ({ title, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingRow = ({ label, value, onChange }: SettingRowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: '#444', true: '#00C896' }}
      thumbColor={value ? '#00C896' : '#ccc'}
    />
  </View>
);

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070C18',
    padding: 24,
    minHeight: '100%',
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  section: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },

  sectionTitle: {
    color: '#00C896',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

  label: {
    color: 'white',
    fontSize: 14,
  },

  dangerButton: {
    backgroundColor: '#FF5C5C',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  dangerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});