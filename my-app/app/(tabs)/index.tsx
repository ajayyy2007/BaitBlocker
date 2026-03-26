import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getScans } from '../store';

export default function Dashboard() {

  const [scans, setScans] = useState<any[]>([]);

  // 🔄 Refresh scans whenever dashboard screen is focused
  useFocusEffect(
    useCallback(() => {
      const data = getScans();
      setScans(data);
    }, [])
  );

  const totalScans = scans.length;
  const totalThreats = scans.filter(s => s.status === 'dangerous').length;

  const exposureScore =
    totalScans === 0 ? 0 : Math.round((totalThreats / totalScans) * 100);

  const securityScore = 100 - exposureScore;

  let exposureLevel = "Low";
  let exposureColor = "#00C896";

  if (exposureScore > 60) {
    exposureLevel = "High";
    exposureColor = "#FF5C5C";
  } else if (exposureScore > 30) {
    exposureLevel = "Medium";
    exposureColor = "#FACC15";
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>ScamShield</Text>
        <Text style={styles.tagline}>
          Personal Threat Intelligence Dashboard
        </Text>
      </View>

      {/* Security Score Circle */}
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreCircle, { borderColor: exposureColor }]}>
          <Text style={[styles.scoreText, { color: exposureColor }]}>
            {securityScore}%
          </Text>
        </View>
        <Text style={styles.scoreLabel}>Security Strength</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalThreats}</Text>
          <Text style={styles.statLabel}>Threats Detected</Text>
        </View>
      </View>

      {/* Exposure Section */}
      <View style={styles.exposureCard}>
        <Text style={styles.exposureTitle}>Threat Exposure Level</Text>
        <Text style={[styles.exposureValue, { color: exposureColor }]}>
          {exposureLevel} ({exposureScore}%)
        </Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push('/(tabs)/scan')}
      >
        <Text style={styles.scanText}>RUN NEW SECURITY SCAN</Text>
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

  appName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  tagline: {
    color: '#6C7A89',
    marginTop: 6,
    fontSize: 13,
  },

  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },

  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },

  scoreLabel: {
    color: '#8892A6',
    marginTop: 12,
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#111827',
    padding: 22,
    borderRadius: 20,
  },

  statNumber: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#8892A6',
    marginTop: 6,
    fontSize: 13,
  },

  exposureCard: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 18,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  exposureTitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 8,
  },

  exposureValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  scanButton: {
    backgroundColor: '#00C896',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },

  scanText: {
    color: '#070C18',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
}); 