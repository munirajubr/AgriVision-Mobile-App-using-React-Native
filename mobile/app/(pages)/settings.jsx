import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

const SettingsPage = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const sections = [
    {
      title: 'Experience',
      items: [
        { icon: 'moon', label: 'Dark Mode', type: 'toggle', value: isDarkMode, action: toggleTheme, color: COLORS.info },
        { icon: 'notifications', label: 'Push Notifications', type: 'toggle', value: true, color: COLORS.warning },
      ]
    },
    {
      title: 'Account & Security',
      items: [
        { icon: 'person', label: 'Update Profile', type: 'nav', route: '/(pages)/editprofile', color: COLORS.success },
        { icon: 'lock-closed', label: 'Privacy Settings', type: 'nav', color: '#9C27B0' },
      ]
    },
    {
      title: 'Support & Interaction',
      items: [
        { icon: 'help-circle', label: 'Help Center', type: 'nav', route: '/(pages)/helpsupport', color: COLORS.info },
        { icon: 'share-social', label: 'Invite Friends', type: 'action', action: () => Alert.alert("Invite Friends", "[Coming Soon]"), color: COLORS.primary },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: 'shield-checkmark', label: 'Privacy Policy', type: 'nav', route: '/(pages)/privacypolicy', color: COLORS.primary },
        { icon: 'information-circle', label: 'App Version', type: 'info', value: '2.0.0', color: COLORS.textTertiary },
      ]
    }
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Settings" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {sections.map((section, sIdx) => (
            <View key={sIdx} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: COLORS.textTertiary }]}>{section.title}</Text>
              <View style={[styles.sectionContent, { backgroundColor: COLORS.cardBackground, borderWidth: 0 }]}>
                {section.items.map((item, iIdx) => (
                  <View key={iIdx}>
                    <TouchableOpacity 
                      style={styles.item} 
                      onPress={() => item.route ? router.push(item.route) : item.action && item.action()}
                      disabled={item.type === 'info' || item.type === 'toggle'}
                    >
                      <View style={[styles.iconBox, { backgroundColor: `${item.color}10` }]}>
                        <Ionicons name={item.icon} size={20} color={item.color} />
                      </View>
                      <Text style={[styles.label, { color: COLORS.textPrimary }]}>{item.label}</Text>
                      
                      {item.type === 'toggle' ? (
                        <Switch 
                          value={item.value} 
                          onValueChange={item.action}
                          trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
                          thumbColor="#FFF"
                        />
                      ) : item.type === 'info' ? (
                        <Text style={[styles.infoVal, { color: COLORS.textTertiary }]}>{item.value}</Text>
                      ) : (
                        <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.textTertiary }]}>AgriVision IoT Ecosystem</Text>
            <Text style={[styles.footerText, { color: COLORS.textTertiary }]}>v2.0.0 Stable Build</Text>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginLeft: 16, marginBottom: 10, letterSpacing: 1 },
  sectionContent: { borderRadius: 24, overflow: 'hidden', borderWidth: 0 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  label: { flex: 1, fontSize: 16, fontWeight: '500' },
  infoVal: { fontSize: 15, fontWeight: '400' },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 12, opacity: 0.5, marginBottom: 5 }
});

export default SettingsPage;
