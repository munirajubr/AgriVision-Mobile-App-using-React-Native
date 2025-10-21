import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";

const NPKUploadPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  // Form data states: only N, P, K, temperature, humidity, pH, rainfall
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    pH: "",
    rainfall: "",
  });

  // Pick PDF document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        processPDF(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
      console.error(error);
    }
  };

  // Process PDF and extract 7 fields (mock implementation)
  const processPDF = async (file) => {
    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Mock data
      const mockData = {
        N: "120",
        P: "34",
        K: "100",
        temperature: "28.4",
        humidity: "53",
        pH: "6.9",
        rainfall: "245",
      };
      setExtractedData(mockData);
      setFormData(mockData);

      Alert.alert("Success", "Soil report data extracted successfully!", [
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to process PDF. Please enter data manually."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get crop suggestions
  const getCropSuggestions = () => {
    if (!formData.N || !formData.P || !formData.K) {
      Alert.alert(
        "Missing Data",
        "Please enter NPK values or upload a soil report."
      );
      return;
    }
    router.push({
      pathname: "/(pages)/npkanalysis",
      params: {
        ...formData,
        fileName: selectedFile?.name || "Manual Entry",
      },
    });
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setFormData({
      N: "",
      P: "",
      K: "",
      temperature: "",
      humidity: "",
      pH: "",
      rainfall: "",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* PDF Upload Section */}
        <View style={styles.section}>
          {selectedFile ? (
            <View style={styles.fileCard}>
              <View style={styles.fileInfo}>
                <View style={styles.fileIcon}>
                  <Ionicons name="document-text" size={32} color="#F44336" />
                </View>
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Text>
                  {extractedData && (
                    <View style={styles.successBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#4CAF50"
                      />
                      <Text style={styles.successText}>Data Extracted</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={removeFile}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.uploadButton, { opacity: 0.5 }]} 
              onPress={pickDocument}
              disabled={true} 
              
            >
              <Ionicons
                name="cloud-upload-outline"
                size={48}
                color={COLORS.primary}
              />
              <Text style={styles.uploadTitle}>Upload Soil Report</Text>
              <Text style={styles.uploadSubtitle}>Tap to select PDF file</Text>
            </TouchableOpacity>
          )}
          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.processingText}>Processing PDF...</Text>
            </View>
          )}
        </View>
        {/* Separator with "or" text */}
        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorOr}>or</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* NPK & Environmental Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soil & Climate Data</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nitrogen (N)</Text>
              <TextInput
                style={styles.input}
                value={formData.N}
                onChangeText={(value) => updateField("N", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phosphorus (P)</Text>
              <TextInput
                style={styles.input}
                value={formData.P}
                onChangeText={(value) => updateField("P", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Potassium (K)</Text>
              <TextInput
                style={styles.input}
                value={formData.K}
                onChangeText={(value) => updateField("K", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>pH Level</Text>
              <TextInput
                style={styles.input}
                value={formData.pH}
                onChangeText={(value) => updateField("pH", value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Temperature (°C)</Text>
              <TextInput
                style={styles.input}
                value={formData.temperature}
                onChangeText={(value) => updateField("temperature", value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Humidity (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.humidity}
                onChangeText={(value) => updateField("humidity", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rainfall (mm)</Text>
              <TextInput
                style={styles.input}
                value={formData.rainfall}
                onChangeText={(value) => updateField("rainfall", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
        </View>
        {/* Get Suggestions Button */}
        <TouchableOpacity
          style={styles.suggestButton}
          onPress={getCropSuggestions}
          activeOpacity={0.8}
        >
          <Ionicons name="bulb-outline" size={20} color="#fff" />
          <Text style={styles.suggestButtonText}>Get Crop Suggestions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  fileCard: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  fileInfo: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F4433610",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  successText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "600",
  },
  removeButton: {
    marginLeft: 8,
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 100,
  },
  statusInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusUnit: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  suggestButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  suggestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  separatorOr: {
    marginHorizontal: 10,
    fontSize: 18,
    color: COLORS.placeholderText,
    fontWeight: "600",
  },
});

export default NPKUploadPage;
