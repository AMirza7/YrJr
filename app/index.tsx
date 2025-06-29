import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";

const { width } = Dimensions.get("window");

export default function LandingPage() {
  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleDemoAccess = async () => {
    try {
      // Create a demo user session
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
      Alert.alert("Error", "Unable to start demo. Please try again.");
    }
  };

  const handleFeatures = () => {
    router.push("/features");
  };

  const handlePricing = () => {
    router.push("/subscription");
  };

  const handlePrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  const handleTermsOfService = () => {
    router.push("/terms-of-service");
  };

  const handleSupport = () => {
    router.push("/help-support");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.logo}>⚖️</Text>
          <Text style={styles.appName}>YRJR Legal Assistant</Text>
          <Text style={styles.tagline}>Your Intelligent Legal Companion</Text>

          <Text style={styles.heroTitle}>
            Revolutionize Your Legal Practice
          </Text>
          <Text style={styles.heroSubtitle}>
            AI-powered tools for lawyers, law students, and legal professionals
            in India
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started Free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoAccess}
            activeOpacity={0.8}
          >
            <Text style={styles.demoButtonText}>🎯 Try Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Powerful Features</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📌</Text>
              <Text style={styles.featureTitle}>Legal Pinboard</Text>
              <Text style={styles.featureDescription}>
                Organize legal research and case materials efficiently
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={styles.featureTitle}>Secure Vault</Text>
              <Text style={styles.featureDescription}>
                Encrypted document storage with biometric protection
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚖️</Text>
              <Text style={styles.featureTitle}>AI Comparator</Text>
              <Text style={styles.featureDescription}>
                Compare IPC vs BNS sections with AI assistance
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureTitle}>OCR Scanner</Text>
              <Text style={styles.featureDescription}>
                Scan and digitize legal documents instantly
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🗂️</Text>
              <Text style={styles.featureTitle}>Case Timeline</Text>
              <Text style={styles.featureDescription}>
                Track case progress and important dates
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🎓</Text>
              <Text style={styles.featureTitle}>Flashcards</Text>
              <Text style={styles.featureDescription}>
                Learn legal concepts with interactive flashcards
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            Trusted by Legal Professionals
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Accuracy Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Ready to Transform Your Legal Practice?
          </Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of legal professionals who trust YRJR Legal Assistant
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
        </View>

        {/* Comprehensive Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerLogo}>⚖️</Text>
              <Text style={styles.footerBrandName}>YRJR Legal Assistant</Text>
              <Text style={styles.footerTagline}>
                Your Intelligent Legal Companion
              </Text>
              <Text style={styles.footerDescription}>
                Built specifically for the Indian Legal System with
                comprehensive features for lawyers, law students, and legal
                professionals.
              </Text>
            </View>

            <View style={styles.footerLinks}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Product</Text>
                <TouchableOpacity onPress={handleFeatures} activeOpacity={0.7}>
                  <Text style={styles.footerLink}>Features</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePricing} activeOpacity={0.7}>
                  <Text style={styles.footerLink}>Pricing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDemoAccess}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Live Demo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => console.log("API Docs")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>API Documentation</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Legal & Support</Text>
                <TouchableOpacity
                  onPress={handlePrivacyPolicy}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleTermsOfService}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSupport} activeOpacity={0.7}>
                  <Text style={styles.footerLink}>Help & Support</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/help-support")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>FAQ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Contact Info</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Contact", "Email: support@yrjr.app")
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerContact}>📧 support@yrjr.app</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Contact", "Phone: +91-1234567890")
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerContact}>📞 +91-1234567890</Text>
                </TouchableOpacity>
                <Text style={styles.footerContact}>
                  🏢 Legal Tech Hub{"\n"}Mumbai, Maharashtra{"\n"}India - 400001
                </Text>
                <Text style={styles.footerContact}>
                  🕒 Mon-Fri: 9:00 AM - 6:00 PM IST
                </Text>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>For Developers</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Developer Resources",
                      "Backend Integration Guide will open soon",
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Backend Integration</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Developer Resources",
                      "API Reference documentation coming soon",
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>API Reference</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Developer Resources",
                      "SDKs & Libraries will be available soon",
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>SDKs & Libraries</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Developer Resources",
                      "GitHub Repository will be public soon",
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>GitHub Repository</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>
              © 2024 YRJR Legal Assistant. All rights reserved.
            </Text>
            <Text style={styles.footerBuilt}>
              Built for the Indian Legal System • Made with ❤️ in India
            </Text>
            <Text style={styles.footerLegal}>
              This app complies with Indian IT Act 2000 and Data Protection Laws
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: "#1e40af",
    paddingTop: Platform.OS === "web" ? 40 : 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    fontSize: 72,
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 24,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#1e40af",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    maxWidth: 300,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
  demoButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  featuresSection: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f8fafc",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width:
      Platform.OS === "web"
        ? width > 768
          ? (width - 100) / 3
          : (width - 60) / 2
        : (width - 60) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  statsSection: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    paddingVertical: 50,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  statCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  ctaSection: {
    backgroundColor: "#1e40af",
    padding: 20,
    paddingVertical: 50,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 26,
  },
  ctaButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: "#1e40af",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#111827",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  footerContent: {
    marginBottom: 40,
  },
  footerBrand: {
    alignItems: "center",
    marginBottom: 40,
  },
  footerLogo: {
    fontSize: 48,
    marginBottom: 12,
  },
  footerBrandName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  footerTagline: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 16,
  },
  footerDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  footerColumn: {
    flex: 1,
    minWidth: 150,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  footerColumnTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 12,
    paddingVertical: 4,
  },
  footerContact: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 12,
    lineHeight: 20,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#374151",
    paddingTop: 30,
    alignItems: "center",
  },
  footerCopyright: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  footerBuilt: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 8,
  },
  footerLegal: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});
