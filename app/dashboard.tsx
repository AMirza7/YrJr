import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { storage } from "@/services/storage";
import { User } from "@/types";

export default function DashboardScreen() {
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
        setTimeout(() => router.replace("/"), 0);
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      // Use setTimeout to avoid navigation during render
      setTimeout(() => router.replace("/"), 0);
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
          router.replace("/");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "lawyer":
        return "#8B5CF6";
      case "junior_lawyer":
        return "#06B6D4";
      case "lawyer_assistant":
        return "#10B981";
      case "law_office_helper":
        return "#F59E0B";
      case "law_student":
        return "#EF4444";
      default:
        return "#64748b";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text>

      <View
        style={[
          styles.roleCard,
          { backgroundColor: getRoleColor(user.role) + "20" },
        ]}
      >
        <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
          {user.role.replace("_", " ").toUpperCase()}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.status}>
          {user.isVerified ? "✅ Verified" : "⏳ Pending Verification"}
        </Text>
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Available Features</Text>
        <Text style={styles.featuresText}>
          • Role-based dashboard ✅{"\n"}• Authentication system ✅{"\n"}• Demo
          accounts ✅{"\n"}• Clean navigation ✅
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  roleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  roleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  features: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  featuresText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
