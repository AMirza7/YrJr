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

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await storage.getUser();
      if (!userData) {
        router.replace("/login");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      router.replace("/login");
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

  const quickActions = [
    {
      title: "Legal Pinboard",
      icon: "📌",
      available: permissions.canAccessPinboard,
      tab: "pinboard",
    },
    {
      title: "Case Timeline",
      icon: "⏱️",
      available: permissions.canAccessCaseTimeline,
      tab: "timeline",
    },
    {
      title: "Secure Notes",
      icon: "🔐",
      available: permissions.canAccessSecureNotes,
      tab: "notes",
    },
    { title: "Search Legal", icon: "🔍", available: true, tab: "search" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={[styles.roleCard, { backgroundColor: roleColor + "20" }]}>
          <Text style={[styles.roleText, { color: roleColor }]}>
            {user.role.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionCard,
                { opacity: action.available ? 1 : 0.5 },
              ]}
              onPress={() =>
                action.available && router.push(`/(tabs)/${action.tab}`)
              }
              disabled={!action.available}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              {!action.available && (
                <Text style={styles.unavailableText}>Not available</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Features</Text>
        <View style={styles.featuresCard}>
          <Text style={styles.featuresText}>
            ✅ Role-based navigation{"\n"}✅ Tab-based interface{"\n"}✅
            Authentication system{"\n"}✅ Demo accounts{"\n"}
            🔄 Advanced features in progress...
          </Text>
        </View>
      </View>

      {/* User Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={styles.profileButtonText}>👤 View Profile</Text>
        </TouchableOpacity>

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
  },
  greeting: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  roleCard: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
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
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  unavailableText: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
  },
  featuresCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  profileButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  profileButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
