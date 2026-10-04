import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { useDashboardStore } from '../../store/dashboardStore';
import SafeScreen from '../../components/SafeScreen';
import DashboardHome from '../(dashboard)/index';
import DevicesScreen from '../(dashboard)/devices';

const { width } = Dimensions.get('window');

const DOCK_H   = 64;
const DOCK_PAD = 6;
const DOCK_W   = 200;   // wider to fit icon + label for both tabs
const ITEM_W   = (DOCK_W - DOCK_PAD * 2) / 2;

const TABS = [
  { key: 'home',    icon: 'grid',          iconOff: 'grid-outline',         label: 'Dashboard' },
  { key: 'devices', icon: 'hardware-chip', iconOff: 'hardware-chip-outline', label: 'IoT' },
];

export default function DashboardPage() {
  const COLORS = getColors();
  const { activeTab, setActiveTab } = useDashboardStore();

  const tabIndex = activeTab === 'devices' ? 1 : 0;

  // Shared blob X — drives liquid slide
  const blobX    = useRef(new Animated.Value(tabIndex * ITEM_W)).current;
  const blobSX   = useRef(new Animated.Value(1)).current;
  const blobSY   = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  const handleTabChange = (key) => {
    if (activeTab === key) return;

    const toIndex = key === 'devices' ? 1 : 0;

    Animated.parallel([
      // Blob slides with spring
      Animated.spring(blobX, {
        toValue: toIndex * ITEM_W,
        friction: 7,
        tension: 52,
        useNativeDriver: true,
      }),
      // Liquid squish sequence
      Animated.sequence([
        Animated.parallel([
          Animated.timing(blobSX, { toValue: 1.3,  duration: 100, useNativeDriver: true }),
          Animated.timing(blobSY, { toValue: 0.75, duration: 100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(blobSX, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
          Animated.spring(blobSY, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
        ]),
      ]),
      // Content fade
      Animated.sequence([
        Animated.timing(contentFade, { toValue: 0.6, duration: 90,  useNativeDriver: true }),
        Animated.timing(contentFade, { toValue: 1,   duration: 200, useNativeDriver: true }),
      ]),
    ]).start();

    setActiveTab(key);
  };

  useEffect(() => {
    blobX.setValue(tabIndex * ITEM_W);
  }, []);

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>

        {/* Main Content */}
        <Animated.View style={[styles.content, { opacity: contentFade }]}>
          {activeTab === 'home' ? <DashboardHome /> : <DevicesScreen />}
        </Animated.View>

        {/* ── Floating Mini Dock ── same DNA as bottom nav: dark pill, lime blob, icon-only */}
        <View style={styles.dockWrapper} pointerEvents="box-none">
          <View style={styles.dock}>

            {/* Liquid Blob */}
            <Animated.View
              style={[
                styles.blob,
                {
                  width: ITEM_W,
                  transform: [
                    { translateX: blobX },
                    { scaleX: blobSX },
                    { scaleY: blobSY },
                  ],
                },
              ]}
            />

            {/* Icon buttons */}
            {TABS.map((tab) => {
              const isFocused = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.tabItem}
                  onPress={() => handleTabChange(tab.key)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={isFocused ? tab.icon : tab.iconOff}
                    size={20}
                    color={isFocused ? '#C8F572' : '#5E7A65'}
                  />
                  <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1 },

  // Floating mini dock — sits directly above the bottom nav bar
  dockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 100 : 94,
    alignItems: 'center',
    zIndex: 900,
  },
  dock: {
    width: DOCK_W,
    height: DOCK_H,
    borderRadius: DOCK_H / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DOCK_PAD,
    backgroundColor: '#132317',         // same dark forest as bottom nav
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  blob: {
    position: 'absolute',
    top:    DOCK_PAD,
    bottom: DOCK_PAD,
    left:   DOCK_PAD,
    borderRadius: (DOCK_H - DOCK_PAD * 2) / 2,
    backgroundColor: '#1E4D30',        // same active blob as bottom nav
    shadowColor: '#84CC16',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  tabItem: {
    width: ITEM_W,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    zIndex: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5E7A65',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#C8F572',
    fontWeight: '800',
  },
});
