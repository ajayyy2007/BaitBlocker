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
  const totalSafe = totalScans - totalThreats;
  
  const recentScans = scans.slice(0, 3);

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
          <Text style={[styles.statNumber, { color: '#FF5C5C' }]}>{totalThreats}</Text>
          <Text style={styles.statLabel}>Threats Detected</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#00C896' }]}>{totalSafe}</Text>
          <Text style={styles.statLabel}>Safe Scans</Text>
        </View>
      </View>

      {/* Exposure Section */}
      <View style={styles.exposureCard}>
        <Text style={styles.exposureTitle}>Threat Exposure Level</Text>
        <Text style={[styles.exposureValue, { color: exposureColor }]}>
          {exposureLevel} ({exposureScore}%)
        </Text>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentScans.length === 0 ? (
          <Text style={styles.noData}>No recent scans.</Text>
        ) : (
          recentScans.map((scan, i) => (
            <View key={i} style={styles.recentItem}>
              <View style={[styles.statusIndicator, { backgroundColor: scan.status === 'dangerous' ? '#FF5C5C' : '#00C896' }]} />
              <View style={styles.recentTextCol}>
                <Text style={styles.recentInput} numberOfLines={1}>{scan.input}</Text>
                <Text style={styles.recentType}>{scan.threatType || "Scan"}</Text>
              </View>
              <Text style={styles.recentDate}>{scan.date.split(',')[0]}</Text>
            </View>
          ))
        )}
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
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937'
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

  recentActivity: {
    marginBottom: 40,
  },

  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  noData: {
    color: '#6C7A89',
    fontSize: 14,
    fontStyle: 'italic',
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1F2937'
  },

  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  recentTextCol: {
    flex: 1,
  },

  recentInput: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },

  recentType: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  recentDate: {
    color: '#6C7A89',
    fontSize: 12,
  }
}); 