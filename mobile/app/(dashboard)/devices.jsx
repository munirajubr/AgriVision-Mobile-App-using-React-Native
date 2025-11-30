// app/(dashboard)/devices.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../../assets/styles/devices.styles';
import { useAuthStore } from '../../store/authStore';

/**
 * Endpoints
 */
const DEVICES_API = 'https://ml-flask-model.onrender.com/api/devices';
const ADD_API = 'https://agrivision-mobile-app-using-react-native.onrender.com/api/devices/add';
const REMOVE_API = 'https://agrivision-mobile-app-using-react-native.onrender.com/api/devices/remove';

const STORAGE_KEY_BASE = '@devices_with_details_v1_';

// safe getter
const safeGet = (obj, path, fallback = undefined) => {
  try {
    return path.split('.').reduce((s, p) => (s && s[p] !== undefined ? s[p] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizeImageCandidate = (candidate) => {
  if (!candidate) return null;
  if (typeof candidate !== 'string') return null;
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
    rec.image ??
    rec.image_base64 ??
    rec.image_url ??
    safeGet(rec, 'img') ??
    safeGet(rec, 'photo') ??
    safeGet(rec, 'saved_file') ??
    null;
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

  // preferred: { devices: { id: [records] } }
  if (respBody.devices && typeof respBody.devices === 'object' && !Array.isArray(respBody.devices)) {
    const out = {};
    for (const [id, arr] of Object.entries(respBody.devices)) {
      if (!Array.isArray(arr)) continue;
      out[id] = arr.map(normalizeRecord).filter(Boolean);
    }
    return out;
  }

  // { devices: [ { device_id: "...", ... }, ... ] }
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

  // If respBody is array (ids or objects)
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

  // fallback single device object
  const maybeId = respBody.device_id ?? respBody.deviceId ?? respBody.id ?? null;
  if (maybeId) {
    return { [String(maybeId)]: [normalizeRecord(respBody)] };
  }

  return {};
};

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

export default function DevicesScreen() {
  const { user } = useAuthStore();
  const username = user ? (user.username || user.email || null) : null;

  const [devicesMap, setDevicesMap] = useState({}); // { deviceId: [records] }
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add device UI
  const [formVisible, setFormVisible] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [adding, setAdding] = useState(false);

  // inline menu state
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);

  // history modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeviceId, setModalDeviceId] = useState(null);
  const [modalRecords, setModalRecords] = useState([]);

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

  const fetchDevices = useCallback(async () => {
    if (!username) {
      setDevicesMap({});
      setLoading(false);
      return;
    }

    setRefreshing(true);
    setLoading(true);

    try {
      const resp = await retryRequest(
        () => axios.post(DEVICES_API, { username }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }),
        2,
        600
      );

      const body = resp.data;
      const normalized = normalizeDevicesResponse(body);
      setDevicesMap(normalized);
      await cacheDevices(normalized);
    } catch (err) {
      console.error('Failed to fetch devices:', err?.response ?? err);
      const isNetwork = err?.message === 'Network Error' || err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
      if (isNetwork) {
        Alert.alert('Network error', 'Cannot reach devices API. Check network or API availability.');
      } else {
        const serverMsg = err?.response?.data?.error || err?.response?.data?.message || null;
        const status = err?.response?.status;
        Alert.alert('Error', status ? `Server returned ${status}${serverMsg ? ': ' + serverMsg : ''}` : (serverMsg || 'Failed to fetch devices'));
      }
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [username, storageKey]);

  const onRefresh = async () => {
    await fetchDevices();
  };

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

  // Add device: optimistic update + POST to ADD_API
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
        // backend didn't return full map, refetch to sync
        fetchDevices();
      }
      setFormVisible(false);
      setNewDeviceId('');
    } catch (err) {
      setDevicesMap(prev);
      await cacheDevices(prev);
      console.error('Add device failed:', err?.response ?? err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || null;
      Alert.alert('Add failed', serverMsg || 'Failed to add device. Try again.');
    } finally {
      setAdding(false);
    }
  };

  // Remove device: confirmation -> DELETE with JSON body { username, deviceId }
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
      // axios.delete with body: pass data in config
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
        // if backend didn't return updated map, refetch
        fetchDevices();
      }
    } catch (err) {
      setDevicesMap(prev);
      await cacheDevices(prev);
      console.error('Remove device failed:', err?.response ?? err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || null;
      Alert.alert('Remove failed', serverMsg || 'Failed to remove device. Try again.');
    } finally {
      setMenuVisibleFor(null);
    }
  };

  const openMenuFor = (deviceId) => setMenuVisibleFor(deviceId);
  const closeMenu = () => setMenuVisibleFor(null);

  const DeviceCard = ({ deviceId }) => {
    const rec = latestRecordFor(deviceId);
    return (
      <View style={localStyles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={localStyles.title}>{`Device ${deviceId}`}</Text>

          <TouchableOpacity onPress={() => openMenuFor(deviceId)} style={{ padding: 6 }}>
            <Text style={{ fontSize: 20 }}>⋯</Text>
          </TouchableOpacity>
        </View>

        {menuVisibleFor === deviceId && (
          <View style={localStyles.inlineMenu}>
            <TouchableOpacity
              onPress={() => {
                closeMenu();
                onRemoveDeviceConfirmed(deviceId);
              }}
              style={localStyles.menuItem}
            >
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeMenu();
              }}
              style={localStyles.menuItem}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={localStyles.imageContainer}>
          {rec?.image ? (
            <Image source={{ uri: rec.image }} style={localStyles.image} resizeMode="cover" />
          ) : (
            <View style={[localStyles.image, localStyles.noImage]}>
              <Text style={{ color: '#666' }}>No image</Text>
            </View>
          )}
        </View>

        <View style={localStyles.infoRow}>
          <View style={localStyles.infoCol}>
            <Text style={localStyles.label}>Temperature</Text>
            <Text style={localStyles.value}>{rec?.temperature != null ? `${rec.temperature}°C` : '--'}</Text>
          </View>

          <View style={localStyles.infoCol}>
            <Text style={localStyles.label}>Soil moisture</Text>
            <Text style={localStyles.value}>{rec?.soil_moisture != null ? `${rec.soil_moisture}%` : '--'}</Text>
          </View>

          <View style={localStyles.infoCol}>
            <Text style={localStyles.label}>Humidity</Text>
            <Text style={localStyles.value}>{rec?.humidity != null ? `${rec.humidity}%` : '--'}</Text>
          </View>
        </View>

        <View style={localStyles.metaRow}>
          <Text style={localStyles.metaLabel}>Captured</Text>
          <Text style={localStyles.metaValue}>{rec?.created_at ? String(rec.created_at) : 'Unknown'}</Text>
        </View>

        <View style={localStyles.predictionRow}>
          <Text style={localStyles.predLabel}>Prediction</Text>
          <Text style={localStyles.predValue}>
            {rec?.prediction ? (typeof rec.prediction === 'object' ? rec.prediction.class ?? JSON.stringify(rec.prediction) : String(rec.prediction)) : 'No prediction'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <TouchableOpacity onPress={() => openHistory(deviceId)} style={localStyles.debugButton}>
            <Text style={localStyles.debugText}>View history</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert('Raw data', JSON.stringify(rec?.raw ?? 'No data', null, 2));
            }}
            style={localStyles.debugButton}
          >
            <Text style={localStyles.debugText}>View raw</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Top bar with Add button
  const TopBar = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>Connected Devices</Text>
      <TouchableOpacity onPress={() => setFormVisible(true)} style={{ padding: 8 }}>
        <Text style={{ color: '#007bff', fontWeight: '700' }}>+ Device</Text>
      </TouchableOpacity>
    </View>
  );

  if (!username) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Please log in to view devices.</Text>
      </View>
    );
  }

  if (loading) {
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
          <TopBar />
          <Text style={styles.sectionTitleSmall}>{`Total: ${deviceIds.length}`}</Text>

          {deviceIds.length > 0 ? deviceIds.map((id) => <DeviceCard key={id} deviceId={id} />) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No devices connected yet</Text>
              <Text style={styles.emptySubtext}>Add a device using + Device</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Device Popup (centered card) */}
      <Modal
        visible={formVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setFormVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFormVisible(false)}>
          <View style={localStyles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={localStyles.modalContainer}
        >
          <View style={localStyles.popupCard}>
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
                style={localStyles.input}
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
                style={[localStyles.actionButton, localStyles.cancelButton]}
              >
                <Text style={localStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onAddDevice}
                style={[localStyles.actionButton, localStyles.addButton, { marginLeft: 10 }]}
                disabled={adding}
              >
                <Text style={localStyles.addText}>{adding ? 'Adding...' : 'Add'}</Text>
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
                <Text>Prediction: {item.prediction ? (typeof item.prediction === 'object' ? item.prediction.class ?? JSON.stringify(item.prediction) : String(item.prediction)) : 'No prediction'}</Text>

                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: '100%', height: 160, marginTop: 8, borderRadius: 6 }} resizeMode="cover" />
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

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f3f3',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  label: {
    color: '#666',
    fontSize: 12,
  },
  value: {
    fontWeight: '700',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  metaLabel: {
    color: '#888',
    fontSize: 12,
  },
  metaValue: {
    color: '#333',
    fontSize: 12,
  },
  predictionRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  predLabel: {
    color: '#666',
    fontSize: 12,
  },
  predValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  debugButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  debugText: {
    color: '#007bff',
  },
  inlineMenu: {
    position: 'absolute',
    right: 12,
    top: 28,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    zIndex: 999,
    paddingVertical: 6,
    minWidth: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  /* modal popup specific */
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
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    color: '#333',
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#007bff',
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
  },
});
