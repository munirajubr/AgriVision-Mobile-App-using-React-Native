import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { Image } from "expo-image";
import styles from "../assets/styles/profile.styles";
import { formatMemberSince } from "../lib/utils";

export default function ProfileHeader({ onEditProfile }) {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={56} color="#ccc" />
          )}
        </View>
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{user.username}</Text>
      {user.farmName && <Text style={styles.userFarmName}>{user.farmName}</Text>}

      <TouchableOpacity style={styles.editProfileButton} onPress={onEditProfile}>
        <Ionicons name="create-outline" size={18} color="#037B21" />
        <Text  style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
