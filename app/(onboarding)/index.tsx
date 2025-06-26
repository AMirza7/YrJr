import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { Button } from "@/components/ui/Button";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  Layout,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const handleGetStarted = () => {
    router.push("/(onboarding)/language-selection");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <LinearGradient
        colors={[theme.primary + "20", theme.secondary + "20"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo and App Name */}
          <View style={styles.logoContainer}>
            <View
              style={[styles.logoCircle, { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.logoText, { color: theme.textInverse }]}>
                ⚖️
              </Text>
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>
              LegalTax Assistant
            </Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Your Complete Indian Legal System Companion
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <FeatureItem
              icon="🔍"
              title="Smart Legal Search"
              description="Search IPC, CrPC, BNS, BNSS & Judgments"
              theme={theme}
            />
            <FeatureItem
              icon="🎤"
              title="Voice Assistant"
              description="Ask questions in any Indian language"
              theme={theme}
            />
            <FeatureItem
              icon="📱"
              title="Real-time Updates"
              description="Latest court orders and legal updates"
              theme={theme}
            />
            <FeatureItem
              icon="💬"
              title="Connect with Lawyers"
              description="Chat with verified legal professionals"
              theme={theme}
            />
          </View>

          {/* Get Started Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              fullWidth
              gradient
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  theme: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  theme,
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureText}>
      <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Layout.bottomSafeArea + Spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: FontSizes.heading,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
  },
  featuresContainer: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
    width: 50,
    textAlign: "center",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingTop: Spacing.lg,
  },
});
