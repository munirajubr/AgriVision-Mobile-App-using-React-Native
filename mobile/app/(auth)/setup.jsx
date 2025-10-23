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
} from "react-native";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/setup.styles"; // Create appropriate styles
import { useAuthStore } from "../../store/authStore";

export default function Setup() {
  const router = useRouter();

  const { user, token, isLoading, setupProfile } = useAuthStore();

  // Pre-fill username from user object if available
  const [username, setUsername] = useState(user?.username || "");

  // Profile fields to complete
  const [phone, setPhone] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [experience, setExperience] = useState("");
  const [farmingType, setFarmingType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [lastHarvest, setLastHarvest] = useState("");
  const [cropsGrown, setCropsGrown] = useState("");

  const handleSubmit = async () => {
  if (!username) {
    Alert.alert("Validation Error", "Username is required");
    return;
  }

  // Prepare profile data JSON
  const details = {
    username,
    phone,
    farmLocation,
    farmSize,
    experience,
    farmingType,
    soilType,
    irrigationType,
    lastHarvest,
    cropsGrown: cropsGrown
      .split(",")
      .map((crop) => crop.trim())
      .filter(Boolean),
  };

  // Call your store action to send profile data to backend
  const result = await setupProfile(details);

  if (result.success) {
    Alert.alert("Success", "Profile setup complete");
    // Navigate to home/profile after successful setup
    router.push("/profile"); // Or your desired route
  } else {
    Alert.alert("Error", result.error || "Failed to setup profile");
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Complete Your Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="e.g., +1234567890"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Farm Location</Text>
          <TextInput
            style={styles.input}
            value={farmLocation}
            onChangeText={setFarmLocation}
            placeholder="City, State, Country"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Farm Size</Text>
          <TextInput
            style={styles.input}
            value={farmSize}
            onChangeText={setFarmSize}
            placeholder="e.g., 5 acres"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Experience (years)</Text>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            placeholder="e.g., 3"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Farming Type</Text>
          <TextInput
            style={styles.input}
            value={farmingType}
            onChangeText={setFarmingType}
            placeholder="e.g., Organic, Hydroponic"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Soil Type</Text>
          <TextInput
            style={styles.input}
            value={soilType}
            onChangeText={setSoilType}
            placeholder="e.g., Loamy, Sandy"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Irrigation Type</Text>
          <TextInput
            style={styles.input}
            value={irrigationType}
            onChangeText={setIrrigationType}
            placeholder="e.g., Drip, Sprinkler"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Harvest Date</Text>
          <TextInput
            style={styles.input}
            value={lastHarvest}
            onChangeText={setLastHarvest}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crops Grown</Text>
          <TextInput
            style={styles.input}
            value={cropsGrown}
            onChangeText={setCropsGrown}
            placeholder="Comma separated list"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
