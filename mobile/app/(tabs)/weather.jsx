import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ActivityIndicator, Platform, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import SafeScreen from '../../components/SafeScreen';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export default function WeatherScreen() {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const COLORS = getColors(isDarkMode);
  
  const [location, setLocation] = useState(user?.farmLocation || 'Bangalore');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  const getWeatherIcon = (c) => {
    const cond = c?.toLowerCase() || '';
    if (cond.includes('sunny') || cond.includes('clear')) return 'sunny';
    if (cond.includes('cloudy') || cond.includes('overcast')) return 'cloudy';
    if (cond.includes('rain') || cond.includes('showers')) return 'rainy';
    if (cond.includes('thunder')) return 'thunderstorm';
    return 'partly-sunny';
  };

  const { setWeatherData } = useDashboardStore();
  
  const fetchWeather = useCallback(async (cityName) => {
    if (!WEATHER_API_KEY) return;
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${cityName}&days=7`);
      const data = await resp.json();
      if (data.current) {
        const weather = { 
          temp: Math.round(data.current.temp_c), 
          condition: data.current.condition.text, 
          icon: getWeatherIcon(data.current.condition.text), 
          humidity: data.current.humidity, 
          wind: Math.round(data.current.wind_kph), 
          uv: data.current.uv,
          location: data.location.name
        };
        setCurrentWeather(weather);
        setWeatherData(weather); // SYNC TO HOME
        setLocation(data.location.name);
        const h = new Date().getHours();
        setHourlyForecast(data.forecast.forecastday[0].hour.slice(h, h + 12).map(hr => ({ time: new Date(hr.time).getHours(), temp: Math.round(hr.temp_c), icon: getWeatherIcon(hr.condition.text) })));
        setWeeklyForecast(data.forecast.forecastday.map(day => ({ day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }), high: Math.round(day.day.maxtemp_c), low: Math.round(day.day.mintemp_c), icon: getWeatherIcon(day.day.condition.text), cond: day.day.condition.text })));
      }
    } catch { Alert.alert('Error', 'Weather data unreachable.'); } finally { setLoading(false); }
  }, [setWeatherData]);

  // Handle live location
  const getLiveLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchWeather(location);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      fetchWeather(`${loc.coords.latitude},${loc.coords.longitude}`);
    } catch (error) {
      console.log('Location error:', error);
      fetchWeather(location);
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await fetch(`${BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${query}`);
      const data = await resp.json();
      setSuggestions(data);
    } catch (error) {
      console.log('Suggestion error:', error);
    }
  };

  const handleSelectSuggestion = (item) => {
    setLocation(item.name);
    setSearchQuery('');
    setSuggestions([]);
    setModalVisible(false);
    fetchWeather(item.name);
  };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.locBtn, { backgroundColor: COLORS.cardBackground }]} onPress={() => setModalVisible(true)}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Text style={[styles.locText, { color: COLORS.textPrimary }]}>{location}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: COLORS.cardBackground }]} onPress={() => getLiveLocation()}>
            <Ionicons name="refresh" size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainBox}>
            <Ionicons name={currentWeather?.icon || 'partly-sunny'} size={120} color={isDarkMode ? '#FFD60A' : '#F7B500'} />
            <Text style={[styles.tempMain, { color: COLORS.textPrimary }]}>{currentWeather?.temp}°</Text>
            <Text style={[styles.condMain, { color: COLORS.textSecondary }]}>{currentWeather?.condition}</Text>
          </View>

          <View style={styles.statsGrid}>
            {[ { label: 'Humidity', val: `${currentWeather?.humidity}%`, ic: 'water', col: COLORS.info }, { label: 'Wind', val: `${currentWeather?.wind} km/h`, ic: 'leaf', col: COLORS.primary }, { label: 'UV Index', val: currentWeather?.uv, ic: 'sunny', col: '#FF9500' } ].map((s, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons name={s.ic} size={22} color={s.col} />
                <Text style={[styles.statVal, { color: COLORS.textPrimary }]}>{s.val}</Text>
                <Text style={[styles.statLab, { color: COLORS.textTertiary }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.secTitle, { color: COLORS.textPrimary }]}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyContainer}>
            {hourlyForecast.map((hr, i) => (
              <View key={i} style={[styles.hourCard, { backgroundColor: COLORS.cardBackground }]}>
                <Text style={[styles.hourTime, { color: COLORS.textTertiary }]}>{hr.time}:00</Text>
                <Ionicons name={hr.icon} size={24} color={COLORS.primary} />
                <Text style={[styles.hourTemp, { color: COLORS.textPrimary }]}>{hr.temp}°</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={[styles.secTitle, { color: COLORS.textPrimary }]}>7-Day Outlook</Text>
          <View style={[styles.weeklyBox, { backgroundColor: COLORS.cardBackground }]}>
            {weeklyForecast.map((day, i) => (
              <View key={i} style={[styles.dayRow, i !== weeklyForecast.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.secondaryBackground }]}>
                <Text style={[styles.dayName, { color: COLORS.textPrimary }]}>{day.day}</Text>
                <Ionicons name={day.icon} size={20} color={COLORS.primary} />
                <View style={styles.dayTemps}><Text style={[styles.hi, { color: COLORS.textPrimary }]}>{day.high}°</Text><Text style={[styles.lo, { color: COLORS.textTertiary }]}>{day.low}°</Text></View>
              </View>
            ))}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={[styles.overlay, { backgroundColor: COLORS.overlay }]}>
            <View style={[styles.modal, { backgroundColor: COLORS.cardBackground }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: COLORS.textPrimary }]}>Search Location</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.searchContainer, { backgroundColor: COLORS.secondaryBackground }]}>
                <Ionicons name="search" size={20} color={COLORS.textTertiary} />
                <TextInput 
                  style={[styles.input, { color: COLORS.textPrimary }]} 
                  placeholder="Enter city name..." 
                  placeholderTextColor={COLORS.textTertiary} 
                  value={searchQuery} 
                  onChangeText={fetchSuggestions}
                  autoFocus
                />
              </View>

              {suggestions.length > 0 ? (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.suggestionList}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.suggestionItem, { borderBottomColor: COLORS.border }]}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <Ionicons name="location-outline" size={18} color={COLORS.textTertiary} />
                      <View>
                        <Text style={[styles.suggestionName, { color: COLORS.textPrimary }]}>{item.name}</Text>
                        <Text style={[styles.suggestionRegion, { color: COLORS.textTertiary }]}>{item.region}, {item.country}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : searchQuery.length >= 3 && (
                <View style={styles.emptyState}>
                  <Text style={{ color: COLORS.textTertiary }}>No locations found</Text>
                </View>
              )}

              {!searchQuery && (
                <TouchableOpacity 
                  style={[styles.currentLocBtn, { backgroundColor: COLORS.primary }]}
                  onPress={() => {
                    getLiveLocation();
                    setModalVisible(false);
                  }}
                >
                  <Ionicons name="locate" size={20} color="#FFF" />
                  <Text style={styles.currentLocText}>Use Current Location</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  locBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  locText: { fontSize: 16, fontWeight: '700' },
  refreshBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 20 },
  mainBox: { alignItems: 'center', paddingVertical: 40 },
  tempMain: { fontSize: 80, fontWeight: '800' },
  condMain: { fontSize: 20, fontWeight: '600', opacity: 0.8 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  statCard: { flex: 1, padding: 18, borderRadius: 24, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLab: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  secTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  hourlyContainer: { marginBottom: 30 },
  hourCard: { padding: 16, borderRadius: 20, alignItems: 'center', marginRight: 12, gap: 10, minWidth: 70 },
  hourTime: { fontSize: 12, fontWeight: '700' },
  hourTemp: { fontSize: 16, fontWeight: '800' },
  weeklyBox: { borderRadius: 30, padding: 10 },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  dayName: { fontSize: 16, fontWeight: '700', width: 50 },
  dayTemps: { flexDirection: 'row', gap: 12 },
  hi: { fontSize: 16, fontWeight: '800' },
  lo: { fontSize: 16, fontWeight: '500' },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modal: { height: '80%', borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 20, marginBottom: 20 },
  input: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 16 },
  suggestionList: { flex: 1 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1 },
  suggestionName: { fontSize: 16, fontWeight: '700' },
  suggestionRegion: { fontSize: 12, fontWeight: '500' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  currentLocBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20, marginTop: 'auto' },
  currentLocText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});