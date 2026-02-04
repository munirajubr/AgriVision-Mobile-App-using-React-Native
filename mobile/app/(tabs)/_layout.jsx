import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20 + insets.bottom,
          left: 20,
          right: 20,
          backgroundColor: COLORS.cardBackground,
          borderRadius: 30,
          height: 70,
          paddingBottom: 0,
          paddingTop: 0,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? COLORS.primary : 'transparent',
              paddingHorizontal: focused ? 20 : 12,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons 
                name={focused ? "grid" : "grid-outline"} 
                size={24} 
                color={focused ? COLORS.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? COLORS.primary : 'transparent',
              paddingHorizontal: focused ? 20 : 12,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons 
                name={focused ? "stats-chart" : "stats-chart-outline"} 
                size={24} 
                color={focused ? COLORS.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? COLORS.primary : 'transparent',
              paddingHorizontal: focused ? 20 : 12,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons 
                name={focused ? "cloud" : "cloud-outline"} 
                size={24} 
                color={focused ? COLORS.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? COLORS.primary : 'transparent',
              paddingHorizontal: focused ? 20 : 12,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons 
                name={focused ? "notifications" : "notifications-outline"} 
                size={24} 
                color={focused ? COLORS.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? COLORS.primary : 'transparent',
              paddingHorizontal: focused ? 20 : 12,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={24} 
                color={focused ? COLORS.white : color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
