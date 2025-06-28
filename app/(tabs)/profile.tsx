import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { storage } from "@/services/storage";
import { User } from "@/types";
import { getRoleColor, getRolePermissions } from "@/constants/tabs";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await storage.getUser();
      if (!userData) {
        // Use setTimeout to avoid navigation during render
        setTimeout(() => router.replace("/login"), 0);
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      // Use setTimeout to avoid navigation during render
      setTimeout(() => router.replace("/login"), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await storage.clearAuth();
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const permissions = getRolePermissions(user.role);
  const roleColor = getRoleColor(user.role);

  const profileActions = [
    { title: "Settings", icon: "⚙️", available: true },
    { title: "Help & Support", icon: "❓", available: true },
    { title: "Privacy Policy", icon: "🔒", available: true },
    { title: "Terms of Service", icon: "📋", available: true },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={[styles.roleTag, { backgroundColor: roleColor + "20" }]}>
            <Text style={[styles.roleTagText, { color: roleColor }]}>
              {user.role.replace("_", " ").toUpperCase()}
            </Text>
          </View>
          <Text style={styles.verificationStatus}>
            {user.isVerified
              ? "✅ Verified Account"
              : "⏳ Pending Verification"}
          </Text>
        </View>
      </View>

      {/* Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Access Level</Text>
        <View style={styles.permissionsCard}>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>Legal Pinboard</Text>
            <Text style={styles.permissionStatus}>
              {permissions.canAccessPinboard ? "✅" : "❌"}
            </Text>
          </View>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>Case Timeline</Text>
            <Text style={styles.permissionStatus}>
              {permissions.canAccessCaseTimeline ? "✅" : "❌"}
            </Text>
          </View>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>Secure Notes</Text>
            <Text style={styles.permissionStatus}>
              {permissions.canAccessSecureNotes ? "✅" : "❌"}
            </Text>
          </View>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>AI Comparator</Text>
            <Text style={styles.permissionStatus}>
              {permissions.canAccessAIComparator ? "✅" : "❌"}
            </Text>
          </View>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>Document Scanner</Text>
            <Text style={styles.permissionStatus}>
              {permissions.canAccessDocumentScanner ? "✅" : "❌"}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {profileActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionRow}
            onPress={() =>
              Alert.alert(action.title, "This feature is coming soon!")
            }
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionText}>{action.title}</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  roleTag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  verificationStatus: {
    fontSize: 14,
    color: "#374151",
  },
  permissionsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  permissionLabel: {
    fontSize: 14,
    color: "#374151",
  },
  permissionStatus: {
    fontSize: 14,
  },
  actionRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  actionArrow: {
    fontSize: 18,
    color: "#9ca3af",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
