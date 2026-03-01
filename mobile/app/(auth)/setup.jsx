import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";
import PageHeader from "../../components/PageHeader";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// COMPONENT DEFINED OUTSIDE TO PREVENT KEYBOARD HIDING ON EVERY KEYSTROKE
const InputField = ({ label, value, setter, placeholder, icon, keyboardType = "default", COLORS }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: COLORS.textTertiary }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
      <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: COLORS.textPrimary }]}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

export default function Setup() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { user, isLoading, setupProfile } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [experience, setExperience] = useState("");
  const [farmingType, setFarmingType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const searchTimeout = useRef(null);

  const searchLocation = (query) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setFarmLocation(query);
    
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
          {
            headers: { 'User-Agent': 'AgriVision-App' },
          }
        );
        const data = await response.json();
        const suggestions = data.map(item => {
          const city = item.address.city || item.address.town || item.address.village || item.address.suburb || '';
          const state = item.address.state || '';
          const country = item.address.country || '';
          return {
            display: `${city}${city && state ? ', ' : ''}${state}${state && country ? ', ' : ''}${country}`,
          };
        }).filter(item => item.display !== '');
        
        setLocationSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Location search error:', error);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 500);
  };

  const selectLocation = (location) => {
    setFarmLocation(location.display);
    setShowSuggestions(false);
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Setup",
      "You can always complete your profile later in Settings. Continue to Dashboard?",
      [
        { text: "No, stay", style: "cancel" },
        { text: "Yes, skip", onPress: () => router.replace("/(tabs)") }
      ]
    );
  };

  const handleSubmit = async () => {
    const details = {
      username: user?.username,
      phone,
      farmLocation,
      farmSize,
      experience,
      farmingType,
      soilType,
      irrigationType,
    };

    const result = await setupProfile(details);

    if (result.success) {
      Alert.alert("Success", "Profile setup complete!", [
        { text: "Great", onPress: () => router.replace("/(tabs)") }
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to setup profile");
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <PageHeader 
          title="Account Setup" 
          showBack={false} 
          rightComponent={
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 16 }}>Skip</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.circle1, { backgroundColor: COLORS.primary + "05" }]} />

          <View style={styles.heroSection}>
            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
              <Ionicons name="sparkles" size={32} color={COLORS.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Welcome, {user?.fullName?.split(' ')[0] || 'Farmer'}!</Text>
            <Text style={[styles.heroSub, { color: COLORS.textSecondary }]}>Tell us a bit about your farm to personalize your experience.</Text>
          </View>

          <View style={styles.formGrid}>
            <InputField label="Phone Number" value={phone} setter={setPhone} placeholder="e.g., +1 234 567 890" icon="call-outline" keyboardType="phone-pad" COLORS={COLORS} />
            
            {/* Location with Auto-Suggest */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: COLORS.textTertiary }]}>Farm Location</Text>
                {isSearchingLocation && <ActivityIndicator size="small" color={COLORS.primary} />}
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  value={farmLocation}
                  onChangeText={searchLocation}
                  placeholder="City, State"
                  placeholderTextColor={COLORS.textTertiary}
                  onFocus={() => { if (locationSuggestions.length > 0) setShowSuggestions(true); }}
                />
              </View>
              {showSuggestions && (
                <View style={[styles.suggestionBox, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
                  {locationSuggestions.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.suggestionItem, index < locationSuggestions.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.border }]} 
                      onPress={() => selectLocation(item)}
                    >
                      <Ionicons name="location-sharp" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
                      <Text style={[styles.suggestionText, { color: COLORS.textPrimary }]} numberOfLines={1}>{item.display}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <InputField label="Farm Size" value={farmSize} setter={setFarmSize} placeholder="e.g., 5 Acres" icon="expand-outline" COLORS={COLORS} />
            <InputField label="Years of Experience" value={experience} setter={setExperience} placeholder="e.g., 5" icon="time-outline" keyboardType="numeric" COLORS={COLORS} />
            <InputField label="Farming Type" value={farmingType} setter={setFarmingType} placeholder="e.g., Organic, Greenhouse" icon="leaf-outline" COLORS={COLORS} />
            <InputField label="Soil Type" value={soilType} setter={setSoilType} placeholder="e.g., Clay, Loamy" icon="flower-outline" COLORS={COLORS} />
            <InputField label="Irrigation" value={irrigationType} setter={setIrrigationType} placeholder="e.g., Drip, Sprinkler" icon="water-outline" COLORS={COLORS} />
          </View>

          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: COLORS.primary }]} 
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.mainBtnText}>Complete Setup</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 24, flexGrow: 1 },
  circle1: { position: "absolute", top: -50, right: -100, width: 250, height: 250, borderRadius: 125, zIndex: -1 },
  heroSection: { alignItems: 'center', marginBottom: 32, marginTop: 10 },
  iconCircle: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 26, fontWeight: '800', marginBottom: 8, letterSpacing: -0.5 },
  heroSub: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 30, opacity: 0.8 },
  formGrid: { width: '100%' },
  inputGroup: { marginBottom: 20, zIndex: 50 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    height: 60,
    zIndex: 1,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  suggestionBox: { 
    marginTop: 0, 
    borderRadius: 18, 
    borderWidth: 1, 
    overflow: 'hidden',
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 9999,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 },
      android: { elevation: 15 },
    }),
  },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  suggestionText: { fontSize: 14, fontWeight: '500' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },
  mainBtn: { 
    height: 60, 
    borderRadius: 20, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
    ...Platform.select({ 
      ios: { shadowColor: "#34C759", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 }, 
      android: { elevation: 6 } 
    }) 
  },
  mainBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  skipBtn: { padding: 8 }
});
