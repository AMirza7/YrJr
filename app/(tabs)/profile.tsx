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
import { authService } from "@/services/auth";
import { User } from "@/types";
import { getRoleColor, getRolePermissions } from "@/constants/tabs";
import { useLocalization } from "@/contexts/LocalizationContext";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function ProfileScreen() {
  const { t } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (!userData) {
        // Use setTimeout to avoid navigation during render
        setTimeout(() => router.replace("/landing"), 0);
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      // Use setTimeout to avoid navigation during render
      setTimeout(() => router.replace("/landing"), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("logout"), t("logoutConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
            Alert.alert(t("success"), t("logoutSuccess"), [
              {
                text: t("done"),
                onPress: () => router.replace("/landing"),
              },
            ]);
          } catch (error) {
            console.error("Logout error:", error);
            // Force navigation even if logout fails
            router.replace("/landing");
          }
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

  const handleProfileImageUpdate = () => {
    Alert.alert(
      "Update Profile Picture",
      "Choose how you'd like to update your profile picture:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: () => {
            Alert.alert(
              "Coming Soon",
              "Camera integration will be available soon!",
            );
          },
        },
        {
          text: "Choose from Gallery",
          onPress: () => {
            Alert.alert(
              "Coming Soon",
              "Gallery selection will be available soon!",
            );
          },
        },
        {
          text: "Use Initials",
          onPress: () => {
            Alert.alert(
              "Profile Updated",
              "Your profile is using initials avatar!",
            );
          },
        },
      ],
    );
  };

  const handleProfileAction = (actionTitle: string) => {
    switch (actionTitle) {
      case t("settings"):
        router.push("/settings");
        break;
      case t("helpSupport"):
        router.push("/help-support");
        break;
      case t("privacyPolicy"):
        router.push("/privacy-policy");
        break;
      case t("termsAndConditions"):
        router.push("/terms-of-service");
        break;
      default:
        Alert.alert(actionTitle, t("comingSoon"));
    }
  };

  const profileActions = [
    { title: t("settings"), icon: "⚙️", available: true },
    { title: t("helpSupport"), icon: "❓", available: true },
    { title: t("privacyPolicy"), icon: "🔒", available: true },
    { title: t("termsAndConditions"), icon: "📋", available: true },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t("profile")}</Text>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <View style={styles.userCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => handleProfileImageUpdate()}
          >
            <Text style={styles.avatar}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
            <View style={styles.editImageBadge}>
              <Text style={styles.editImageIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={[styles.roleTag, { backgroundColor: roleColor + "20" }]}>
            <Text style={[styles.roleTagText, { color: roleColor }]}>
              {user.role.replace("_", " ").toUpperCase()}
            </Text>
          </View>
          <Text style={styles.verificationStatus}>
            {user.isVerified
              ? `✅ ${t("verifiedAccount")}`
              : `⏳ ${t("pendingVerification")}`}
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

      {/* Language Settings */}
      <View style={styles.section}>
        <LanguageSelector showTitle />
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("accountSettings")}</Text>
        {profileActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionRow}
            onPress={() => handleProfileAction(action.title)}
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
          <Text style={styles.logoutText}>🚪 {t("logout")}</Text>
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
