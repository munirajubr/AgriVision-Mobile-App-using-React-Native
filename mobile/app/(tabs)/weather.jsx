import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

const WeatherScreen = () => {
  const [location, setLocation] = useState('Bangalore');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [farmingInsights, setFarmingInsights] = useState([]);

  const popularCities = [
    'Bangalore',
    'Tumakuru',
    'Mumbai',
    'Delhi',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Jaipur',
  ];

  useEffect(() => {
    if (WEATHER_API_KEY) {
      fetchWeatherData(location);
    } else {
      Alert.alert('Error', 'Please add EXPO_PUBLIC_WEATHER_API_KEY to your .env file');
    }
  }, [location]);

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${cityName}&days=7&aqi=yes`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.current) {
        setCurrentWeather({
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: getWeatherIcon(data.current.condition.text),
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_kph),
          rainfall: data.current.precip_mm,
          pressure: data.current.pressure_mb,
          uvIndex: data.current.uv,
        });

        // Process hourly forecast (next 24 hours)
        if (data.forecast?.forecastday?.[0]?.hour) {
          const currentHour = new Date().getHours();
          const hourly = data.forecast.forecastday[0].hour
            .slice(currentHour, currentHour + 6)
            .map(hour => ({
              time: new Date(hour.time).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
              }),
              temp: Math.round(hour.temp_c),
              icon: getWeatherIcon(hour.condition.text),
            }));
          setHourlyForecast(hourly);
        }

        // Process weekly forecast
        if (data.forecast?.forecastday) {
          const weekly = data.forecast.forecastday.map(day => ({
            day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
            high: Math.round(day.day.maxtemp_c),
            low: Math.round(day.day.mintemp_c),
            icon: getWeatherIcon(day.day.condition.text),
            rain: day.day.daily_chance_of_rain,
          }));
          setWeeklyForecast(weekly);
        }

        // Generate farming insights
        generateFarmingInsights(data);
      } else {
        Alert.alert('Error', data.error?.message || 'City not found');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to fetch weather data. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'sunny';
    } else if (conditionLower.includes('partly cloudy')) {
      return 'partly-sunny';
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return 'cloudy';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'rainy';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'thunderstorm';
    } else if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
      return 'snow';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return 'cloudy';
    }
    return 'partly-sunny';
  };

  const generateFarmingInsights = (data) => {
    const insights = [];
    const temp = data.current.temp_c;
    const humidity = data.current.humidity;
    const windSpeed = data.current.wind_kph;
    const isRaining = data.current.precip_mm > 0;

    // Irrigation insight
    if (humidity > 70 || isRaining) {
      insights.push({
        icon: 'water-outline',
        title: 'Irrigation',
        message: 'High humidity detected. Reduce watering to prevent overwatering.',
        color: '#2196F3',
      });
    } else if (humidity < 40) {
      insights.push({
        icon: 'water-outline',
        title: 'Irrigation',
        message: 'Low humidity. Consider increasing irrigation frequency.',
        color: '#2196F3',
      });
    } else {
      insights.push({
        icon: 'water-outline',
        title: 'Irrigation',
        message: 'Good conditions for watering. Soil moisture optimal.',
        color: '#2196F3',
      });
    }

    // Spraying insight
    if (windSpeed < 15 && !isRaining) {
      insights.push({
        icon: 'leaf-outline',
        title: 'Spraying',
        message: 'Wind speed favorable for pesticide application.',
        color: '#4CAF50',
      });
    } else {
      insights.push({
        icon: 'leaf-outline',
        title: 'Spraying',
        message: 'Avoid spraying. Wind too strong or rain expected.',
        color: '#F44336',
      });
    }

    // Harvesting insight
    if (!isRaining && temp > 20 && temp < 35) {
      insights.push({
        icon: 'sunny-outline',
        title: 'Harvesting',
        message: 'Dry weather expected. Good for harvesting crops.',
        color: '#FF9800',
      });
    } else {
      insights.push({
        icon: 'sunny-outline',
        title: 'Harvesting',
        message: 'Weather not ideal for harvesting. Wait for better conditions.',
        color: '#FF9800',
      });
    }

    setFarmingInsights(insights);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setModalVisible(false);
    setSearchQuery('');
  };

  if (loading && !currentWeather) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentWeather && (
          <>
            <View style={styles.currentWeatherCard}>
              <TouchableOpacity 
                style={styles.locationContainer}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="location" size={18} color={COLORS.primary} />
                <Text style={styles.location}>{location}</Text>
                <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
              </TouchableOpacity>

              <View style={styles.currentTempContainer}>
                <Ionicons name={currentWeather.icon} size={80} color={COLORS.primary} />
                <Text style={styles.currentTemp}>{currentWeather.temperature}°C</Text>
              </View>
              
              <Text style={styles.condition}>{currentWeather.condition}</Text>

              <View style={styles.detailsGrid}>
                {[
                  { icon: 'water-outline', value: `${currentWeather.humidity}%`, label: 'Humidity', color: '#2196F3' },
                  { icon: 'speedometer-outline', value: `${currentWeather.windSpeed} km/h`, label: 'Wind', color: '#4CAF50' },
                  { icon: 'umbrella-outline', value: `${currentWeather.rainfall} mm`, label: 'Rain', color: '#9C27B0' },
                  { icon: 'sunny-outline', value: currentWeather.uvIndex, label: 'UV Index', color: '#FF9800' },
                ].map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    <Ionicons name={detail.icon} size={24} color={detail.color} />
                    <Text style={styles.detailValue}>{detail.value}</Text>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {farmingInsights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Farming Insights</Text>
                {farmingInsights.map((insight, index) => (
                  <View key={index} style={styles.insightCard}>
                    <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
                      <Ionicons name={insight.icon} size={24} color={insight.color} />
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text style={styles.insightMessage}>{insight.message}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {hourlyForecast.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hourly Forecast</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hourlyContainer}
                >
                  {hourlyForecast.map((hour, index) => (
                    <View key={index} style={styles.hourlyCard}>
                      <Text style={styles.hourlyTime}>{hour.time}</Text>
                      <Ionicons name={hour.icon} size={32} color={COLORS.primary} />
                      <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {weeklyForecast.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>7-Day Forecast</Text>
                {weeklyForecast.map((day, index) => (
                  <View key={index} style={styles.dailyCard}>
                    <Text style={styles.dayName}>{day.day}</Text>
                    <View style={styles.dailyInfo}>
                      <Ionicons name={day.icon} size={28} color={COLORS.primary} />
                      <View style={styles.tempRange}>
                        <Text style={styles.highTemp}>{day.high}°</Text>
                        <Text style={styles.lowTemp}>{day.low}°</Text>
                      </View>
                      <View style={styles.rainChance}>
                        <Ionicons name="water-outline" size={16} color="#2196F3" />
                        <Text style={styles.rainText}>{day.rain}%</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city..."
                placeholderTextColor={COLORS.placeholderText}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => searchQuery.trim() && handleLocationChange(searchQuery.trim())}
              />
            </View>

            <ScrollView style={styles.citiesList} showsVerticalScrollIndicator={false}>
              <Text style={styles.listTitle}>Popular Cities</Text>
              {popularCities
                .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.cityItem}
                    onPress={() => handleLocationChange(city)}
                  >
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.cityName}>{city}</Text>
                    {location === city && (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  currentWeatherCard: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 20,
    alignSelf: 'center',
  },
  location: { fontSize: 16, color: COLORS.primary, marginLeft: 6, fontWeight: '600' },
  currentTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  currentTemp: { fontSize: 72, fontWeight: '700', color: COLORS.primary, marginLeft: 16 },
  condition: { fontSize: 20, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailItem: { alignItems: 'center', width: '25%', marginBottom: 16 },
  detailValue: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginTop: 8 },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  insightMessage: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  hourlyContainer: { paddingRight: 20 },
  hourlyCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hourlyTime: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 12 },
  hourlyTemp: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12 },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, width: 50 },
  dailyInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  tempRange: { flexDirection: 'row', alignItems: 'center' },
  highTemp: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginRight: 8 },
  lowTemp: { fontSize: 18, fontWeight: '500', color: COLORS.textSecondary },
  rainChance: { flexDirection: 'row', alignItems: 'center' },
  rainText: { fontSize: 14, color: '#2196F3', marginLeft: 4, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 14,
    marginLeft: 12,
  },
  citiesList: { paddingHorizontal: 20 },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityName: { flex: 1, fontSize: 16, color: COLORS.textPrimary, marginLeft: 12, fontWeight: '500' },
});

export default WeatherScreen;