import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

// COMPONENT DEFINED OUTSIDE TO PREVENT KEYBOARD HIDING
const InputField = ({ label, value, field, placeholder, icon, keyboardType = 'default', COLORS, onChange }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: COLORS.textTertiary }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground, borderWidth: 0 }]}>
      <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: COLORS.textPrimary }]}
        value={value}
        onChangeText={(text) => onChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

export default function EditProfile() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user, updateProfile, isLoading } = useAuthStore();
  const COLORS = getColors(isDarkMode);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmLocation: user?.farmLocation || '',
    farmSize: user?.farmSize || '',
    experience: user?.experience || '',
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const searchTimeout = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'farmLocation') searchLocation(value);
  };

  const searchLocation = (query) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
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
          { headers: { 'User-Agent': 'AgriVision-App' } }
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
    setFormData(prev => ({ ...prev, farmLocation: location.display }));
    setShowSuggestions(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    const result = await updateProfile({ ...formData, profileImage });
    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
          <PageHeader 
            title="Edit Profile" 
            rightComponent={
              <TouchableOpacity onPress={handleSave} disabled={isLoading} style={[styles.saveBtn, { backgroundColor: COLORS.primary }]}>
                {isLoading ? <ActivityIndicator color={isDarkMode ? COLORS.black : COLORS.white} size="small" /> : <Text style={[styles.saveBtnText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>Save</Text>}
              </TouchableOpacity>
            }
          />

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage} style={[styles.avatarBox, { backgroundColor: COLORS.primary }]}>
                {profileImage ? <Image source={{ uri: profileImage }} style={styles.avatarImage} /> : <Text style={[styles.avatarInitial, { color: isDarkMode ? COLORS.black : COLORS.white }]}>{(formData.fullName || 'U').charAt(0).toUpperCase()}</Text>}
                <View style={[styles.cameraBtn, { backgroundColor: COLORS.cardBackground, borderWidth: 0 }]}>
                  <Ionicons name="camera" size={20} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
              <Text style={[styles.changeText, { color: COLORS.primary }]}>Tap to change picture</Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Personal Details</Text>
            </View>

            <InputField label="Full Name" value={formData.fullName} field="fullName" placeholder="Enter your name" icon="person-outline" COLORS={COLORS} onChange={handleInputChange} />
            <InputField label="Email Address" value={formData.email} field="email" placeholder="Enter email" icon="mail-outline" keyboardType="email-address" COLORS={COLORS} onChange={handleInputChange} />
            <InputField label="Phone Number" value={formData.phone} field="phone" placeholder="Enter phone" icon="call-outline" keyboardType="phone-pad" COLORS={COLORS} onChange={handleInputChange} />

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Farm Details</Text>
            </View>

            <View style={[styles.inputGroup, { zIndex: 100 }]}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: COLORS.textTertiary }]}>Farm Location</Text>
                {isSearchingLocation && <ActivityIndicator size="small" color={COLORS.primary} />}
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground, zIndex: 101, borderWidth: 0 }]}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  value={formData.farmLocation}
                  onChangeText={(text) => handleInputChange('farmLocation', text)}
                  placeholder="City, State"
                  placeholderTextColor={COLORS.textTertiary}
                  onFocus={() => { if (locationSuggestions.length > 0) setShowSuggestions(true); }}
                />
              </View>
              {showSuggestions && (
                <View style={[styles.suggestionBox, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border, zIndex: 9999 }]}>
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

            <InputField label="Farm Size" value={formData.farmSize} field="farmSize" placeholder="e.g. 5 Acres" icon="expand-outline" COLORS={COLORS} onChange={handleInputChange} />
            <InputField label="Years of Experience" value={formData.experience} field="experience" placeholder="e.g. 10 Years" icon="time-outline" COLORS={COLORS} onChange={handleInputChange} />

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnText: { fontWeight: '700', fontSize: 14 },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarBox: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarInitial: { color: '#FFF', fontSize: 48, fontWeight: '700' },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  changeText: { marginTop: 12, fontSize: 13, fontWeight: '700' },
  sectionHeader: { marginTop: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 11, fontWeight: '800', marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingHorizontal: 16, height: 58 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  suggestionBox: { 
    marginTop: 0, 
    borderRadius: 18, 
    overflow: 'hidden',
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
  },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  suggestionText: { fontSize: 14, fontWeight: '500' },
});
