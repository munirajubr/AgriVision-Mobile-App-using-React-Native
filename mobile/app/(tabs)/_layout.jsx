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
        bottom: Platform.OS === 'ios' ? insets.bottom + 5 : 15,
        backgroundColor: COLORS.background,
        borderColor: COLORS.border,
        shadowColor: 'rgba(0,0,0,0.05)',
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
            market: focused ? "basket" : "basket-outline",
            weather: focused ? "partly-sunny" : "partly-sunny-outline",
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
            style={styles.tabItem}
          >
            <Ionicons 
              name={getIcon(route.name, isFocused)} 
              size={26} 
              color={isFocused ? COLORS.primary : COLORS.textTertiary} 
            />
            {isFocused && <View style={[styles.focusDot, { backgroundColor: COLORS.primary }]} />}
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
    justifyContent: 'space-around',
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 60,
  },
  focusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: 8,
  },
});
