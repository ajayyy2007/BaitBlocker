import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { addScan } from '../store';

export default function ScanPage() {
  const [urlInput, setUrlInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* ================= IMAGE PICKER (NO OCR) ================= */

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission required to access gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      alert('Image selected successfully!');
    }
  };

  /* ================= SCAN LOGIC ================= */

  const handleScan = async () => {
    const finalInput = messageInput || urlInput;

    if (!finalInput.trim()) {
      alert('Please enter a message or URL to scan');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: finalInput }),
      });

      const data = await response.json();

      addScan({
        input: finalInput,
        status: data.status,
        scamType: data.scamType,
      });

      router.push({
        pathname: '/result',
        params: { ...data, input: finalInput },
      });

    } catch (error) {
      alert('Backend not reachable');
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

      {/* Image Upload (UI Only) */}
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

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
        <Text style={styles.scanText}>RUN SECURITY SCAN</Text>
      </TouchableOpacity>

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
  },

  scanBtn: {
    marginTop: 20,
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
});