import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { storage } from "@/services/storage";

const { width } = Dimensions.get("window");

export default function LandingScreen() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const features = [
    {
      icon: "📌",
      title: "Legal Pinboard",
      description: "Organize and track all your legal research in one place",
      color: "#1e40af",
    },
    {
      icon: "🔐",
      title: "Secure Notes Vault",
      description: "Encrypted storage for sensitive legal documents",
      color: "#059669",
    },
    {
      icon: "⚖️",
      title: "AI Section Comparator",
      description: "Compare legal sections and find similarities instantly",
      color: "#dc2626",
    },
    {
      icon: "📱",
      title: "Document Scanner",
      description: "OCR scanning with legal document recognition",
      color: "#7c3aed",
    },
    {
      icon: "🎤",
      title: "Voice Assistant",
      description: "Search legal information using natural voice commands",
      color: "#ea580c",
    },
    {
      icon: "📚",
      title: "Smart Flashcards",
      description: "AI-powered learning system for legal concepts",
      color: "#0891b2",
    },
  ];

  const testimonials = [
    {
      name: "Advocate Priya Sharma",
      role: "Senior Lawyer, Delhi High Court",
      comment:
        "This app has revolutionized how I manage my practice. The AI comparator saves hours of research time.",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      role: "Junior Lawyer, Mumbai",
      comment:
        "Perfect for new lawyers like me. The flashcards helped me prepare for court arguments.",
      rating: 5,
    },
    {
      name: "Dr. Anita Desai",
      role: "Law Professor, Delhi University",
      comment:
        "I recommend this to all my students. The document scanner is incredibly accurate.",
      rating: 5,
    },
  ];

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleDemoAccess = async () => {
    // Create a demo user session
    const demoUser = {
      id: "demo_user",
      name: "Demo User",
      email: "demo@yrjr.com",
      role: "law_student",
      isVerified: true,
      subscriptionTier: "pro",
    };

    await storage.setUser(demoUser);
    await storage.setToken("demo_token");
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
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
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: feature.color + "15" },
                  ]}
                >
                  <Text style={styles.featureIconText}>{feature.icon}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
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

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>What Legal Professionals Say</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsContainer}
          >
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <View style={styles.ratingContainer}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Text key={i} style={styles.star}>
                      ⭐
                    </Text>
                  ))}
                </View>
                <Text style={styles.testimonialText}>
                  "{testimonial.comment}"
                </Text>
                <View style={styles.testimonialAuthor}>
                  <Text style={styles.authorName}>{testimonial.name}</Text>
                  <Text style={styles.authorRole}>{testimonial.role}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Pricing Teaser */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Simple, Transparent Pricing</Text>
          <View style={styles.pricingCards}>
            <View style={styles.pricingCard}>
              <Text style={styles.planName}>Free</Text>
              <Text style={styles.planPrice}>₹0/month</Text>
              <Text style={styles.planDescription}>
                Perfect for law students and beginners
              </Text>
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>✅ Basic templates</Text>
                <Text style={styles.planFeature}>✅ 5 document scans</Text>
                <Text style={styles.planFeature}>✅ Basic search</Text>
              </View>
            </View>

            <View style={[styles.pricingCard, styles.popularCard]}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
              <Text style={styles.planName}>Professional</Text>
              <Text style={styles.planPrice}>₹999/month</Text>
              <Text style={styles.planDescription}>
                For practicing lawyers and firms
              </Text>
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>✅ All free features</Text>
                <Text style={styles.planFeature}>✅ Unlimited scans</Text>
                <Text style={styles.planFeature}>✅ AI comparator</Text>
                <Text style={styles.planFeature}>✅ Voice search</Text>
                <Text style={styles.planFeature}>✅ Biometric security</Text>
              </View>
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
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push("/privacy-policy")}>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity
                onPress={() => router.push("/terms-of-service")}
              >
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity onPress={() => router.push("/help-support")}>
                <Text style={styles.footerLink}>Support</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.copyright}>
              © 2024 YRJR Legal Assistant. All rights reserved.
            </Text>
          </View>
        </View>
      </Animated.View>
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 28,
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
  testimonialsSection: {
    padding: 20,
    paddingVertical: 40,
  },
  testimonialsContainer: {
    paddingHorizontal: 10,
  },
  testimonialCard: {
    width: width - 80,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  testimonialText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: "italic",
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 14,
    color: "#6b7280",
  },
  pricingSection: {
    backgroundColor: "#f9fafb",
    padding: 20,
    paddingVertical: 40,
  },
  pricingCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  popularCard: {
    borderColor: "#1e40af",
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    left: 20,
    right: 20,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  popularText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 10,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
  },
  planFeature: {
    fontSize: 14,
    color: "#374151",
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
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: "#d1d5db",
  },
  footerSeparator: {
    fontSize: 14,
    color: "#6b7280",
    marginHorizontal: 8,
  },
  copyright: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
