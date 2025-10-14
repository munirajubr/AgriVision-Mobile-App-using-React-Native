import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceForm from '../../components/DeviceForm';
import DeviceCard from '../../components/DeviceCard';
import COLORS from '../../constants/colors';
import styles from '../../assets/styles/devices.styles';

const STORAGE_KEY = '@devices_storage';

export default function Devices() {
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load devices from storage when component mounts
  useEffect(() => {
    loadDevices();
  }, []);

  // Save devices to storage whenever the list changes
  useEffect(() => {
    if (!isLoading) {
      saveDevices();
    }
  }, [connectedDevices]);

  // Load devices from AsyncStorage
  const loadDevices = async () => {
    try {
      const savedDevices = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (savedDevices !== null) {
        // Parse and set the saved devices
        setConnectedDevices(JSON.parse(savedDevices));
      } else {
        // If no saved devices, load initial sample data
        const initialDevices = [
          {
            deviceName: 'Smart Farm Sensor Alpha',
            deviceId: 'IOT-001',
            temperature: '28.5°C',
            humidity: '65%',
            battery: '85%',
            image: null,
            icon: 'camera-outline',
            location: 'Field A - Zone 1',
            lastSeen: '2 mins ago',
            isOnline: true,
            hasImage: true,
          },
          {
            deviceName: 'Smart Farm Sensor Beta',
            deviceId: 'IOT-002',
            temperature: '26.8°C',
            humidity: '72%',
            battery: '92%',
            image: null,
            icon: 'leaf-outline',
            location: 'Field B - Zone 3',
            lastSeen: '15 mins ago',
            isOnline: true,
            hasImage: false,
          },
        ];
        setConnectedDevices(initialDevices);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  };

  // Save devices to AsyncStorage
  const saveDevices = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(connectedDevices));
      console.log('Devices saved successfully');
    } catch (error) {
      console.error('Error saving devices:', error);
    }
  };

  // Add new device
  const handleAddDevice = (deviceId) => {
    console.log('Adding device:', deviceId);
    
    // Check if device already exists
    const deviceExists = connectedDevices.some(device => device.deviceId === deviceId);
    
    if (deviceExists) {
      Alert.alert('Error', 'A device with this ID already exists!');
      return;
    }

    // Create a new device object
    const newDevice = {
      deviceName: `Smart Farm Sensor ${deviceId}`,
      deviceId: deviceId,
      temperature: '--°C',
      humidity: '--%',
      battery: '--%',
      image: null,
      icon: 'hardware-chip-outline',
      location: 'Pending location setup',
      lastSeen: 'Just added',
      isOnline: true,
      hasImage: false,
    };

    // Add to the devices list
    setConnectedDevices([...connectedDevices, newDevice]);
    
    // Show success message
    Alert.alert(
      'Success',
      `Device ${deviceId} has been added and saved!`,
      [{ text: 'OK' }]
    );
  };

  // Optional: Function to remove a device
  const handleRemoveDevice = (deviceId) => {
    Alert.alert(
      'Remove Device',
      'Are you sure you want to remove this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedDevices = connectedDevices.filter(
              device => device.deviceId !== deviceId
            );
            setConnectedDevices(updatedDevices);
            Alert.alert('Success', 'Device removed successfully');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Add New Device Form */}
      <DeviceForm onAddDevice={handleAddDevice} />
      
      {/* Connected Devices List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Connected Devices ({connectedDevices.length})
        </Text>
        
        {connectedDevices.length > 0 ? (
          connectedDevices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              deviceName={device.deviceName}
              deviceId={device.deviceId}
              temperature={device.temperature}
              humidity={device.humidity}
              battery={device.battery}
              image={device.image}
              icon={device.icon}
              location={device.location}
              lastSeen={device.lastSeen}
              isOnline={device.isOnline}
              hasImage={device.hasImage}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No devices connected yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first IoT device using the form above
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}