import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SUBSCRIPTION_PLANS } from "@/constants/LegalConstants";
import { AuthService } from "@/services/auth";

export default function SubscriptionScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Create user with selected subscription
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);
      if (plan) {
        const subscriptionData = {
          type: plan.id as "monthly" | "quarterly" | "yearly",
          price: plan.price,
          startDate: new Date(),
          endDate: new Date(
            Date.now() +
              (plan.id === "monthly"
                ? 30
                : plan.id === "quarterly"
                  ? 90
                  : 365) *
                24 *
                60 *
                60 *
                1000,
          ),
          isActive: true,
        };

        // For demo, create a mock user
        await AuthService.createUser({
          email: "demo@legaltax.com",
          phone: "9876543210",
          role: "lawyer",
          name: "Demo User",
          language: "en",
          subscription: subscriptionData,
        });

        router.push("/(onboarding)/terms");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPlanCard = (plan: (typeof SUBSCRIPTION_PLANS)[0]) => {
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        key={plan.id}
        onPress={() => setSelectedPlan(plan.id)}
        style={styles.planItem}
      >
        <Card
          style={[
            styles.planCard,
            {
              borderColor: isSelected ? theme.primary : theme.border,
              backgroundColor: isSelected
                ? theme.primary + "10"
                : theme.surface,
            },
            plan.popular && styles.popularCard,
          ]}
          padding="large"
        >
          {plan.popular && (
            <View
              style={[styles.popularBadge, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.popularText, { color: theme.textInverse }]}>
                Most Popular
              </Text>
            </View>
          )}

          <View style={styles.planHeader}>
            <Text style={[styles.planTitle, { color: theme.text }]}>
              {plan.title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.text }]}>
                ₹{plan.price}
              </Text>
              <Text style={[styles.duration, { color: theme.textSecondary }]}>
                /{plan.duration}
              </Text>
            </View>
            {plan.originalPrice && (
              <Text
                style={[styles.originalPrice, { color: theme.textTertiary }]}
              >
                ₹{plan.originalPrice}
              </Text>
            )}
          </View>

          <View style={styles.featuresContainer}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.success}
                />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.primary}
              />
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          Choose Your Plan
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select a subscription plan to access all features of LegalTax
          Assistant
        </Text>

        <View style={styles.plansContainer}>
          {SUBSCRIPTION_PLANS.map(renderPlanCard)}
        </View>

        <View style={styles.guaranteeContainer}>
          <View
            style={[
              styles.guaranteeIcon,
              { backgroundColor: theme.success + "20" },
            ]}
          >
            <Ionicons name="shield-checkmark" size={32} color={theme.success} />
          </View>
          <Text style={[styles.guaranteeTitle, { color: theme.text }]}>
            30-Day Money Back Guarantee
          </Text>
          <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface }]}>
        <Button
          title={`Continue with ${SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.title}`}
          onPress={handleContinue}
          variant="primary"
          size="large"
          fullWidth
          gradient
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  plansContainer: {
    marginBottom: Spacing.xl,
  },
  planItem: {
    marginBottom: Spacing.lg,
  },
  planCard: {
    borderWidth: 2,
    position: "relative",
  },
  popularCard: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: "absolute",
    top: -1,
    left: Spacing.lg,
    right: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    alignItems: "center",
  },
  popularText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  planTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  duration: {
    fontSize: FontSizes.md,
    marginLeft: Spacing.xs,
  },
  originalPrice: {
    fontSize: FontSizes.sm,
    textDecorationLine: "line-through",
  },
  featuresContainer: {
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  featureText: {
    fontSize: FontSizes.sm,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  selectedIndicator: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
  },
  guaranteeContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  guaranteeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  guaranteeTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  guaranteeText: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
});
