import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

const InputField = ({ label, value, field, placeholder, icon, keyboardType = 'default', COLORS, onChange }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: COLORS.textTertiary }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground }]}>
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
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmLocation: user?.farmLocation || '',
    farmSize: user?.farmSize || '',
    experience: user?.experience || '',
    farmingType: user?.farmingType || '',
    soilType: user?.soilType || '',
    irrigationType: user?.irrigationType || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
          <PageHeader 
            title="Edit Profile" 
            rightComponent={
              <TouchableOpacity 
                onPress={handleSave} 
                disabled={isLoading}
                style={[styles.saveBtn, { backgroundColor: COLORS.primary }]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            }
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.avatarSection}>
              <View style={[styles.avatarBox, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.avatarInitial}>{formData.username?.charAt(0).toUpperCase() || 'U'}</Text>
                <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: COLORS.cardBackground }]}>
                  <Ionicons name="camera" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Personal Details</Text>
            </View>

            <InputField label="Full Name" value={formData.username} field="username" placeholder="Enter your name" icon="person-outline" COLORS={COLORS} onChange={handleInputChange} />
            <InputField label="Email Address" value={formData.email} field="email" placeholder="Enter email" icon="mail-outline" keyboardType="email-address" COLORS={COLORS} onChange={handleInputChange} />
            <InputField label="Phone Number" value={formData.phone} field="phone" placeholder="Enter phone" icon="call-outline" keyboardType="phone-pad" COLORS={COLORS} onChange={handleInputChange} />

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Farm Details</Text>
            </View>

            <InputField label="Farm Location" value={formData.farmLocation} field="farmLocation" placeholder="City, State" icon="location-outline" COLORS={COLORS} onChange={handleInputChange} />
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
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarBox: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarInitial: { color: '#FFF', fontSize: 40, fontWeight: '700' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  sectionHeader: { marginTop: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },
});
