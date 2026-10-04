import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
  Image,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

const COLORS_BASE = {
  bg:        "#F7F8F7",
  card:      "#FFFFFF",
  border:    "#EEEFEE",
  text:      "#111411",
  sub:       "#8A9A8E",
  accent:    "#1A4D2E",
  lime:      "#C8F572",
  red:       "#EF4444",
};

function TopBar({ title, onBack, rightIcon, onRight }) {
  return (
    <View style={tb.row}>
      {onBack ? (
        <TouchableOpacity style={tb.iconBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color={COLORS_BASE.text} />
        </TouchableOpacity>
      ) : <View style={tb.iconBtn} />}

      <Text style={tb.title}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity style={tb.iconBtn} onPress={onRight} activeOpacity={0.7}>
          <Ionicons name={rightIcon} size={20} color={COLORS_BASE.text} />
        </TouchableOpacity>
      ) : <View style={tb.iconBtn} />}
    </View>
  );
}

const tb = StyleSheet.create({
  row:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14 },
  title:  { fontSize: 17, fontWeight: "700", color: COLORS_BASE.text },
  iconBtn:{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS_BASE.border, alignItems: "center", justifyContent: "center" },
});

// ─────────────────────────────────────────────
//  PROFILE SCREEN
// ─────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const firstName  = user.fullName?.split(" ")[0] || user.username || "Farmer";
  const initial    = (user.fullName || user.username || "F").charAt(0).toUpperCase();

  const handleLogout = () =>
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);

  const menuGroups = [
    {
      items: [
        { icon: "settings-outline",        label: "Settings",           route: "/(pages)/settings" },
        { icon: "notifications-outline",   label: "Notifications",      route: "/(pages)/notifications" },
        { icon: "shield-checkmark-outline",label: "Privacy Policy",     route: "/(pages)/privacypolicy" },
        { icon: "help-circle-outline",     label: "Help & Support",     route: "/(pages)/helpsupport" },
      ],
    },
    {
      items: [
        { icon: "share-social-outline",    label: "Invite Friends",     action: () => Alert.alert("Invite", "Coming soon!") },
        { icon: "star-outline",            label: "Rate AgriVision",    action: () => Alert.alert("Rate App", "Thank you!") },
        { icon: "mail-outline",            label: "Contact Developer",  action: () => Linking.openURL("mailto:support@agrivision.com") },
        { icon: "document-text-outline",   label: "Terms of Service",   route: "/(pages)/terms" },
      ],
    },
  ];

  return (
    <SafeScreen>
      <View style={s.container}>
        <TopBar title="Profile" rightIcon="search-outline" onRight={() => {}} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* ── User Card ── */}
          <TouchableOpacity
            style={s.userCard}
            onPress={() => router.push("/(pages)/editprofile")}
            activeOpacity={0.8}
          >
            <View style={s.avatarRing}>
              {user.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={s.avatarImg} />
              ) : (
                <View style={s.avatarFallback}>
                  <Text style={s.avatarInitial}>{initial}</Text>
                </View>
              )}
            </View>
            <View style={s.userInfo}>
              <Text style={s.userName}>{user.fullName || firstName}</Text>
              <Text style={s.userEmail}>{user.email || `@${user.username}`}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS_BASE.sub} />
          </TouchableOpacity>

          {/* ── Upgrade Banner ── */}
          <View style={s.upgradeBanner}>
            <View style={s.upgradeIcon}>
              <Ionicons name="sparkles" size={22} color="#C8F572" />
            </View>
            <View style={s.upgradeText}>
              <Text style={s.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={s.upgradeSub}>Unlock AI insights, advanced analytics & more.</Text>
            </View>
            <TouchableOpacity style={s.upgradeBtn} activeOpacity={0.85}>
              <Text style={s.upgradeBtnText}>Upgrade</Text>
              <Ionicons name="chevron-forward" size={13} color={COLORS_BASE.text} />
            </TouchableOpacity>
          </View>

          {/* ── Menu Groups ── */}
          {menuGroups.map((group, gi) => (
            <View key={gi} style={s.menuGroup}>
              {group.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[
                    s.menuRow,
                    ii === 0               && s.menuRowFirst,
                    ii === group.items.length - 1 && s.menuRowLast,
                    ii < group.items.length - 1   && s.menuRowDivider,
                  ]}
                  onPress={() => item.action ? item.action() : router.push(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={s.menuIconWrap}>
                    <Ionicons name={item.icon} size={20} color={COLORS_BASE.sub} />
                  </View>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: "#D1D5DB", true: COLORS_BASE.accent }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={COLORS_BASE.sub} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* ── Sign Out ── */}
          <View style={s.menuGroup}>
            <TouchableOpacity style={[s.menuRow, s.menuRowFirst, s.menuRowLast]} onPress={handleLogout} activeOpacity={0.7}>
              <View style={s.menuIconWrap}>
                <Ionicons name="log-out-outline" size={20} color={COLORS_BASE.red} />
              </View>
              <Text style={[s.menuLabel, { color: COLORS_BASE.red }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.version}>AgriVision v2.0.0 • Made for Farmers</Text>
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS_BASE.bg },
  scroll:    { paddingHorizontal: 20, paddingTop: 8 },

  // User Card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS_BASE.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRing: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 2, borderColor: "#E5E7E5",
    overflow: "hidden",
  },
  avatarImg:     { width: 54, height: 54 },
  avatarFallback:{ width: 54, height: 54, backgroundColor: COLORS_BASE.accent, alignItems: "center", justifyContent: "center" },
  avatarInitial: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  userInfo:      { flex: 1 },
  userName:      { fontSize: 16, fontWeight: "700", color: COLORS_BASE.text, marginBottom: 2 },
  userEmail:     { fontSize: 13, color: COLORS_BASE.sub },

  // Upgrade Banner
  upgradeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS_BASE.accent,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  upgradeIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  upgradeText:  { flex: 1 },
  upgradeTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", marginBottom: 2 },
  upgradeSub:   { color: "rgba(255,255,255,0.65)", fontSize: 11, lineHeight: 16 },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 2,
  },
  upgradeBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },

  // Menu Groups
  menuGroup:     { backgroundColor: COLORS_BASE.card, borderRadius: 18, marginBottom: 12, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  menuRow:       { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 15, gap: 14 },
  menuRowFirst:  { borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  menuRowLast:   { borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  menuRowDivider:{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS_BASE.border },
  menuIconWrap:  { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS_BASE.bg, alignItems: "center", justifyContent: "center" },
  menuLabel:     { flex: 1, fontSize: 15, fontWeight: "600", color: COLORS_BASE.text },

  version: { textAlign: "center", fontSize: 11, color: COLORS_BASE.sub, marginTop: 20, opacity: 0.6 },
});
