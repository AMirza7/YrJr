import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { USER_ROLES } from "@/constants/LegalConstants";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { User, UserRole } from "@/types";
import { AuthService } from "@/services/auth";

interface UserRoleInfo {
  role: UserRole;
  isVerified: boolean;
  lastUsed: Date;
  permissions: string[];
}

interface RoleSwitchProps {
  currentUser: User;
  onRoleChange: (newRole: UserRole) => void;
  userRoles?: UserRoleInfo[];
}

export const RoleSwitch: React.FC<RoleSwitchProps> = ({
  currentUser,
  onRoleChange,
  userRoles = [],
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [availableRoles, setAvailableRoles] = useState<UserRoleInfo[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [switching, setSwitching] = useState(false);

  const scaleValue = useSharedValue(1);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    // In a real app, this would fetch from an API
    // For demo, we'll simulate multiple roles for some users
    const mockRoles: UserRoleInfo[] = [
      {
        role: currentUser.role,
        isVerified: currentUser.isVerified,
        lastUsed: new Date(),
        permissions: getRolePermissions(currentUser.role),
      },
    ];

    // Add additional roles for demo (lawyers might also be law students, etc.)
    if (currentUser.role === "lawyer") {
      mockRoles.push({
        role: "law_student",
        isVerified: true,
        lastUsed: new Date(Date.now() - 86400000), // 1 day ago
        permissions: getRolePermissions("law_student"),
      });
    }

    if (currentUser.role === "junior_lawyer") {
      mockRoles.push({
        role: "law_student",
        isVerified: true,
        lastUsed: new Date(Date.now() - 172800000), // 2 days ago
        permissions: getRolePermissions("law_student"),
      });
    }

    setAvailableRoles(mockRoles);
  };

  const getRolePermissions = (role: UserRole): string[] => {
    const permissions: Record<UserRole, string[]> = {
      lawyer: [
        "Create legal documents",
        "Access all court orders",
        "Communicate with clients",
        "Schedule court hearings",
        "Access premium features",
      ],
      junior_lawyer: [
        "Create basic documents",
        "Access court orders",
        "Communicate with clients",
        "Schedule hearings",
      ],
      lawyer_assistant: [
        "Access court orders",
        "Manage calendars",
        "Basic communication",
      ],
      law_office_helper: [
        "Access basic features",
        "View schedules",
        "Limited communication",
      ],
      law_student: [
        "Access study materials",
        "Join study groups",
        "Take quizzes",
        "Basic legal research",
      ],
    };

    return permissions[role] || [];
  };

  const getRoleInfo = (roleId: UserRole) => {
    return USER_ROLES.find((role) => role.id === roleId);
  };

  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === selectedRole) return;

    try {
      setSwitching(true);

      // Animate scale
      scaleValue.value = withSpring(0.95, {}, () => {
        scaleValue.value = withSpring(1);
      });

      // Update user role
      await AuthService.updateUser({ role: newRole });

      setSelectedRole(newRole);
      onRoleChange(newRole);

      // Update last used time for the role
      const updatedRoles = availableRoles.map((roleInfo) => ({
        ...roleInfo,
        lastUsed: roleInfo.role === newRole ? new Date() : roleInfo.lastUsed,
      }));
      setAvailableRoles(updatedRoles);
    } catch (error) {
      console.error("Error switching role:", error);
      Alert.alert("Error", "Failed to switch role. Please try again.");
    } finally {
      setSwitching(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const formatLastUsed = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (availableRoles.length <= 1) {
    return null; // Don't show if user has only one role
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Card style={styles.card} padding="medium">
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.switchIcon,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Ionicons
                name="swap-horizontal"
                size={24}
                color={theme.primary}
              />
            </View>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                Switch Role
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                You have multiple roles
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rolesContainer}
        >
          {availableRoles.map((roleInfo) => {
            const role = getRoleInfo(roleInfo.role);
            if (!role) return null;

            const isSelected = roleInfo.role === selectedRole;
            const isCurrentRole = roleInfo.role === currentUser.role;

            return (
              <TouchableOpacity
                key={roleInfo.role}
                onPress={() => handleRoleSwitch(roleInfo.role)}
                disabled={switching}
                style={[
                  styles.roleItem,
                  {
                    backgroundColor: isSelected
                      ? theme.primary + "10"
                      : theme.surface,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <View style={styles.roleHeader}>
                  <View
                    style={[
                      styles.roleIconContainer,
                      { backgroundColor: role.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={20}
                      color={role.color}
                    />
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.selectedBadge,
                        { backgroundColor: theme.primary },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={theme.textInverse}
                      />
                    </View>
                  )}

                  {isCurrentRole && !isSelected && (
                    <View style={styles.currentBadge}>
                      <Text
                        style={[
                          styles.currentBadgeText,
                          { color: theme.textTertiary },
                        ]}
                      >
                        Current
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[styles.roleTitle, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {role.title}
                </Text>

                <Text
                  style={[
                    styles.roleDescription,
                    { color: theme.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {role.description}
                </Text>

                <View style={styles.roleFooter}>
                  <View style={styles.verificationStatus}>
                    <Ionicons
                      name={
                        roleInfo.isVerified
                          ? "checkmark-circle"
                          : "time-outline"
                      }
                      size={12}
                      color={
                        roleInfo.isVerified ? theme.success : theme.warning
                      }
                    />
                    <Text
                      style={[
                        styles.verificationText,
                        {
                          color: roleInfo.isVerified
                            ? theme.success
                            : theme.warning,
                        },
                      ]}
                    >
                      {roleInfo.isVerified ? "Verified" : "Pending"}
                    </Text>
                  </View>

                  <Text
                    style={[styles.lastUsed, { color: theme.textTertiary }]}
                  >
                    {formatLastUsed(roleInfo.lastUsed)}
                  </Text>
                </View>

                {isSelected && (
                  <View style={styles.permissionsContainer}>
                    <Text
                      style={[
                        styles.permissionsTitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Permissions:
                    </Text>
                    {roleInfo.permissions
                      .slice(0, 3)
                      .map((permission, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.permissionItem,
                            { color: theme.textTertiary },
                          ]}
                        >
                          • {permission}
                        </Text>
                      ))}
                    {roleInfo.permissions.length > 3 && (
                      <Text
                        style={[
                          styles.permissionItem,
                          { color: theme.textTertiary },
                        ]}
                      >
                        • +{roleInfo.permissions.length - 3} more
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {switching && (
          <View style={styles.switchingIndicator}>
            <Text
              style={[styles.switchingText, { color: theme.textSecondary }]}
            >
              Switching roles...
            </Text>
          </View>
        )}
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  rolesContainer: {
    marginBottom: Spacing.md,
  },
  roleItem: {
    width: 200,
    padding: Spacing.md,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  roleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  currentBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  currentBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  roleTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: FontSizes.xs,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  roleFooter: {
    marginBottom: Spacing.sm,
  },
  verificationStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  verificationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  lastUsed: {
    fontSize: FontSizes.xs,
  },
  permissionsContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  permissionsTitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  permissionItem: {
    fontSize: FontSizes.xs,
    lineHeight: 14,
    marginBottom: 2,
  },
  switchingIndicator: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  switchingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
