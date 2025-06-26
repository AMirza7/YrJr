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
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      Alert.alert(
        "Error",
        "Please accept both Terms & Conditions and Privacy Policy to continue.",
      );
      return;
    }

    setLoading(true);
    try {
      // Simulate completing onboarding
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        "Welcome!",
        "Your account has been created successfully. Welcome to LegalTax Assistant!",
        [
          {
            text: "Get Started",
            onPress: () => {
              // Force a complete app restart to show the main app
              router.replace("/(main)/(tabs)/home");
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CheckboxItem = ({
    checked,
    onPress,
    title,
    description,
  }: {
    checked: boolean;
    onPress: () => void;
    title: string;
    description: string;
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.checkboxItem}>
      <View style={styles.checkboxContainer}>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: checked ? theme.primary : "transparent",
              borderColor: checked ? theme.primary : theme.border,
            },
          ]}
        >
          {checked && (
            <Ionicons name="checkmark" size={16} color={theme.textInverse} />
          )}
        </View>
        <View style={styles.checkboxText}>
          <Text style={[styles.checkboxTitle, { color: theme.text }]}>
            {title}
          </Text>
          <Text
            style={[styles.checkboxDescription, { color: theme.textSecondary }]}
          >
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          Terms & Privacy
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View
            style={[styles.icon, { backgroundColor: theme.primary + "20" }]}
          >
            <Ionicons name="shield-checkmark" size={48} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Please review and accept our terms and privacy policy to complete your
          registration
        </Text>

        <Card style={styles.termsCard} padding="large">
          <Text style={[styles.termsTitle, { color: theme.text }]}>
            Terms & Conditions
          </Text>
          <Text style={[styles.termsText, { color: theme.textSecondary }]}>
            By using LegalTax Assistant, you agree to:
          </Text>
          <View style={styles.termsList}>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Use the app for lawful purposes only
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Provide accurate information during registration
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Respect intellectual property rights
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Follow community guidelines in forums
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Not misuse or abuse the platform
            </Text>
          </View>
        </Card>

        <Card style={styles.termsCard} padding="large">
          <Text style={[styles.termsTitle, { color: theme.text }]}>
            Privacy Policy
          </Text>
          <Text style={[styles.termsText, { color: theme.textSecondary }]}>
            We are committed to protecting your privacy:
          </Text>
          <View style={styles.termsList}>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Your personal data is encrypted and secure
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • We don't sell your information to third parties
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Data is used to improve our services
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • You can request data deletion anytime
            </Text>
            <Text style={[styles.termItem, { color: theme.textSecondary }]}>
              • Cookies enhance your user experience
            </Text>
          </View>
        </Card>

        <View style={styles.checkboxesContainer}>
          <CheckboxItem
            checked={acceptedTerms}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            title="I accept the Terms & Conditions"
            description="You agree to follow our community guidelines and usage policies"
          />

          <CheckboxItem
            checked={acceptedPrivacy}
            onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
            title="I accept the Privacy Policy"
            description="You consent to our data collection and usage practices"
          />
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color={theme.info} />
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            Legal advice provided through this app should not replace
            consultation with a qualified lawyer for serious legal matters.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface }]}>
        <Button
          title="Complete Registration"
          onPress={handleFinish}
          variant="primary"
          size="large"
          fullWidth
          gradient
          loading={loading}
          disabled={!acceptedTerms || !acceptedPrivacy}
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
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  termsCard: {
    marginBottom: Spacing.lg,
  },
  termsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  termsText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  termsList: {
    paddingLeft: Spacing.sm,
  },
  termItem: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  checkboxesContainer: {
    marginVertical: Spacing.xl,
  },
  checkboxItem: {
    marginBottom: Spacing.lg,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  checkboxDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  noteText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginLeft: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
});
