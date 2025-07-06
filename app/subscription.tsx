import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { useLocalization } from "@/contexts/LocalizationContext";
import { User, SubscriptionTier } from "@/types";
import { SUBSCRIPTION_FEATURES, SUBSCRIPTION_PRICING } from "@/constants/roles";

export default function SubscriptionScreen() {
  const { t } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadUser();
  }, []);

  const checkAuthAndLoadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        Alert.alert(
          "Authentication Required",
          "Please sign in to manage your subscription",
          [{ text: "OK", onPress: () => router.replace("/login") }],
        );
        return;
      }
      setUser(currentUser);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) return;

    try {
      Alert.alert(
        "Upgrade Subscription",
        `Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              const amount =
                tier === "pro"
                  ? SUBSCRIPTION_PRICING.pro.monthly
                  : SUBSCRIPTION_PRICING.premium.monthly;
              router.push({
                pathname: "/payment-options",
                params: {
                  amount: amount.toString(),
                  plan: tier.charAt(0).toUpperCase() + tier.slice(1),
                },
              });
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleDowngrade = () => {
    if (!user) return;

    Alert.alert(
      "Downgrade Subscription",
      "Are you sure you want to downgrade to Free plan? You will lose access to premium features.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Downgrade",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.updateUser({
                subscriptionTier: "free",
              });
              setUser((prev) =>
                prev ? { ...prev, subscriptionTier: "free" } : null,
              );
              Alert.alert("Success", "Downgraded to Free plan");
            } catch (error) {
              Alert.alert("Error", "Failed to downgrade subscription");
            }
          },
        },
      ],
    );
  };

  const getPlanColor = (tier: SubscriptionTier, current: boolean) => {
    if (current) return "#10B981";
    switch (tier) {
      case "free":
        return "#6B7280";
      case "pro":
        return "#1E40AF";
      case "premium":
        return "#7C3AED";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const plans: Array<{
    tier: SubscriptionTier;
    name: string;
    price: string;
    features: string[];
    recommended?: boolean;
  }> = [
    {
      tier: "free",
      name: t("freePlan"),
      price: "₹0/month",
      features: SUBSCRIPTION_FEATURES.free,
    },
    {
      tier: "pro",
      name: t("proPlan"),
      price: `₹${SUBSCRIPTION_PRICING.pro.monthly}/month`,
      features: SUBSCRIPTION_FEATURES.pro,
      recommended: true,
    },
    {
      tier: "premium",
      name: t("premiumPlan"),
      price: `₹${SUBSCRIPTION_PRICING.premium.monthly}/month`,
      features: SUBSCRIPTION_FEATURES.premium,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("subscription")}</Text>
      </View>

      {/* Current Plan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("currentPlan")}</Text>
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <Text style={styles.currentPlanName}>
              {user.subscriptionTier.charAt(0).toUpperCase() +
                user.subscriptionTier.slice(1)}{" "}
              Plan
            </Text>
            <View
              style={[
                styles.currentPlanBadge,
                {
                  backgroundColor: getPlanColor(user.subscriptionTier, true),
                },
              ]}
            >
              <Text style={styles.currentPlanBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.currentPlanDescription}>
            {user.subscriptionTier === "free" &&
              "Free access with basic features"}
            {user.subscriptionTier === "pro" &&
              "Professional plan with advanced features"}
            {user.subscriptionTier === "premium" &&
              "Premium plan with all features included"}
          </Text>

          {user.subscriptionTier !== "free" && (
            <TouchableOpacity
              style={styles.downgradeButton}
              onPress={handleDowngrade}
            >
              <Text style={styles.downgradeButtonText}>Downgrade to Free</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Available Plans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Plans</Text>
        {plans.map((plan, index) => {
          const isCurrent = plan.tier === user.subscriptionTier;
          const canUpgrade =
            (user.subscriptionTier === "free" && plan.tier !== "free") ||
            (user.subscriptionTier === "pro" && plan.tier === "premium");

          return (
            <View
              key={index}
              style={[
                styles.planCard,
                isCurrent && styles.currentPlan,
                plan.recommended && !isCurrent && styles.recommendedPlan,
              ]}
            >
              {plan.recommended && !isCurrent && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text
                  style={[
                    styles.planPrice,
                    { color: getPlanColor(plan.tier, isCurrent) },
                  ]}
                >
                  {plan.price}
                </Text>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={styles.featureRow}>
                    <Text style={styles.featureIcon}>✅</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {isCurrent ? (
                <View style={styles.currentPlanButton}>
                  <Text style={styles.currentPlanButtonText}>Current Plan</Text>
                </View>
              ) : canUpgrade ? (
                <TouchableOpacity
                  style={[
                    styles.upgradeButton,
                    { backgroundColor: getPlanColor(plan.tier, false) },
                  ]}
                  onPress={() => handleUpgrade(plan.tier)}
                >
                  <Text style={styles.upgradeButtonText}>
                    {plan.tier === "pro"
                      ? "Upgrade to Pro"
                      : "Upgrade to Premium"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.unavailableButton}>
                  <Text style={styles.unavailableButtonText}>
                    {user.subscriptionTier === "premium" &&
                    plan.tier !== "premium"
                      ? "Downgrade Available"
                      : "Not Available"}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Upgrade?</Text>
        <View style={styles.benefitsCard}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🚀</Text>
            <Text style={styles.benefitText}>
              Unlimited access to all legal tools
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🔐</Text>
            <Text style={styles.benefitText}>
              Advanced security with biometric vault
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⚖️</Text>
            <Text style={styles.benefitText}>
              AI-powered legal research and comparison
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📱</Text>
            <Text style={styles.benefitText}>
              Priority support and regular updates
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
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#1E40AF",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  currentPlanCard: {
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
  currentPlanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  currentPlanName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  currentPlanBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  currentPlanDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  downgradeButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  downgradeButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "500",
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  currentPlan: {
    borderColor: "#10B981",
    borderWidth: 2,
  },
  recommendedPlan: {
    borderColor: "#1E40AF",
    borderWidth: 2,
  },
  recommendedBadge: {
    position: "absolute",
    top: -8,
    left: 20,
    right: 20,
    backgroundColor: "#1E40AF",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    zIndex: 1,
  },
  recommendedText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  planHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 12,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  upgradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  currentPlanButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  currentPlanButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  unavailableButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  unavailableButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  benefitsCard: {
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
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
});
