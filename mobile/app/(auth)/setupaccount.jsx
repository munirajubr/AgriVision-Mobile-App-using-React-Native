import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";

const SetupAccountPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const [phone, setPhone] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [experience, setExperience] = useState("");
  const [connectedDevices, setConnectedDevices] = useState("");
  const [farmingType, setFarmingType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [lastHarvest, setLastHarvest] = useState("");
  const [cropsGrown, setCropsGrown] = useState("");

  const handleSave = () => {
    const userData = {
      phone,
      farmLocation,
      farmSize,
      experience,
      connectedDevices: Number(connectedDevices) || 0,
      farmingType,
      soilType,
      irrigationType,
      lastHarvest,
      cropsGrown: cropsGrown.split(",").map((c) => c.trim()),
    };
    console.log("User data to save:", userData);
  };

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType, icon }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: COLORS.textSecondary }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: COLORS.cardBackground }]}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.textTertiary} style={styles.inputIcon} />}
        <TextInput
          style={[styles.input, { color: COLORS.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          keyboardType={keyboardType || "default"}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: COLORS.textPrimary }]}>Setup Account Details</Text>
        <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
          Complete your profile to get personalized farming insights
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Contact Information</Text>
          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            icon="call-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Farm Details</Text>
          <InputField
            label="Farm Location"
            value={farmLocation}
            onChangeText={setFarmLocation}
            placeholder="Enter farm location"
            icon="location-outline"
          />
          <InputField
            label="Farm Size"
            value={farmSize}
            onChangeText={setFarmSize}
            placeholder="e.g., 5 acres"
            icon="resize-outline"
          />
          <InputField
            label="Farming Experience"
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g., 10 years"
            icon="time-outline"
          />
          <InputField
            label="Connected Devices"
            value={connectedDevices}
            onChangeText={setConnectedDevices}
            placeholder="Number of devices"
            keyboardType="number-pad"
            icon="hardware-chip-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Farming Information</Text>
          <InputField
            label="Farming Type"
            value={farmingType}
            onChangeText={setFarmingType}
            placeholder="e.g., Organic, Traditional"
            icon="leaf-outline"
          />
          <InputField
            label="Soil Type"
            value={soilType}
            onChangeText={setSoilType}
            placeholder="e.g., Clay, Loam"
            icon="layers-outline"
          />
          <InputField
            label="Irrigation Type"
            value={irrigationType}
            onChangeText={setIrrigationType}
            placeholder="e.g., Drip, Sprinkler"
            icon="water-outline"
          />
          <InputField
            label="Last Harvest"
            value={lastHarvest}
            onChangeText={setLastHarvest}
            placeholder="Date or season"
            icon="calendar-outline"
          />
          <InputField
            label="Crops Grown"
            value={cropsGrown}
            onChangeText={setCropsGrown}
            placeholder="Wheat, Rice, Tomato (comma separated)"
            icon="nutrition-outline"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: COLORS.white }]}>Save Details</Text>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "400",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default SetupAccountPage;
