import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import {
  paymentService,
  PaymentPlan,
  PaymentHistory,
} from "@/services/payment";

// Plans will be loaded from payment service

export default function SubscriptionScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [processing, setProcessing] = useState(false);

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

      // Load payment plans and history
      const availablePlans = paymentService.getAvailablePlans();
      const history = await paymentService.getPaymentHistory(
        currentUser.id || "demo",
      );

      setPlans(availablePlans);
      setPaymentHistory(history);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    if (planId === user.subscriptionTier) {
      Alert.alert("Already Subscribed", "You already have this plan active.");
      return;
    }

    if (plan.price === 0) {
      // Free plan - direct upgrade
      const updatedUser = { ...user, subscriptionTier: planId as any };
      const success = await authService.updateUser(updatedUser);

      if (success) {
        setUser(updatedUser);
        Alert.alert("Success!", "Your plan has been updated successfully.");
      }
      return;
    }

    // Paid plan - initiate payment
    Alert.alert(
      "Upgrade Subscription",
      `Upgrade to ${plan.name} plan for ${paymentService.formatCurrency(plan.price)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue to Payment",
          onPress: () => handlePayment(plan),
        },
      ],
    );
  };

  const handlePayment = async (plan: PaymentPlan) => {
    if (!user) return;

    setProcessing(true);

    try {
      // Demo payment flow
      const success = await paymentService.simulatePaymentFlow(plan);

      if (success) {
        // Update user subscription
        const updatedUser = { ...user, subscriptionTier: plan.id as any };
        const updateSuccess = await authService.updateUser(updatedUser);

        if (updateSuccess) {
          setUser(updatedUser);

          // Reload payment history
          const history = await paymentService.getPaymentHistory(
            user.id || "demo",
          );
          setPaymentHistory(history);
        }
      }
    } catch (error) {
      Alert.alert(
        "Payment Error",
        "Failed to process payment. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const PlanCard = ({ plan }: { plan: PaymentPlan }) => {
    const isCurrentPlan = user?.subscriptionTier === plan.id;
    const planColor = plan.popular
      ? "#3b82f6"
      : plan.price === 0
        ? "#6b7280"
        : "#7c3aed";

    return (
      <View
        style={[
          styles.planCard,
          { borderColor: planColor },
          isCurrentPlan && styles.currentPlan,
          plan.popular && styles.recommendedPlan,
        ]}
      >
        {plan.popular && (
          <View
            style={[styles.recommendedBadge, { backgroundColor: planColor }]}
          >
            <Text style={styles.recommendedText}>MOST POPULAR</Text>
          </View>
        )}

        {plan.discountPercentage && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              Save {plan.discountPercentage}%
            </Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: planColor }]}>
            {plan.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.planPrice, { color: planColor }]}>
              {paymentService.formatCurrency(plan.price)}
            </Text>
            <Text style={styles.planPeriod}>/{plan.duration}</Text>
          </View>

          {plan.discountPercentage && (
            <Text style={styles.originalPrice}>
              Was:{" "}
              {paymentService.formatCurrency(
                plan.price +
                  paymentService.calculateDiscount(
                    plan.price,
                    plan.discountPercentage,
                  ),
              )}
            </Text>
          )}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>✅ Features:</Text>
          {plan.features.map((feature, index) => (
            <Text key={index} style={styles.featureText}>
              • {feature}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.planButton,
            { backgroundColor: isCurrentPlan ? "#6b7280" : planColor },
            isCurrentPlan && styles.currentPlanButton,
            processing && styles.planButtonDisabled,
          ]}
          onPress={() => handleUpgrade(plan.id)}
          disabled={isCurrentPlan || processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.planButtonText}>
              {isCurrentPlan
                ? "Current Plan"
                : plan.price === 0
                  ? "Select Free"
                  : `Upgrade - ${paymentService.formatCurrency(plan.price)}`}
            </Text>
          )}
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
            {plans.find((p) => p.id === user?.subscriptionTier)?.name ||
              "Basic"}
          </Text>
          <Text style={styles.currentPlanStatus}>
            {user?.subscriptionTier === "basic" ||
            plans.find((p) => p.id === user?.subscriptionTier)?.price === 0
              ? "No billing - Free forever"
              : "Next billing: February 15, 2025"}
          </Text>
        </View>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💳 Payment History</Text>
            <View style={styles.historyContainer}>
              {paymentHistory.slice(0, 3).map((payment) => (
                <View key={payment.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyPlan}>
                      {plans.find((p) => p.id === payment.planId)?.name ||
                        payment.planId}
                    </Text>
                    <Text style={styles.historyDate}>
                      {payment.date.toLocaleDateString("en-IN")}
                    </Text>
                  </View>
                  <View style={styles.historyAmount}>
                    <Text style={styles.historyPrice}>
                      {paymentService.formatCurrency(payment.amount)}
                    </Text>
                    <Text
                      style={[
                        styles.historyStatus,
                        {
                          color:
                            payment.status === "success"
                              ? "#059669"
                              : "#ef4444",
                        },
                      ]}
                    >
                      {payment.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          {plans.map((plan) => (
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
  planButtonDisabled: {
    opacity: 0.6,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 14,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  historyContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  historyInfo: {
    flex: 1,
  },
  historyPlan: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  historyAmount: {
    alignItems: "flex-end",
  },
  historyPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 10,
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
