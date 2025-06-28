import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "Basic legal templates",
      "5 document downloads/month",
      "Basic search functionality",
      "Email support",
      "Access to flashcards",
    ],
    limitations: [
      "No AI comparator",
      "No document scanner",
      "No voice assistant",
      "No biometric security",
    ],
    color: "#6b7280",
    recommended: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: "₹999",
    period: "month",
    features: [
      "All free features",
      "Unlimited downloads",
      "AI section comparator",
      "Advanced search with voice",
      "Document scanner with OCR",
      "Priority email support",
      "Calendar integration",
      "Advanced templates",
    ],
    limitations: ["No video consultations", "No custom templates"],
    color: "#3b82f6",
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹1999",
    period: "month",
    features: [
      "All professional features",
      "Video consultations",
      "Custom template creation",
      "API access",
      "White-label options",
      "24/7 phone support",
      "Advanced analytics",
      "Multi-user accounts",
    ],
    limitations: [],
    color: "#7c3aed",
    recommended: false,
  },
];

export default function SubscriptionScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
      setSelectedPlan(currentUser.subscriptionTier);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    if (planId === user.subscriptionTier) {
      Alert.alert("Already Subscribed", "You already have this plan active.");
      return;
    }

    Alert.alert(
      "Upgrade Subscription",
      `Upgrade to ${SUBSCRIPTION_PLANS.find((p) => p.id === planId)?.name} plan?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Upgrade",
          onPress: async () => {
            // Simulate upgrade process
            const updatedUser = { ...user, subscriptionTier: planId as any };
            const success = await authService.updateUser(updatedUser);

            if (success) {
              setUser(updatedUser);
              Alert.alert(
                "Success!",
                "Your subscription has been upgraded successfully.",
              );
            } else {
              Alert.alert("Error", "Failed to upgrade subscription.");
            }
          },
        },
      ],
    );
  };

  const PlanCard = ({ plan }: { plan: (typeof SUBSCRIPTION_PLANS)[0] }) => {
    const isCurrentPlan = user?.subscriptionTier === plan.id;
    const isSelected = selectedPlan === plan.id;

    return (
      <View
        style={[
          styles.planCard,
          { borderColor: plan.color },
          isCurrentPlan && styles.currentPlan,
          plan.recommended && styles.recommendedPlan,
        ]}
      >
        {plan.recommended && (
          <View
            style={[styles.recommendedBadge, { backgroundColor: plan.color }]}
          >
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: plan.color }]}>
            {plan.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.planPrice, { color: plan.color }]}>
              {plan.price}
            </Text>
            <Text style={styles.planPeriod}>/{plan.period}</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>✅ Included Features:</Text>
          {plan.features.map((feature, index) => (
            <Text key={index} style={styles.featureText}>
              • {feature}
            </Text>
          ))}
        </View>

        {plan.limitations.length > 0 && (
          <View style={styles.limitationsSection}>
            <Text style={styles.limitationsTitle}>❌ Limitations:</Text>
            {plan.limitations.map((limitation, index) => (
              <Text key={index} style={styles.limitationText}>
                • {limitation}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.planButton,
            { backgroundColor: isCurrentPlan ? "#6b7280" : plan.color },
            isCurrentPlan && styles.currentPlanButton,
          ]}
          onPress={() => handleUpgrade(plan.id)}
          disabled={isCurrentPlan}
        >
          <Text style={styles.planButtonText}>
            {isCurrentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading subscription details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Settings" color="#fff" />
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>
          Choose the plan that's right for you
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan Info */}
        <View style={styles.currentPlanInfo}>
          <Text style={styles.currentPlanTitle}>Current Plan</Text>
          <Text style={styles.currentPlanName}>
            {SUBSCRIPTION_PLANS.find((p) => p.id === user?.subscriptionTier)
              ?.name || "Free"}
          </Text>
          <Text style={styles.currentPlanStatus}>
            {user?.subscriptionTier === "free"
              ? "No billing - Free forever"
              : "Next billing: January 15, 2025"}
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        {/* Billing Info */}
        <View style={styles.billingInfo}>
          <Text style={styles.billingTitle}>💳 Billing Information</Text>
          <Text style={styles.billingText}>
            • All prices are in Indian Rupees (₹)
          </Text>
          <Text style={styles.billingText}>
            • Billed monthly on the same date
          </Text>
          <Text style={styles.billingText}>
            • Cancel anytime from your account settings
          </Text>
          <Text style={styles.billingText}>• 30-day money-back guarantee</Text>
          <Text style={styles.billingText}>
            • Secure payments via Razorpay/UPI
          </Text>
        </View>

        {/* Contact Support */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() =>
              Alert.alert(
                "Contact Support",
                "Email: support@yrjr.app\nPhone: +91-9876543210",
              )
            }
          >
            <Text style={styles.supportButtonText}>📞 Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#3b82f6",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentPlanInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentPlanTitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  currentPlanStatus: {
    fontSize: 14,
    color: "#059669",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  plansSection: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  currentPlan: {
    backgroundColor: "#f0f9ff",
  },
  recommendedPlan: {
    transform: [{ scale: 1.02 }],
  },
  recommendedBadge: {
    position: "absolute",
    top: -1,
    left: 20,
    right: 20,
    padding: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
  },
  recommendedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  planHeader: {
    marginBottom: 20,
    marginTop: 10,
  },
  planName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "bold",
  },
  planPeriod: {
    fontSize: 16,
    color: "#6b7280",
    marginLeft: 4,
  },
  featuresSection: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 20,
  },
  limitationsSection: {
    marginBottom: 20,
  },
  limitationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  limitationText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    lineHeight: 20,
  },
  planButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  currentPlanButton: {
    opacity: 0.7,
  },
  planButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  billingInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  billingText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 20,
  },
  supportSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  supportButton: {
    backgroundColor: "#059669",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
