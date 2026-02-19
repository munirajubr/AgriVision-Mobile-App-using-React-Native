import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import Card from '../../components/Card';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export default function Home() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { user } = useAuthStore();
  const { weatherData, setWeatherData } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    const fetchHomeWeather = async () => {
      const location = user?.farmLocation || 'Bangalore';
      if (!WEATHER_API_KEY) return;
      
      try {
        const resp = await fetch(`${BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${location}`);
        const data = await resp.json();
        if (data.current) {
          const getWeatherIcon = (cond) => {
            const c = cond?.toLowerCase() || '';
            if (c.includes('sunny') || c.includes('clear')) return 'sunny';
            if (c.includes('cloudy') || c.includes('overcast')) return 'cloudy';
            if (c.includes('rain') || c.includes('showers')) return 'rainy';
            if (c.includes('thunder')) return 'thunderstorm';
            return 'partly-sunny';
          };

          setWeatherData({
            temp: Math.round(data.current.temp_c),
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            wind: Math.round(data.current.wind_kph),
            icon: getWeatherIcon(data.current.condition.text),
            loading: false
          });
        }
      } catch (error) {
        console.error("Home weather fetch error:", error);
      }
    };

    fetchHomeWeather();
  }, [user?.farmLocation]);

  const categories = ['All', 'Crops', 'Soil', 'Weather', 'Diseases'];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting and Avatar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetingText, { color: COLORS.textPrimary }]}>Hello, {user?.fullName?.split(' ')[0] || "Farmer"}!</Text>
            <Text style={[styles.subGreeting, { color: COLORS.textSecondary }]}>What's happening on the farm today?</Text>
          </View>
          <TouchableOpacity 
            style={styles.notifBtn}
            onPress={() => router.push('/(pages)/notifications')}
          >
            <View style={[styles.notifCircle, { backgroundColor: COLORS.cardBackground }]}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Weather Card */}
        <Card
          variant="large"
          title={`${weatherData.temp}°C ${weatherData.condition}`}
          subtitle={`Humidity: ${weatherData.humidity}% • Wind: ${weatherData.wind} km/h`}
          bgColor={COLORS.pastelBlue}
          onPress={() => router.push('/(tabs)/weather')}
          icon={weatherData.icon || 'partly-sunny'}
          iconColor={isDarkMode ? '#FFD60A' : '#F7B500'}
          actionLabel="Check details"
        />

        {/* Popular Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Quick Analysis</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/(pages)/all-tools', params: { category: 'Quick Analysis' } })}>
            <Text style={[styles.seeAll, { color: COLORS.textTertiary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <Card
              variant="box"
              icon="scan-outline"
              title="Instant Disease Diagnosis"
              subtitle="AI Vision"
              link="/(pages)/diagnosis"
              bgColor={COLORS.pastelGreen}
              themeColor="#2E7D32"
            />
            <Card
              variant="box"
              icon="analytics-outline"
              title="Soil Analysis"
              subtitle="NPK Check"
              link="/(pages)/npkupload"
              bgColor={COLORS.pastelPurple}
              themeColor="#6A1B9A"
            />
          </View>
          <View style={styles.gridRow}>
            <Card
              variant="box"
              icon="leaf-outline"
              title="Crop Tips"
              subtitle="24 Guides"
              link="/(pages)/cropguide"
              bgColor={COLORS.pastelOrange}
              themeColor="#E65100"
            />
            <Card
              variant="box"
              icon="flask-outline"
              title="Fertilizer Advisor"
              subtitle="Pro Tips"
              link="/(pages)/fertilizerguide"
              bgColor={COLORS.pastelBlue}
              themeColor="#1565C0"
            />
          </View>
        </View>

        {/* Tools Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Daily Tools</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/(pages)/all-tools', params: { category: 'Daily Tools' } })}>
            <Text style={[styles.seeAll, { color: COLORS.textTertiary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <Card
          variant="horizontal"
          title="Market Trends"
          subtitle="Real-time prices"
          link="/(tabs)/market"
          bgColor={COLORS.background}
        />
        <Card
          variant="horizontal"
          title="Local Weather"
          subtitle="Forecast & Alerts"
          link="/(tabs)/weather"
          bgColor={COLORS.background}
        />
      </ScrollView>

      {/* Simplified FAB for Instant Diagnosis */}
      <TouchableOpacity 
        style={[styles.floatingActionBtn, { backgroundColor: COLORS.success }]}
        activeOpacity={0.8}
        onPress={() => router.push('/(pages)/diagnosis')}
      >
        <Ionicons name="scan" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 200, // Extra padding for the floating button
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  notifBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  notifCircle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridContainer: {
    gap: 16,
    marginBottom: 32,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  floatingActionBtn: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
