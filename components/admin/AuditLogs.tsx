import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { UserRole } from "@/types";

interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: "user" | "document" | "system" | "payment" | "template" | "case";
  targetId: string;
  targetName?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  success: boolean;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "audit_1",
    adminId: "admin_001",
    adminName: "Admin Sarah",
    action: "USER_APPROVED",
    targetType: "user",
    targetId: "user_123",
    targetName: "Adv. Priya Sharma",
    details: { role: "lawyer", barCouncilNo: "DL/2019/12345" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2024-01-15T10:30:00Z",
    severity: "medium",
    success: true,
  },
  {
    id: "audit_2",
    adminId: "admin_001",
    adminName: "Admin Sarah",
    action: "USER_BLOCKED",
    targetType: "user",
    targetId: "user_456",
    targetName: "Rajesh Kumar",
    details: { reason: "Violation of terms", suspensionDays: 30 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2024-01-15T09:45:00Z",
    severity: "high",
    success: true,
  },
  {
    id: "audit_3",
    adminId: "admin_002",
    adminName: "Admin John",
    action: "DOCUMENT_DELETED",
    targetType: "document",
    targetId: "doc_789",
    targetName: "Contract Template v2.pdf",
    details: { caseId: "CIV/2024/001", reason: "Duplicate content" },
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2024-01-15T09:15:00Z",
    severity: "high",
    success: true,
  },
  {
    id: "audit_4",
    adminId: "admin_001",
    adminName: "Admin Sarah",
    action: "SYSTEM_CONFIG_CHANGED",
    targetType: "system",
    targetId: "config_maintenance",
    targetName: "Maintenance Mode",
    details: { enabled: true, duration: "2 hours", reason: "Security updates" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2024-01-15T08:30:00Z",
    severity: "critical",
    success: true,
  },
  {
    id: "audit_5",
    adminId: "admin_003",
    adminName: "Admin Mike",
    action: "PAYMENT_REFUNDED",
    targetType: "payment",
    targetId: "pay_012",
    targetName: "Premium Subscription",
    details: { amount: 2999, reason: "Technical issue", userId: "user_789" },
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    timestamp: "2024-01-15T08:00:00Z",
    severity: "medium",
    success: true,
  },
  {
    id: "audit_6",
    adminId: "admin_002",
    adminName: "Admin John",
    action: "LOGIN_FAILED",
    targetType: "system",
    targetId: "admin_login",
    details: { attempts: 3, reason: "Invalid credentials" },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2024-01-15T07:45:00Z",
    severity: "high",
    success: false,
  },
];

export default function AuditLogs() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [filteredLogs, setFilteredLogs] =
    useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<string>("All");
  const [selectedAction, setSelectedAction] = useState<string>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [dateRange, setDateRange] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const admins = ["All", ...new Set(logs.map((log) => log.adminName))];
  const actions = ["All", ...new Set(logs.map((log) => log.action))];
  const severities = ["All", "low", "medium", "high", "critical"];
  const dateRanges = [
    "All",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
  ];

  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    selectedAdmin,
    selectedAction,
    selectedSeverity,
    dateRange,
    logs,
  ]);

  const applyFilters = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.details &&
            JSON.stringify(log.details)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    // Admin filter
    if (selectedAdmin !== "All") {
      filtered = filtered.filter((log) => log.adminName === selectedAdmin);
    }

    // Action filter
    if (selectedAction !== "All") {
      filtered = filtered.filter((log) => log.action === selectedAction);
    }

    // Severity filter
    if (selectedSeverity !== "All") {
      filtered = filtered.filter((log) => log.severity === selectedSeverity);
    }

    // Date range filter
    if (dateRange !== "All") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "Today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "Yesterday":
          filterDate.setDate(now.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "Last 7 days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "Last 30 days":
          filterDate.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(
        (log) => new Date(log.timestamp) >= filterDate,
      );
    }

    setFilteredLogs(filtered);
  };

  const getSeverityColor = (severity: AuditLogEntry["severity"]) => {
    switch (severity) {
      case "critical":
        return theme.colors.error;
      case "high":
        return "#f59e0b";
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("APPROVED")) return "✅";
    if (action.includes("BLOCKED") || action.includes("DELETED")) return "❌";
    if (action.includes("CREATED") || action.includes("ADDED")) return "➕";
    if (action.includes("UPDATED") || action.includes("CHANGED")) return "✏️";
    if (action.includes("LOGIN")) return "🔐";
    if (action.includes("PAYMENT")) return "💳";
    if (action.includes("SYSTEM")) return "⚙️";
    return "📝";
  };

  const exportLogs = () => {
    // In real app, this would generate and download CSV
    const csvData = filteredLogs.map((log) => ({
      Timestamp: new Date(log.timestamp).toLocaleString(),
      Admin: log.adminName,
      Action: log.action,
      Target: log.targetName || log.targetId,
      Severity: log.severity,
      Success: log.success ? "Yes" : "No",
      IP: log.ipAddress,
      Details: JSON.stringify(log.details),
    }));

    Alert.alert(
      "Export Audit Logs",
      `Exporting ${csvData.length} log entries as CSV file`,
      [{ text: "OK" }],
    );
  };

  const renderLogEntry = (log: AuditLogEntry) => (
    <TouchableOpacity
      key={log.id}
      style={[styles.logEntry, { backgroundColor: theme.colors.surface }]}
      onPress={() => {
        setSelectedLog(log);
        setShowDetails(true);
      }}
    >
      <View style={styles.logHeader}>
        <View style={styles.logInfo}>
          <View style={styles.logTitleRow}>
            <Text style={styles.actionIcon}>{getActionIcon(log.action)}</Text>
            <Text style={[styles.logAction, { color: theme.colors.text }]}>
              {log.action.replace(/_/g, " ")}
            </Text>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(log.severity) },
              ]}
            >
              <Text style={styles.severityText}>
                {log.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.logTarget, { color: theme.colors.textSecondary }]}
          >
            Target: {log.targetName || log.targetId} ({log.targetType})
          </Text>

          <View style={styles.logMeta}>
            <Text style={[styles.adminName, { color: theme.colors.primary }]}>
              By: {log.adminName}
            </Text>
            <Text
              style={[styles.timestamp, { color: theme.colors.textSecondary }]}
            >
              {new Date(log.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: log.success
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal visible={showFilters} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.filterModal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Filter Audit Logs
            </Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text
                style={[styles.closeButton, { color: theme.colors.primary }]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Admin Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
                Admin
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {admins.map((admin) => (
                  <TouchableOpacity
                    key={admin}
                    style={[
                      styles.filterOption,
                      selectedAdmin === admin && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedAdmin(admin)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            selectedAdmin === admin
                              ? "#fff"
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {admin}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Action Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
                Action
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {actions.map((action) => (
                  <TouchableOpacity
                    key={action}
                    style={[
                      styles.filterOption,
                      selectedAction === action && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedAction(action)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            selectedAction === action
                              ? "#fff"
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {action.replace(/_/g, " ")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Severity Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
                Severity
              </Text>
              <View style={styles.filterRow}>
                {severities.map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.filterOption,
                      selectedSeverity === severity && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedSeverity(severity)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            selectedSeverity === severity
                              ? "#fff"
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {severity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
                Date Range
              </Text>
              <View style={styles.filterRow}>
                {dateRanges.map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterOption,
                      dateRange === range && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setDateRange(range)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            dateRange === range ? "#fff" : theme.colors.text,
                        },
                      ]}
                    >
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={[
                styles.clearButton,
                { backgroundColor: theme.colors.textSecondary },
              ]}
              onPress={() => {
                setSelectedAdmin("All");
                setSelectedAction("All");
                setSelectedSeverity("All");
                setDateRange("All");
              }}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.applyButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDetailsModal = () => (
    <Modal visible={showDetails} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.detailsModal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {selectedLog && (
            <>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Audit Log Details
                </Text>
                <TouchableOpacity onPress={() => setShowDetails(false)}>
                  <Text
                    style={[
                      styles.closeButton,
                      { color: theme.colors.primary },
                    ]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.detailsContent}>
                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Action
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {selectedLog.action.replace(/_/g, " ")}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Admin
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {selectedLog.adminName} ({selectedLog.adminId})
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Target
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {selectedLog.targetName || selectedLog.targetId} (
                    {selectedLog.targetType})
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Timestamp
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    IP Address
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {selectedLog.ipAddress}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    User Agent
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {selectedLog.userAgent}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Details
                  </Text>
                  <View
                    style={[
                      styles.detailsData,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    <Text
                      style={[
                        styles.detailsDataText,
                        { color: theme.colors.text },
                      ]}
                    >
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          📊 Audit Logs
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Track all administrative actions and system events
        </Text>

        {/* Search and Controls */}
        <View style={styles.controls}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Search logs..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>🔍 Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.exportButton,
              { backgroundColor: theme.colors.success },
            ]}
            onPress={exportLogs}
          >
            <Text style={styles.exportButtonText}>📤 Export</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {filteredLogs.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Total Logs
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {filteredLogs.filter((l) => l.severity === "critical").length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Critical
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {filteredLogs.filter((l) => l.success).length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Successful
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {filteredLogs.filter((l) => !l.success).length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Failed
            </Text>
          </View>
        </View>
      </View>

      {/* Logs List */}
      <ScrollView style={styles.logsList} showsVerticalScrollIndicator={false}>
        {filteredLogs.length > 0 ? (
          filteredLogs
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .map(renderLogEntry)
        ) : (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.emptyIcon}>📋</Text>
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No audit logs found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              Try adjusting your search criteria or filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {renderFilterModal()}
      {renderDetailsModal()}
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
  controls: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  exportButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 12,
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
  logsList: {
    flex: 1,
    padding: 16,
  },
  logEntry: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logInfo: {
    flex: 1,
  },
  logTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logAction: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  logTarget: {
    fontSize: 12,
    marginBottom: 8,
  },
  logMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adminName: {
    fontSize: 12,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: "center",
    marginLeft: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModal: {
    width: "90%",
    maxHeight: "70%",
    borderRadius: 12,
    padding: 20,
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
  filterContent: {
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  detailsContent: {
    maxHeight: 500,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsData: {
    borderRadius: 8,
    padding: 12,
  },
  detailsDataText: {
    fontSize: 12,
    fontFamily: "monospace",
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
