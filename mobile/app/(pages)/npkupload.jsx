import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
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

  const getCropSuggestions = () => {
    const keys = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"];
    if (keys.some(k => !formData[k])) {
      Alert.alert("Missing Fields", "Please complete all environmental parameters.");
      return;
    }

    router.push({
      pathname: "/(pages)/npkanalysis",
      params: { ...formData, fileName: "Manual Entry" },
    });
  };

  const InputCard = ({ label, field, placeholder, icon, unit }) => (
    <View style={[styles.inputGroup, { backgroundColor: COLORS.cardBackground }]}>
      <View style={styles.inputHeader}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
        <Text style={[styles.inputLabel, { color: COLORS.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.fieldRow}>
        <TextInput
          style={[styles.input, { color: COLORS.textPrimary }]}
          value={formData[field]}
          onChangeText={(v) => updateField(field, v)}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          keyboardType="numeric"
        />
        {unit && <Text style={[styles.unitText, { color: COLORS.textTertiary }]}>{unit}</Text>}
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
          <PageHeader title="NPK Analysis" />
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.heroSection}>
              <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Soil Nutrients</Text>
              <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Enter your soil test results for AI crop advice</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.gridRow}>
                <InputCard label="Nitrogen" field="N" placeholder="120" icon="leaf-outline" unit="mg/kg" />
                <InputCard label="Phosphorus" field="P" placeholder="45" icon="flask-outline" unit="mg/kg" />
              </View>
              <View style={styles.gridRow}>
                <InputCard label="Potassium" field="K" placeholder="100" icon="prism-outline" unit="mg/kg" />
                <InputCard label="pH Level" field="ph" placeholder="6.5" icon="water-outline" />
              </View>
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.heroSection}>
              <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Climate Context</Text>
              <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Environmental data for better predictions</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.gridRow}>
                <InputCard label="Temperature" field="temperature" placeholder="28" icon="thermometer-outline" unit="°C" />
                <InputCard label="Humidity" field="humidity" placeholder="60" icon="cloud-outline" unit="%" />
              </View>
              <InputCard label="Average Rainfall" field="rainfall" placeholder="250" icon="umbrella-outline" unit="mm" />
            </View>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: COLORS.primary }]} onPress={getCropSuggestions} activeOpacity={0.8}>
              <Text style={styles.submitText}>Get Analysis Results</Text>
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
  scrollContent: { padding: 20 },
  heroSection: { marginBottom: 20, paddingLeft: 4 },
  heroTitle: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  heroSub: { fontSize: 14, fontWeight: '500' },
  grid: { gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  inputGroup: { flex: 1, padding: 16, borderRadius: 24, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 }, android: { elevation: 1 } }) },
  inputHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  input: { fontSize: 20, fontWeight: '800', padding: 0, flex: 1 },
  unitText: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  sectionDivider: { height: 1, marginVertical: 32, backgroundColor: 'rgba(0,0,0,0.03)' },
  submitBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 40 },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});
