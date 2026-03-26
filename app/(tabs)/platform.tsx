import { View, Text, StyleSheet, Switch, Image, ScrollView, NativeModules, Platform } from 'react-native';
import { useState } from 'react';
import { setPlatform } from "../store";

const { NotificationModule } = NativeModules;

export default function PlatformPage() {

  const handleToggle = async (platform: string, value: boolean) => {
    setPlatform(platform, value);
    
    // Automatically request Android native Notification Access when WhatsApp is enabled
    if (platform === 'whatsapp' && value && Platform.OS === 'android') {
      try {
        const hasPermission = await NotificationModule.hasPermission();
        if (!hasPermission) {
          NotificationModule.requestPermission();
        }
      } catch (e) {
        console.log("NotificationModule native method missing", e);
      }
    }
  };

  const [whatsapp, setWhatsapp] = useState(true);
  const [gmail, setGmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [browser, setBrowser] = useState(true);
  const [telegram, setTelegram] = useState(true);
  const [instagram, setInstagram] = useState(true);

  const platforms = [
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      logo: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
      threats: 2,
      enabled: whatsapp,
      toggle: setWhatsapp,
    },
    {
      name: 'gmail',
      label: 'Gmail',
      logo: 'https://cdn-icons-png.flaticon.com/512/281/281769.png',
      threats: 1,
      enabled: gmail,
      toggle: setGmail,
    },
    {
      name: 'sms',
      label: 'SMS',
      logo: 'https://cdn-icons-png.flaticon.com/512/724/724664.png',
      threats: 0,
      enabled: sms,
      toggle: setSms,
    },
    {
      name: 'browser',
      label: 'Browser',
      logo: 'https://cdn-icons-png.flaticon.com/512/841/841364.png',
      threats: 3,
      enabled: browser,
      toggle: setBrowser,
    },
    {
      name: 'telegram',
      label: 'Telegram',
      logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png',
      threats: 1,
      enabled: telegram,
      toggle: setTelegram,
    },
    {
      name: 'instagram',
      label: 'Instagram',
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
              <Text style={styles.appName}>{app.label}</Text>
              <Text style={styles.threatText}>
                Threats Detected: {app.threats}
              </Text>
            </View>
          </View>

          <Switch
            value={app.enabled}
            onValueChange={(value) => {
              app.toggle(value);
              handleToggle(app.name, value);
            }}
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