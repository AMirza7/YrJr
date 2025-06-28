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

const { width } = Dimensions.get("window");

export default function LandingScreen() {
  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleDemoAccess = () => {
    // Skip all storage operations for now - just navigate
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>⚖️</Text>
            <Text style={styles.appName}>YRJR Legal Assistant</Text>
            <Text style={styles.tagline}>Your Intelligent Legal Companion</Text>
          </View>

          <View style={styles.heroDescription}>
            <Text style={styles.heroTitle}>
              Revolutionize Your Legal Practice
            </Text>
            <Text style={styles.heroSubtitle}>
              AI-powered tools for lawyers, law students, and legal
              professionals. From document scanning to case research -
              everything you need in one app.
            </Text>
          </View>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.primaryButtonText}>Get Started Free</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSignIn}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoAccess}
          >
            <Text style={styles.demoButtonText}>🎯 Try Demo (No Signup)</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Powerful Features</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need for modern legal practice
          </Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📌</Text>
              <Text style={styles.featureTitle}>Legal Pinboard</Text>
              <Text style={styles.featureDescription}>
                Organize and track all your legal research in one place
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={styles.featureTitle}>Secure Notes Vault</Text>
              <Text style={styles.featureDescription}>
                Encrypted storage for sensitive legal documents
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚖️</Text>
              <Text style={styles.featureTitle}>AI Section Comparator</Text>
              <Text style={styles.featureDescription}>
                Compare legal sections and find similarities instantly
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureTitle}>Document Scanner</Text>
              <Text style={styles.featureDescription}>
                OCR scanning with legal document recognition
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Trusted by Professionals</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Legal Professionals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50,000+</Text>
              <Text style={styles.statLabel}>Documents Scanned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>OCR Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>AI Support</Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Transform Your Practice?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of legal professionals already using YRJR
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <Text style={styles.ctaButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>
            No credit card required • 30-day free trial
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerBrand}>⚖️ YRJR Legal Assistant</Text>
            <Text style={styles.footerDescription}>
              Empowering legal professionals with AI-driven technology
            </Text>
            <Text style={styles.copyright}>
              © 2024 YRJR Legal Assistant. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  hero: {
    backgroundColor: "#1e40af",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  heroDescription: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  heroActions: {
    width: "100%",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#1e40af",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  demoButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  featuresSection: {
    padding: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
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
    paddingVertical: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 2,
    alignItems: "center",
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  ctaSection: {
    backgroundColor: "#1e40af",
    padding: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: "#1e40af",
    fontSize: 16,
    fontWeight: "600",
  },
  ctaNote: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#111827",
    padding: 20,
    paddingVertical: 30,
  },
  footerContent: {
    alignItems: "center",
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  copyright: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
