import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
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
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { scheduleNotification } from '../../utils/notifications';

const cercosporaImg  = require('../../assets/images/pics/Cercospora Leaf Spot.png');
const laceBugImg     = require('../../assets/images/pics/Eggplant Lace Bug.png');
const leafRollerImg  = require('../../assets/images/pics/Eggplant Leaf Roller.png');

const STORAGE_KEY = '@agrivision_default_devices_v3';

const C = {
  bg:     '#F7F8F7',
  card:   '#FFFFFF',
  border: '#EEEFEE',
  text:   '#111411',
  sub:    '#8A9A8E',
  accent: '#1A4D2E',
  lime:   '#C8F572',
  green:  '#16A34A',
  amber:  '#D97706',
  red:    '#EF4444',
};

const DEFAULT_DEVICES = {
  'ENV-101': [{ soil_moisture: 45, temperature: 28, humidity: 65, created_at: new Date(Date.now() - 10 * 60000).toISOString(), image: cercosporaImg,  prediction: { class: 'Cercospora Leaf Spot',  confidence: 95, recommendations: ['Remove infected leaves. Spray copper fungicide immediately.'] } }],
  'SL-204':  [{ soil_moisture: 18, temperature: 32, humidity: 52, created_at: new Date(Date.now() - 25 * 60000).toISOString(), image: laceBugImg,     prediction: { class: 'Eggplant Lace Bug',    confidence: 92, recommendations: ['Spray insecticidal soap or neem oil on leaf undersides.'] } }],
  'IRR-309': [{ soil_moisture: 58, temperature: 26, humidity: 70, created_at: new Date(Date.now() - 60 * 60000).toISOString(), image: leafRollerImg,  prediction: { class: 'Eggplant Leaf Roller', confidence: 90, recommendations: ['Handpick rolled leaves. Apply Bacillus thuringiensis (Bt).'] } }],
  'CROP-402':[{ soil_moisture: 42, temperature: 27, humidity: 62, created_at: new Date(Date.now() - 120* 60000).toISOString(), image: null,           prediction: 'Monitoring...' }],
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1)  return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

function statusColor(soilMoisture) {
  if (soilMoisture > 50) return C.green;
  if (soilMoisture > 25) return C.amber;
  return C.red;
}

