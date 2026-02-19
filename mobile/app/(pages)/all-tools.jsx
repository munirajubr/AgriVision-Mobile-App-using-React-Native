import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import Card from '../../components/Card';

export default function AllToolsPage() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const tools = [
    {
      title: "Instant Disease Detection",
      subtitle: "AI Vision",
      icon: "scan-outline",
      link: "/(pages)/diagnosis",
      bgColor: COLORS.pastelGreen,
      themeColor: "#2E7D32",
      type: "Quick Analysis"
    },
    {
      title: "Soil Analysis",
      subtitle: "NPK Check",
      icon: "analytics-outline",
      link: "/(pages)/npkupload",
      bgColor: COLORS.pastelPurple,
      themeColor: "#6A1B9A",
      type: "Quick Analysis"
    },
    {
      title: "Crop Tips",
      subtitle: "24 Guides",
      icon: "leaf-outline",
      link: "/(pages)/cropguide",
      bgColor: COLORS.pastelOrange,
      themeColor: "#E65100",
      type: "Quick Analysis"
    },
    {
      title: "Fertilizer Advisor",
      subtitle: "Pro Tips",
      icon: "flask-outline",
      link: "/(pages)/fertilizerguide",
      bgColor: COLORS.pastelBlue,
      themeColor: "#1565C0",
      type: "Quick Analysis"
    },
    {
      title: "Market Trends",
      subtitle: "Real-time prices",
      link: "/(tabs)/market",
      type: "Daily Tools"
    },
    {
      title: "Local Weather",
      subtitle: "Forecast & Alerts",
      link: "/(tabs)/weather",
      type: "Daily Tools"
    }
  ];

  const filteredTools = category ? tools.filter(t => t.type === category) : tools;

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: COLORS.textPrimary }]}>{category || "All Tools"}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredTools.map((tool, index) => (
            <Card
              key={index}
              variant="horizontal"
              title={tool.title}
              subtitle={tool.subtitle}
              link={tool.link}
              bgColor={COLORS.background}
            />
          ))}
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  }
});
