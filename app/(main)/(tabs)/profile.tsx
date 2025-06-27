import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_DISPLAY_INFO } from "@/constants/auth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(onboarding)");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>No user data available</Text>
      </View>
    );
  }

  const roleInfo = ROLE_DISPLAY_INFO[user.role];

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Profile</Text>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>
              {roleInfo.icon}
            </Text>
            <Text style={[styles.text, { fontSize: 20, fontWeight: "600" }]}>
              {user.name}
            </Text>
            <Text style={[styles.text, { color: "#64748b", fontSize: 14 }]}>
              {user.email}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: roleInfo.color + "20",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={[
                styles.text,
                { fontWeight: "600", color: roleInfo.color },
              ]}
            >
              {roleInfo.title}
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#374151", marginTop: 4 },
              ]}
            >
              {roleInfo.description}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.text, { fontWeight: "600", marginBottom: 8 }]}>
              Account Details
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              User ID: {user.id}
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              Role: {user.role.replace("_", " ")}
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 14, color: "#64748b", marginBottom: 4 },
              ]}
            >
              Status:{" "}
              {user.isVerified ? "Verified ✅" : "Pending Verification ⏳"}
            </Text>
            <Text style={[styles.text, { fontSize: 14, color: "#64748b" }]}>
              Joined: {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <Text style={[styles.text, { fontWeight: "600", marginBottom: 16 }]}>
            Account Actions
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#64748b", marginBottom: 8 },
            ]}
            onPress={() =>
              Alert.alert("Coming Soon", "This feature will be available soon")
            }
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#64748b", marginBottom: 8 },
            ]}
            onPress={() =>
              Alert.alert("Coming Soon", "This feature will be available soon")
            }
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ef4444" }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
