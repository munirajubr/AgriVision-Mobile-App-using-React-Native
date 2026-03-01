import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Smart Crop Diagnosis',
    description: 'Instantly identify plant diseases and get expert recommendations for sustainable farming.',
    icon: 'scan-outline',
    bgColor: '#1B5E20', // Deep Forest Green
    accent: '+120 Points',
    label: 'Online',
  },
  {
    id: '2',
    title: 'Precision Farm Monitoring',
    description: 'Keep a virtual eye on soil moisture and climate conditions from anywhere in the world.',
    icon: 'stats-chart-outline',
    bgColor: '#2E7D32', // Medium Green
    accent: '850 Points',
    label: 'Gift Card',
  },
  {
    id: '3',
    title: 'Direct Market Insights',
    description: 'Access real-time mandi rates and connect with better opportunities for your harvest.',
    icon: 'leaf-outline',
    bgColor: '#43A047', // Vibrant Green
    accent: 'Swap to Profit',
    label: 'Market',
  },
];

const Onboarding = () => {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/signup');
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.slide, { width }]}>
        {/* Top Section - Illustration/Graphic */}
        <View style={[styles.topSection, { backgroundColor: item.bgColor }]}>
          {/* Decorative Spirals (Styled Views to mimic the image style) */}
          <View style={styles.spiralContainer}>
            <View style={[styles.circleOutline, { width: 150, height: 150, top: 40, left: 30 }]} />
            <View style={[styles.circleOutline, { width: 180, height: 180, top: 20, right: 20 }]} />
            <View style={[styles.circleOutline, { width: 120, height: 120, bottom: 40, left: '25%' }]} />
          </View>

          {/* Floating UI elements mimicking the image */}
          <View style={[styles.floatingTag, { top: 60, left: 30, transform: [{ rotate: '-15deg' }] }]}>
            <Text style={styles.tagText}>{item.accent}</Text>
          </View>

          <View style={[styles.tabBar, { top: 180, alignSelf: 'center' }]}>
            <View style={[styles.tab, { backgroundColor: '#FFF' }]}>
              <Ionicons name="globe-outline" size={14} color={item.bgColor} />
              <Text style={[styles.tabText, { color: item.bgColor }]}>{item.label}</Text>
            </View>
            <View style={styles.tab}>
              <Ionicons name="cart-outline" size={14} color="#FFF" />
              <Text style={styles.tabText}>Farm</Text>
            </View>
          </View>

          {/* Central Icon */}
          <Animated.View style={styles.mainIconContainer}>
            <Ionicons name={item.icon} size={120} color="#FFF" style={{ opacity: 0.9 }} />
          </Animated.View>

          {/* Happy Character (Mimicking the image bottom creature) */}
          <View style={[styles.character, { bottom: -20, right: 30 }]}>
            <View style={[styles.characterBody, { backgroundColor: '#FFD1DA' }]} />
            <View style={styles.characterFace}>
              <Text style={styles.characterEyes}>..</Text>
              <Text style={styles.characterMouth}>◡</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section - Content */}
        <View style={styles.bottomSection}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: '#000' }]}>{item.title}</Text>
            <Text style={[styles.description, { color: '#666' }]}>{item.description}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.paginator}>
              {SLIDES.map((_, i) => (
                <View
                  key={i.toString()}
                  style={[
                    styles.dot,
                    { 
                      backgroundColor: i === currentIndex ? item.bgColor : '#DDD',
                      width: i === currentIndex ? 20 : 8 
                    }
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: item.bgColor }]}
              onPress={scrollToNext}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {currentIndex === SLIDES.length - 1 && (
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={{ color: item.bgColor, fontWeight: '800' }}>Login</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  slide: {
    flex: 1,
  },
  topSection: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  spiralContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  circleOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 1000,
  },
  floatingTag: {
    position: 'absolute',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  tabBar: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  tabText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mainIconContainer: {
    zIndex: 10,
  },
  character: {
    position: 'absolute',
    width: 140,
    height: 140,
  },
  characterBody: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  characterFace: {
    position: 'absolute',
    top: 30,
    left: 40,
    alignItems: 'center',
  },
  characterEyes: {
    fontSize: 30,
    fontWeight: '900',
    color: '#333',
    lineHeight: 30,
  },
  characterMouth: {
    fontSize: 24,
    color: '#333',
    marginTop: -10,
  },
  bottomSection: {
    height: '40%',
    backgroundColor: '#FFF',
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 15,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  paginator: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loginLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default Onboarding;
