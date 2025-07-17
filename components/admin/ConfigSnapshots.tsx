import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ConfigSnapshot {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  timestamp: string;
  size: number;
  configData: Record<string, any>;
  checksum: string;
  version: string;
  environment: "production" | "staging" | "development";
}

const mockSnapshots: ConfigSnapshot[] = [
  {
    id: "snapshot_1",
    name: "Pre-Security-Update",
    description: "System configuration before applying security patches v2.1.0",
    createdBy: "Admin Sarah",
    timestamp: "2024-01-15T10:30:00Z",
    size: 24576,
    configData: {
      maintenance: { enabled: false, duration: 0 },
      features: { aiComparator: true, templates: true, payments: true },
      security: { maxLoginAttempts: 3, sessionTimeout: 3600 },
      notifications: { enabled: true, channels: ["email", "push"] },
    },
    checksum: "sha256:a1b2c3d4e5f6...",
    version: "2.0.5",
    environment: "production",
  },
  {
    id: "snapshot_2",
    name: "Feature-Toggle-Backup",
    description: "Backup before enabling new legal templates feature",
    createdBy: "Admin John",
    timestamp: "2024-01-14T15:45:00Z",
    size: 18432,
    configData: {
      maintenance: { enabled: false, duration: 0 },
      features: { aiComparator: true, templates: false, payments: true },
      security: { maxLoginAttempts: 3, sessionTimeout: 3600 },
      notifications: { enabled: true, channels: ["email"] },
    },
    checksum: "sha256:f6e5d4c3b2a1...",
    version: "2.0.4",
    environment: "production",
  },
  {
    id: "snapshot_3",
    name: "Daily-Auto-Backup",
    description: "Automated daily configuration backup",
    createdBy: "System",
    timestamp: "2024-01-14T00:00:00Z",
    size: 22528,
    configData: {
      maintenance: { enabled: false, duration: 0 },
      features: { aiComparator: true, templates: false, payments: true },
      security: { maxLoginAttempts: 3, sessionTimeout: 3600 },
      notifications: { enabled: true, channels: ["email"] },
    },
    checksum: "sha256:1a2b3c4d5e6f...",
    version: "2.0.4",
    environment: "production",
  },
];

