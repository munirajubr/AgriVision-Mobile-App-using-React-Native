import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store/authStore';
import SafeScreen from '../../components/SafeScreen';
import DashboardHome from '../(dashboard)/index';
import DevicesScreen from '../(dashboard)/devices';
import { useRouter } from 'expo-router';

const TabButton = ({ label, active, onPress, COLORS, isDarkMode }) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      active && { backgroundColor: COLORS.primary },
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.tabButtonText,
        { color: active ? (isDarkMode ? '#000000' : '#FFFFFF') : COLORS.textTertiary },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DashboardPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { activeTab, setActiveTab } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Check if profile is incomplete
    const isIncomplete = !user?.phone || !user?.farmLocation || !user?.farmSize;
    
    if (isIncomplete && user) {
      // Small delay to ensure screen is mounted
      const timer = setTimeout(() => {
        Alert.alert(
          "Complete Your Profile",
          "Please take a moment to complete your profile for a better experience.",
          [
            { text: "Later", style: "cancel" },
            { text: "Update Now", onPress: () => router.push("/(auth)/setup") }
          ]
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const tabs = [
    { key: 'home', label: 'Overview' },
    { key: 'devices', label: 'Devices' },
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {/* Minimal Tab Switcher at the very top */}
        <View style={styles.tabsWrapper}>
          <View style={[styles.tabsContainer, { backgroundColor: COLORS.cardBackground }]}>
            {tabs.map(({ key, label }) => (
              <TabButton
                key={key}
                label={label}
                active={activeTab === key}
                onPress={() => setActiveTab(key)}
                COLORS={COLORS}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === 'home' ? <DashboardHome /> : <DevicesScreen />}
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 18,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
});
