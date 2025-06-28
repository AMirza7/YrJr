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
import { storage } from "@/services/storage";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import {
  paymentService,
  PaymentPlan,
  PaymentHistory,
} from "@/services/payment";

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
      const currentUser = await storage.getUser();
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
      await storage.setUser(updatedUser);
      setUser(updatedUser);
      Alert.alert("Success!", "Your plan has been updated successfully.");
      return;
    }

    // Paid plan - initiate payment
    Alert.alert(
      "Upgrade Subscription",
      `Upgrade to ${plan.name} plan for ${paymentService.formatCurrency(plan.price)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay with Razorpay",
          onPress: () => handleRazorpayPayment(plan),
        },
        {
          text: "Pay with UPI",
          onPress: () => handleUPIPayment(plan),
        },
      ],
    );
  };

  const handleRazorpayPayment = async (plan: PaymentPlan) => {
    if (!user) return;

    setProcessing(true);
    try {
      const userDetails = {
        name: user.name,
        email: user.email,
        phone: user.phone || "+91-9999999999", // Fallback phone
      };

      // Use real Razorpay integration
      const result = await paymentService.initiateRazorpayPayment(
        plan,
        userDetails,
      );

      if (result.success) {
        // Update user subscription
        const updatedUser = { ...user, subscriptionTier: plan.id as any };
        await storage.setUser(updatedUser);
        setUser(updatedUser);

        // Reload payment history
        const history = await paymentService.getPaymentHistory(
          user.id || "demo",
        );
        setPaymentHistory(history);

        Alert.alert(
          "Payment Successful!",
          `Your ${plan.name} subscription is now active.\n\nPayment ID: ${result.paymentId}`,
          [{ text: "Continue" }],
        );
      } else {
        Alert.alert(
          "Payment Failed",
          result.error || "Payment could not be processed.",
        );
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

  const handleUPIPayment = async (plan: PaymentPlan) => {
    if (!user) return;

    setProcessing(true);
    try {
      const result = await paymentService.initiateUPIPayment(plan);

      if (result.success && result.upiLink) {
        Alert.alert("UPI Payment", "Opening UPI app for payment...", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open UPI App",
            onPress: async () => {
              // In real app, this would open the UPI app
              // Linking.openURL(result.upiLink);
              Alert.alert(
                "Demo Mode",
                "UPI payment simulation completed successfully!",
              );

              // Simulate successful payment
              const updatedUser = { ...user, subscriptionTier: plan.id as any };
              await storage.setUser(updatedUser);
              setUser(updatedUser);

              // Reload payment history
              const history = await paymentService.getPaymentHistory(
                user.id || "demo",
              );
              setPaymentHistory(history);
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to generate UPI payment link",
        );
      }
    } catch (error) {
      Alert.alert("Error", "UPI payment failed. Please try again.");
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
            { backgroundColor: planColor },
            isCurrentPlan && styles.currentPlanButton,
          ]}
          onPress={() => handleUpgrade(plan.id)}
          disabled={processing || isCurrentPlan}
        >
          <Text style={styles.planButtonText}>
            {isCurrentPlan
              ? "✓ Current Plan"
              : plan.price === 0
                ? "Switch to Free"
                : `Upgrade - ${paymentService.formatCurrency(plan.price)}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading subscription plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Settings" color="#fff" />
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>
          Choose the perfect plan for your legal practice
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Subscription Status */}
        {user && (
          <View style={styles.currentSubscriptionCard}>
            <Text style={styles.currentSubscriptionTitle}>Current Plan</Text>
            <View style={styles.currentSubscriptionInfo}>
              <Text style={styles.currentPlanName}>
                {plans.find((p) => p.id === user.subscriptionTier)?.name ||
                  "Basic"}
              </Text>
              <Text style={styles.currentPlanPrice}>
                {paymentService.formatCurrency(
                  plans.find((p) => p.id === user.subscriptionTier)?.price || 0,
                )}
                /month
              </Text>
            </View>
            <Text style={styles.currentPlanStatus}>
              ✅ Active • Renews automatically
            </Text>
          </View>
        )}

        {/* Payment Methods Info */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.paymentMethodsTitle}>💳 Payment Methods</Text>
          <Text style={styles.paymentMethodsText}>
            We support multiple payment options:
          </Text>
          <View style={styles.paymentOptionsList}>
            <Text style={styles.paymentOption}>
              🔒 Razorpay (Cards, UPI, Net Banking)
            </Text>
            <Text style={styles.paymentOption}>📱 Direct UPI Payment</Text>
            <Text style={styles.paymentOption}>
              💼 Corporate/Business Payments
            </Text>
            <Text style={styles.paymentOption}>🔄 Auto-renewal Support</Text>
          </View>
        </View>

        {/* Plans Grid */}
        <View style={styles.plansSection}>
          <Text style={styles.plansSectionTitle}>Available Plans</Text>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>Payment History</Text>
            {paymentHistory.slice(0, 3).map((payment) => (
              <View key={payment.id} style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyPlan}>
                    {plans.find((p) => p.id === payment.planId)?.name ||
                      "Unknown Plan"}
                  </Text>
                  <Text style={styles.historyDate}>
                    {payment.date.toLocaleDateString()}
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
                            : payment.status === "pending"
                              ? "#f59e0b"
                              : "#dc2626",
                      },
                    ]}
                  >
                    {payment.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllHistoryButton}>
              <Text style={styles.viewAllHistoryText}>
                View All Transactions
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Have questions about subscriptions or payments? Our support team is
            here to help.
          </Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => router.push("/help-support")}
          >
            <Text style={styles.supportButtonText}>💬 Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Processing Overlay */}
      {processing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.processingText}>Processing payment...</Text>
          </View>
        </View>
      )}
    </View>
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
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
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
  currentSubscriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentSubscriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
  },
  currentSubscriptionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  currentPlanName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  currentPlanPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#059669",
  },
  currentPlanStatus: {
    fontSize: 14,
    color: "#6b7280",
  },
  paymentMethodsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  paymentMethodsText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  paymentOptionsList: {
    gap: 6,
  },
  paymentOption: {
    fontSize: 14,
    color: "#374151",
  },
  plansSection: {
    marginBottom: 24,
  },
  plansSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
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
    backgroundColor: "#f0fdf4",
  },
  recommendedPlan: {
    borderWidth: 3,
  },
  recommendedBadge: {
    position: "absolute",
    top: -10,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  recommendedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  planHeader: {
    marginBottom: 16,
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
    marginBottom: 4,
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
  originalPrice: {
    fontSize: 14,
    color: "#6b7280",
    textDecorationLine: "line-through",
  },
  featuresSection: {
    marginBottom: 20,
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
  planButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  currentPlanButton: {
    backgroundColor: "#6b7280",
  },
  planButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  historySection: {
    marginBottom: 24,
  },
  historySectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyPlan: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  historyAmount: {
    alignItems: "flex-end",
  },
  historyPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewAllHistoryButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  viewAllHistoryText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  supportSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  supportButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
});
