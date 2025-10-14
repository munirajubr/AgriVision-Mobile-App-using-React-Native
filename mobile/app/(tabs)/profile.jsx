import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';

const ProfileScreen = () => {
  const router = useRouter();

  // Farmer Profile Data
  const farmerData = {
    name: 'Raj Gowda',
    email: 'rajgowda@gmail.com',
    phone: '+91 98765 4XXXX',
    farmName: 'Green Valley Farms',
    farmLocation: 'Kunigal, Karnataka',
    farmSize: '5.2 acres',
    farmingType: 'Organic Farming',
    experience: '15 years',
    soilType: 'Red Sandy Loam',
    irrigationType: 'Drip Irrigation',
    cropsGrown: ['Rice', 'Sugarcane', 'Ragi', 'Vegetables'],
    connectedDevices: 3,
    lastHarvest: 'October 2024',
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
            // TODO: Add logout logic
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your feedback!');
  };

  const handleContactUs = () => {
    Linking.openURL('mailto:support@agrivision.com?subject=Support Request');
  };

  const menuItems = [
    {
      icon: 'settings-outline',
      label: 'Settings',
      route: '/(pages)/settings',
      color: '#2196F3',
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      route: '/(pages)/helpsupport',
      color: '#FF9800',
    },
    {
      icon: 'information-circle-outline',
      label: 'About App',
      route: '/(pages)/about',
      color: '#4CAF50',
    },
    {
      icon: 'document-text-outline',
      label: 'Terms & Conditions',
      route: '/(pages)/terms',
      color: '#9C27B0',
    },
    {
      icon: 'star-outline',
      label: 'Rate App',
      action: handleRateApp,
      color: '#FFC107',
    },
    {
      icon: 'mail-outline',
      label: 'Contact Us',
      action: handleContactUs,
      color: '#00BCD4',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={56} color={COLORS.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{farmerData.name}</Text>
          <Text style={styles.userFarmName}>{farmerData.farmName}</Text>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/(pages)/profile')}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#2196F3" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{farmerData.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#4CAF50" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{farmerData.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#FF9800" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{farmerData.farmLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Farm Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Details</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="resize-outline" size={28} color={COLORS.primary} />
              <Text style={styles.statValue}>{farmerData.farmSize}</Text>
              <Text style={styles.statLabel}>Farm Size</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={28} color="#4CAF50" />
              <Text style={styles.statValue}>{farmerData.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="hardware-chip-outline" size={28} color="#2196F3" />
              <Text style={styles.statValue}>{farmerData.connectedDevices}</Text>
              <Text style={styles.statLabel}>Devices</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="leaf-outline" size={18} color="#4CAF50" />
                <Text style={styles.detailLabel}>Farming Type</Text>
              </View>
              <Text style={styles.detailValue}>{farmerData.farmingType}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="layers-outline" size={18} color="#795548" />
                <Text style={styles.detailLabel}>Soil Type</Text>
              </View>
              <Text style={styles.detailValue}>{farmerData.soilType}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={18} color="#2196F3" />
                <Text style={styles.detailLabel}>Irrigation</Text>
              </View>
              <Text style={styles.detailValue}>{farmerData.irrigationType}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={18} color="#9C27B0" />
                <Text style={styles.detailLabel}>Last Harvest</Text>
              </View>
              <Text style={styles.detailValue}>{farmerData.lastHarvest}</Text>
            </View>
          </View>
        </View>

        {/* Crops Grown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crops Grown</Text>
          <View style={styles.cropsContainer}>
            {farmerData.cropsGrown.map((crop, index) => (
              <View key={index} style={styles.cropChip}>
                <Ionicons name="leaf" size={16} color={COLORS.primary} />
                <Text style={styles.cropText}>{crop}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.route) {
                    router.push(item.route);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={22} color={COLORS.border} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AgriVision v1.0.0</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.cardBackground,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userFarmName: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cropText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  menuContainer: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 13,
    color: COLORS.placeholderText,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#F4433630',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 10,
  },
});

export default ProfileScreen;