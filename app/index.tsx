import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Index() {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
  };

  const handleSignIn = () => {
    console.log("Sign In clicked");
  };

  const handleDemoAccess = () => {
    console.log("Demo Access clicked");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          </Text>

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

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoAccess}
          >
            <Text style={styles.demoButtonText}>🎯 Try Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Powerful Features</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📌</Text>
              <Text style={styles.featureTitle}>Legal Pinboard</Text>
              <Text style={styles.featureDescription}>
                Organize legal research
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={styles.featureTitle}>Secure Vault</Text>
              <Text style={styles.featureDescription}>Encrypted documents</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚖️</Text>
              <Text style={styles.featureTitle}>AI Comparator</Text>
              <Text style={styles.featureDescription}>Smart analysis</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureTitle}>Scanner</Text>
              <Text style={styles.featureDescription}>OCR scanning</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 YRJR Legal Assistant. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e40af",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
