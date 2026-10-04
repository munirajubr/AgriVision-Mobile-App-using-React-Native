import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import SafeScreen from '../../components/SafeScreen';

const { width } = Dimensions.get('window');
const WEATHER_HERO_BG = 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1000&auto=format&fit=crop';

const DEFAULT_HOURLY = [
  { time: '06:00', temp: 24, icon: 'partly-sunny' },
  { time: '08:00', temp: 26, icon: 'sunny' },
  { time: '10:00', temp: 28, icon: 'sunny' },
  { time: '12:00', temp: 30, icon: 'sunny' },
  { time: '14:00', temp: 31, icon: 'partly-sunny' },
  { time: '16:00', temp: 29, icon: 'cloudy' },
  { time: '18:00', temp: 27, icon: 'partly-sunny' },
  { time: '20:00', temp: 25, icon: 'moon' },
];

const DEFAULT_WEEKLY = [
  { day: 'Mon', high: 30, low: 22, icon: 'sunny', cond: 'Sunny' },
  { day: 'Tue', high: 29, low: 21, icon: 'partly-sunny', cond: 'Partly Cloudy' },
  { day: 'Wed', high: 27, low: 20, icon: 'rainy', cond: 'Light Showers' },
  { day: 'Thu', high: 28, low: 21, icon: 'cloudy', cond: 'Overcast' },
  { day: 'Fri', high: 31, low: 22, icon: 'sunny', cond: 'Clear' },
  { day: 'Sat', high: 32, low: 23, icon: 'sunny', cond: 'Sunny' },
  { day: 'Sun', high: 29, low: 22, icon: 'partly-sunny', cond: 'Partly Cloudy' },
];

const MOCK_CITIES = [
  { id: 1, name: 'Bangalore', region: 'Karnataka', country: 'India' },
  { id: 2, name: 'Mysore', region: 'Karnataka', country: 'India' },
  { id: 3, name: 'Delhi', region: 'NCR', country: 'India' },
  { id: 4, name: 'Pune', region: 'Maharashtra', country: 'India' },
  { id: 5, name: 'Mumbai', region: 'Maharashtra', country: 'India' },
  { id: 6, name: 'Sawojajar', region: 'Jawa Timur', country: 'Indonesia' },
  { id: 7, name: 'Hyderabad', region: 'Telangana', country: 'India' },
];

