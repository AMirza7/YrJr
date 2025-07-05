import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  critical: boolean;
  affectedUsers?: number;
  lastModified?: Date;
  modifiedBy?: string;
}

interface FeatureToggleSettingsProps {
  onFeatureToggle: (
    featureId: string,
    enabled: boolean,
    reason?: string,
  ) => void;
}

export default function FeatureToggleSettings({
  onFeatureToggle,
}: FeatureToggleSettingsProps) {
  const [features, setFeatures] = useState<FeatureToggle[]>([
    {
      id: "document_scanner",
      name: "Document Scanner",
      description: "OCR document scanning functionality",
      category: "Core Features",
      enabled: true,
      critical: true,
      affectedUsers: 1247,
      lastModified: new Date("2024-01-15"),
      modifiedBy: "Admin",
    },
    {
      id: "ai_chat_assistant",
      name: "AI Chat Assistant",
      description: "Legal AI chat support",
      category: "AI Features",
      enabled: true,
      critical: false,
      affectedUsers: 856,
      lastModified: new Date("2024-01-10"),
      modifiedBy: "Admin",
    },
    {
      id: "case_timeline",
      name: "Case Timeline",
      description: "Visual case timeline functionality",
      category: "Case Management",
      enabled: true,
      critical: false,
      affectedUsers: 234,
      lastModified: new Date("2024-01-08"),
      modifiedBy: "Admin",
    },
    {
      id: "auto_drafter",
      name: "Auto Drafter",
      description: "Automatic legal document generation",
      category: "Document Tools",
      enabled: true,
      critical: false,
      affectedUsers: 445,
      lastModified: new Date("2024-01-12"),
      modifiedBy: "Admin",
    },
    {
      id: "templates_library",
      name: "Templates Library",
      description: "Legal document templates",
      category: "Document Tools",
      enabled: true,
      critical: false,
      affectedUsers: 567,
      lastModified: new Date("2024-01-05"),
      modifiedBy: "Admin",
    },
    {
      id: "case_folders",
      name: "Case Folders",
      description: "Case organization and management",
      category: "Case Management",
      enabled: true,
      critical: false,
      affectedUsers: 389,
      lastModified: new Date("2024-01-14"),
      modifiedBy: "Admin",
    },
    {
      id: "biometric_auth",
      name: "Biometric Authentication",
      description: "Fingerprint and face recognition login",
      category: "Security",
      enabled: true,
      critical: false,
      affectedUsers: 834,
      lastModified: new Date("2024-01-03"),
      modifiedBy: "Admin",
    },
    {
      id: "push_notifications",
      name: "Push Notifications",
      description: "Mobile push notification system",
      category: "Communications",
      enabled: true,
      critical: false,
      affectedUsers: 1156,
      lastModified: new Date("2024-01-09"),
      modifiedBy: "Admin",
    },
    {
      id: "export_functionality",
      name: "Export Functionality",
      description: "Document export in various formats",
      category: "Document Tools",
      enabled: true,
      critical: false,
      affectedUsers: 723,
      lastModified: new Date("2024-01-11"),
      modifiedBy: "Admin",
    },
    {
      id: "lawyer_directory",
      name: "Lawyer Directory",
      description: "Directory of verified lawyers",
      category: "Core Features",
      enabled: true,
      critical: false,
      affectedUsers: 445,
      lastModified: new Date("2024-01-07"),
      modifiedBy: "Admin",
    },
    {
      id: "payment_gateway",
      name: "Payment Gateway",
      description: "Subscription and payment processing",
      category: "Payments",
      enabled: true,
      critical: true,
      affectedUsers: 334,
      lastModified: new Date("2024-01-13"),
      modifiedBy: "Admin",
    },
    {
      id: "analytics_tracking",
      name: "Analytics Tracking",
      description: "User behavior and app analytics",
      category: "Analytics",
      enabled: true,
      critical: false,
      affectedUsers: 1247,
      lastModified: new Date("2024-01-06"),
      modifiedBy: "Admin",
    },
  ]);

  const [selectedFeature, setSelectedFeature] = useState<FeatureToggle | null>(
    null,
  );
  const [toggleReason, setToggleReason] = useState("");
  const [showMaintenanceMode, setShowMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  const categories = Array.from(new Set(features.map((f) => f.category)));

  const handleFeatureToggle = (feature: FeatureToggle) => {
    if (feature.critical) {
      Alert.alert(
        "Critical Feature",
        `${feature.name} is a critical feature. Disabling it may affect ${feature.affectedUsers} users. Are you sure?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "destructive",
            onPress: () => promptForReason(feature),
          },
        ],
      );
    } else {
      promptForReason(feature);
    }
  };

  const promptForReason = (feature: FeatureToggle) => {
    setSelectedFeature(feature);
    setToggleReason("");
  };

  const confirmToggle = () => {
    if (!selectedFeature) return;

    if (!toggleReason.trim()) {
      Alert.alert("Error", "Please provide a reason for this change");
      return;
    }

    const updatedFeatures = features.map((f) =>
      f.id === selectedFeature.id
        ? {
            ...f,
            enabled: !f.enabled,
            lastModified: new Date(),
            modifiedBy: "Current Admin",
          }
        : f,
    );

    setFeatures(updatedFeatures);
    onFeatureToggle(selectedFeature.id, !selectedFeature.enabled, toggleReason);

    Alert.alert(
      "Feature Updated",
      `${selectedFeature.name} has been ${!selectedFeature.enabled ? "enabled" : "disabled"}`,
    );

    setSelectedFeature(null);
    setToggleReason("");
  };

  const enableMaintenanceMode = () => {
    Alert.alert(
      "Enable Maintenance Mode",
      "This will disable all features and show a maintenance message to users. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Enable",
          style: "destructive",
          onPress: () => {
            const disabledFeatures = features.map((f) => ({
              ...f,
              enabled: false,
            }));
            setFeatures(disabledFeatures);
            setShowMaintenanceMode(true);
            Alert.alert("Maintenance Mode", "All features have been disabled");
          },
        },
      ],
    );
  };

  const disableMaintenanceMode = () => {
    const enabledFeatures = features.map((f) => ({ ...f, enabled: true }));
    setFeatures(enabledFeatures);
    setShowMaintenanceMode(false);
    Alert.alert(
      "Maintenance Mode Disabled",
      "All features have been re-enabled",
    );
  };

  const bulkToggleCategory = (category: string, enable: boolean) => {
    Alert.alert(
      `${enable ? "Enable" : "Disable"} Category`,
      `${enable ? "Enable" : "Disable"} all features in "${category}" category?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: enable ? "Enable All" : "Disable All",
          onPress: () => {
            const updatedFeatures = features.map((f) =>
              f.category === category
                ? {
                    ...f,
                    enabled: enable,
                    lastModified: new Date(),
                    modifiedBy: "Current Admin",
                  }
                : f,
            );
            setFeatures(updatedFeatures);
            Alert.alert(
              "Success",
              `All features in "${category}" have been ${enable ? "enabled" : "disabled"}`,
            );
          },
        },
      ],
    );
  };

  const getFeatureStatusColor = (enabled: boolean, critical: boolean) => {
    if (!enabled && critical) return "#ef4444";
    if (!enabled) return "#f59e0b";
    return "#10b981";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const FeatureCard = ({ feature }: { feature: FeatureToggle }) => (
    <View
      style={[
        styles.featureCard,
        !feature.enabled && styles.featureCardDisabled,
        feature.critical && !feature.enabled && styles.featureCardCritical,
      ]}
    >
      <View style={styles.featureHeader}>
        <View style={styles.featureInfo}>
          <Text style={styles.featureName}>{feature.name}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>

          <View style={styles.featureStats}>
            <Text style={styles.featureStat}>
              👥 {feature.affectedUsers} users
            </Text>
            {feature.lastModified && (
              <Text style={styles.featureStat}>
                📅 Modified {formatDate(feature.lastModified)} by{" "}
                {feature.modifiedBy}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.featureControls}>
          {feature.critical && (
            <View style={styles.criticalBadge}>
              <Text style={styles.criticalText}>CRITICAL</Text>
            </View>
          )}

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  getFeatureStatusColor(feature.enabled, feature.critical) +
                  "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: getFeatureStatusColor(
                    feature.enabled,
                    feature.critical,
                  ),
                },
              ]}
            >
              {feature.enabled ? "ACTIVE" : "DISABLED"}
            </Text>
          </View>

          <Switch
            value={feature.enabled}
            onValueChange={() => handleFeatureToggle(feature)}
            trackColor={{ false: "#e2e8f0", true: "#10b981" }}
            thumbColor={feature.enabled ? "#fff" : "#64748b"}
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Feature Toggle Settings</Text>
        <Text style={styles.subtitle}>
          Manage application features and maintenance mode
        </Text>
      </View>

      {/* Maintenance Mode Controls */}
      <View style={styles.maintenanceSection}>
        <Text style={styles.maintenanceSectionTitle}>🔧 Maintenance Mode</Text>

        {showMaintenanceMode ? (
          <View style={styles.maintenanceActiveCard}>
            <Text style={styles.maintenanceActiveTitle}>
              ⚠️ Maintenance Mode Active
            </Text>
            <Text style={styles.maintenanceActiveDescription}>
              All features are currently disabled. Users will see a maintenance
              message.
            </Text>
            <TouchableOpacity
              style={styles.maintenanceDisableButton}
              onPress={disableMaintenanceMode}
            >
              <Text style={styles.maintenanceDisableButtonText}>
                Disable Maintenance Mode
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.maintenanceControls}>
            <TouchableOpacity
              style={styles.maintenanceButton}
              onPress={enableMaintenanceMode}
            >
              <Text style={styles.maintenanceButtonText}>
                🔧 Enable Maintenance Mode
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.maintenanceInput}
              placeholder="Custom maintenance message (optional)"
              value={maintenanceMessage}
              onChangeText={setMaintenanceMessage}
              multiline
            />
          </View>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {features.filter((f) => f.enabled).length}
          </Text>
          <Text style={styles.statLabel}>Active Features</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {features.filter((f) => !f.enabled).length}
          </Text>
          <Text style={styles.statLabel}>Disabled Features</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {features.filter((f) => f.critical).length}
          </Text>
          <Text style={styles.statLabel}>Critical Features</Text>
        </View>
      </View>

      {/* Features by Category */}
      {categories.map((category) => {
        const categoryFeatures = features.filter(
          (f) => f.category === category,
        );
        const enabledCount = categoryFeatures.filter((f) => f.enabled).length;

        return (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.categoryStats}>
                {enabledCount}/{categoryFeatures.length} enabled
              </Text>
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.categoryActionButton}
                  onPress={() => bulkToggleCategory(category, true)}
                >
                  <Text style={styles.categoryActionText}>Enable All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryActionButton,
                    styles.categoryActionButtonDanger,
                  ]}
                  onPress={() => bulkToggleCategory(category, false)}
                >
                  <Text style={styles.categoryActionText}>Disable All</Text>
                </TouchableOpacity>
              </View>
            </View>

            {categoryFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        );
      })}

      {/* Reason Modal */}
      {selectedFeature && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedFeature.enabled ? "Disable" : "Enable"}{" "}
              {selectedFeature.name}
            </Text>

            <Text style={styles.modalDescription}>
              Please provide a reason for this change:
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="e.g., Maintenance, Bug fix, New version deployment..."
              value={toggleReason}
              onChangeText={setToggleReason}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setSelectedFeature(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmToggle}
              >
                <Text style={styles.modalConfirmText}>
                  {selectedFeature.enabled ? "Disable" : "Enable"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  maintenanceSection: {
    backgroundColor: "#fff",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  maintenanceSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  maintenanceActiveCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  maintenanceActiveTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  maintenanceActiveDescription: {
    fontSize: 14,
    color: "#92400e",
    marginBottom: 16,
  },
  maintenanceDisableButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  maintenanceDisableButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  maintenanceControls: {
    gap: 16,
  },
  maintenanceButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  maintenanceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  maintenanceInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1e293b",
    height: 80,
    textAlignVertical: "top",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  categorySection: {
    backgroundColor: "#fff",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  categoryStats: {
    fontSize: 14,
    color: "#64748b",
  },
  categoryActions: {
    flexDirection: "row",
    gap: 8,
  },
  categoryActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#3b82f6",
    borderRadius: 6,
  },
  categoryActionButtonDanger: {
    backgroundColor: "#ef4444",
  },
  categoryActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  featureCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  featureCardDisabled: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  featureCardCritical: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  featureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featureInfo: {
    flex: 1,
    marginRight: 16,
  },
  featureName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  featureStats: {
    gap: 4,
  },
  featureStat: {
    fontSize: 12,
    color: "#94a3b8",
  },
  featureControls: {
    alignItems: "flex-end",
    gap: 8,
  },
  criticalBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  criticalText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 20,
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3b82f6",
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
