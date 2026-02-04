import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getColors } from "../constants/colors";
import { Image } from "expo-image";

export default function ProfileHeader({ onEditProfile }) {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: COLORS.secondaryBackground }]}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={56} color={COLORS.textTertiary} />
          )}
        </View>
        <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="camera" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.userName, { color: COLORS.textPrimary }]}>{user.username}</Text>
      {user.farmName && <Text style={[styles.userFarmName, { color: COLORS.textSecondary }]}>{user.farmName}</Text>}

      <TouchableOpacity 
        style={[styles.editProfileButton, { backgroundColor: `${COLORS.primary}15`, borderColor: COLORS.primary }]} 
        onPress={onEditProfile}
      >
        <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        <Text style={[styles.editProfileText, { color: COLORS.primary }]}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  userFarmName: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