export default function WeatherScreen() {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const COLORS = getColors(isDarkMode);
  
  const [location, setLocation] = useState(user?.farmLocation || 'Sawojajar, Jawa Timur');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const { weatherData, setWeatherData } = useDashboardStore();

  const [currentWeather, setCurrentWeather] = useState({
    temp: weatherData.temp || 26,
    condition: weatherData.condition || 'Sunny Day',
    icon: weatherData.icon || 'sunny',
    humidity: weatherData.humidity || 75,
    wind: weatherData.wind || 5,
    uv: weatherData.uv || 6,
    location: location
  });

  useEffect(() => {
    setCurrentWeather({
      temp: weatherData.temp || 26,
      condition: weatherData.condition || 'Sunny Day',
      icon: weatherData.icon || 'sunny',
      humidity: weatherData.humidity || 75,
      wind: weatherData.wind || 5,
      uv: weatherData.uv || 6,
      location: location
    });
  }, [location, weatherData]);

  const fetchSuggestions = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const filtered = MOCK_CITIES.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.region.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSelectSuggestion = (item) => {
    setLocation(item.name);
    const updated = {
      temp: item.name === 'Delhi' ? 34 : item.name === 'Pune' ? 26 : 28,
      condition: item.name === 'Delhi' ? 'Sunny' : 'Sunny Day',
      icon: item.name === 'Delhi' ? 'sunny' : 'partly-sunny',
      humidity: 68,
      wind: 5,
      uv: 7,
      location: item.name
    };
    setCurrentWeather(updated);
    setWeatherData(updated);
    setSearchQuery('');
    setSuggestions([]);
    setModalVisible(false);
  };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* 1. HERO WEATHER BANNER (Matching Image 1 Screen 3) */}
          <View style={styles.heroWrapper}>
            <ImageBackground
              source={{ uri: WEATHER_HERO_BG }}
              style={styles.heroBackground}
              imageStyle={styles.heroImageRadius}
            >
              <LinearGradient
                colors={['rgba(10, 25, 12, 0.45)', 'rgba(10, 25, 12, 0.25)', 'rgba(8, 20, 10, 0.75)']}
                style={styles.heroGradient}
              >
                {/* Location Picker Header */}
                <View style={styles.heroHeader}>
                  <TouchableOpacity 
                    style={styles.locationButton} 
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="location-sharp" size={16} color="#A3E635" />
                    <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
                    <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={() => setLocation(location)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Big Temperature & Condition */}
                <View style={styles.heroTempRow}>
                  <Text style={styles.heroTempText}>{currentWeather.temp}°C</Text>
                  
                  <View style={styles.heroConditionBox}>
                    <View style={styles.sunIconRow}>
                      <Ionicons name="sunny" size={18} color="#FFD700" />
                      <Text style={styles.heroConditionText}>{currentWeather.condition}</Text>
                    </View>
                    <Text style={styles.heroDateText}>8:45 AM | Jan 26</Text>
                  </View>
                </View>

                {/* 3 Translucent Metric Cards (Temperature, Wind, Rain Forecast) */}
                <View style={styles.glassCardsRow}>
                  <View style={styles.glassCard}>
                    <Ionicons name="thermometer-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.glassLabel}>Temperature</Text>
                    <Text style={styles.glassValue}>+12°C</Text>
                  </View>

                  <View style={styles.glassCard}>
                    <Ionicons name="paper-plane-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.glassLabel}>Wind</Text>
                    <Text style={styles.glassValue}>{currentWeather.wind}m/s</Text>
                  </View>

                  <View style={styles.glassCard}>
                    <Ionicons name="rainy-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.glassLabel}>Rain Forecast</Text>
                    <Text style={styles.glassValue}>{currentWeather.temp}°C</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* 2. MOISTURE LEVEL CARD (Circular Ring matching Image 1 Screen 3) */}
          <View style={styles.sectionBlock}>
            <View style={[styles.cleanCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
              <View style={styles.moistureRow}>
                {/* Circular Gauge Ring */}
                <View style={styles.moistureCircle}>
                  <Text style={styles.moisturePercentage}>75%</Text>
                </View>

                {/* Moisture Details */}
                <View style={styles.moistureInfo}>
                  <Text style={[styles.moistureTitle, { color: COLORS.textPrimary }]}>Moisture Level</Text>
                  <Text style={[styles.moistureSubtitle, { color: COLORS.textTertiary }]}>
                    Optimal range for current crop stage
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. SOIL STATUS CARD (NPK Pills & pH Bar matching Image 1 Screen 3) */}
          <View style={styles.sectionBlock}>
            <View style={[styles.cleanCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
              <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]}>Soil Status</Text>

              {/* NPK Pill Badges */}
              <View style={styles.npkPillsRow}>
                {/* Nitrogen */}
                <View style={[styles.npkPill, { borderColor: '#16A34A', backgroundColor: '#F0FDF4' }]}>
                  <Text style={[styles.npkNutrientName, { color: '#16A34A' }]}>Nitrogen</Text>
                  <Text style={[styles.npkNutrientStatus, { color: '#16A34A' }]}>High</Text>
                </View>

                {/* Phosphorus */}
                <View style={[styles.npkPill, { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' }]}>
                  <Text style={[styles.npkNutrientName, { color: '#D97706' }]}>Phosphorus</Text>
                  <Text style={[styles.npkNutrientStatus, { color: '#D97706' }]}>Good</Text>
                </View>

                {/* Potassium */}
                <View style={[styles.npkPill, { borderColor: '#EF4444', backgroundColor: '#FEF2F2' }]}>
                  <Text style={[styles.npkNutrientName, { color: '#DC2626' }]}>Potassium</Text>
                  <Text style={[styles.npkNutrientStatus, { color: '#DC2626' }]}>Low</Text>
                </View>
              </View>

              {/* Soil pH Slider / Bar */}
              <View style={styles.soilPhSection}>
                <View style={styles.soilPhHeader}>
                  <Text style={[styles.soilPhLabel, { color: COLORS.textSecondary }]}>Soil pH</Text>
                  <Text style={[styles.soilPhValue, { color: COLORS.textPrimary }]}>6.5 Neutral</Text>
                </View>

                <View style={styles.phTrack}>
                  <View style={[styles.phBarFill, { width: '65%', backgroundColor: '#185226' }]} />
                </View>
              </View>
            </View>
          </View>

          {/* 4. HOURLY FORECAST (Horizontal Scroll) */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Hourly Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
              {DEFAULT_HOURLY.map((hr, i) => (
                <View 
                  key={i} 
                  style={[styles.hourCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}
                >
                  <Text style={[styles.hourTime, { color: COLORS.textTertiary }]}>{hr.time}</Text>
                  <Ionicons name={hr.icon} size={22} color={COLORS.primary} style={{ marginVertical: 6 }} />
                  <Text style={[styles.hourTemp, { color: COLORS.textPrimary }]}>{hr.temp}°</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 5. 7-DAY OUTLOOK */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>7-Day Outlook</Text>
            <View style={[styles.weeklyCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
              {DEFAULT_WEEKLY.map((day, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.dayRow, 
                    i !== DEFAULT_WEEKLY.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.separator }
                  ]}
                >
                  <Text style={[styles.dayName, { color: COLORS.textPrimary }]}>{day.day}</Text>
                  <View style={styles.dayCondition}>
                    <Ionicons name={day.icon} size={18} color={COLORS.primary} />
                    <Text style={[styles.dayConditionText, { color: COLORS.textSecondary }]}>{day.cond}</Text>
                  </View>
                  <View style={styles.dayTemps}>
                    <Text style={[styles.hiTemp, { color: COLORS.textPrimary }]}>{day.high}°</Text>
                    <Text style={[styles.loTemp, { color: COLORS.textTertiary }]}>{day.low}°</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Dock Spacing */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Location Picker Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={[styles.modalOverlay, { backgroundColor: COLORS.overlay }]}>
            <View style={[styles.modalContainer, { backgroundColor: COLORS.cardBackground }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: COLORS.textPrimary }]}>Select Farm Location</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.searchBox, { backgroundColor: COLORS.secondaryBackground }]}>
                <Ionicons name="search" size={18} color={COLORS.textTertiary} />
                <TextInput 
                  style={[styles.searchInput, { color: COLORS.textPrimary }]} 
                  placeholder="Search city or village..." 
                  placeholderTextColor={COLORS.textTertiary} 
                  value={searchQuery} 
                  onChangeText={fetchSuggestions}
                  autoFocus
                />
              </View>

              <FlatList
                data={suggestions.length > 0 ? suggestions : MOCK_CITIES}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.cityItem, { borderBottomColor: COLORS.border }]}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={[styles.cityName, { color: COLORS.textPrimary }]}>{item.name}</Text>
                      <Text style={[styles.cityRegion, { color: COLORS.textTertiary }]}>{item.region}, {item.country}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Hero Section
  heroWrapper: {
    width: '100%',
    height: 330,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  heroImageRadius: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroGradient: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  locationText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginHorizontal: 6,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTempText: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  heroConditionBox: {
    alignItems: 'flex-end',
  },
  sunIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroConditionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
  heroDateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  // 3 Glass Cards
  glassCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  glassCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  glassValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },

  // Section Blocks
  sectionBlock: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  cleanCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },

  // Moisture Row
  moistureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moistureCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 4,
    borderColor: '#84CC16',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moisturePercentage: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
  },
  moistureInfo: {
    flex: 1,
  },
  moistureTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  moistureSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },

  // NPK Pills
  npkPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  npkPill: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  npkNutrientName: {
    fontSize: 11,
    fontWeight: '700',
  },
  npkNutrientStatus: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },

  // Soil pH
  soilPhSection: {
    marginTop: 6,
  },
  soilPhHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  soilPhLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  soilPhValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  phTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  phBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Hourly Forecast
  hourlyList: {
    gap: 10,
  },
  hourCard: {
    width: 72,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  hourTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  hourTemp: {
    fontSize: 14,
    fontWeight: '800',
  },

  // 7-Day Outlook
  weeklyCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayName: {
    width: 44,
    fontSize: 14,
    fontWeight: '700',
  },
  dayCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  dayConditionText: {
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  dayTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hiTemp: {
    fontSize: 14,
    fontWeight: '800',
  },
  loTemp: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    height: 46,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '700',
  },
  cityRegion: {
    fontSize: 12,
    marginTop: 2,
  },
});