import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Platform, StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";
import { getColors } from "../../constants/colors";

const { width } = Dimensions.get("window");

// Same icons/labels as the sub-tab dock — dashboard icon for Home
const TAB_ROUTES = [
  { name: "index",   icon: "grid",          iconOff: "grid-outline",         label: "Dashboard" },
  { name: "market",  icon: "pricetag",       iconOff: "pricetag-outline",     label: "Market" },
  { name: "weather", icon: "cloudy",         iconOff: "cloudy-outline",       label: "Weather" },
  { name: "profile", icon: "person",         iconOff: "person-outline",       label: "Profile" },
];

// Taller pill to accommodate icon + label stacked
const DOCK_H   = 68;
const DOCK_PAD = 6;
const DOCK_W   = Math.min(width - 40, 380);
const ITEM_W   = (DOCK_W - DOCK_PAD * 2) / TAB_ROUTES.length;

function LiquidTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  const blobX  = useRef(new Animated.Value(state.index * ITEM_W)).current;
  const blobSX = useRef(new Animated.Value(1)).current;
  const blobSY = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(blobX, {
        toValue: state.index * ITEM_W,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(blobSX, { toValue: 1.28, duration: 110, useNativeDriver: true }),
          Animated.timing(blobSY, { toValue: 0.78, duration: 110, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(blobSX, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
          Animated.spring(blobSY, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [state.index]);

  return (
    <View
      style={[
        styles.wrapper,
        { bottom: Platform.OS === "ios" ? Math.max(insets.bottom + 6, 18) : 16 },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.dock}>

        {/* Liquid blob */}
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

        {/* Icon + Label — always visible, matching sub-tab style */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          if (options.href === null) return null;

          const isFocused = state.index === index;
          const meta = TAB_ROUTES.find((t) => t.name === route.name) ?? TAB_ROUTES[index];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.85}
              style={styles.tabItem}
            >
              <Ionicons
                name={isFocused ? meta.icon : meta.iconOff}
                size={20}
                color={isFocused ? "#C8F572" : "#5E7A65"}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {meta.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const COLORS = getColors();

  return (
    <Tabs
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: COLORS.background }}
    >
      <Tabs.Screen name="index"   options={{ title: "Dashboard" }} />
      <Tabs.Screen name="market"  options={{ title: "Market" }} />
      <Tabs.Screen name="weather" options={{ title: "Weather" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  dock: {
    width: DOCK_W,
    height: DOCK_H,
    borderRadius: DOCK_H / 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DOCK_PAD,
    backgroundColor: "#132317",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  blob: {
    position: "absolute",
    top:    DOCK_PAD,
    bottom: DOCK_PAD,
    left:   DOCK_PAD,
    borderRadius: (DOCK_H - DOCK_PAD * 2) / 2,
    backgroundColor: "#1E4D30",
    shadowColor: "#84CC16",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  tabItem: {
    width: ITEM_W,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    zIndex: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#5E7A65",
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: "#C8F572",
    fontWeight: "800",
  },
});
