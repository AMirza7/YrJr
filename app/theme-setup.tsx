import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ThemeMode } from "@/types";

const THEME_OPTIONS = [
  {
    mode: "light" as ThemeMode,
    name: "Light",
    emoji: "☀️",
    description: "Clean and bright interface",
    colors: {
      background: "#ffffff",
      text: "#000000",
      primary: "#1e40af",
    },
  },
  {
    mode: "dark" as ThemeMode,
    name: "Dark",
    emoji: "🌙",
    description: "Easy on the eyes",
    colors: {
      background: "#111827",
      text: "#ffffff",
      primary: "#3b82f6",
    },
  },
  {
    mode: "system" as ThemeMode,
    name: "System",
    emoji: "📱",
    description: "Follow device settings",
    colors: {
      background: "#f3f4f6",
      text: "#374151",
      primary: "#6366f1",
    },
  },
];

export default function ThemeSetupScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { t } = useLocalization();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [loading, setLoading] = useState(false);

  const handleThemeSelect = (mode: ThemeMode) => {
    setSelectedTheme(mode);
    setThemeMode(mode);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Simulate saving preferences
      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert.alert(
        "Theme Saved!",
        `Your theme preference has been set to ${selectedTheme}. You can change this anytime in Settings.`,
        [
          {
            text: "Continue",
            onPress: () => {
              // Navigate to main app
              router.replace("/(tabs)");
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save theme preference");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Theme</Text>
        <Text style={styles.subtitle}>
          Customize your app appearance to match your preference
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.themeOptions}>
          {THEME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.themeOption,
                selectedTheme === option.mode && styles.themeOptionSelected,
              ]}
              onPress={() => handleThemeSelect(option.mode)}
            >
              <View style={styles.themePreview}>
                <View
                  style={[
                    styles.previewBackground,
                    { backgroundColor: option.colors.background },
                  ]}
                >
                  <View
                    style={[
                      styles.previewHeader,
                      { backgroundColor: option.colors.primary },
                    ]}
                  />
                  <View style={styles.previewContent}>
                    <View
                      style={[
                        styles.previewText,
                        { backgroundColor: option.colors.text },
                      ]}
                    />
                    <View
                      style={[
                        styles.previewText,
                        { backgroundColor: option.colors.text, opacity: 0.6 },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.themeInfo}>
                <Text style={styles.themeEmoji}>{option.emoji}</Text>
                <View style={styles.themeDetails}>
                  <Text style={styles.themeName}>{option.name}</Text>
                  <Text style={styles.themeDescription}>
                    {option.description}
                  </Text>
                </View>
                {selectedTheme === option.mode && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View
            style={[
              styles.livePreview,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.previewCard,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Text
                style={[styles.previewCardTitle, { color: theme.colors.text }]}
              >
                Legal Pinboard
              </Text>
              <Text
                style={[
                  styles.previewCardText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Organize your legal research and case notes effectively
              </Text>
              <View
                style={[
                  styles.previewButton,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.previewButtonText}>Open Pinboard</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? "Saving..." : "Continue with " + selectedTheme}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text
              style={[
                styles.skipButtonText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tips}>
          <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
            💡 Tips
          </Text>
          <Text
            style={[styles.tipsText, { color: theme.colors.textSecondary }]}
          >
            • Light theme is great for daytime use and better readability{"\n"}•
            Dark theme reduces eye strain in low-light conditions{"\n"}• System
            theme automatically adapts to your device settings{"\n"}• You can
            change your theme anytime in Settings
          </Text>
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
  header: {
    backgroundColor: "#6366f1",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  themeOptions: {
    marginBottom: 30,
  },
  themeOption: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#f0f9ff",
  },
  themePreview: {
    marginBottom: 12,
  },
  previewBackground: {
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  previewHeader: {
    height: 20,
    width: "100%",
  },
  previewContent: {
    padding: 8,
    flex: 1,
  },
  previewText: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
    width: "60%",
  },
  themeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  themeDetails: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  selectedIcon: {
    fontSize: 24,
    color: "#6366f1",
    fontWeight: "bold",
  },
  previewSection: {
    marginBottom: 30,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  livePreview: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  previewCard: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  previewCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  previewCardText: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  previewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  previewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    marginBottom: 30,
  },
  continueButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    padding: 12,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tips: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
