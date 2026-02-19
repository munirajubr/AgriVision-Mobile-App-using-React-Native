import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

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
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

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
      : 'Monitoring...';

  return (
    <View style={[styles.card, { backgroundColor: COLORS.cardBackground, borderWidth: 0 }]}>
      {/* Header with ID and Menu */}
      <View style={styles.header}>
        <View style={[styles.idBadge, { backgroundColor: `${COLORS.primary}10` }]}>
          <Text style={[styles.idText, { color: COLORS.primary }]}>Device #{deviceId}</Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation && e.stopPropagation();
            onOpenMenu();
          }}
          style={styles.menuBtn}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Inline Menu */}
      {menuVisible && (
        <View style={[styles.inlineMenu, { backgroundColor: COLORS.cardBackground, shadowColor: COLORS.shadow }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              onDelete();
              onCloseMenu();
            }}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={[styles.deleteText, { color: COLORS.error }]}>Remove Device</Text>
          </TouchableOpacity>
          <View style={[styles.menuDivider, { backgroundColor: COLORS.secondaryBackground }]} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              onCloseMenu();
            }}
          >
            <Text style={[styles.cancelText, { color: COLORS.textTertiary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Vision Display */}
      <View style={[styles.imageWrap, { backgroundColor: COLORS.secondaryBackground }]}>
        {record?.image ? (
          <Image source={{ uri: record.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name="camera-outline" size={32} color={COLORS.textTertiary} />
            <Text style={[styles.noImageText, { color: COLORS.textTertiary }]}>Waiting for vision data</Text>
          </View>
        )}
      </View>

      {/* Analytics Row */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricBox, { backgroundColor: isDarkMode ? '#2C1717' : '#FFF5F5' }]}>
          <Ionicons name="thermometer" size={16} color={COLORS.error} />
          <Text style={[styles.metricLabel, { color: COLORS.textSecondary }]}>Temp</Text>
          <Text style={[styles.metricValue, { color: COLORS.error }]}>{temperature}</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: isDarkMode ? '#17212C' : '#EBF8FF' }]}>
          <Ionicons name="water" size={16} color={COLORS.info} />
          <Text style={[styles.metricLabel, { color: COLORS.textSecondary }]}>Soil</Text>
          <Text style={[styles.metricValue, { color: COLORS.info }]}>{soil}</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: isDarkMode ? '#172C1E' : '#F0FFF4' }]}>
          <Ionicons name="leaf" size={16} color={COLORS.primary} />
          <Text style={[styles.metricLabel, { color: COLORS.textSecondary }]}>Health</Text>
          <Text style={[styles.metricValue, { color: COLORS.primary }]}>{humidity}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: COLORS.secondaryBackground }]} />

      {/* Prediction & Action */}
      <View style={styles.predictionArea}>
        <View style={styles.predContent}>
          <Text style={[styles.predTitle, { color: COLORS.textTertiary }]}>LATEST STATUS</Text>
          <Text style={[styles.predValue, { color: COLORS.textPrimary }]} numberOfLines={1}>{prediction}</Text>
          <Text style={[styles.timestamp, { color: COLORS.textTertiary }]}>{capturedDisplay}</Text>
        </View>
        <TouchableOpacity
          onPress={onDiagnose}
          style={[styles.diagnoseBtn, { backgroundColor: COLORS.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.diagnoseText}>Analyze</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatRelative(input) {
  if (!input) return 'Inactive';
  const date = new Date(input);
  if (isNaN(date.getTime())) return 'Recently';
  const diffSec = Math.floor((new Date() - date) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec/60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec/3600)}h ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    position: 'relative',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  idBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  idText: { fontSize: 13, fontWeight: '700' },
  menuBtn: { padding: 4 },
  inlineMenu: {
    position: 'absolute',
    right: 16,
    top: 50,
    borderRadius: 18,
    padding: 8,
    width: 190,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  deleteText: { fontWeight: '700', fontSize: 14 },
  cancelText: { fontWeight: '600', fontSize: 14 },
  menuDivider: { height: 1.5, marginVertical: 4 },
  imageWrap: { width: '100%', height: 160, borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  image: { width: '100%', height: '100%' },
  noImage: { justifyContent: 'center', alignItems: 'center', gap: 8 },
  noImageText: { fontSize: 13, fontWeight: '500' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricBox: { flex: 1, padding: 12, borderRadius: 18, alignItems: 'center', gap: 4 },
  metricLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  metricValue: { fontSize: 15, fontWeight: '800' },
  divider: { height: 1.5, marginBottom: 16 },
  predictionArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  predContent: { flex: 1 },
  predTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  predValue: { fontSize: 17, fontWeight: '700', marginTop: 2 },
  timestamp: { fontSize: 12, marginTop: 2 },
  diagnoseBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 },
  diagnoseText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
