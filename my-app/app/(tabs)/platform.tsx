import { View, Text, StyleSheet, Switch, Image, ScrollView } from 'react-native';
import { useState } from 'react';

export default function PlatformPage() {

  const [whatsapp, setWhatsapp] = useState(true);
  const [gmail, setGmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [browser, setBrowser] = useState(true);
  const [telegram, setTelegram] = useState(true);
  const [instagram, setInstagram] = useState(true);

  // Static demo threat counts (can connect to real data later)
  const platforms = [
    {
      name: 'WhatsApp',
      logo: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
      threats: 2,
      enabled: whatsapp,
      toggle: setWhatsapp,
    },
    {
      name: 'Gmail',
      logo: 'https://cdn-icons-png.flaticon.com/512/281/281769.png',
      threats: 1,
      enabled: gmail,
      toggle: setGmail,
    },
    {
      name: 'SMS',
      logo: 'https://cdn-icons-png.flaticon.com/512/724/724664.png',
      threats: 0,
      enabled: sms,
      toggle: setSms,
    },
    {
      name: 'Browser',
      logo: 'https://cdn-icons-png.flaticon.com/512/841/841364.png',
      threats: 3,
      enabled: browser,
      toggle: setBrowser,
    },
    {
      name: 'Telegram',
      logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png',
      threats: 1,
      enabled: telegram,
      toggle: setTelegram,
    },
    {
      name: 'Instagram',
      logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
      threats: 2,
      enabled: instagram,
      toggle: setInstagram,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Platform Threat Monitoring</Text>

      {platforms.map((app, index) => (
        <View key={index} style={styles.card}>
          
          <View style={styles.leftSection}>
            <Image source={{ uri: app.logo }} style={styles.logo} />
            <View>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.threatText}>
                Threats Detected: {app.threats}
              </Text>
            </View>
          </View>

          <Switch
            value={app.enabled}
            onValueChange={app.toggle}
            trackColor={{ false: '#444', true: '#00C896' }}
            thumbColor={app.enabled ? '#00C896' : '#ccc'}
          />
        </View>
      ))}
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
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 10,
  },

  appName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  threatText: {
    color: '#6C7A89',
    fontSize: 13,
    marginTop: 4,
  },
});