import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          uv: data.current.uv 
        };
        setCurrentWeather(weather);
        setWeatherData(weather); // SYNC TO HOME
        const h = new Date().getHours();
        setHourlyForecast(data.forecast.forecastday[0].hour.slice(h, h + 12).map(hr => ({ time: new Date(hr.time).getHours(), temp: Math.round(hr.temp_c), icon: getWeatherIcon(hr.condition.text) })));
        setWeeklyForecast(data.forecast.forecastday.map(day => ({ day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }), high: Math.round(day.day.maxtemp_c), low: Math.round(day.day.mintemp_c), icon: getWeatherIcon(day.day.condition.text), cond: day.day.condition.text })));
      }
    } catch { Alert.alert('Error', 'Weather data unreachable.'); } finally { setLoading(false); }
  }, [setWeatherData]);

  useEffect(() => { fetchWeather(location); }, [location]);

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.locBtn, { backgroundColor: COLORS.cardBackground }]} onPress={() => setModalVisible(true)}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Text style={[styles.locText, { color: COLORS.textPrimary }]}>{location}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: COLORS.cardBackground }]} onPress={() => fetchWeather(location)}>
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

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={[styles.overlay, { backgroundColor: COLORS.overlay }]}>
            <View style={[styles.modal, { backgroundColor: COLORS.cardBackground }]}>
              <Text style={[styles.modalTitle, { color: COLORS.textPrimary }]}>Change Location</Text>
              <TextInput style={[styles.input, { backgroundColor: COLORS.secondaryBackground, color: COLORS.textPrimary }]} placeholder="City Name" placeholderTextColor={COLORS.textTertiary} value={searchQuery} onChangeText={setSearchQuery} />
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{ color: COLORS.textTertiary }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.primary }]} onPress={() => { setLocation(searchQuery); setModalVisible(false); }}><Text style={{ color: '#FFF', fontWeight: '700' }}>Search</Text></TouchableOpacity>
              </View>
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
  overlay: { flex: 1, justifyContent: 'center', padding: 24 },
  modal: { padding: 30, borderRadius: 32, gap: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  input: { padding: 18, borderRadius: 20, fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20 },
  btn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 }
});