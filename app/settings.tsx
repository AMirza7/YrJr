import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User, ThemeMode, Language } from "@/types";
import BackButton from "@/components/navigation/BackButton";

const LANGUAGES = [
  { code: "en", name: "English", emoji: "🇺🇸" },
  { code: "hi", name: "हिन्दी", emoji: "🇮🇳" },
  { code: "ur", name: "اردو", emoji: "🇵🇰" },
  { code: "bn", name: "বাংলা", emoji: "🇧🇩" },
  { code: "te", name: "తెలుగు", emoji: "🇮🇳" },
  { code: "ta", name: "தமிழ்", emoji: "🇮🇳" },
  { code: "mr", name: "मराठी", emoji: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", emoji: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", emoji: "🇮🇳" },
  { code: "ml", name: "മലയാളം", emoji: "🇮🇳" },
];

const THEMES = [
  {
    mode: "light",
    name: "Light",
    emoji: "☀️",
    description: "Clean and bright interface",
  },
  { mode: "dark", name: "Dark", emoji: "🌙", description: "Easy on the eyes" },
  {
    mode: "system",
    name: "System",
    emoji: "📱",
    description: "Follow device settings",
  },
];

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    theme: "light" as ThemeMode,
    language: "en" as Language,
    notifications: {
      push: true,
      email: true,
      caseUpdates: true,
      reminders: true,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      contactInfoVisible: false,
      showOnlineStatus: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setPreferences(currentUser.preferences);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: any) => {
    try {
      const updatedUser = { ...user!, preferences: newPreferences };
      const success = await authService.updateUser(updatedUser);

      if (success) {
        setUser(updatedUser);
        setPreferences(newPreferences);
      } else {
        Alert.alert("Error", "Failed to update preferences");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update preferences");
    }
  };

  const handleThemeChange = (theme: ThemeMode) => {
    const newPreferences = { ...preferences, theme };
    updatePreferences(newPreferences);
  };

  const handleLanguageChange = (language: Language) => {
    const newPreferences = { ...preferences, language };
    updatePreferences(newPreferences);
    Alert.alert(
      "Language Changed",
      "The app language has been updated. Some changes may require an app restart.",
    );
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    const newPreferences = {
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    };
    updatePreferences(newPreferences);
  };

  const handlePrivacyToggle = (key: string, value: boolean) => {
    const newPreferences = {
      ...preferences,
      privacy: { ...preferences.privacy, [key]: value },
    };
    updatePreferences(newPreferences);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authService.logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.prompt(
              "Confirm Deletion",
              "Type 'DELETE' to confirm account deletion:",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Account",
                  style: "destructive",
                  onPress: async (text) => {
                    if (text === "DELETE") {
                      const success = await authService.deleteAccount();
                      if (success) {
                        Alert.alert(
                          "Account Deleted",
                          "Your account has been successfully deleted.",
                        );
                        router.replace("/login");
                      } else {
                        Alert.alert(
                          "Error",
                          "Failed to delete account. Please try again.",
                        );
                      }
                    } else {
                      Alert.alert(
                        "Error",
                        "Incorrect confirmation text. Account not deleted.",
                      );
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <Text style={styles.profileIcon}>👤</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileRole}>
                {user?.role.replace("_", " ").toUpperCase()}
              </Text>
              <Text style={styles.profileSubscription}>
                {user?.subscriptionTier.toUpperCase()} Plan
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Theme & Appearance</Text>
          <View style={styles.settingCard}>
            {THEMES.map((theme) => (
              <TouchableOpacity
                key={theme.mode}
                style={[
                  styles.optionItem,
                  preferences.theme === theme.mode && styles.optionItemSelected,
                ]}
                onPress={() => handleThemeChange(theme.mode as ThemeMode)}
              >
                <Text style={styles.optionIcon}>{theme.emoji}</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{theme.name}</Text>
                  <Text style={styles.optionDescription}>
                    {theme.description}
                  </Text>
                </View>
                {preferences.theme === theme.mode && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Language</Text>
          <View style={styles.settingCard}>
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.optionItem,
                  preferences.language === language.code &&
                    styles.optionItemSelected,
                ]}
                onPress={() => handleLanguageChange(language.code as Language)}
              >
                <Text style={styles.optionIcon}>{language.emoji}</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{language.name}</Text>
                </View>
                {preferences.language === language.code && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          <View style={styles.settingCard}>
            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Push Notifications</Text>
                <Text style={styles.switchDescription}>
                  Receive push notifications on your device
                </Text>
              </View>
              <Switch
                value={preferences.notifications.push}
                onValueChange={(value) =>
                  handleNotificationToggle("push", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Email Notifications</Text>
                <Text style={styles.switchDescription}>
                  Receive email updates and alerts
                </Text>
              </View>
              <Switch
                value={preferences.notifications.email}
                onValueChange={(value) =>
                  handleNotificationToggle("email", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Case Updates</Text>
                <Text style={styles.switchDescription}>
                  Get notified about case progress and deadlines
                </Text>
              </View>
              <Switch
                value={preferences.notifications.caseUpdates}
                onValueChange={(value) =>
                  handleNotificationToggle("caseUpdates", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Reminders</Text>
                <Text style={styles.switchDescription}>
                  Receive reminders for important tasks
                </Text>
              </View>
              <Switch
                value={preferences.notifications.reminders}
                onValueChange={(value) =>
                  handleNotificationToggle("reminders", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Marketing Communications</Text>
                <Text style={styles.switchDescription}>
                  Receive promotional offers and updates
                </Text>
              </View>
              <Switch
                value={preferences.notifications.marketing}
                onValueChange={(value) =>
                  handleNotificationToggle("marketing", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Privacy</Text>
          <View style={styles.settingCard}>
            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Profile Visibility</Text>
                <Text style={styles.switchDescription}>
                  Make your profile visible to other users
                </Text>
              </View>
              <Switch
                value={preferences.privacy.profileVisible}
                onValueChange={(value) =>
                  handlePrivacyToggle("profileVisible", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Contact Information</Text>
                <Text style={styles.switchDescription}>
                  Show contact details in your profile
                </Text>
              </View>
              <Switch
                value={preferences.privacy.contactInfoVisible}
                onValueChange={(value) =>
                  handlePrivacyToggle("contactInfoVisible", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchContent}>
                <Text style={styles.switchTitle}>Online Status</Text>
                <Text style={styles.switchDescription}>
                  Show when you're active in the app
                </Text>
              </View>
              <Switch
                value={preferences.privacy.showOnlineStatus}
                onValueChange={(value) =>
                  handlePrivacyToggle("showOnlineStatus", value)
                }
                trackColor={{ false: "#f3f4f6", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Quick Actions</Text>
          <View style={styles.settingCard}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/subscription")}
            >
              <Text style={styles.actionIcon}>💳</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Subscription</Text>
                <Text style={styles.actionDescription}>
                  Manage your subscription plan
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/help-support")}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Help & Support</Text>
                <Text style={styles.actionDescription}>
                  Get help and contact support
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/privacy-policy")}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Privacy Policy</Text>
                <Text style={styles.actionDescription}>
                  Read our privacy policy
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/terms-of-service")}
            >
              <Text style={styles.actionIcon}>📄</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Terms of Service</Text>
                <Text style={styles.actionDescription}>
                  View terms and conditions
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Account Actions</Text>
          <View style={styles.settingCard}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
              <Text style={styles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>YRJR Legal Assistant v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for legal professionals
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#6b7280",
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
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    marginTop: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  profileSubscription: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  settingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  optionItemSelected: {
    backgroundColor: "#f0f9ff",
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  selectedIcon: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "bold",
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  switchContent: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  switchDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  actionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: "#9ca3af",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fef2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#dc2626",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fef2f2",
  },
  deleteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#dc2626",
  },
  footer: {
    alignItems: "center",
    padding: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#d1d5db",
  },
});
