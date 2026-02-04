import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";

const { width } = Dimensions.get("window");

// Custom Tab Bar to ensure absolute control and zero squashing
function CustomTabBar({ state, descriptors, navigation, COLORS, isDarkMode }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.tabBarContainer, 
      { 
        bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20,
        backgroundColor: COLORS.cardBackground,
        borderColor: COLORS.border,
        shadowColor: isDarkMode ? '#000' : COLORS.shadow,
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Skip hidden routes
        if (options.href === null) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = (routeName, focused) => {
          const icons = {
            index: focused ? "home" : "home-outline",
            market: focused ? "stats-chart" : "stats-chart-outline",
            weather: focused ? "cloud" : "cloud-outline",
            profile: focused ? "person" : "person-outline",
          };
          return icons[routeName] || "square";
        };

        const getLabel = (routeName) => {
          const labels = {
            index: "Home",
            market: "Market",
            weather: "Sky",
            profile: "Me",
          };
          return labels[routeName] || routeName;
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            activeOpacity={0.7}
            style={[
              styles.tabItem,
              isFocused && { 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(52, 199, 89, 0.1)',
                flex: 2.2,
                marginHorizontal: 4,
              }
            ]}
          >
            <Ionicons 
              name={getIcon(route.name, isFocused)} 
              size={22} 
              color={isFocused ? COLORS.primary : COLORS.textTertiary} 
              style={{ opacity: isFocused ? 1 : 0.7 }}
            />
            {isFocused && (
              <Text style={[styles.tabLabel, { color: COLORS.primary }]}>
                {getLabel(route.name)}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} COLORS={COLORS} isDarkMode={isDarkMode} />}
      screenOptions={{
        headerShown: false,
      }}
      sceneContainerStyle={{ backgroundColor: COLORS.background }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="market" options={{ title: "Market" }} />
      <Tabs.Screen name="weather" options={{ title: "Weather" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: 15,
    right: 15,
    height: 72,
    borderRadius: 36,
    paddingHorizontal: 8,
    elevation: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
});