export default function ConfigSnapshots() {
  const { theme } = useTheme();
  const [snapshots, setSnapshots] = useState<ConfigSnapshot[]>(mockSnapshots);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSnapshot, setNewSnapshot] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] =
    useState<ConfigSnapshot | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const createSnapshot = async () => {
    if (!newSnapshot.name.trim()) {
      Alert.alert("Error", "Please provide a name for the snapshot");
      return;
    }

    setLoading(true);

    // Simulate API call to create snapshot
    setTimeout(() => {
      const snapshot: ConfigSnapshot = {
        id: `snapshot_${Date.now()}`,
        name: newSnapshot.name,
        description: newSnapshot.description || "Manual configuration backup",
        createdBy: "Current Admin",
        timestamp: new Date().toISOString(),
        size: Math.floor(Math.random() * 50000) + 10000,
        configData: {
          maintenance: { enabled: false, duration: 0 },
          features: {
            aiComparator: true,
            templates: true,
            payments: true,
            flashcards: true,
            notifications: true,
          },
          security: { maxLoginAttempts: 3, sessionTimeout: 3600 },
          notifications: { enabled: true, channels: ["email", "push"] },
          backup: { autoBackup: true, retention: 30 },
        },
        checksum: `sha256:${Math.random().toString(36).substring(2, 15)}...`,
        version: "2.1.0",
        environment: "production",
      };

      setSnapshots((prev) => [snapshot, ...prev]);
      setNewSnapshot({ name: "", description: "" });
      setShowCreateForm(false);
      setLoading(false);
      Alert.alert("Success", "Configuration snapshot created successfully");
    }, 2000);
  };

  const restoreSnapshot = (snapshot: ConfigSnapshot) => {
    Alert.alert(
      "Restore Configuration",
      `Are you sure you want to restore the configuration from "${snapshot.name}"? This will overwrite current settings and may require a system restart.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            // Simulate restore process
            setTimeout(() => {
              setLoading(false);
              Alert.alert(
                "Configuration Restored",
                "System configuration has been restored successfully. Some changes may require a restart to take effect.",
                [{ text: "OK" }],
              );
            }, 3000);
          },
        },
      ],
    );
  };

  const deleteSnapshot = (snapshotId: string) => {
    Alert.alert(
      "Delete Snapshot",
      "Are you sure you want to delete this configuration snapshot? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
            Alert.alert("Success", "Snapshot deleted successfully");
          },
        },
      ],
    );
  };

  const exportSnapshot = (snapshot: ConfigSnapshot) => {
    // In real app, this would generate and download the config file
    const configJson = JSON.stringify(snapshot.configData, null, 2);
    Alert.alert(
      "Export Configuration",
      `Exporting configuration snapshot "${snapshot.name}" as JSON file (${(configJson.length / 1024).toFixed(1)} KB)`,
      [{ text: "OK" }],
    );
  };

  const importSnapshot = () => {
    Alert.alert(
      "Import Configuration",
      "This would open a file picker to select a configuration JSON file for import.",
      [{ text: "OK" }],
    );
  };

  const getEnvironmentColor = (env: ConfigSnapshot["environment"]) => {
    switch (env) {
      case "production":
        return theme.colors.error;
      case "staging":
        return theme.colors.warning;
      case "development":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const renderSnapshotCard = (snapshot: ConfigSnapshot) => (
    <View
      key={snapshot.id}
      style={[styles.snapshotCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.snapshotHeader}>
        <View style={styles.snapshotInfo}>
          <Text style={[styles.snapshotName, { color: theme.colors.text }]}>
            {snapshot.name}
          </Text>
          <Text
            style={[
              styles.snapshotDescription,
              { color: theme.colors.textSecondary },
            ]}
          >
            {snapshot.description}
          </Text>
          <View style={styles.snapshotMeta}>
            <Text
              style={[styles.metaText, { color: theme.colors.textSecondary }]}
            >
              By: {snapshot.createdBy} •{" "}
              {new Date(snapshot.timestamp).toLocaleString()}
            </Text>
            <View style={styles.metaBadges}>
              <View
                style={[
                  styles.envBadge,
                  {
                    backgroundColor: getEnvironmentColor(snapshot.environment),
                  },
                ]}
              >
                <Text style={styles.envBadgeText}>
                  {snapshot.environment.toUpperCase()}
                </Text>
              </View>
              <Text
                style={[styles.sizeText, { color: theme.colors.textSecondary }]}
              >
                {formatFileSize(snapshot.size)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.snapshotDetails}>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            Version:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            v{snapshot.version}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            Checksum:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {snapshot.checksum}
          </Text>
        </View>
      </View>

      <View style={styles.snapshotActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
          onPress={() => {
            setSelectedSnapshot(snapshot);
            setShowDetails(true);
          }}
        >
          <Text style={styles.actionButtonText}>👁️ View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.success },
          ]}
          onPress={() => exportSnapshot(snapshot)}
        >
          <Text style={styles.actionButtonText}>📤 Export</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.warning },
          ]}
          onPress={() => restoreSnapshot(snapshot)}
        >
          <Text style={styles.actionButtonText}>🔄 Restore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => deleteSnapshot(snapshot.id)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          ⚙️ Configuration Snapshots
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Backup and restore system configuration settings
        </Text>

        {/* Action Buttons */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setShowCreateForm(true)}
          >
            <Text style={styles.headerButtonText}>📸 Create Snapshot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.headerButton,
              { backgroundColor: theme.colors.secondary },
            ]}
            onPress={importSnapshot}
          >
            <Text style={styles.headerButtonText}>📥 Import</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {snapshots.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Total Snapshots
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {snapshots.filter((s) => s.environment === "production").length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Production
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.info }]}>
              {formatFileSize(snapshots.reduce((acc, s) => acc + s.size, 0))}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Total Size
            </Text>
          </View>
        </View>
      </View>

      {/* Create Snapshot Form */}
      {showCreateForm && (
        <View
          style={[styles.createForm, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>
            Create New Snapshot
          </Text>

          <TextInput
            style={[
              styles.formInput,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Snapshot name (required)"
            value={newSnapshot.name}
            onChangeText={(text) =>
              setNewSnapshot((prev) => ({ ...prev, name: text }))
            }
            placeholderTextColor={theme.colors.textSecondary}
          />

          <TextInput
            style={[
              styles.formInput,
              styles.formTextArea,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Description (optional)"
            value={newSnapshot.description}
            onChangeText={(text) =>
              setNewSnapshot((prev) => ({ ...prev, description: text }))
            }
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
          />

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[
                styles.formButton,
                { backgroundColor: theme.colors.textSecondary },
              ]}
              onPress={() => {
                setShowCreateForm(false);
                setNewSnapshot({ name: "", description: "" });
              }}
            >
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.formButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={createSnapshot}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.formButtonText}>Create Snapshot</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Snapshots List */}
      <ScrollView
        style={styles.snapshotsList}
        showsVerticalScrollIndicator={false}
      >
        {snapshots.length > 0 ? (
          snapshots
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .map(renderSnapshotCard)
        ) : (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.emptyIcon}>⚙️</Text>
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No configuration snapshots found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              Create your first snapshot to backup current system configuration
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      {showDetails && selectedSnapshot && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.detailsModal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Configuration Details
              </Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Text
                  style={[styles.closeButton, { color: theme.colors.primary }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsContent}>
              <View
                style={[
                  styles.configDataContainer,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Text
                  style={[styles.configDataTitle, { color: theme.colors.text }]}
                >
                  Configuration Data
                </Text>
                <Text
                  style={[styles.configDataText, { color: theme.colors.text }]}
                >
                  {JSON.stringify(selectedSnapshot.configData, null, 2)}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View
            style={[
              styles.loadingContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Processing configuration...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
  },
  createForm: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  formTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  formButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  snapshotsList: {
    flex: 1,
    padding: 16,
  },
  snapshotCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  snapshotHeader: {
    marginBottom: 12,
  },
  snapshotInfo: {
    flex: 1,
  },
  snapshotName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  snapshotDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  snapshotMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
  },
  metaBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  envBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  envBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  sizeText: {
    fontSize: 12,
  },
  snapshotDetails: {
    marginBottom: 16,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
  snapshotActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
  },
  detailsModal: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "700",
  },
  detailsContent: {
    maxHeight: 500,
  },
  configDataContainer: {
    borderRadius: 8,
    padding: 12,
  },
  configDataTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  configDataText: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
