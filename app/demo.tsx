import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function DemoScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      padding: 20,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
      marginTop: 40,
    },
    logo: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#1E40AF",
      marginBottom: 8,
    },
    tagline: {
      fontSize: 16,
      color: "#6B7280",
      textAlign: "center",
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#1F2937",
      marginBottom: 15,
    },
    feature: {
      fontSize: 14,
      color: "#374151",
      marginBottom: 8,
      lineHeight: 20,
    },
    button: {
      backgroundColor: "#1E40AF",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    statusBadge: {
      backgroundColor: "#10B981",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: "center",
      marginTop: 20,
    },
    statusText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "600",
    },
  });

  const features = [
    "✅ Complete backend API integration structure",
    "✅ Enhanced token management with auto-refresh",
    "✅ Comprehensive API hooks for all modules",
    "✅ Production-ready error handling",
    "✅ Optimized loading and caching system",
    "✅ Environment configuration support",
    "✅ Mock data for development",
    "✅ Security best practices implemented",
  ];

  const apiModules = [
    "Authentication (login, register, OTP)",
    "Court Orders (fetch, filter, download)",
    "Messages (send, receive, conversations)",
    "Lawyers Directory (search, reviews)",
    "Case Management (create, update, track)",
    "Notifications (push, in-app)",
    "Secure Vault (document storage)",
    "AI Assistant (legal queries)",
    "Document Scanner (OCR)",
    "Templates Hub (document generation)",
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>YrJr Legal Assistant</Text>
        <Text style={styles.tagline}>
          Production-Ready Backend Integration Complete
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>🚀 READY FOR BACKEND</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Key Features Implemented</Text>
        {features.map((feature, index) => (
          <Text key={index} style={styles.feature}>
            {feature}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📡 API Modules Ready</Text>
        {apiModules.map((module, index) => (
          <Text key={index} style={styles.feature}>
            • {module}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Next Steps</Text>
        <Text style={styles.feature}>
          1. Update .env file with your backend API endpoints
        </Text>
        <Text style={styles.feature}>
          2. Replace mock data with real API calls
        </Text>
        <Text style={styles.feature}>
          3. Configure authentication providers
        </Text>
        <Text style={styles.feature}>4. Test with your backend services</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          try {
            router.replace("/(onboarding)");
          } catch (error) {
            console.log("Navigation error:", error);
            // Fallback navigation
            router.push("/(onboarding)/");
          }
        }}
      >
        <Text style={styles.buttonText}>Continue to Full App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
