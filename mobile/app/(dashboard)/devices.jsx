import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import DeviceCard from '../../components/DeviceCard';
import { scheduleNotification } from '../../utils/notifications';

const DEVICES_API = 'https://ml-flask-model.onrender.com/api/devices';
const ADD_API = 'https://agrivision-mobile-app-using-react-native.onrender.com/api/devices/add';
const REMOVE_API = 'https://agrivision-mobile-app-using-react-native.onrender.com/api/devices/remove';
const STORAGE_KEY_BASE = '@devices_with_details_v1_';

function safeGet(obj, path, fallback = undefined) {
  try { return path.split('.').reduce((s, p) => (s && s[p] !== undefined ? s[p] : undefined), obj) ?? fallback; } catch { return fallback; }
}

function normalizeRecord(rec) {
  if (!rec || typeof rec !== 'object') return null;
  const soil = rec.soil_moisture ?? rec.soil ?? rec.moisture ?? null;
  const temp = rec.temperature ?? rec.temp ?? null;
  const humidity = rec.humidity ?? rec.hum ?? rec.humid ?? null;
  const created_at = rec.created_at ?? rec.predicted_at ?? rec._id ?? null;
  const imgCandidate = rec.image ?? rec.image_base64 ?? rec.image_url ?? safeGet(rec, 'img') ?? null;
  const image = imgCandidate && typeof imgCandidate === 'string' ? (imgCandidate.startsWith('data:') || imgCandidate.startsWith('http') ? imgCandidate : `data:image/jpeg;base64,${imgCandidate}`) : null;
  const predObj = safeGet(rec, 'model_prediction_raw.prediction') || safeGet(rec, 'model_prediction_raw') || safeGet(rec, 'prediction') || null;
  return { soil_moisture: soil, temperature: temp, humidity, created_at, image, prediction: predObj, raw: rec };
}

function normalizeDevicesResponse(respBody) {
  if (!respBody) return {};
  if (respBody.devices && !Array.isArray(respBody.devices)) {
    const out = {};
    for (const [id, arr] of Object.entries(respBody.devices)) { if (Array.isArray(arr)) out[id] = arr.map(normalizeRecord).filter(Boolean); }
    return out;
  }
  if (Array.isArray(respBody.devices)) {
    const out = {};
    for (const item of respBody.devices) {
      const id = item.device_id ?? item.id ?? null;
      if (id) { out[id] = out[id] || []; out[id].push(normalizeRecord(item)); }
    }
    return out;
  }
  return {};
}

