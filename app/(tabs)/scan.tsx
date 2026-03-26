import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';

import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { addScan, getPlatforms, getSettings } from '../store';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.134.175.158:5000';

const fetchWithTimeout = (url: string, options: any, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), timeout)
    )
  ]);
};

export default function ScanPage() {

  const [urlInput, setUrlInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');
  const [scanning, setScanning] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errorMsg) setErrorMsg(null);
  }, [messageInput, urlInput, selectedImage]);

  /* ================= SECURITY POPUP ================= */

  useEffect(() => {

    const timer = setTimeout(() => {

      Alert.alert(
        "Security Setup",
        "BaitBlocker needs permission to scan screenshots and send security alerts.",
        [{ text: "Continue" }]
      );

      requestPermissions();

    }, 1000);

    return () => clearTimeout(timer);

  }, []);

  const requestPermissions = async () => {

    if (Platform.OS !== 'web') {
      await Notifications.requestPermissionsAsync();
    }
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    /* Protection active notification */

    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🛡 Protection Active",
          body: "BaitBlocker is ready to detect scam messages.",
        },
        trigger: null,
      });
    }

  };

  /* ================= IMAGE PICKER ================= */

  const pickImage = async () => {

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "BaitBlocker needs photo access to scan screenshots."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {

      const uri = result.assets[0].uri;
      setSelectedImage(uri);

      /* Screenshot notification */

      if (Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "📷 Screenshot Ready",
            body: "Screenshot uploaded. Tap scan to analyze it.",
          },
          trigger: null,
        });
      }

    }

  };

  /* ================= AUTO SCAN ================= */

  useEffect(() => {
    const settings = getSettings();
    if (settings.autoScan && selectedImage) {
      handleScan();
    }
  }, [selectedImage]);

  useEffect(() => {
    const settings = getSettings();
    if (settings.autoScan && messageInput.trim().length > 0) {
      const timeout = setTimeout(() => {
        handleScan();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [messageInput]);

  /* ================= SCAN LOGIC ================= */

  const handleScan = async () => {

    const platforms = getPlatforms();
    if (!platforms[selectedPlatform]) {
      Alert.alert(
        "Platform Disabled",
        `Scanning for ${selectedPlatform} is currently disabled in your Protection Settings.`
      );
      return;
    }

    const finalInput = messageInput || urlInput || (selectedImage ? "Screenshot Scan" : "");

    if (!finalInput.trim()) {
      Alert.alert('Empty Input', 'Please enter a message, URL, or upload an image to scan');
      return;
    }

    setScanning(true);
    setErrorMsg(null);
    setLoadingText("Scanning securely...");

    const slowTimer = setTimeout(() => {
      setLoadingText("Still analyzing, please wait...");
    }, 3000);

    try {

      const settings = getSettings();
      const response = await fetchWithTimeout(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: finalInput, sensitivity: settings.sensitivity }),
      }, 5000) as Response;

      clearTimeout(slowTimer);

      if (!response.ok) {
        throw new Error('SERVER_ERROR');
      }

      const data = await response.json();

      setScanning(false);

      /* ===== SEND ALERT IF DANGEROUS ===== */

      if (data.status === "dangerous" && Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⚠ Scam Alert",
            body: "Suspicious message or link detected. Avoid interacting with it.",
          },
          trigger: null,
        });
      }

      /* ===== SAVE TO HISTORY ===== */

      addScan({
        input: finalInput || "Screenshot Scan",
        status: data.status,
        scamType: data.scamType,
        threatType: data.threatType,
        riskLevel: data.riskLevel,
      });

      /* ===== NAVIGATE TO RESULT ===== */

      router.push({
        pathname: '/result',
        params: { ...data, input: finalInput },
      });

    } catch (err: any) {

      clearTimeout(slowTimer);
      setScanning(false);
      
      let msg = 'An unexpected error occurred.';
      if (err?.message === 'TIMEOUT') {
        msg = 'Server timeout. Please try again.';
      } else if (err?.message === 'SERVER_ERROR') {
        msg = 'Server error. Try again later.';
      } else {
        msg = 'No internet connection or server unreachable.';
      }
      
      setErrorMsg(msg);

    }

  };

  return (

    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>Threat Scanner</Text>
        <Text style={styles.subtitle}>
          Analyze links, messages & screenshots
        </Text>
      </View>

      {/* Source Platform Selector */}
      <View style={styles.card}>
        <Text style={styles.icon}>📱</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.photoTitle}>Source Platform</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {['whatsapp', 'sms', 'gmail', 'telegram', 'instagram', 'browser'].map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.platformChip,
                  selectedPlatform === p && styles.platformChipActive
                ]}
                onPress={() => setSelectedPlatform(p)}
              >
                <Text style={[
                  styles.platformText,
                  selectedPlatform === p && styles.platformTextActive
                ]}>
                  {p.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* URL Input */}

      <View style={styles.card}>
        <Text style={styles.icon}>🌐</Text>

        <TextInput
          placeholder="Enter suspicious URL"
          placeholderTextColor="#6C7A89"
          style={styles.input}
          value={urlInput}
          onChangeText={setUrlInput}
        />

      </View>

      {/* Message Input */}

      <View style={styles.card}>
        <Text style={styles.icon}>💬</Text>

        <TextInput
          placeholder="Paste suspicious message"
          placeholderTextColor="#6C7A89"
          style={[styles.input, { minHeight: 60 }]}
          value={messageInput}
          onChangeText={setMessageInput}
          multiline
        />

      </View>

      {/* Screenshot Upload */}

      <TouchableOpacity style={styles.card} onPress={pickImage}>

        <Text style={styles.icon}>📷</Text>

        <View>
          <Text style={styles.photoTitle}>Upload Screenshot</Text>
          <Text style={styles.photoSub}>
            Image selected for future analysis
          </Text>
        </View>

      </TouchableOpacity>

      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.preview}
        />
      )}

      {/* ERROR MESSAGE */}

      {errorMsg && !scanning && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠ {errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleScan}>
            <Text style={styles.retryText}>Retry Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SCANNING MESSAGE */}

      {scanning && (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#00C896" />
          <Text style={styles.scanStatus}>
            {loadingText}
          </Text>
        </View>
      )}

      {/* Scan Button */}

      {!scanning && !errorMsg && (
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={handleScan}
        >
          <Text style={styles.scanText}>
            RUN SECURITY SCAN
          </Text>
        </TouchableOpacity>
      )}

    </ScrollView>

  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#070C18',
    padding: 24,
    minHeight: '100%',
  },

  header: {
    marginBottom: 40,
  },

  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#6C7A89',
    marginTop: 6,
    fontSize: 13,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  icon: {
    fontSize: 20,
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: 'white',
  },

  photoTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },

  photoSub: {
    color: '#6C7A89',
    fontSize: 12,
    marginTop: 4,
  },

  preview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'contain'
  },

  scanningContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },

  scanStatus: {
    color: "#00C896",
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  errorContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    marginBottom: 20,
  },

  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },

  retryBtn: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },

  retryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },

  scanBtn: {
    marginTop: 10,
    backgroundColor: '#00C896',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },

  scanText: {
    color: '#070C18',
    fontSize: 15,
    fontWeight: 'bold',
  },

  platformChip: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },

  platformChipActive: {
    backgroundColor: '#00C896',
  },

  platformText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  platformTextActive: {
    color: '#070C18',
  }

});