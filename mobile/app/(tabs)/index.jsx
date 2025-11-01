import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/dashboard.styles";

import HomeContent from "../(dashboard)/index";
import DevicesContent from "../(dashboard)/devices";

const tabs = [
  { key: "home", label: "Home" },
  { key: "devices", label: "Devices" },
];

// Clean TabButton component to handle tab clicks and styles
const TabButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.subHeaderTab, active && styles.activeTab]}
    activeOpacity={0.7}
  >
    <Text style={[styles.subHeaderText, active && styles.activeTabText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome back to Agrivision</Text>
          <Text style={styles.welcomeSubtitle}>Your smart farming assistant.</Text>
        </View>

        {/* Sub Navigation Tabs */}
        <View style={styles.subHeader}>
          {tabs.map(({ key, label }) => (
            <TabButton
              key={key}
              label={label}
              active={activeTab === key}
              onPress={() => setActiveTab(key)}
            />
          ))}
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          {activeTab === "home" && <HomeContent />}
          {activeTab === "devices" && <DevicesContent />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardPage;
