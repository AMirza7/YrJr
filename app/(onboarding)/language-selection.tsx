import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
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
import { INDIAN_LANGUAGES } from "@/constants/LegalConstants";

export default function LanguageSelectionScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleContinue = () => {
    router.push("/(onboarding)/role-selection");
  };

  const renderLanguageItem = ({
    item,
  }: {
    item: (typeof INDIAN_LANGUAGES)[0];
  }) => {
    const isSelected = selectedLanguage === item.code;

    return (
      <TouchableOpacity
        onPress={() => setSelectedLanguage(item.code)}
        style={styles.languageItem}
      >
        <Card
          style={[
            styles.languageCard,
            {
              borderColor: isSelected ? theme.primary : theme.border,
              backgroundColor: isSelected
                ? theme.primary + "10"
                : theme.surface,
            },
          ]}
          padding="medium"
        >
          <View style={styles.languageContent}>
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.languageNative, { color: theme.textSecondary }]}
              >
                {item.nativeName}
              </Text>
            </View>
            {isSelected && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.primary}
              />
            )}
          </View>
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
          Choose Your Language
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select your preferred language for the app interface and voice
          commands
        </Text>

        <FlatList
          data={INDIAN_LANGUAGES}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.languageList}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            fullWidth
            gradient
            disabled={!selectedLanguage}
          />
        </View>
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
  languageList: {
    paddingBottom: Spacing.xl,
  },
  languageItem: {
    marginBottom: Spacing.md,
  },
  languageCard: {
    borderWidth: 2,
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  languageNative: {
    fontSize: FontSizes.sm,
  },
  buttonContainer: {
    paddingVertical: Spacing.lg,
  },
});
