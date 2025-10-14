import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import COLORS from '../../constants/colors';
import styles from '../../assets/styles/dashboard.styles';

// Import your page components from the (dashboard) directory
// Since you have index.jsx in (dashboard), that's the "home" page
// Import Devices component
import HomeContent from '../(dashboard)/index';
import DevicesContent from '../(dashboard)/devices';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* --- Welcome Message Section --- */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome back to Agrivision</Text>
          <Text style={styles.welcomeSubtitle}>Your smart farming assistant.</Text>
        </View>

        {/* --- Sub Navigation Tabs --- */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            onPress={() => setActiveTab('home')}
            style={[styles.subHeaderTab, activeTab === 'home' && styles.activeTab]}
          >
            <Text style={[styles.subHeaderText, activeTab === 'home' && styles.activeTabText]}>
              Home
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('devices')}
            style={[styles.subHeaderTab, activeTab === 'devices' && styles.activeTab]}
          >
            <Text style={[styles.subHeaderText, activeTab === 'devices' && styles.activeTabText]}>
              Devices
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Conditional Content --- */}
        <View style={{ flex: 1 }}>
          {activeTab === 'home' ? <HomeContent /> : <DevicesContent />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardPage;
