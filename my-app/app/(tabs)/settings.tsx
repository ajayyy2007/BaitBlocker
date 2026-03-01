import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';

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

  /* Protection Engine */
  const [sensitivity, setSensitivity] = useState<number>(1);
  const [autoClipboard, setAutoClipboard] = useState<boolean>(false);
  const [imageOCR, setImageOCR] = useState<boolean>(false);

  /* Privacy */
  const [incognito, setIncognito] = useState<boolean>(false);

  /* Results Display */
  const [showConfidence, setShowConfidence] = useState<boolean>(true);
  const [deepLink, setDeepLink] = useState<boolean>(false);
  const [explainWhy, setExplainWhy] = useState<boolean>(true);

  /* Notifications */
  const [soundEffects, setSoundEffects] = useState<boolean>(true);

  const sensitivityLabel =
    sensitivity === 0 ? 'Low' :
    sensitivity === 1 ? 'Medium' :
    'High';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

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
          label="Auto Clipboard Scan"
          value={autoClipboard}
          onChange={setAutoClipboard}
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
          label="Explain 'The Why'"
          value={explainWhy}
          onChange={setExplainWhy}
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