import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/components/auth/AuthContext";
import { ROLE_DISPLAY_INFO, ROLE_FEATURES } from "@/constants/AuthConstants";
import { HOME_SECTIONS } from "@/constants/LegalConstants";
import { LegalTheme, FontSizes, FontWeights, Spacing } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserRole } from "@/types";

interface RoleDashboardProps {
  children: React.ReactNode;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const { user, hasFeatureAccess, checkPermission } = useAuth();

  if (!user) {
    return null;
  }

  const roleInfo = ROLE_DISPLAY_INFO[user.role];
  const allowedFeatures = ROLE_FEATURES[user.role];
  const filteredSections = HOME_SECTIONS.filter((section) =>
    hasFeatureAccess(section.id),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Role Header */}
      <View style={[styles.roleHeader, { backgroundColor: theme.card }]}>
        <View
          style={[
            styles.roleIconContainer,
            { backgroundColor: roleInfo.color + "20" },
          ]}
        >
          <Ionicons
            name={roleInfo.icon as any}
            size={24}
            color={roleInfo.color}
          />
        </View>
        <View style={styles.roleTextContainer}>
          <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.roleTitle, { color: roleInfo.color }]}>
            {roleInfo.title}
          </Text>
        </View>
      </View>

      {/* Role Permissions Summary */}
      <View style={[styles.permissionsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.permissionsTitle, { color: theme.text }]}>
          Your Access Level
        </Text>
        <View style={styles.permissionsList}>
          <PermissionItem
            icon="create-outline"
            text="Edit Cases"
            enabled={checkPermission("canEditCases")}
            theme={theme}
          />
          <PermissionItem
            icon="folder-outline"
            text="Client Folders"
            enabled={checkPermission("canViewClientFolders")}
            theme={theme}
          />
          <PermissionItem
            icon="shield-checkmark-outline"
            text="Secure Vault"
            enabled={checkPermission("canAccessSecureVault")}
            theme={theme}
          />
          <PermissionItem
            icon="school-outline"
            text="Learning Tools"
            enabled={checkPermission("canUseFlashcards")}
            theme={theme}
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      {/* Available Features Summary */}
      <View style={[styles.featuresCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.featuresTitle, { color: theme.text }]}>
          Available Features ({filteredSections.length})
        </Text>
        <Text
          style={[styles.featuresDescription, { color: theme.textSecondary }]}
        >
          {roleInfo.description}
        </Text>
      </View>
    </View>
  );
};

interface PermissionItemProps {
  icon: string;
  text: string;
  enabled: boolean;
  theme: any;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
  icon,
  text,
  enabled,
  theme,
}) => (
  <View style={styles.permissionItem}>
    <Ionicons
      name={icon as any}
      size={16}
      color={enabled ? theme.success : theme.textSecondary}
    />
    <Text
      style={[
        styles.permissionText,
        {
          color: enabled ? theme.text : theme.textSecondary,
          opacity: enabled ? 1 : 0.6,
        },
      ]}
    >
      {text}
    </Text>
    <Ionicons
      name={enabled ? "checkmark-circle" : "close-circle"}
      size={16}
      color={enabled ? theme.success : theme.textSecondary}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 16,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  roleTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: 2,
  },
  roleTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  permissionsCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 16,
  },
  permissionsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  permissionsList: {
    gap: Spacing.xs,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  permissionText: {
    flex: 1,
    fontSize: FontSizes.sm,
  },
  content: {
    flex: 1,
  },
  featuresCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 16,
  },
  featuresTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  featuresDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
