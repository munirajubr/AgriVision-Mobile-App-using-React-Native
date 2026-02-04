import React, { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";
import PageHeader from "../../components/PageHeader";
import { Ionicons } from "@expo/vector-icons";

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

  const InputField = ({ label, value, setter, placeholder, icon, keyboardType = "default" }) => (
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

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <PageHeader 
          title="Account Setup" 
          hideBackButton 
          rightComponent={
            <TouchableOpacity onPress={handleSkip}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Skip</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary}10` }]}>
              <Ionicons name="sparkles" size={32} color={COLORS.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Welcome to AgriVision</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Tell us a bit about your farm to personalize your experience.</Text>
          </View>

          <InputField label="Phone Number" value={phone} setter={setPhone} placeholder="e.g., +1 234 567 890" icon="call-outline" keyboardType="phone-pad" />
          <InputField label="Farm Location" value={farmLocation} setter={setFarmLocation} placeholder="City, State" icon="location-outline" />
          <InputField label="Farm Size" value={farmSize} setter={setFarmSize} placeholder="e.g., 5 Acres" icon="expand-outline" />
          <InputField label="Years of Experience" value={experience} setter={setExperience} placeholder="e.g., 5" icon="time-outline" keyboardType="numeric" />
          <InputField label="Farming Type" value={farmingType} setter={setFarmingType} placeholder="e.g., Organic, Greenhouse" icon="leaf-outline" />
          <InputField label="Soil Type" value={soilType} setter={setSoilType} placeholder="e.g., Clay, Loamy" icon="flower-outline" />
          <InputField label="Irrigation" value={irrigationType} setter={setIrrigationType} placeholder="e.g., Drip, Sprinkler" icon="water-outline" />

          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: COLORS.primary }]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.mainBtnText}>Complete Setup</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 24 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  heroSub: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },
  mainBtn: { height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 15 }, android: { elevation: 4 } }) },
  mainBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});
