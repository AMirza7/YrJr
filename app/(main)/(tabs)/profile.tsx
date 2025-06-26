import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RoleSwitch } from "@/components/profile/RoleSwitch";
import { DocumentScanner } from "@/components/documents/DocumentScanner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { NotificationService } from "@/services/notifications";
import { BiometricService } from "@/services/biometric";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthService } from "@/services/auth";
import { User } from "@/types";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const [user, setUser] = useState<User | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    colorScheme === "dark",
  );
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getUser();
      setUser(userData);

      // Load biometric status
      const biometricStatus = await BiometricService.isBiometricEnabled();
      setBiometricEnabled(biometricStatus);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AuthService.logout();
            router.replace("/(onboarding)");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Profile editing feature will be available soon!",
    );
  };

  const handleSubscriptionManage = () => {
    Alert.alert(
      "Manage Subscription",
      "Subscription management will be available soon!",
    );
  };

  const handleRoleChange = (newRole: string) => {
    setUser((prev) => (prev ? { ...prev, role: newRole as any } : null));
  };

  const handleDocumentScanned = (document: any) => {
    Alert.alert("Document Scanned", `Successfully scanned: ${document.name}`);
  };

  const handleBiometricToggle = async () => {
    try {
      if (biometricEnabled) {
        // Disable biometric
        await BiometricService.setBiometricEnabled(false);
        setBiometricEnabled(false);
        Alert.alert(
          "Biometric Disabled",
          "Biometric authentication has been disabled.",
        );
      } else {
        // Enable biometric
        setShowBiometricAuth(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update biometric settings.");
    }
  };

  const handleBiometricSuccess = async () => {
    try {
      await BiometricService.setBiometricEnabled(true);
      setBiometricEnabled(true);
      setShowBiometricAuth(false);
      Alert.alert(
        "Biometric Enabled",
        "Biometric authentication has been enabled.",
      );
    } catch (error) {
      Alert.alert("Error", "Failed to enable biometric authentication.");
    }
  };

  const handleNotificationSettings = async () => {
    try {
      router.push("/(main)/notification-center");
    } catch (error) {
      Alert.alert("Error", "Failed to open notification settings.");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "lawyer":
        return theme.lawyer;
      case "junior_lawyer":
        return theme.juniorLawyer;
      case "lawyer_assistant":
        return theme.lawyerAssistant;
      case "law_office_helper":
        return theme.lawOfficeHelper;
      case "law_student":
        return theme.lawStudent;
      default:
        return theme.primary;
    }
  };

  const formatRoleName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const MenuSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.menuSection}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Card style={styles.menuCard} padding="none">
        {children}
      </Card>
    </View>
  );

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showArrow = true,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.menuItem}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[styles.menuIcon, { backgroundColor: theme.primary + "20" }]}
        >
          <Ionicons name={icon as any} size={20} color={theme.primary} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, { color: theme.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {rightElement}
        {showArrow && onPress && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textTertiary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard} padding="large">
          <View style={styles.profileHeader}>
            <View
              style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
            >
              <Ionicons name="person" size={40} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user?.name || "User Name"}
              </Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                {user?.email || "user@email.com"}
              </Text>
              {user?.role && (
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(user.role) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      { color: getRoleColor(user.role) },
                    ]}
                  >
                    {formatRoleName(user.role)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.editButton}
          />
        </Card>

        {/* Role Switch */}
        {user && (
          <RoleSwitch currentUser={user} onRoleChange={handleRoleChange} />
        )}

        {/* Account Settings */}
        <MenuSection title="Account">
          <MenuItem
            icon="person-circle"
            title="Personal Information"
            subtitle="Name, email, phone number"
            onPress={handleEditProfile}
          />
          <MenuItem
            icon="shield-checkmark"
            title="Verification Status"
            subtitle={user?.isVerified ? "Verified" : "Pending verification"}
            onPress={() =>
              Alert.alert(
                "Verification",
                "Verification details will be shown here.",
              )
            }
          />
          <MenuItem
            icon="card"
            title="Subscription"
            subtitle={`${user?.subscription?.type || "No active plan"} plan`}
            onPress={handleSubscriptionManage}
          />
          <MenuItem
            icon="document-text"
            title="Documents"
            subtitle="Uploaded certificates and IDs"
            onPress={() =>
              Alert.alert(
                "Documents",
                "Document management will be available soon.",
              )
            }
          />
        </MenuSection>

        {/* App Settings */}
        <MenuSection title="Settings">
          <MenuItem
            icon="notifications"
            title="Notifications"
            subtitle="Push notifications and alerts"
            onPress={handleNotificationSettings}
          />
          <MenuItem
            icon="moon"
            title="Dark Mode"
            subtitle="Enable dark theme"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{
                  false: theme.textTertiary,
                  true: theme.primary + "50",
                }}
                thumbColor={
                  darkModeEnabled ? theme.primary : theme.textTertiary
                }
              />
            }
            showArrow={false}
          />
          <MenuItem
            icon="language"
            title="Language"
            subtitle="App language and region"
            onPress={() =>
              Alert.alert(
                "Language",
                "Language settings will be available soon.",
              )
            }
          />
          <MenuItem
            icon="lock-closed"
            title="Biometric Authentication"
            subtitle={biometricEnabled ? "Enabled" : "Disabled"}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{
                  false: theme.textTertiary,
                  true: theme.primary + "50",
                }}
                thumbColor={
                  biometricEnabled ? theme.primary : theme.textTertiary
                }
              />
            }
            showArrow={false}
          />
          <MenuItem
            icon="document-attach"
            title="Document Scanner"
            subtitle="Scan legal documents with OCR"
            onPress={() => setShowDocumentScanner(true)}
          />
        </MenuSection>

        {/* Help & Support */}
        <MenuSection title="Help & Support">
          <MenuItem
            icon="help-circle"
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={() =>
              Alert.alert("Help", "Help center will be available soon.")
            }
          />
          <MenuItem
            icon="chatbubble-ellipses"
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() =>
              Alert.alert("Support", "Contact support will be available soon.")
            }
          />
          <MenuItem
            icon="star"
            title="Rate App"
            subtitle="Share your feedback"
            onPress={() =>
              Alert.alert(
                "Rate App",
                "Thank you for your interest in rating our app!",
              )
            }
          />
          <MenuItem
            icon="document"
            title="Terms & Privacy"
            subtitle="Legal information"
            onPress={() =>
              Alert.alert(
                "Terms",
                "Terms and privacy policy will be shown here.",
              )
            }
          />
        </MenuSection>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            size="large"
            fullWidth
          />
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.textTertiary }]}>
            LegalTax Assistant v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Document Scanner Modal */}
      <DocumentScanner
        visible={showDocumentScanner}
        onClose={() => setShowDocumentScanner(false)}
        onDocumentScanned={handleDocumentScanned}
      />

      {/* Biometric Auth Modal */}
      <BiometricAuth
        visible={showBiometricAuth}
        onSuccess={handleBiometricSuccess}
        onCancel={() => setShowBiometricAuth(false)}
        title="Enable Biometric Authentication"
        subtitle="Set up biometric authentication for secure app access"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  profileCard: {
    marginBottom: Spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  roleText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  editButton: {
    marginTop: Spacing.md,
  },
  menuSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  menuCard: {
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  menuItemSubtitle: {
    fontSize: FontSizes.sm,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  appVersion: {
    fontSize: FontSizes.sm,
  },
});
