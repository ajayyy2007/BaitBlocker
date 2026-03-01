import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { getScans, deleteScan, clearScans } from '../store';

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const refresh = () => {
    setScans([...getScans()]);
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const filteredScans = scans.filter(scan => {
    const matchesFilter =
      filter === 'all' ||
      scan.status === filter;

    const matchesSearch =
      scan.input.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan History</Text>

      {/* Search */}
      <TextInput
        placeholder="Search history..."
        placeholderTextColor="#6C7A89"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['all', 'safe', 'dangerous'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              filter === type && styles.activeFilter,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text style={styles.filterText}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clear All */}
      {scans.length > 0 && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            clearScans();
            refresh();
          }}
        >
          <Text style={styles.clearText}>CLEAR ALL HISTORY</Text>
        </TouchableOpacity>
      )}

      {/* History List */}
      {filteredScans.length === 0 ? (
        <Text style={styles.empty}>No matching scans.</Text>
      ) : (
        filteredScans.map((scan, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                borderColor:
                  scan.status === 'dangerous'
                    ? '#FF5C5C'
                    : '#00C896',
              },
            ]}
          >
            <Text
              style={[
                styles.status,
                {
                  color:
                    scan.status === 'dangerous'
                      ? '#FF5C5C'
                      : '#00C896',
                },
              ]}
            >
              {scan.status.toUpperCase()}
            </Text>

            <Text style={styles.inputText}>
              {scan.input}
            </Text>

            <Text style={styles.type}>
              Type: {scan.scamType || 'General'}
            </Text>

            <Text style={styles.date}>
              {scan.date}
            </Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                deleteScan(index);
                refresh();
              }}
            >
              <Text style={styles.deleteText}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070C18',
    padding: 24,
    minHeight: '100%',
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  search: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 12,
    color: 'white',
    marginBottom: 15,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  filterBtn: {
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },

  activeFilter: {
    backgroundColor: '#00C896',
  },

  filterText: {
    color: 'white',
    fontSize: 12,
  },

  clearBtn: {
    backgroundColor: '#FF5C5C',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  clearText: {
    color: 'white',
    fontWeight: 'bold',
  },

  empty: {
    color: '#6C7A89',
    fontSize: 14,
  },

  card: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
  },

  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  inputText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 6,
  },

  type: {
    color: '#6C7A89',
    fontSize: 12,
  },

  date: {
    color: '#8892A6',
    fontSize: 11,
    marginTop: 4,
  },

  deleteBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  deleteText: {
    color: '#FF5C5C',
    fontSize: 12,
  },
});