import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";

const { width } = Dimensions.get("window");

export default function FeaturesScreen() {
  const features = [
    {
      icon: "📌",
      title: "Legal Pinboard",
      description: "Organize and track all your legal research in one place",
      details: [
        "Pin important cases and documents",
        "Organize by case or client",
        "Quick search and filtering",
        "Share with team members",
      ],
    },
    {
      icon: "🔐",
      title: "Secure Notes Vault",
      description: "Encrypted storage for sensitive legal documents",
      details: [
        "End-to-end encryption",
        "Biometric authentication",
        "Secure cloud backup",
        "Client confidentiality protection",
      ],
    },
    {
      icon: "⚖️",
      title: "AI Section Comparator",
      description: "Compare legal sections and find similarities instantly",
      details: [
        "IPC vs BNS comparison",
        "AI-powered analysis",
        "Side-by-side viewing",
        "Highlight changes and updates",
      ],
    },
    {
      icon: "📱",
      title: "Document Scanner",
      description: "OCR scanning with legal document recognition",
      details: [
        "High-quality OCR scanning",
        "Legal document templates",
        "Text extraction and editing",
        "PDF generation",
      ],
    },
    {
      icon: "🗂️",
      title: "Interactive Case Timeline",
      description: "Track case progress and important dates",
      details: [
        "Visual timeline view",
        "Important date reminders",
        "Document attachments",
        "Status tracking",
      ],
    },
    {
      icon: "🎓",
      title: "Legal Flashcards",
      description: "Learn legal concepts with interactive flashcards",
      details: [
        "Curated legal content",
        "Spaced repetition learning",
        "Custom card creation",
        "Progress tracking",
      ],
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "AI-powered search across all your documents",
      details: [
        "Natural language queries",
        "Cross-document search",
        "Voice search support",
        "Intelligent suggestions",
      ],
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track your productivity and case progress",
      details: [
        "Work time tracking",
        "Case progress metrics",
        "Client interaction logs",
        "Performance insights",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Features</Text>
        <Text style={styles.subtitle}>
          Comprehensive tools for modern legal practice
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
              <View style={styles.featureDetails}>
                {feature.details.map((detail, detailIndex) => (
                  <View key={detailIndex} style={styles.detailItem}>
                    <Text style={styles.detailBullet}>•</Text>
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaSubtitle}>
            Experience all these features with a free trial
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.ctaButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={async () => {
              try {
                const { authService } = await import("@/services/auth");
                const demoUser = {
                  id: "demo_user",
                  name: "Demo User",
                  email: "demo@yrjr.com",
                  role: "law_student" as const,
                  isVerified: true,
                  subscriptionTier: "pro" as const,
                };

                await authService.updateUser(demoUser);
                router.replace("/(tabs)");
              } catch (error) {
                console.error("Demo access error:", error);
              }
            }}
          >
            <Text style={styles.demoButtonText}>Try Demo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1e40af",
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
  },
  featuresGrid: {
    padding: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  featureDetails: {
    paddingLeft: 56,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  detailBullet: {
    fontSize: 16,
    color: "#1e40af",
    marginRight: 8,
    marginTop: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: "#f9fafb",
    padding: 20,
    margin: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#1e40af",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  demoButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e40af",
  },
  demoButtonText: {
    color: "#1e40af",
    fontSize: 14,
    fontWeight: "500",
  },
});
