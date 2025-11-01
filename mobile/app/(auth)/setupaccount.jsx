import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SetupAccountPage = () => {
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
    // Prepare data object
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
      cropsGrown: cropsGrown.split(",").map((c) => c.trim()), // expecting comma separated crops list
    };

    // TODO: Submit or save userData to backend or store
    console.log("User data to save:", userData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Setup Account Details</Text>

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />

      <Text style={styles.label}>Farm Location</Text>
      <TextInput
        style={styles.input}
        value={farmLocation}
        onChangeText={setFarmLocation}
        placeholder="Enter farm location"
      />

      <Text style={styles.label}>Farm Size</Text>
      <TextInput
        style={styles.input}
        value={farmSize}
        onChangeText={setFarmSize}
        placeholder="Enter farm size"
      />

      <Text style={styles.label}>Experience</Text>
      <TextInput
        style={styles.input}
        value={experience}
        onChangeText={setExperience}
        placeholder="Enter farming experience"
      />

      <Text style={styles.label}>Connected Devices</Text>
      <TextInput
        style={styles.input}
        value={connectedDevices}
        onChangeText={setConnectedDevices}
        keyboardType="number-pad"
        placeholder="Number of devices"
      />

      <Text style={styles.label}>Farming Type</Text>
      <TextInput
        style={styles.input}
        value={farmingType}
        onChangeText={setFarmingType}
        placeholder="Type of farming"
      />

      <Text style={styles.label}>Soil Type</Text>
      <TextInput
        style={styles.input}
        value={soilType}
        onChangeText={setSoilType}
        placeholder="Type of soil"
      />

      <Text style={styles.label}>Irrigation Type</Text>
      <TextInput
        style={styles.input}
        value={irrigationType}
        onChangeText={setIrrigationType}
        placeholder="Type of irrigation"
      />

      <Text style={styles.label}>Last Harvest</Text>
      <TextInput
        style={styles.input}
        value={lastHarvest}
        onChangeText={setLastHarvest}
        placeholder="Date or season of last harvest"
      />

      <Text style={styles.label}>Crops Grown</Text>
      <TextInput
        style={styles.input}
        value={cropsGrown}
        onChangeText={setCropsGrown}
        placeholder="List crops separated by commas"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SetupAccountPage;