export default function DevicesScreen() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { user } = useAuthStore();
  const username = user?.username || user?.email || null;
  const router = useRouter();

  const [devicesMap, setDevicesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [adding, setAdding] = useState(false);
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);

  const storageKey = username ? `${STORAGE_KEY_BASE}${username}` : `${STORAGE_KEY_BASE}anon`;

  useEffect(() => {
    (async () => {
      await loadCache();
      if (username) await fetchDevices();
      else setLoading(false);
    })();
  }, [username]);

  const loadCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      if (raw) { const parsed = JSON.parse(raw); if (parsed?.devices) setDevicesMap(parsed.devices); }
    } catch {}
  };

  const fetchDevices = useCallback(async () => {
    if (!username) return;
    setRefreshing(true);
    try {
      const resp = await axios.post(DEVICES_API, { username }, { timeout: 15000 });
      const normalized = normalizeDevicesResponse(resp?.data);
      setDevicesMap(normalized);

      // Check for issues and notify
      Object.entries(normalized).forEach(([id, records]) => {
        if (records.length > 0) {
          const last = records[0];
          const pred = last.prediction;
          const diseaseStr = typeof pred === 'object' ? pred.class : pred;
          
          if (diseaseStr && diseaseStr.toLowerCase() !== 'healthy' && diseaseStr !== 'Monitoring...') {
            scheduleNotification(
              "Device Alert",
              `Issue detected on Sensor #${id}: ${diseaseStr}`
            );
          }
          
          // Check soil moisture
          if (last.soil_moisture !== null && (last.soil_moisture < 20 || last.soil_moisture > 90)) {
            scheduleNotification(
              "Soil Alert",
              `Critical moisture on Sensor #${id}: ${last.soil_moisture}%`
            );
          }
        }
      });

      await AsyncStorage.setItem(storageKey, JSON.stringify({ username, devices: normalized }));
    } catch {} finally { setRefreshing(false); setLoading(false); }
  }, [username]);

  const onAddDevice = async () => {
    if (!newDeviceId.trim()) return;
    setAdding(true);
    try {
      await axios.post(ADD_API, { username, deviceId: newDeviceId.trim() });
      await fetchDevices();
      setFormVisible(false);
      setNewDeviceId('');
    } catch { Alert.alert('Error', 'Failed to register device.'); } finally { setAdding(false); }
  };

  const confirmRemoveDevice = (deviceId) => {
    Alert.alert(
      "Remove Device",
      `Are you sure you want to disconnect sensor ${deviceId}? All historical data for this session will be lost.`,
      [
        { text: "Cancel", style: "cancel", onPress: () => setMenuVisibleFor(null) },
        { text: "Disconnect", style: "destructive", onPress: () => doRemoveDevice(deviceId) }
      ]
    );
  };

  const doRemoveDevice = async (deviceId) => {
    try {
      await axios.delete(REMOVE_API, { data: { username, deviceId } });
      await fetchDevices();
    } catch { Alert.alert('Error', 'Failed to remove device.'); } finally { setMenuVisibleFor(null); }
  };

  if (!username) {
    return (
      <View style={[styles.centered, { backgroundColor: COLORS.background }]}>
        <Ionicons name="hardware-chip-outline" size={80} color={COLORS.textTertiary} />
        <Text style={[styles.title, { color: COLORS.textPrimary, marginTop: 24 }]}>Access Denied</Text>
        <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>Log in to manage your IoT ecosystem.</Text>
      </View>
    );
  }

  const deviceIds = Object.keys(devicesMap);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDevices} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.screenTitle, { color: COLORS.textPrimary }]}>Connected Sensors</Text>
          <TouchableOpacity 
            style={[styles.miniAddBtn, { backgroundColor: COLORS.primary }]} 
            onPress={() => setFormVisible(true)}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.miniAddText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Chips */}
        <View style={styles.chipsRow}>
          <View style={[styles.chip, { backgroundColor: COLORS.cardBackground }]}>
            <Text style={[styles.chipVal, { color: COLORS.primary }]}>{deviceIds.length}</Text>
            <Text style={[styles.chipLabel, { color: COLORS.textTertiary }]}>Total</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: COLORS.cardBackground }]}>
            <Text style={[styles.chipVal, { color: COLORS.success }]}>Online</Text>
            <Text style={[styles.chipLabel, { color: COLORS.textTertiary }]}>Status</Text>
          </View>
        </View>

        {loading && deviceIds.length === 0 ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 60 }} />
        ) : deviceIds.length > 0 ? (
          deviceIds.map((id) => (
            <DeviceCard
              key={id}
              deviceId={id}
              record={devicesMap[id][0]}
              menuVisible={menuVisibleFor === id}
              onOpenMenu={() => setMenuVisibleFor(id)}
              onCloseMenu={() => setMenuVisibleFor(null)}
              onHistory={() => {}}
              onDelete={() => confirmRemoveDevice(id)} // Added confirmation here
              onDiagnose={() => {
                const pred = devicesMap[id][0]?.prediction;
                const diseaseStr = typeof pred === 'object' ? (pred.class ?? JSON.stringify(pred)) : (pred || "Healthy");
                router.push(`/(pages)/diseasediagnosis?deviceId=${id}&prediction=${encodeURIComponent(diseaseStr)}`);
              }} 
            />
          ))
        ) : (
          <View style={styles.emptyBox}>
            <View style={[styles.emptyIconCircle, { backgroundColor: `${COLORS.textTertiary}15` }]}>
              <Ionicons name="wifi-outline" size={60} color={COLORS.textTertiary} />
            </View>
            <Text style={[styles.emptyTitle, { color: COLORS.textPrimary }]}>No Sensors Found</Text>
            <Text style={[styles.emptySub, { color: COLORS.textTertiary }]}>Link your first AgriVision hardware sensor.</Text>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={formVisible} animationType="fade" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: COLORS.overlay }]}>
          <TouchableWithoutFeedback onPress={() => setFormVisible(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContent}>
            <View style={[styles.popupCard, { backgroundColor: COLORS.cardBackground }]}>
              <View style={styles.popupHeader}>
                <Ionicons name="hardware-chip" size={32} color={COLORS.primary} />
                <Text style={[styles.popupTitle, { color: COLORS.textPrimary }]}>Register Sensor</Text>
              </View>
              <View style={[styles.inputGroup, { backgroundColor: COLORS.secondaryBackground }]}>
                <Ionicons name="barcode-outline" size={20} color={COLORS.textTertiary} />
                <TextInput
                  value={newDeviceId}
                  onChangeText={setNewDeviceId}
                  placeholder="Device Serial Number"
                  placeholderTextColor={COLORS.textTertiary}
                  style={[styles.input, { color: COLORS.textPrimary }]}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.popupActions}>
                <TouchableOpacity onPress={() => setFormVisible(false)} style={styles.secBtn}><Text style={{ color: COLORS.textTertiary, fontWeight: '700' }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={onAddDevice} disabled={adding} style={[styles.priBtn, { backgroundColor: COLORS.primary }]}>
                  {adding ? <ActivityIndicator color="#FFF" /> : <Text style={styles.priBtnText}>Link Sensor</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: 22, fontWeight: '800' },
  miniAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  miniAddText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  chipsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  chip: { flex: 1, padding: 12, borderRadius: 18, alignItems: 'center' },
  chipVal: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  chipLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 15, textAlign: 'center', marginTop: 8 },
  emptyBox: { alignItems: 'center', paddingVertical: 80, gap: 16 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', maxWidth: 400 },
  popupCard: { borderRadius: 28, padding: 24, gap: 20 },
  popupHeader: { alignItems: 'center', gap: 10 },
  popupTitle: { fontSize: 22, fontWeight: '800' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, gap: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },
  popupActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 10 },
  secBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  priBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14, minWidth: 120, alignItems: 'center' },
  priBtnText: { color: '#FFF', fontWeight: '800' },
});
