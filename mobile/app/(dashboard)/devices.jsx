// app/(dashboard)/devices.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../../assets/styles/devices.styles';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import DeviceCard from '../../components/DeviceCard';

// Update these if your backend URLs differ
const DEVICES_API = 'https://ml-flask-model.onrender.com/api/devices';
const ADD_API = 'https://agrivision-mobile-app-using-react-native.onrender.com/api/devices/add';
const REMOVE_API = 'https://agrivision-mobile-app-using-react-native.onrender.com/api/devices/remove';

const STORAGE_KEY_BASE = '@devices_with_details_v1_';

// small retry wrapper
async function retryRequest(fn, attempts = 2, delayMs = 600) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

/* ---------- Normalizers (unchanged logic) ---------- */
const safeGet = (obj, path, fallback = undefined) => {
  try {
    return path.split('.').reduce((s, p) => (s && s[p] !== undefined ? s[p] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
};
const normalizeImageCandidate = (candidate) => {
  if (!candidate || typeof candidate !== 'string') return null;
  if (candidate.startsWith('data:') || candidate.startsWith('http')) return candidate;
  return `data:image/jpeg;base64,${candidate}`;
};
const normalizeRecord = (rec) => {
  if (!rec || typeof rec !== 'object') return null;
  const soil = rec.soil_moisture ?? rec.soil ?? rec.moisture ?? null;
  const temp = rec.temperature ?? rec.temp ?? null;
  const humidity = rec.humidity ?? rec.hum ?? rec.humid ?? null;
  const created_at = rec.created_at ?? rec.predicted_at ?? rec._id ?? null;
  const imageCandidate =
    rec.image ?? rec.image_base64 ?? rec.image_url ?? safeGet(rec, 'img') ?? safeGet(rec, 'photo') ?? null;
  const image = normalizeImageCandidate(imageCandidate);
  const predObj =
    safeGet(rec, 'model_prediction_raw.prediction') ||
    safeGet(rec, 'model_prediction_raw') ||
    safeGet(rec, 'model_prediction') ||
    safeGet(rec, 'prediction') ||
    null;
  return {
    soil_moisture: soil,
    temperature: temp,
    humidity,
    created_at,
    image,
    prediction: predObj,
    raw: rec,
  };
};
const normalizeDevicesResponse = (respBody) => {
  if (!respBody) return {};
  if (respBody.devices && typeof respBody.devices === 'object' && !Array.isArray(respBody.devices)) {
    const out = {};
    for (const [id, arr] of Object.entries(respBody.devices)) {
      if (!Array.isArray(arr)) continue;
      out[id] = arr.map(normalizeRecord).filter(Boolean);
    }
    return out;
  }
  if (Array.isArray(respBody.devices)) {
    const out = {};
    for (const item of respBody.devices) {
      const id = item.device_id ?? item.deviceId ?? item.id ?? null;
      if (!id) continue;
      out[id] = out[id] || [];
      out[id].push(normalizeRecord(item));
    }
    return out;
  }
  if (Array.isArray(respBody)) {
    const out = {};
    for (const item of respBody) {
      if (typeof item === 'string' || typeof item === 'number') {
        out[String(item)] = [];
      } else if (item && typeof item === 'object') {
        const id = item.device_id ?? item.deviceId ?? item.id ?? null;
        if (id) {
          out[id] = out[id] || [];
          out[id].push(normalizeRecord(item));
        }
      }
    }
    return out;
  }
  const maybeId = respBody.device_id ?? respBody.deviceId ?? respBody.id ?? null;
  if (maybeId) return { [String(maybeId)]: [normalizeRecord(respBody)] };
  return {};
};

/* ------------------ Main component ------------------ */
export default function DevicesScreen() {
  const { user } = useAuthStore();
  const username = user ? (user.username || user.email || null) : null;
  const router = useRouter();

  const [devicesMap, setDevicesMap] = useState({}); // { deviceId: [records] }
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [adding, setAdding] = useState(false);
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeviceId, setModalDeviceId] = useState(null);
  const [modalRecords, setModalRecords] = useState([]);
  const [lastFetchError, setLastFetchError] = useState(null);

  const storageKey = username ? `${STORAGE_KEY_BASE}${username}` : `${STORAGE_KEY_BASE}anon`;

  useEffect(() => {
    (async () => {
      await loadCache();
      if (username) await fetchDevices();
      else setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const loadCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.devices) setDevicesMap(parsed.devices);
      }
    } catch (e) {
      console.warn('Failed to load cached device details', e);
    }
  };

  const cacheDevices = async (map) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify({ username, devices: map }));
    } catch (e) {
      console.warn('Failed to cache devices', e);
    }
  };

  // Primary fetch: try axios POST -> if Network Error, try fetch fallback -> then try candidate endpoints
  const fetchDevices = useCallback(async () => {
    if (!username) {
      setDevicesMap({});
      setLoading(false);
      return;
    }
    setRefreshing(true);
    setLoading(true);
    setLastFetchError(null);

    // 1) Try axios.post first (preferred)
    try {
      const resp = await retryRequest(
        () => axios.post(DEVICES_API, { username }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }),
        2,
        600
      );
      const normalized = normalizeDevicesResponse(resp?.data ?? null);
      setDevicesMap(normalized);
      await cacheDevices(normalized);
      setRefreshing(false);
      setLoading(false);
      return;
    } catch (errAxios) {
      // Log full axios error for debugging
      try {
        console.log('AXIOS ERROR JSON:', errAxios && errAxios.toJSON ? errAxios.toJSON() : errAxios);
      } catch (e) {
        console.log('AXIOS ERROR (fallback):', errAxios);
      }

      // If it was a network error (common in emulator), try fetch (native fetch)
      const isNetwork =
        errAxios?.message === 'Network Error' ||
        errAxios?.code === 'ECONNABORTED' ||
        errAxios?.message?.includes('timeout') ||
        (errAxios && !errAxios.response);

      if (isNetwork) {
        console.log('Axios reported network issue — trying fetch() fallback as diagnostic.');
        try {
          const f = await fetch(DEVICES_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });
          const text = await f.text();
          console.log('FETCH fallback status', f.status, 'body preview:', text.slice(0, 500));
          try {
            const body = JSON.parse(text);
            const normalized = normalizeDevicesResponse(body);
            setDevicesMap(normalized);
            await cacheDevices(normalized);
            setRefreshing(false);
            setLoading(false);
            return;
          } catch (parseErr) {
            console.warn('Fetch response parse failed', parseErr);
            // fallthrough to candidate attempts
          }
        } catch (errFetch) {
          console.log('FETCH fallback error', errFetch);
          // fallthrough to trying other endpoints
        }
      }
      // else continue to further candidate endpoints (maybe server expects different path/method)
    }

    // 2) Try multiple candidate endpoints/methods (handles 405 or alternative routes)
    const candidates = [
      { method: 'post', url: DEVICES_API, data: { username } },
      { method: 'get', url: DEVICES_API, params: { username } },
      { method: 'get', url: `${DEVICES_API}/list`, params: { username } },
      { method: 'post', url: `${DEVICES_API}/list`, data: { username } },
      { method: 'get', url: `${DEVICES_API}/get`, params: { username } },
      { method: 'post', url: `${DEVICES_API}/get`, data: { username } },
      { method: 'get', url: `${DEVICES_API}/${encodeURIComponent(username)}` },
      { method: 'get', url: `${DEVICES_API}?username=${encodeURIComponent(username)}` },
    ];

    let lastErr = null;
    for (const c of candidates) {
      try {
        let resp;
        if (c.method === 'post') {
          resp = await retryRequest(
            () => axios.post(c.url, c.data, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }),
            2,
            600
          );
        } else {
          resp = await retryRequest(() => axios.get(c.url, { params: c.params, timeout: 15000 }), 2, 600);
        }
        const normalized = normalizeDevicesResponse(resp?.data ?? null);
        setDevicesMap(normalized);
        await cacheDevices(normalized);
        setRefreshing(false);
        setLoading(false);
        return;
      } catch (err) {
        lastErr = err;
        try {
          console.warn(`Attempt failed ${c.method.toUpperCase()} ${c.url}`, err && err.toJSON ? err.toJSON() : err);
        } catch (e) {
          console.warn(`Attempt failed ${c.method.toUpperCase()} ${c.url}`, err);
        }
        const isNetworkAttempt =
          err?.message === 'Network Error' || err?.code === 'ECONNABORTED' || err?.message?.includes('timeout') || !err?.response;
        if (isNetworkAttempt) break; // stop trying if network-level issue
      }
    }

    console.error('All device fetch attempts failed:', lastErr);
    setLastFetchError(lastErr);
    const isNet =
      lastErr?.message === 'Network Error' ||
      lastErr?.code === 'ECONNABORTED' ||
      lastErr?.message?.includes('timeout') ||
      (lastErr && !lastErr.response);

    if (isNet) {
      Alert.alert('Network error', 'Cannot reach devices API. Check emulator/device network or use ngrok/tunnel.');
    } else {
      const serverMsg = lastErr?.response?.data?.error || lastErr?.response?.data?.message || null;
      const status = lastErr?.response?.status;
      Alert.alert('Error', status ? `Server returned ${status}${serverMsg ? ': ' + serverMsg : ''}` : (serverMsg || 'Failed to fetch devices'));
    }

    setRefreshing(false);
    setLoading(false);
  }, [username, storageKey]);

  const onRefresh = async () => fetchDevices();

  const openHistory = (deviceId) => {
    const recs = devicesMap[deviceId] || [];
    setModalDeviceId(deviceId);
    setModalRecords(recs);
    setModalVisible(true);
  };

  const latestRecordFor = (deviceId) => {
    const arr = devicesMap[deviceId] || [];
    return arr.length > 0 ? arr[0] : null;
  };

  // Add device (optimistic)
  const onAddDevice = async () => {
    if (!newDeviceId || !username) {
      Alert.alert('Error', 'Enter device ID and ensure you are logged in.');
      return;
    }
    const deviceIdStr = String(newDeviceId).trim();
    if (!deviceIdStr) {
      Alert.alert('Error', 'Device ID cannot be empty.');
      return;
    }
    setAdding(true);
    const prev = { ...devicesMap };
    const updated = { ...devicesMap, [deviceIdStr]: prev[deviceIdStr] ?? [] };
    setDevicesMap(updated);
    await cacheDevices(updated);

    try {
      const payload = { username, deviceId: deviceIdStr };
      const resp = await retryRequest(
        () => axios.post(ADD_API, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }),
        2,
        500
      );
      const respBody = resp?.data ?? null;
      if (respBody && respBody.devices) {
        const normalized = normalizeDevicesResponse(respBody);
        setDevicesMap(normalized);
        await cacheDevices(normalized);
      } else {
        await fetchDevices();
      }
      setFormVisible(false);
      setNewDeviceId('');
    } catch (err) {
      setDevicesMap(prev);
      await cacheDevices(prev);
      console.error('Add device failed:', err && err.toJSON ? err.toJSON() : err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || null;
      Alert.alert('Add failed', serverMsg || 'Failed to add device. Try again.');
    } finally {
      setAdding(false);
    }
  };

  // Remove device
  const onRemoveDeviceConfirmed = (deviceId) => {
    Alert.alert('Confirm delete', `Remove device ${deviceId} from your account?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => doRemoveDevice(deviceId),
      },
    ]);
  };

  const doRemoveDevice = async (deviceId) => {
    if (!username) {
      Alert.alert('Error', 'Not logged in');
      return;
    }
    const prev = { ...devicesMap };
    const updated = { ...devicesMap };
    delete updated[deviceId];
    setDevicesMap(updated);
    await cacheDevices(updated);

    try {
      const payload = { username, deviceId };
      const resp = await retryRequest(
        () => axios.delete(REMOVE_API, { headers: { 'Content-Type': 'application/json' }, data: payload, timeout: 15000 }),
        2,
        500
      );
      const respBody = resp?.data ?? null;
      if (respBody && respBody.devices) {
        const normalized = normalizeDevicesResponse(respBody);
        setDevicesMap(normalized);
        await cacheDevices(normalized);
      } else {
        await fetchDevices();
      }
    } catch (err) {
      setDevicesMap(prev);
      await cacheDevices(prev);
      console.error('Remove device failed:', err && err.toJSON ? err.toJSON() : err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || null;
      Alert.alert('Remove failed', serverMsg || 'Failed to remove device. Try again.');
    } finally {
      setMenuVisibleFor(null);
    }
  };

  const openMenuFor = (deviceId) => setMenuVisibleFor(deviceId);
  const closeMenu = () => setMenuVisibleFor(null);

  // navigate to diagnosis page with deviceId and record (encoded)
  const navigateToDiagnosis = async (deviceId) => {
  try {
    const rec = latestRecordFor(deviceId);
    const tempKey = `diag_${deviceId}_${Date.now()}`;
    if (rec) {
      await AsyncStorage.setItem(tempKey, JSON.stringify(rec.raw ?? rec));
    } else {
      await AsyncStorage.setItem(tempKey, JSON.stringify(null));
    }

    // push – try object form first; if your expo-router version doesn't support this, use the string form below
    try {
      router.push({ pathname: '/diseasediagnosis', params: { deviceId, tempKey } });
    } catch (e) {
      // fallback to query string
      router.push(`/diseasediagnosis?deviceId=${encodeURIComponent(deviceId)}&tempKey=${encodeURIComponent(tempKey)}`);
    }
  } catch (e) {
    console.error('navigateToDiagnosis failed', e);
    Alert.alert('Navigation error', 'Could not open diagnosis page.');
  }
};


  if (!username) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Please log in to view devices.</Text>
      </View>
    );
  }

  if (loading && Object.keys(devicesMap).length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading devices...</Text>
      </View>
    );
  }

  const deviceIds = Object.keys(devicesMap);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 24 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>Connected Devices</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => fetchDevices()} style={{ padding: 8 }}>
                <Text style={{ color: '#007bff', fontWeight: '700' }}>Refresh</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFormVisible(true)} style={{ padding: 8 }}>
                <Text style={{ color: '#007bff', fontWeight: '700' }}>+ Device</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitleSmall}>{`Total: ${deviceIds.length}`}</Text>

          {lastFetchError ? (
            <View style={{ marginVertical: 12, padding: 12, backgroundColor: '#ffecec', borderRadius: 8 }}>
              <Text style={{ color: '#b71c1c', marginBottom: 8 }}>Failed to fetch devices.</Text>
              <Text style={{ color: '#333', marginBottom: 8 }}>{String(lastFetchError?.message ?? lastFetchError)}</Text>
              <TouchableOpacity onPress={() => fetchDevices()} style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 8, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {deviceIds.length > 0 ? (
            deviceIds.map((id) => (
              <DeviceCard
                key={id}
                deviceId={id}
                record={latestRecordFor(id)}
                menuVisible={menuVisibleFor === id}
                onOpenMenu={() => openMenuFor(id)}
                onCloseMenu={() => closeMenu()}
                onHistory={() => openHistory(id)}
                onDelete={() => onRemoveDeviceConfirmed(id)}
                onDiagnose={() => navigateToDiagnosis(id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No devices connected yet</Text>
              <Text style={styles.emptySubtext}>Add a device using + Device</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Device Modal */}
      <Modal visible={formVisible} animationType="fade" transparent onRequestClose={() => setFormVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setFormVisible(false)}>
          <View style={fallbackLocal.modalBackdrop} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={fallbackLocal.modalContainer}>
          <View style={fallbackLocal.popupCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>Add Device</Text>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <Text style={{ color: '#888' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={{ marginBottom: 6 }}>Device ID</Text>
              <TextInput
                value={newDeviceId}
                onChangeText={setNewDeviceId}
                placeholder="Enter device ID (required)"
                style={fallbackLocal.input}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="done"
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
              <TouchableOpacity
                onPress={() => {
                  setFormVisible(false);
                  setNewDeviceId('');
                }}
                style={[fallbackLocal.actionButton, fallbackLocal.cancelButton]}
              >
                <Text style={fallbackLocal.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onAddDevice} style={[fallbackLocal.actionButton, fallbackLocal.addButton, { marginLeft: 10 }]} disabled={adding}>
                <Text style={fallbackLocal.addText}>{adding ? 'Adding...' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* History modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.container, { padding: 12 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{`History — Device ${modalDeviceId ?? ''}`}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#007bff' }}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={modalRecords}
            keyExtractor={(_, idx) => `${modalDeviceId}-${idx}`}
            renderItem={({ item, index }) => (
              <View style={{ marginBottom: 12, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}>
                <Text style={{ fontWeight: '700' }}>{`Record ${index + 1}`}</Text>
                <Text style={{ marginTop: 6 }}>Captured: {item.created_at ?? 'Unknown'}</Text>
                <Text>Temperature: {item.temperature ?? '--'}</Text>
                <Text>Soil moisture: {item.soil_moisture ?? '--'}</Text>
                <Text>Humidity: {item.humidity ?? '--'}</Text>
                <Text>
                  Prediction: {item.prediction ? (typeof item.prediction === 'object' ? item.prediction.class ?? JSON.stringify(item.prediction) : String(item.prediction)) : 'No prediction'}
                </Text>

                {item.image ? (
                  <View style={{ width: '100%', height: 160, marginTop: 8, borderRadius: 6, overflow: 'hidden' }}>
                    <Text>{/* image shown inside DeviceCard in list; here simple placeholder */}</Text>
                  </View>
                ) : null}

                <TouchableOpacity onPress={() => Alert.alert('Raw record', JSON.stringify(item.raw ?? item, null, 2))} style={{ marginTop: 8, alignSelf: 'flex-end' }}>
                  <Text style={{ color: '#007bff' }}>View raw</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

/* ---------------- fallback local styles ---------------- */
const fallbackLocal = {
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  actionButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  cancelText: { color: '#333', fontWeight: '700' },
  addButton: { backgroundColor: '#007bff' },
  addText: { color: '#fff', fontWeight: '700' },
};
