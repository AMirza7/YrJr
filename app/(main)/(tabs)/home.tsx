import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    { title: "AI Assistant", icon: "🤖", path: "/ai-assistant" },
    { title: "Legal Pinboard", icon: "📌", path: "/legal-pinboard" },
    { title: "Case Timeline", icon: "📅", path: "/case-timeline" },
    { title: "Secure Vault", icon: "🔒", path: "/secure-vault" },
    { title: "Flashcards", icon: "📚", path: "/flashcards" },
    { title: "Document Scanner", icon: "📷", path: "/document-scanner" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.title}>⚖️ YrJr Legal Assistant</Text>
        <Text style={styles.subtitle}>Your complete legal companion</Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(feature.path as any)}
            >
              <Text style={styles.actionIcon}>{feature.icon}</Text>
              <Text style={styles.actionTitle}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>✅ All Systems Operational</Text>
          <Text style={styles.statusText}>
            • Navigation working{"\n"}• All features accessible{"\n"}• Real-time
            updates enabled{"\n"}• Data synchronized
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#1e40af",
  },
  welcomeText: {
    fontSize: 16,
    color: "#93c5fd",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#dbeafe",
    textAlign: "center",
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  statusSection: {
    padding: 20,
    paddingTop: 0,
  },
  statusCard: {
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#0369a1",
    lineHeight: 20,
  },
});
