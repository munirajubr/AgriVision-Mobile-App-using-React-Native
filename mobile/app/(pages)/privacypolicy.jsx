import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';

export default function PrivacyPolicyPage() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const router = useRouter();

  const sections = [
    {
      title: "Data Collection",
      content: "We collect basic information such as your name, email, and farm location to provide localized weather and disease alerts. Soil data (NPK) is utilized solely for generating crop recommendations."
    },
    {
      title: "Camera & Storage",
      content: "Our AI Vision feature requires camera access to analyze plant health. Images are processed securely. We do not store personal photos unless they are explicitly uploaded as profile pictures."
    },
    {
      title: "Third-Party Services",
      content: "AgriVision utilizes weather APIs and machine learning models hosted on secure servers. Your data is never sold to third-party advertisers."
    },
    {
      title: "User Rights",
      content: "You have the right to access, modify, or delete your account at any time through the settings menu."
    }
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: COLORS.cardBackground }]}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: COLORS.textPrimary }]}>Privacy Policy</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBadge, { backgroundColor: `${COLORS.primary}10` }]}>
            <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
            <Text style={[styles.heroText, { color: COLORS.primary }]}>Your Data is Secure</Text>
          </View>

          <Text style={[styles.introText, { color: COLORS.textSecondary }]}>
            Last updated: February 19, 2026. AgriVision is committed to protecting your privacy and ensuring the security of your agricultural data.
          </Text>

          {sections.map((section, index) => (
            <View key={index} style={[styles.section, { backgroundColor: COLORS.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>{section.title}</Text>
              <Text style={[styles.sectionContent, { color: COLORS.textSecondary }]}>{section.content}</Text>
            </View>
          ))}

          <View style={[styles.footer, { backgroundColor: `${COLORS.info}05` }]}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>
              For more information or inquiries regarding your data, please contact us through the Help Center.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    gap: 16 
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  heroBadge: {
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroText: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  section: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    gap: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
