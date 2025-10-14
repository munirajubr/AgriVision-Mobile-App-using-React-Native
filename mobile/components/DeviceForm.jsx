import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const DeviceForm = ({ onAddDevice }) => {
  const [deviceId, setDeviceId] = useState('');

  const handleAddDevice = () => {
    if (deviceId.trim() === '') {
      Alert.alert('Error', 'Please enter a device ID');
      return;
    }
    
    // Call the parent function with the device ID
    if (onAddDevice) {
      onAddDevice(deviceId);
    }
    
    // Clear the input after submission
    setDeviceId('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Device</Text>
      <Text style={styles.subtitle}>
        Connect a new smart farm sensor using its unique ID
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter device ID (e.g., IOT-"
          placeholderTextColor={COLORS.placeholderText}
          value={deviceId}
          onChangeText={setDeviceId}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddDevice}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default DeviceForm;
