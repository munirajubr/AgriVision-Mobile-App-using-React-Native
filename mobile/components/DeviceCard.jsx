import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

/**
 * Props:
 * - deviceId: string
 * - record: normalized record object (may be null)
 * - menuVisible: boolean
 * - onOpenMenu: () => void
 * - onCloseMenu: () => void
 * - onHistory: () => void        // NEW - opens history modal in parent
 * - onDelete: () => void
 * - onDiagnose: () => void
 *
 * NOTE: card tap does nothing by default (no onPress) - menu/history is explicit.
 */
export default function DeviceCard({
  deviceId,
  record,
  menuVisible = false,
  onOpenMenu = () => {},
  onCloseMenu = () => {},
  onHistory = () => {},
  onDelete = () => {},
  onDiagnose = () => {},
}) {
  const temperature = record?.temperature != null ? `${record.temperature}°C` : '--';
  const soil = record?.soil_moisture != null ? `${record.soil_moisture}%` : '--';
  const humidity = record?.humidity != null ? `${record.humidity}%` : '--';
  const rawCaptured = record?.created_at ?? record?.predicted_at ?? record?._id ?? null;
  const capturedDisplay = formatRelative(rawCaptured);
  const prediction =
    record?.prediction
      ? typeof record.prediction === 'object'
        ? record.prediction.class ?? JSON.stringify(record.prediction)
        : String(record.prediction)
      : 'No prediction';

  return (
    <View style={styles.card}>

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>{`Device ${deviceId}`}</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation && e.stopPropagation();
            onOpenMenu();
          }}
          style={styles.menuBtn}
        >
          <Text style={styles.menuText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* inline menu */}
      {menuVisible && (
        <View style={styles.inlineMenu}>
      

          <TouchableOpacity
            style={styles.menuItem}
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              onDelete();
              onCloseMenu();
            }}
          >
            <Text style={{ color: COLORS.destructive || 'red', fontWeight: '700' }}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              onCloseMenu();
            }}
          >
            <Text style={{ color: COLORS.textSecondary || '#444' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* image */}
      <View style={styles.imageWrap}>
        {record?.image ? (
          <Image source={{ uri: record.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
      </View>

      {/* metrics row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Temperature</Text>
          <Text style={styles.metricValue}>{temperature}</Text>
        </View>

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Soil moisture</Text>
          <Text style={styles.metricValue}>{soil}</Text>
        </View>

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Humidity</Text>
          <Text style={styles.metricValue}>{humidity}</Text>
        </View>
      </View>

      {/* captured row */}
      <View style={styles.capturedRow}>
        <Text style={styles.capturedLabel}>Captured</Text>
        <Text style={styles.capturedValue} numberOfLines={1}>{capturedDisplay}</Text>
      </View>

      <View style={styles.divider} />

      {/* prediction area */}
      <View style={styles.predictionArea}>
        <View style={styles.predLeft}>
          <Text style={styles.predTitle}>Prediction</Text>
          <Text style={styles.predValueBig}>{prediction}</Text>
        </View>

        <View style={styles.predRight}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              onDiagnose();
            }}
            style={styles.diagnoseBtn}
            activeOpacity={0.9}
          >
            <Ionicons name="medical" size={16} color="#fff" />
            <Text style={styles.diagnoseText}>Diagnose</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------- Helper: formatRelative (same as before) ---------- */
function formatRelative(input) {
  if (!input && input !== 0) return 'Unknown';

  let date;
  if (typeof input === 'number') {
    date = input > 1e12 ? new Date(input) : new Date(input * 1000);
  } else if (typeof input === 'string') {
    const num = Number(input);
    if (!Number.isNaN(num)) {
      date = num > 1e12 ? new Date(num) : new Date(num * 1000);
    } else {
      date = new Date(input);
      if (isNaN(date)) {
        const oidMatch = /^([0-9a-fA-F]{8})/.exec(input);
        if (oidMatch) {
          try {
            const ts = parseInt(oidMatch[1], 16);
            date = new Date(ts * 1000);
          } catch (e) {
            return String(input);
          }
        } else {
          return String(input);
        }
      }
    }
  } else {
    try {
      date = new Date(input);
    } catch {
      return 'Unknown';
    }
  }

  if (!date || isNaN(date.getTime())) return 'Unknown';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return date.toLocaleString();

  const sec = Math.floor(diffMs / 1000);
  if (sec < 6) return 'just now';
  if (sec < 60) return `${sec} sec${sec > 1 ? 's' : ''} ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min > 1 ? 's' : ''} ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) {
    const remMin = min % 60;
    if (remMin === 0) return `${hr} hr${hr > 1 ? 's' : ''} ago`;
    return `${hr} hr ${remMin} min ago`;
  }

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return 'Yesterday';
  }

  const opts = { weekday: 'short', day: 'numeric', month: 'short' };
  if (date.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
  try {
    return date.toLocaleDateString(undefined, opts);
  } catch {
    return date.toDateString();
  }
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground || '#fff',
    marginVertical: 12,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#00000050',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
    position: 'relative',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary || '#111' },
  menuBtn: { padding: 6 },
  menuText: { fontSize: 20, color: COLORS.textSecondary || '#444' },

  inlineMenu: {
    position: 'absolute',
    right: 18,
    top: 18,
    backgroundColor: COLORS.cardBackground || '#fff',
    borderRadius: 10,
    elevation: 6,
    paddingVertical: 6,
    minWidth: 140,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 12 },

  imageWrap: { width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', marginBottom: 16, backgroundColor: '#f3f3f3' },
  image: { width: '100%', height: '100%' },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  noImageText: { color: '#777' },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, paddingHorizontal: 4 },
  metricCol: { alignItems: 'flex-start', width: '33%' },
  metricLabel: { color: '#9aa0a6', fontSize: 14, marginBottom: 6 },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#111' },

  capturedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, marginBottom: 12 },
  capturedLabel: { color: '#9aa0a6', fontSize: 12 },
  capturedValue: { color: '#666', fontSize: 12, textAlign: 'right', maxWidth: '70%' },

  divider: { height: 1, backgroundColor: '#eee', marginBottom: 12 },

  predictionArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  predLeft: { flex: 1, paddingRight: 8 },
  predTitle: { color: '#9aa0a6', fontSize: 14, marginBottom: 6 },
  predValueBig: { fontSize: 18, fontWeight: '800', color: '#111' },

  predRight: { width: 110, alignItems: 'flex-end' },
  diagnoseBtn: { backgroundColor: COLORS.primary || '#037B21', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  diagnoseText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
});
