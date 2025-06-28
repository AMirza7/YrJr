import React, { memo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

// Minimal imports for landing page
const { width } = Dimensions.get("window");

// Memoized components for better performance
const FeatureCard = memo(({ feature }: { feature: any }) => (
  <View style={styles.featureCard}>
    <View
      style={[styles.featureIcon, { backgroundColor: feature.color + "15" }]}
    >
      <Text style={styles.featureIconText}>{feature.icon}</Text>
    </View>
    <Text style={styles.featureTitle}>{feature.title}</Text>
    <Text style={styles.featureDescription}>{feature.description}</Text>
  </View>
));

const TestimonialCard = memo(({ testimonial }: { testimonial: any }) => (
  <View style={styles.testimonialCard}>
    <View style={styles.ratingContainer}>
      {[...Array(testimonial.rating)].map((_, i) => (
        <Text key={i} style={styles.star}>
          ⭐
        </Text>
      ))}
    </View>
    <Text style={styles.testimonialText}>"{testimonial.comment}"</Text>
    <View style={styles.testimonialAuthor}>
      <Text style={styles.authorName}>{testimonial.name}</Text>
      <Text style={styles.authorRole}>{testimonial.role}</Text>
    </View>
  </View>
));

const BenefitItem = memo(({ benefit }: { benefit: any }) => (
  <View style={styles.benefitItem}>
    <Text style={styles.benefitIcon}>{benefit.icon}</Text>
    <Text style={styles.benefitTitle}>{benefit.title}</Text>
    <Text style={styles.benefitDescription}>{benefit.description}</Text>
  </View>
));

export default function LandingScreenOptimized() {
  const [isNavigating, setIsNavigating] = useState(false);

  // Lazy navigation to avoid loading heavy auth screens immediately
  const handleGetStarted = useCallback(async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Dynamic import for signup screen
    const { router } = await import("expo-router");
    router.push("/signup");
    setIsNavigating(false);
  }, [isNavigating]);

  const handleSignIn = useCallback(async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Dynamic import for login screen
    const { router } = await import("expo-router");
    router.push("/login");
    setIsNavigating(false);
  }, [isNavigating]);

  const handleDemoAccess = useCallback(async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Dynamic import for auth service and navigation
    const [{ authService }, { router }] = await Promise.all([
      import("@/services/auth"),
      import("expo-router"),
    ]);

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
    setIsNavigating(false);
  }, [isNavigating]);

  // Static data to avoid unnecessary re-renders
  const features = React.useMemo(
    () => [
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
    ],
    [],
  );

  const testimonials = React.useMemo(
    () => [
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
    ],
    [],
  );

  const benefits = React.useMemo(
    () => [
      {
        icon: "🚀",
        title: "Fast & Efficient",
        description:
          "Save hours with AI-powered legal research and document processing",
      },
      {
        icon: "🔒",
        title: "Secure & Private",
        description:
          "Bank-level encryption ensures your legal data stays confidential",
      },
      {
        icon: "⚖️",
        title: "Legal Accuracy",
        description: "Built by legal experts with latest Indian law updates",
      },
      {
        icon: "📱",
        title: "Mobile First",
        description: "Access your legal tools anywhere, anytime on any device",
      },
    ],
    [],
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS !== "web"}
      maxToRenderPerBatch={10}
      windowSize={10}
    >
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
            AI-powered tools for lawyers, law students, and legal professionals.
            From document scanning to case research - everything you need in one
            app.
          </Text>
        </View>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.primaryButton, { opacity: isNavigating ? 0.7 : 1 }]}
            onPress={handleGetStarted}
            disabled={isNavigating}
          >
            <Text style={styles.primaryButtonText}>
              {isNavigating ? "Loading..." : "Get Started Free"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { opacity: isNavigating ? 0.7 : 1 },
            ]}
            onPress={handleSignIn}
            disabled={isNavigating}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.demoButton, { opacity: isNavigating ? 0.7 : 1 }]}
          onPress={handleDemoAccess}
          disabled={isNavigating}
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
            <FeatureCard key={index} feature={feature} />
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
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Why Choose YRJR?</Text>
        <View style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index} benefit={benefit} />
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>What Legal Professionals Say</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.testimonialsContainer}
          removeClippedSubviews={Platform.OS !== "web"}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </ScrollView>
      </View>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Transform Your Practice?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of legal professionals already using YRJR
        </Text>
        <TouchableOpacity
          style={[styles.ctaButton, { opacity: isNavigating ? 0.7 : 1 }]}
          onPress={handleGetStarted}
          disabled={isNavigating}
        >
          <Text style={styles.ctaButtonText}>Start Free Trial</Text>
        </TouchableOpacity>
        <Text style={styles.ctaNote}>
          No credit card required • 30-day free trial
        </Text>
      </View>
    </ScrollView>
  );
}

// Optimized styles with minimal computation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      },
    }),
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
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
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
  benefitsSection: {
    backgroundColor: "#f9fafb",
    padding: 20,
    paddingVertical: 40,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  benefitIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      },
    }),
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
});
