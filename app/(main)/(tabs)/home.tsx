import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "@/constants/AppStyles";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_PERMISSIONS } from "@/constants/auth";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  permission?: keyof typeof ROLE_PERMISSIONS.lawyer;
}

const FEATURES: FeatureCard[] = [
  {
    id: "legal_pinboard",
    title: "Legal Pinboard",
    description: "Pin important legal notes and updates",
    icon: "📌",
    route: "/(main)/legal-pinboard",
    permission: "canUsePinboard",
  },
  {
    id: "case_timeline",
    title: "Case Timeline",
    description: "Track case progress and milestones",
    icon: "⏰",
    route: "/(main)/case-timeline",
    permission: "canViewTimeline",
  },
  {
    id: "secure_vault",
    title: "Secure Vault",
    description: "Store confidential documents safely",
    icon: "🔒",
    route: "/(main)/secure-vault",
    permission: "canAccessSecureVault",
  },
  {
    id: "section_comparator",
    title: "Section Comparator",
    description: "Compare IPC vs BNS sections",
    icon: "⚖️",
    route: "/(main)/section-comparator",
    permission: "canCompareSections",
  },
  {
    id: "flashcards",
    title: "Legal Flashcards",
    description: "Learn legal concepts with interactive cards",
    icon: "🎯",
    route: "/(main)/flashcards",
    permission: "canUseFlashcards",
  },
  {
    id: "client_folders",
    title: "Client Folders",
    description: "Organize client information and cases",
    icon: "📁",
    route: "/(main)/client-folders",
    permission: "canViewClientFolders",
  },
];

export default function HomeScreen() {
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

  const handleFeaturePress = (feature: FeatureCard) => {
    if (feature.permission) {
      const userPermissions = ROLE_PERMISSIONS[user?.role || "law_student"];
      if (!userPermissions[feature.permission]) {
        Alert.alert(
          "Access Restricted",
          `This feature is not available for ${user?.role?.replace("_", " ") || "your role"}.`,
        );
        return;
      }
    }
    router.push(feature.route as any);
  };

  const getAvailableFeatures = () => {
    if (!user) return [];
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return FEATURES.filter((feature) => {
      if (!feature.permission) return true;
      return userPermissions[feature.permission];
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={[styles.card, { marginBottom: 20 }]}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            {user?.name} • {user?.role?.replace("_", " ")}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#ef4444", marginTop: 10 },
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <Text
          style={[
            styles.text,
            { fontSize: 18, fontWeight: "600", marginBottom: 16 },
          ]}
        >
          Available Features
        </Text>

        {getAvailableFeatures().map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.card}
            onPress={() => handleFeaturePress(feature)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 24, marginRight: 16 }}>
                {feature.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.text, { fontWeight: "600", fontSize: 16 }]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.text,
                    { color: "#64748b", fontSize: 14, marginTop: 4 },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: "#1e40af" }}>→</Text>
            </View>
          </TouchableOpacity>
        ))}

        {getAvailableFeatures().length === 0 && (
          <View style={styles.card}>
            <Text style={styles.text}>
              No features available for your role.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