// ── Sensor Card (Recent image + 3-dots menu actions) ──
function SensorCard({
  deviceId,
  record,
  onDiagnose,
  onDelete,
  isDiagnosing,
  menuVisible,
  onToggleMenu,
  onCloseMenu,
}) {
  const pred       = record?.prediction;
  const hasResult  = pred && typeof pred === 'object';
  const disease    = hasResult ? pred.class : (pred || 'Monitoring…');
  const confidence = hasResult ? pred.confidence : null;
  const sc         = statusColor(record?.soil_moisture ?? 50);

  const imageSource = typeof record?.image === 'string'
    ? { uri: record.image }
    : record?.image;

  return (
    <View style={[card.wrap, menuVisible && { zIndex: 999, elevation: 8 }]}>
      {/* Card Header with 3-Dots Button */}
      <View style={card.header}>
        <View style={[card.iconBox, { backgroundColor: `${sc}15` }]}>
          <Ionicons name="hardware-chip-outline" size={22} color={sc} />
        </View>
        <View style={card.headerText}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={card.deviceId}>{deviceId}</Text>
            <View style={[card.statusDot, { backgroundColor: sc }]} />
          </View>
          <Text style={card.lastSeen}>Updated {timeAgo(record.created_at)}</Text>
        </View>

        <TouchableOpacity
          style={[card.menuBtn, menuVisible && { backgroundColor: '#EAECE9' }]}
          onPress={onToggleMenu}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* 3-Dots Dropdown Menu */}
      {menuVisible && (
        <View style={card.inlineMenu}>
          <TouchableOpacity
            style={card.menuItem}
            onPress={() => {
              onCloseMenu();
              onDiagnose();
            }}
            disabled={isDiagnosing}
            activeOpacity={0.7}
          >
            {isDiagnosing ? (
              <ActivityIndicator size="small" color={C.accent} style={{ width: 16 }} />
            ) : (
              <Ionicons name="scan-outline" size={16} color={C.accent} />
            )}
            <Text style={card.menuItemText}>
              {isDiagnosing ? 'Diagnosing...' : 'Diagnose'}
            </Text>
          </TouchableOpacity>

          <View style={card.menuDivider} />

          <TouchableOpacity
            style={card.menuItem}
            onPress={() => {
              onCloseMenu();
              onDelete();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={C.red} />
            <Text style={[card.menuItemText, { color: C.red }]}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent Picture Display */}
      <View style={card.imageContainer}>
        {imageSource ? (
          <>
            <Image
              source={imageSource}
              style={card.image}
              resizeMode="cover"
            />
            <View style={card.imageOverlay}>
              <View style={card.imageBadge}>
                <Ionicons name="camera" size={11} color="#FFF" />
                <Text style={card.imageBadgeText}>Recent Capture</Text>
              </View>
              <View style={card.imageTimeBadge}>
                <Text style={card.imageTimeText}>{timeAgo(record.created_at)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={card.noImageContainer}>
            <View style={card.noImageIconCircle}>
              <Ionicons name="camera-outline" size={26} color={C.sub} />
            </View>
            <Text style={card.noImageText}>Awaiting camera capture...</Text>
          </View>
        )}
      </View>

      {/* Metrics Row */}
      <View style={card.metricsRow}>
        {[
          { icon: 'water-outline',      val: `${record.soil_moisture}%`,  label: 'Moisture' },
          { icon: 'thermometer-outline',val: `${record.temperature}°C`,   label: 'Temp' },
          { icon: 'cloud-outline',      val: `${record.humidity}%`,       label: 'Humidity' },
        ].map((m, i) => (
          <View key={i} style={card.metric}>
            <Ionicons name={m.icon} size={14} color={C.sub} />
            <Text style={card.metricVal}>{m.val}</Text>
            <Text style={card.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={card.divider} />

      {/* Disease Result Row */}
      <TouchableOpacity
        style={card.resultRow}
        onPress={onDiagnose}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={card.resultLabel}>AI Result</Text>
          {isDiagnosing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <ActivityIndicator size="small" color={C.accent} />
              <Text style={[card.resultVal, { color: C.accent }]}>Analyzing plant...</Text>
            </View>
          ) : (
            <Text style={card.resultVal} numberOfLines={1}>{disease}</Text>
          )}
        </View>
        {confidence && !isDiagnosing && (
          <View style={[card.confidencePill, { backgroundColor: `${C.green}15` }]}>
            <Text style={[card.confidenceText, { color: C.green }]}>{confidence}%</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={C.sub} style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  );
}

const card = StyleSheet.create({
  wrap:               { backgroundColor: C.card, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2, position: 'relative' },
  header:             { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  iconBox:            { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerText:         { flex: 1 },
  deviceId:           { fontSize: 15, fontWeight: '800', color: C.text },
  lastSeen:           { fontSize: 12, color: C.sub, marginTop: 1 },
  statusDot:          { width: 8, height: 8, borderRadius: 4 },
  menuBtn:            { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F6F5' },
  inlineMenu:         { position: 'absolute', top: 56, right: 16, backgroundColor: C.card, borderRadius: 14, paddingVertical: 4, width: 148, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 12, borderWidth: 1, borderColor: C.border, zIndex: 9999 },
  menuItem:           { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, gap: 8 },
  menuItemText:       { fontSize: 13, fontWeight: '700', color: C.text },
  menuDivider:        { height: StyleSheet.hairlineWidth, backgroundColor: C.border, marginHorizontal: 8 },
  imageContainer:     { height: 175, marginHorizontal: 16, marginBottom: 14, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F3' },
  image:              { width: '100%', height: '100%' },
  imageOverlay:       { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  imageBadge:         { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 5 },
  imageBadgeText:     { color: '#FFF', fontSize: 11, fontWeight: '700' },
  imageTimeBadge:     { backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  imageTimeText:      { color: '#FFF', fontSize: 11, fontWeight: '600' },
  noImageContainer:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  noImageIconCircle:  { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EAECE9', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  noImageText:        { fontSize: 12, color: C.sub, fontWeight: '600' },
  metricsRow:         { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 14, gap: 0 },
  metric:             { flex: 1, alignItems: 'center', gap: 2 },
  metricVal:          { fontSize: 14, fontWeight: '800', color: C.text },
  metricLabel:        { fontSize: 10, color: C.sub, fontWeight: '600' },
  divider:            { height: StyleSheet.hairlineWidth, backgroundColor: C.border, marginHorizontal: 16 },
  resultRow:          { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  resultLabel:        { fontSize: 10, color: C.sub, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  resultVal:          { fontSize: 14, fontWeight: '700', color: C.text },
  confidencePill:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  confidenceText:     { fontSize: 12, fontWeight: '800' },
});

// ── Main Screen ──
export default function DevicesScreen() {
  const { user }  = useAuthStore();
  const router    = useRouter();

  const [devicesMap, setDevicesMap]       = useState(DEFAULT_DEVICES);
  const [activeMenuId, setActiveMenuId]   = useState(null);
  const [refreshing, setRefreshing]       = useState(false);
  const [formVisible, setFormVisible]     = useState(false);
  const [newDeviceId, setNewDeviceId]     = useState('');
  const [adding, setAdding]               = useState(false);
  const [diagnosingIds, setDiagnosingIds] = useState(new Set());

  useEffect(() => { loadDevices(); }, []);

  const loadDevices = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...parsed };
        Object.keys(DEFAULT_DEVICES).forEach(id => {
          if (merged[id]?.[0] && !merged[id][0].image && DEFAULT_DEVICES[id]?.[0]?.image) {
            merged[id][0].image = DEFAULT_DEVICES[id][0].image;
          }
        });
        setDevicesMap(merged);
      } else {
        setDevicesMap(DEFAULT_DEVICES);
      }
    } catch {
      setDevicesMap(DEFAULT_DEVICES);
    }
  };

  const fetchDevices = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const onAddDevice = async () => {
    const id = newDeviceId.trim().toUpperCase();
    if (!id) return;
    setAdding(true);
    setTimeout(async () => {
      const updated = { ...devicesMap, [id]: [{ soil_moisture: 50, temperature: 27, humidity: 60, created_at: new Date().toISOString(), image: null, prediction: 'Monitoring...' }] };
      setDevicesMap(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setAdding(false); setFormVisible(false); setNewDeviceId('');
      scheduleNotification('Sensor Connected', `Device #${id} linked.`);
    }, 400);
  };

  const confirmRemove = (id) =>
    Alert.alert('Remove Sensor', `Disconnect sensor ${id}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: () => doRemove(id) },
    ]);

  const doRemove = async (id) => {
    const updated = { ...devicesMap };
    delete updated[id];
    setDevicesMap(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    scheduleNotification('Device Removed', `Sensor #${id} disconnected.`);
  };

  const runDiagnosis = async (id) => {
    setDiagnosingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      const result = { class: 'Cercospora Leaf Spot', confidence: 96, recommendations: ['Remove infected leaves. Apply copper-based fungicide.'] };
      setDevicesMap(prev => {
        const next = { ...prev };
        if (next[id]?.[0]) next[id] = [{ ...next[id][0], prediction: result }, ...next[id].slice(1)];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
      scheduleNotification('Analysis Complete', `Sensor #${id}: ${result.class}`);
      setDiagnosingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      router.push(`/(pages)/diseasediagnosis?deviceId=${id}&prediction=${encodeURIComponent(result.class)}`);
    }, 900);
  };

  const deviceIds = Object.keys(devicesMap);
  const online    = deviceIds.length;

  return (
    <View style={sc.container}>
      {/* ── Top Bar ── */}
      <View style={sc.topBar}>
        <View>
          <Text style={sc.topTitle}>IoT Sensors</Text>
          <Text style={sc.topSub}>{online} device{online !== 1 ? 's' : ''} connected</Text>
        </View>
        <TouchableOpacity style={sc.addBtn} onPress={() => setFormVisible(true)} activeOpacity={0.85}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={sc.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Summary Chips ── */}
      <View style={sc.chips}>
        {[
          { val: deviceIds.length,  label: 'Total',   color: C.accent },
          { val: 'Online',          label: 'Status',  color: C.green  },
          { val: '28°C',            label: 'Avg Temp',color: C.amber  },
          { val: '61%',             label: 'Avg Hum', color: '#0284C7'},
        ].map((c, i) => (
          <View key={i} style={sc.chip}>
            <Text style={[sc.chipVal, { color: c.color }]}>{c.val}</Text>
            <Text style={sc.chipLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* ── List ── */}
      <ScrollView
        contentContainerStyle={sc.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDevices} tintColor={C.accent} />}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => { if (activeMenuId) setActiveMenuId(null); }}
      >
        {deviceIds.length > 0 ? deviceIds.map(id => (
          <SensorCard
            key={id}
            deviceId={id}
            record={devicesMap[id][0]}
            menuVisible={activeMenuId === id}
            onToggleMenu={() => setActiveMenuId(prev => prev === id ? null : id)}
            onCloseMenu={() => setActiveMenuId(null)}
            onDelete={() => confirmRemove(id)}
            isDiagnosing={diagnosingIds.has(id)}
            onDiagnose={() => {
              const pred = devicesMap[id][0]?.prediction;
              const str  = pred && typeof pred === 'object' ? pred.class : (pred || 'Monitoring...');
              str === 'Monitoring...' ? runDiagnosis(id) : router.push(`/(pages)/diseasediagnosis?deviceId=${id}&prediction=${encodeURIComponent(str)}`);
            }}
          />
        )) : (
          <View style={sc.empty}>
            <View style={sc.emptyIcon}>
              <Ionicons name="wifi-outline" size={44} color={C.sub} />
            </View>
            <Text style={sc.emptyTitle}>No Sensors Found</Text>
            <Text style={sc.emptySub}>Tap "Add" to link your first AgriVision sensor.</Text>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Add Modal ── */}
      <Modal visible={formVisible} animationType="slide" transparent>
        <View style={m.overlay}>
          <TouchableWithoutFeedback onPress={() => setFormVisible(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={m.sheet}>
              <View style={m.handle} />
              <View style={m.iconWrap}>
                <Ionicons name="hardware-chip" size={28} color={C.accent} />
              </View>
              <Text style={m.title}>Register Sensor</Text>
              <Text style={m.sub}>Enter the device serial number printed on your sensor.</Text>

              <View style={m.inputRow}>
                <Ionicons name="barcode-outline" size={18} color={C.sub} />
                <TextInput
                  value={newDeviceId}
                  onChangeText={setNewDeviceId}
                  placeholder="e.g. SENSOR-901"
                  placeholderTextColor={C.sub}
                  style={m.input}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={[m.linkBtn, { opacity: adding ? 0.6 : 1 }]}
                onPress={onAddDevice}
                disabled={adding}
                activeOpacity={0.85}
              >
                {adding
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={m.linkBtnText}>Link Sensor</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setFormVisible(false)} style={m.cancelBtn}>
                <Text style={m.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const sc = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  topTitle:  { fontSize: 22, fontWeight: '800', color: C.text },
  topSub:    { fontSize: 13, color: C.sub, marginTop: 2 },
  addBtn:    { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
  addBtnText:{ color: '#FFF', fontWeight: '700', fontSize: 13 },
  chips:     { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  chip:      { flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  chipVal:   { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  chipLabel: { fontSize: 9,  fontWeight: '700', color: C.sub, textTransform: 'uppercase' },
  list:      { paddingHorizontal: 20 },
  empty:     { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#EEEFEE', alignItems: 'center', justifyContent: 'center' },
  emptyTitle:{ fontSize: 18, fontWeight: '800', color: C.text },
  emptySub:  { fontSize: 13, color: C.sub, textAlign: 'center', paddingHorizontal: 40 },
});

const m = StyleSheet.create({
  overlay:     { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:       { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, alignItems: 'center' },
  handle:      { width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, marginBottom: 20 },
  iconWrap:    { width: 56, height: 56, borderRadius: 18, backgroundColor: `${C.accent}15`, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title:       { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 6 },
  sub:         { fontSize: 13, color: C.sub, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  inputRow:    { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: C.bg, borderRadius: 16, padding: 16, gap: 12, marginBottom: 16 },
  input:       { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
  linkBtn:     { width: '100%', backgroundColor: C.accent, paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginBottom: 10 },
  linkBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  cancelBtn:   { paddingVertical: 12 },
  cancelText:  { color: C.sub, fontWeight: '700', fontSize: 14 },
});
