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
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { USER_ROLES } from "@/constants/LegalConstants";
import { UserRole } from "@/types";

export default function RoleSelectionScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      router.push("/(onboarding)/phone-verification");
    }
  };

  const renderRoleItem = ({ item }: { item: (typeof USER_ROLES)[0] }) => {
    const isSelected = selectedRole === item.id;

    return (
      <TouchableOpacity
        onPress={() => setSelectedRole(item.id as UserRole)}
        style={styles.roleItem}
      >
        <Card
          style={[
            styles.roleCard,
            {
              borderColor: isSelected ? theme.primary : theme.border,
              backgroundColor: isSelected
                ? theme.primary + "10"
                : theme.surface,
            },
          ]}
          padding="medium"
        >
          <View style={styles.roleContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color + "20" },
              ]}
            >
              <Ionicons name={item.icon as any} size={32} color={item.color} />
            </View>

            <View style={styles.roleInfo}>
              <Text style={[styles.roleTitle, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.roleDescription, { color: theme.textSecondary }]}
              >
                {item.description}
              </Text>
              {item.requiresVerification && (
                <View style={styles.verificationBadge}>
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={theme.primary}
                  />
                  <Text
                    style={[styles.verificationText, { color: theme.primary }]}
                  >
                    Verification Required
                  </Text>
                </View>
              )}
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
          Select Your Role
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose your professional role to get personalized features and content
        </Text>

        <FlatList
          data={USER_ROLES}
          renderItem={renderRoleItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.roleList}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            fullWidth
            gradient
            disabled={!selectedRole}
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
  roleList: {
    paddingBottom: Spacing.xl,
  },
  roleItem: {
    marginBottom: Spacing.md,
  },
  roleCard: {
    borderWidth: 2,
  },
  roleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  verificationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  buttonContainer: {
    paddingVertical: Spacing.lg,
  },
});
