import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cercosporaImg = require('../../assets/images/pics/Cercospora Leaf Spot.png');
const laceBugImg    = require('../../assets/images/pics/Eggplant Lace Bug.png');
const leafRollerImg = require('../../assets/images/pics/Eggplant Leaf Roller.png');

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

const DISEASE_DATA = {
  'cercospora leaf spot': {
    severity: 'Moderate',
    severityColor: C.amber,
    recovery: '10–14 days',
    summary: 'Fungal leaf spot causing circular brown lesions with gray centers. Leaves may turn yellow and drop prematurely if untreated.',
    actions: [
      'Remove and destroy infected lower leaves',
      'Spray organic neem oil or copper fungicide',
      'Water at the plant base to keep foliage dry',
    ],
  },
  'eggplant lace bug': {
    severity: 'High',
    severityColor: C.red,
    recovery: '7–10 days',
    summary: 'Small insects feeding on leaf undersides, causing yellow stippling, chlorosis, and dark specks.',
    actions: [
      'Spray insecticidal soap or neem oil under leaves',
      'Introduce beneficial ladybugs or lacewings',
      'Clear weeds around the planting area',
    ],
  },
  'eggplant leaf roller': {
    severity: 'Moderate',
    severityColor: C.amber,
    recovery: '5–8 days',
    summary: 'Caterpillars rolling leaves with silken webbing and feeding on green tissue from within the roll.',
    actions: [
      'Handpick and destroy rolled leaf nests',
      'Apply Bacillus thuringiensis (Bt) in the evening',
      'Maintain clean inter-row spacing',
    ],
  },
  'healthy': {
    severity: 'Optimal',
    severityColor: C.green,
    recovery: 'Normal',
    summary: 'Crop foliage is vibrant and shows healthy, normal physiological development.',
    actions: [
      'Maintain regular watering schedule',
      'Keep soil adequately mulched',
      'Continue routine weekly monitoring',
    ],
  },
};

function resolveDisease(name) {
  if (!name) return DISEASE_DATA['healthy'];
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(DISEASE_DATA)) {
    if (lower.includes(key)) return val;
  }
  return {
    severity: 'Monitoring',
    severityColor: C.amber,
    recovery: '7–10 days',
    summary: 'Early-stage leaf stress detected. Ongoing monitoring recommended.',
    actions: [
      'Inspect undersides of affected leaves',
      'Apply mild organic neem oil spray',
      'Avoid over-watering the soil',
    ],
  };
}

function resolveImage(name, customImage) {
  if (customImage) {
    return typeof customImage === 'string' ? { uri: customImage } : customImage;
  }
  if (!name) return cercosporaImg;
  const lower = name.toLowerCase();
  if (lower.includes('cercospora')) return cercosporaImg;
  if (lower.includes('lace') || lower.includes('bug')) return laceBugImg;
  if (lower.includes('roller')) return leafRollerImg;
  return cercosporaImg;
}

export default function DiseaseDiagnosisPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const deviceId      = params?.deviceId ?? null;
  const tempKey       = params?.tempKey ?? null;
  const rawRecord     = params?.record ?? null;
  const rawPrediction = params?.prediction ?? null;
  const imageUri      = params?.imageUri ? decodeURIComponent(params.imageUri) : null;

  const [record, setRecord] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (tempKey) {
          const raw = await AsyncStorage.getItem(tempKey);
          if (raw) setRecord(JSON.parse(raw));
        } else if (rawRecord) {
          setRecord(typeof rawRecord === 'string' ? JSON.parse(rawRecord) : rawRecord);
        } else if (deviceId) {
          const raw = await AsyncStorage.getItem('@agrivision_default_devices_v3');
          if (raw) {
            const map = JSON.parse(raw);
            if (map[deviceId]?.[0]) setRecord(map[deviceId][0]);
          }
        }
      } catch (e) {
        console.warn('Record parsing failed', e);
      }
    })();
  }, [tempKey, rawRecord, deviceId]);

  const diseaseName = useMemo(() => {
    if (rawPrediction) return String(decodeURIComponent(rawPrediction));
    if (record) {
      const p = record.prediction ?? record.predicted_class ?? record.model_prediction ?? record.class ?? null;
      if (p) return typeof p === 'object' ? (p.class ?? p.label) : String(p);
    }
    return 'Cercospora Leaf Spot';
  }, [record, rawPrediction]);

  const data = useMemo(() => resolveDisease(diseaseName), [diseaseName]);
  const leaf = useMemo(() => resolveImage(diseaseName, imageUri || record?.image), [diseaseName, imageUri, record?.image]);

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 16 }]}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Diagnosis</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Photo Card ── */}
        <View style={styles.imageCard}>
          <Image source={leaf} style={styles.image} resizeMode="cover" />
          <View style={styles.imageBadge}>
            <Ionicons name="shield-checkmark" size={12} color={C.lime} />
            <Text style={styles.imageBadgeText}>95% Match</Text>
          </View>
        </View>

        {/* ── Result Card ── */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.conditionTitle}>{diseaseName}</Text>
              <Text style={styles.sourceText}>
                {deviceId ? `Sensor #${deviceId}` : 'Vision Pro Scan'}
              </Text>
            </View>
            <View style={[styles.severityPill, { backgroundColor: `${data.severityColor}15` }]}>
              <View style={[styles.dot, { backgroundColor: data.severityColor }]} />
              <Text style={[styles.severityText, { color: data.severityColor }]}>
                {data.severity}
              </Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricVal}>{data.recovery}</Text>
              <Text style={styles.metricLabel}>Est. Recovery</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: data.severityColor }]}>{data.severity}</Text>
              <Text style={styles.metricLabel}>Severity</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricVal}>Copper/Bt</Text>
              <Text style={styles.metricLabel}>Treatment</Text>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>SUMMARY</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>

          {/* Actions */}
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>RECOMMENDED ACTIONS</Text>
          <View style={styles.actionsList}>
            {data.actions.map((act, i) => (
              <View key={i} style={styles.actionRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.actionText}>{act}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Done Button ── */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.text,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  imageCard: {
    width: '100%',
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EAECE9',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 35, 23, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  imageBadgeText: {
    color: C.lime,
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  conditionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
    lineHeight: 26,
  },
  sourceText: {
    fontSize: 12,
    color: C.sub,
    marginTop: 2,
    fontWeight: '600',
  },
  severityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
  },
  metricLabel: {
    fontSize: 10,
    color: C.sub,
    fontWeight: '700',
  },
  metricDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: C.border,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: C.sub,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#3D4D42',
    fontWeight: '500',
  },
  actionsList: {
    gap: 10,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: `${C.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: C.accent,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: C.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  doneBtn: {
    backgroundColor: C.accent,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
