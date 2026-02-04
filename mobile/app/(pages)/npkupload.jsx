import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import SafeScreen from "../../components/SafeScreen";
import PageHeader from "../../components/PageHeader";

// Simplified Input Component
const SimpleInput = ({ label, value, onChangeText, placeholder, icon, unit, COLORS }) => (
  <View style={styles.inputContainer}>
    <Text style={[styles.inputLabel, { color: COLORS.textTertiary }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
      <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: COLORS.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        keyboardType="numeric"
      />
      {unit && <Text style={[styles.unitText, { color: COLORS.textTertiary }]}>{unit}</Text>}
    </View>
  </View>
);

export default function NPKUploadPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const [formData, setFormData] = useState({
    N: "", P: "", K: "",
    temperature: "", humidity: "", ph: "", rainfall: "",
  });

  const updateField = (field, value) => {
    const cleaned = value.replace(/[^\d.-]/g, "");
    setFormData((prev) => ({ ...prev, [field]: cleaned }));
  };

  const handleAnalyze = () => {
    const keys = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"];
    if (keys.some(k => !formData[k])) {
      Alert.alert("Missing Info", "Please fill in all the fields to get an accurate recommendation.");
      return;
    }

    router.push({
      pathname: "/(pages)/npkanalysis",
      params: { ...formData },
    });
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
          <PageHeader title="NPK Analysis" />
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.introSection}>
              <Text style={[styles.title, { color: COLORS.textPrimary }]}>Enter Soil Details</Text>
              <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>Fill in the nutrients and environmental data from your soil test.</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionHeader, { color: COLORS.primary }]}>SOIL NUTRIENTS</Text>
              <View style={styles.row}>
                <SimpleInput label="Nitrogen (N)" value={formData.N} onChangeText={(v) => updateField("N", v)} placeholder="0" icon="leaf-outline" COLORS={COLORS} />
                <SimpleInput label="Phosphorus (P)" value={formData.P} onChangeText={(v) => updateField("P", v)} placeholder="0" icon="flask-outline" COLORS={COLORS} />
              </View>
              <View style={styles.row}>
                <SimpleInput label="Potassium (K)" value={formData.K} onChangeText={(v) => updateField("K", v)} placeholder="0" icon="prism-outline" COLORS={COLORS} />
                <SimpleInput label="Soil pH" value={formData.ph} onChangeText={(v) => updateField("ph", v)} placeholder="7.0" icon="water-outline" COLORS={COLORS} />
              </View>

              <Text style={[styles.sectionHeader, { color: COLORS.primary, marginTop: 24 }]}>ENVIRONMENT</Text>
              <View style={styles.row}>
                <SimpleInput label="Temperature" value={formData.temperature} onChangeText={(v) => updateField("temperature", v)} placeholder="25" icon="thermometer-outline" unit="°C" COLORS={COLORS} />
                <SimpleInput label="Humidity" value={formData.humidity} onChangeText={(v) => updateField("humidity", v)} placeholder="50" icon="cloud-outline" unit="%" COLORS={COLORS} />
              </View>
              <SimpleInput label="Average Rainfall" value={formData.rainfall} onChangeText={(v) => updateField("rainfall", v)} placeholder="200" icon="umbrella-outline" unit="mm" COLORS={COLORS} />
            </View>

            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: COLORS.primary }]} onPress={handleAnalyze} activeOpacity={0.8}>
              <Text style={styles.mainBtnText}>Run Analysis</Text>
              <Ionicons name="sparkles" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  introSection: { marginBottom: 32 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  
  formSection: { width: '100%' },
  sectionHeader: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 16 },
  
  inputContainer: { flex: 1, marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 16, 
    borderWidth: 1,
    paddingHorizontal: 16, 
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  unitText: { fontSize: 14, fontWeight: '700', marginLeft: 8 },

  mainBtn: { 
    height: 60, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    marginTop: 24,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 3 }
    })
  },
  mainBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
