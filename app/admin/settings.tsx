import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { useLocalization } from "@/contexts/LocalizationContext";
import LanguageSelector from "@/components/ui/LanguageSelector";

interface AppSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  aiComparatorEnabled: boolean;
  templatesEnabled: boolean;
  flashcardsEnabled: boolean;
  paymentsEnabled: boolean;
  notificationsEnabled: boolean;
  maxConcurrentUsers: number;
  minAppVersion: string;
}

export default function AdminSettingsScreen() {
  const { t } = useLocalization();
  const [settings, setSettings] = useState<AppSettings>({
    maintenanceMode: false,
    allowNewRegistrations: true,
    aiComparatorEnabled: true,
    templatesEnabled: true,
    flashcardsEnabled: true,
    paymentsEnabled: true,
    notificationsEnabled: true,
    maxConcurrentUsers: 1000,
    minAppVersion: "1.0.0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    loadSettings();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user || user.role !== "admin") {
        Alert.alert("Access Denied", "Admin access required", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
        return;
      }
    } catch (error) {
      router.replace("/login");
    }
  };

  const loadSettings = async () => {
    try {
      // Simulate loading settings
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to load settings");
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      setSettings((prev) => ({ ...prev, [key]: value }));

      // Show confirmation for critical settings
      if (key === "maintenanceMode" && value === true) {
        Alert.alert(
          "Maintenance Mode",
          "App will be put into maintenance mode. Users won't be able to access the app.",
          [
            {
              text: "Cancel",
              onPress: () => setSettings((prev) => ({ ...prev, [key]: false })),
            },
            { text: "Confirm", style: "destructive" },
          ],
        );
      }

      if (key === "allowNewRegistrations" && value === false) {
        Alert.alert(
          "Registration Disabled",
          "New user registrations will be disabled.",
        );
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      Alert.alert("Error", "Failed to update setting");
      // Revert the change
      setSettings((prev) => ({ ...prev, [key]: !value }));
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to defaults? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setSettings({
              maintenanceMode: false,
              allowNewRegistrations: true,
              aiComparatorEnabled: true,
              templatesEnabled: true,
              flashcardsEnabled: true,
              paymentsEnabled: true,
              notificationsEnabled: true,
              maxConcurrentUsers: 1000,
              minAppVersion: "1.0.0",
            });
            Alert.alert("Success", "Settings reset to defaults");
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/admin");
            }
          }}
        >
          <Text style={styles.backButtonText}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("settings")}</Text>
      </View>

      {/* System Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Settings</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Maintenance Mode</Text>
            <Text style={styles.settingDescription}>
              Put the app in maintenance mode
            </Text>
          </View>
          <Switch
            value={settings.maintenanceMode}
            onValueChange={(value) => updateSetting("maintenanceMode", value)}
            trackColor={{ false: "#E5E7EB", true: "#DC2626" }}
            thumbColor={settings.maintenanceMode ? "#fff" : "#9CA3AF"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Allow New Registrations</Text>
            <Text style={styles.settingDescription}>
              Enable new user account creation
            </Text>
          </View>
          <Switch
            value={settings.allowNewRegistrations}
            onValueChange={(value) =>
              updateSetting("allowNewRegistrations", value)
            }
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor={settings.allowNewRegistrations ? "#fff" : "#9CA3AF"}
          />
        </View>
      </View>

      {/* Feature Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Settings</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>AI Comparator</Text>
            <Text style={styles.settingDescription}>
              IPC vs BNS comparison tool
            </Text>
          </View>
          <Switch
            value={settings.aiComparatorEnabled}
            onValueChange={(value) =>
              updateSetting("aiComparatorEnabled", value)
            }
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor={settings.aiComparatorEnabled ? "#fff" : "#9CA3AF"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Templates Hub</Text>
            <Text style={styles.settingDescription}>
              Legal document templates
            </Text>
          </View>
          <Switch
            value={settings.templatesEnabled}
            onValueChange={(value) => updateSetting("templatesEnabled", value)}
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor={settings.templatesEnabled ? "#fff" : "#9CA3AF"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Flashcards</Text>
            <Text style={styles.settingDescription}>
              Learning flashcard system
            </Text>
          </View>
          <Switch
            value={settings.flashcardsEnabled}
            onValueChange={(value) => updateSetting("flashcardsEnabled", value)}
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor={settings.flashcardsEnabled ? "#fff" : "#9CA3AF"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Payments</Text>
            <Text style={styles.settingDescription}>
              Subscription payment processing
            </Text>
          </View>
          <Switch
            value={settings.paymentsEnabled}
            onValueChange={(value) => updateSetting("paymentsEnabled", value)}
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor={settings.paymentsEnabled ? "#fff" : "#9CA3AF"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Push notification system
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) =>
              updateSetting("notificationsEnabled", value)
            }
            trackColor={{ false: "#E5E7EB", true: "#10B981" }}
            thumbColor={settings.notificationsEnabled ? "#fff" : "#9CA3AF"}
          />
        </View>
      </View>

      {/* Language Settings */}
      <View style={styles.section}>
        <LanguageSelector showTitle />
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: "#DC2626" }]}>
          Danger Zone
        </Text>

        <TouchableOpacity style={styles.dangerButton} onPress={resetToDefaults}>
          <Text style={styles.dangerButtonText}>
            ⚠️ Reset All Settings to Defaults
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Backup and export functionality will be available soon",
            )
          }
        >
          <Text style={styles.dangerButtonText}>📦 Export System Backup</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>Build: 2024.01.15</Text>
          <Text style={styles.infoText}>
            Max Users: {settings.maxConcurrentUsers}
          </Text>
          <Text style={styles.infoText}>
            Min Version: {settings.minAppVersion}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#DC2626",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  dangerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DC2626",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dangerButtonText: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
});
