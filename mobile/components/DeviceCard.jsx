import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS from '../constants/colors';

const DeviceCard = ({ 
  deviceName, 
  deviceId, 
  temperature, 
  humidity, 
  battery, 
  image, 
  icon = 'hardware-chip-outline', // Default icon if no image
  location, 
  lastSeen, 
  isOnline = true,
  hasImage = false 
}) => {
  const router = useRouter();

  const handlePress = () => {
    console.log('Device pressed:', deviceId);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#9E9E9E' }]} />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{deviceName}</Text>
            <Text style={styles.deviceId}>{deviceId}</Text>
          </View>
        </View>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{isOnline ? 'online' : 'offline'}</Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>

      {/* Sensor Data Grid */}
      <View style={styles.sensorGrid}>
        <View style={styles.sensorItem}>
          <Ionicons name="thermometer-outline" size={18} color="#FF5722" />
          <Text style={styles.sensorValue}>{temperature}</Text>
        </View>
        
        <View style={styles.sensorItem}>
          <Ionicons name="water-outline" size={18} color="#2196F3" />
          <Text style={styles.sensorValue}>{humidity}</Text>
        </View>
        
        <View style={styles.sensorItem}>
          <Ionicons name="battery-half-outline" size={18} color="#4CAF50" />
          <Text style={styles.sensorValue}>{battery}</Text>
        </View>
        
        <View style={styles.sensorItem}>
          <Ionicons name="camera-outline" size={18} color="#9C27B0" />
          <Text style={styles.sensorValue}>{hasImage ? 'Image available' : 'No image'}</Text>
        </View>
      </View>

      {/* Device Image or Icon Placeholder */}
      {image ? (
        <Image 
          source={image} 
          style={styles.deviceImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.iconPlaceholder}>
          <Ionicons name={icon} size={80} color={COLORS.primary} />
        </View>
      )}

      {/* Footer Information */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Location: {location}</Text>
        <Text style={styles.footerText}>Last Seen: {lastSeen}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  deviceId: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  sensorValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
    fontWeight: '500',
  },
  deviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  iconPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});

export default DeviceCard;
