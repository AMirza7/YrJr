import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { UserRole } from "@/types";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  critical?: boolean;
}

interface RolePermissions {
  role: UserRole;
  permissions: Record<string, boolean>;
}

const PERMISSIONS: Permission[] = [
  // Case Management
  {
    id: "case_create",
    name: "Create Cases",
    description: "Create new legal cases",
    category: "Case Management",
  },
  {
    id: "case_edit",
    name: "Edit Cases",
    description: "Modify existing case details",
    category: "Case Management",
  },
  {
    id: "case_delete",
    name: "Delete Cases",
    description: "Remove cases from system",
    category: "Case Management",
    critical: true,
  },
  {
    id: "case_view_all",
    name: "View All Cases",
    description: "Access all cases in system",
    category: "Case Management",
  },
  {
    id: "case_assign",
    name: "Assign Cases",
    description: "Assign cases to team members",
    category: "Case Management",
  },

  // Document Management
  {
    id: "doc_upload",
    name: "Upload Documents",
    description: "Upload case documents",
    category: "Document Management",
  },
  {
    id: "doc_download",
    name: "Download Documents",
    description: "Download case documents",
    category: "Document Management",
  },
  {
    id: "doc_delete",
    name: "Delete Documents",
    description: "Remove documents from system",
    category: "Document Management",
    critical: true,
  },
  {
    id: "doc_share",
    name: "Share Documents",
    description: "Share documents externally",
    category: "Document Management",
  },
  {
    id: "doc_scan",
    name: "Scan Documents",
    description: "Use document scanner feature",
    category: "Document Management",
  },

  // User Management
  {
    id: "user_create",
    name: "Create Users",
    description: "Add new users to system",
    category: "User Management",
  },
  {
    id: "user_edit",
    name: "Edit Users",
    description: "Modify user profiles",
    category: "User Management",
  },
  {
    id: "user_delete",
    name: "Delete Users",
    description: "Remove users from system",
    category: "User Management",
    critical: true,
  },
  {
    id: "user_approve",
    name: "Approve Users",
    description: "Approve pending registrations",
    category: "User Management",
  },
  {
    id: "user_block",
    name: "Block Users",
    description: "Block/suspend user accounts",
    category: "User Management",
  },

  // System Administration
  {
    id: "admin_settings",
    name: "System Settings",
    description: "Access admin settings",
    category: "System Administration",
    critical: true,
  },
  {
    id: "admin_analytics",
    name: "View Analytics",
    description: "Access system analytics",
    category: "System Administration",
  },
  {
    id: "admin_audit",
    name: "View Audit Logs",
    description: "Access audit trail logs",
    category: "System Administration",
  },
  {
    id: "admin_backup",
    name: "System Backup",
    description: "Create and restore backups",
    category: "System Administration",
    critical: true,
  },
  {
    id: "admin_broadcast",
    name: "Send Broadcasts",
    description: "Send system-wide messages",
    category: "System Administration",
  },

  // Content Management
  {
    id: "template_create",
    name: "Create Templates",
    description: "Create legal templates",
    category: "Content Management",
  },
  {
    id: "template_edit",
    name: "Edit Templates",
    description: "Modify existing templates",
    category: "Content Management",
  },
  {
    id: "template_delete",
    name: "Delete Templates",
    description: "Remove templates",
    category: "Content Management",
  },
  {
    id: "template_publish",
    name: "Publish Templates",
    description: "Make templates public",
    category: "Content Management",
  },

  // Financial
  {
    id: "billing_view",
    name: "View Billing",
    description: "Access billing information",
    category: "Financial",
  },
  {
    id: "billing_manage",
    name: "Manage Billing",
    description: "Modify billing and subscriptions",
    category: "Financial",
    critical: true,
  },
  {
    id: "payment_process",
    name: "Process Payments",
    description: "Handle payment transactions",
    category: "Financial",
    critical: true,
  },

  // Data Export
  {
    id: "export_data",
    name: "Export Data",
    description: "Export system data",
    category: "Data Export",
  },
  {
    id: "export_reports",
    name: "Export Reports",
    description: "Generate and export reports",
    category: "Data Export",
  },
  {
    id: "export_bulk",
    name: "Bulk Export",
    description: "Perform bulk data exports",
    category: "Data Export",
  },
];

const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  admin: Object.fromEntries(PERMISSIONS.map((p) => [p.id, true])),
  lawyer: {
    case_create: true,
    case_edit: true,
    case_view_all: false,
    case_assign: true,
    doc_upload: true,
    doc_download: true,
    doc_delete: false,
    doc_share: true,
    doc_scan: true,
    user_create: false,
    user_edit: false,
    user_delete: false,
    user_approve: false,
    user_block: false,
    admin_settings: false,
    admin_analytics: false,
    admin_audit: false,
    admin_backup: false,
    admin_broadcast: false,
    template_create: true,
    template_edit: true,
    template_delete: false,
    template_publish: false,
    billing_view: true,
    billing_manage: false,
    payment_process: false,
    export_data: true,
    export_reports: true,
    export_bulk: false,
  },
  junior_lawyer: {
    case_create: true,
    case_edit: true,
    case_view_all: false,
    case_assign: false,
    doc_upload: true,
    doc_download: true,
    doc_delete: false,
    doc_share: false,
    doc_scan: true,
    user_create: false,
    user_edit: false,
    user_delete: false,
    user_approve: false,
    user_block: false,
    admin_settings: false,
    admin_analytics: false,
    admin_audit: false,
    admin_backup: false,
    admin_broadcast: false,
    template_create: true,
    template_edit: false,
    template_delete: false,
    template_publish: false,
    billing_view: false,
    billing_manage: false,
    payment_process: false,
    export_data: false,
    export_reports: true,
    export_bulk: false,
  },
  lawyer_assistant: {
    case_create: false,
    case_edit: true,
    case_view_all: false,
    case_assign: false,
    doc_upload: true,
    doc_download: true,
    doc_delete: false,
    doc_share: false,
    doc_scan: true,
    user_create: false,
    user_edit: false,
    user_delete: false,
    user_approve: false,
    user_block: false,
    admin_settings: false,
    admin_analytics: false,
    admin_audit: false,
    admin_backup: false,
    admin_broadcast: false,
    template_create: false,
    template_edit: false,
    template_delete: false,
    template_publish: false,
    billing_view: false,
    billing_manage: false,
    payment_process: false,
    export_data: false,
    export_reports: false,
    export_bulk: false,
  },
  law_office_helper: {
    case_create: false,
    case_edit: false,
    case_view_all: false,
    case_assign: false,
    doc_upload: true,
    doc_download: true,
    doc_delete: false,
    doc_share: false,
    doc_scan: true,
    user_create: false,
    user_edit: false,
    user_delete: false,
    user_approve: false,
    user_block: false,
    admin_settings: false,
    admin_analytics: false,
    admin_audit: false,
    admin_backup: false,
    admin_broadcast: false,
    template_create: false,
    template_edit: false,
    template_delete: false,
    template_publish: false,
    billing_view: false,
    billing_manage: false,
    payment_process: false,
    export_data: false,
    export_reports: false,
    export_bulk: false,
  },
  law_student: {
    case_create: false,
    case_edit: false,
    case_view_all: false,
    case_assign: false,
    doc_upload: false,
    doc_download: true,
    doc_delete: false,
    doc_share: false,
    doc_scan: true,
    user_create: false,
    user_edit: false,
    user_delete: false,
    user_approve: false,
    user_block: false,
    admin_settings: false,
    admin_analytics: false,
    admin_audit: false,
    admin_backup: false,
    admin_broadcast: false,
    template_create: false,
    template_edit: false,
    template_delete: false,
    template_publish: false,
    billing_view: false,
    billing_manage: false,
    payment_process: false,
    export_data: false,
    export_reports: false,
    export_bulk: false,
  },
};

export default function RolesPermissionsManager() {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole>("lawyer");
  const [rolePermissions, setRolePermissions] = useState<
    Record<UserRole, Record<string, boolean>>
  >(DEFAULT_ROLE_PERMISSIONS);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const roles: Array<{
    key: UserRole;
    label: string;
    icon: string;
    color: string;
  }> = [
    { key: "admin", label: "Administrator", icon: "👨‍💼", color: "#ef4444" },
    { key: "lawyer", label: "Senior Lawyer", icon: "⚖️", color: "#3b82f6" },
    {
      key: "junior_lawyer",
      label: "Junior Lawyer",
      icon: "📝",
      color: "#10b981",
    },
    {
      key: "lawyer_assistant",
      label: "Legal Assistant",
      icon: "📋",
      color: "#f59e0b",
    },
    {
      key: "law_office_helper",
      label: "Office Helper",
      icon: "📁",
      color: "#8b5cf6",
    },
    { key: "law_student", label: "Law Student", icon: "🎓", color: "#06b6d4" },
  ];

  const categories = [...new Set(PERMISSIONS.map((p) => p.category))];

  const togglePermission = (permissionId: string) => {
    const permission = PERMISSIONS.find((p) => p.id === permissionId);

    if (permission?.critical) {
      Alert.alert(
        "Critical Permission",
        `This is a critical system permission. Are you sure you want to ${rolePermissions[selectedRole][permissionId] ? "revoke" : "grant"} it?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            style: "destructive",
            onPress: () => updatePermission(permissionId),
          },
        ],
      );
    } else {
      updatePermission(permissionId);
    }
  };

  const updatePermission = (permissionId: string) => {
    setRolePermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permissionId]: !prev[selectedRole][permissionId],
      },
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const bulkToggleCategory = (category: string, enabled: boolean) => {
    const categoryPermissions = PERMISSIONS.filter(
      (p) => p.category === category,
    );
    const updates = Object.fromEntries(
      categoryPermissions.map((p) => [p.id, enabled]),
    );

    setRolePermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        ...updates,
      },
    }));
  };

  const savePermissions = () => {
    // In real app, this would make an API call
    Alert.alert("Success", "Permissions updated successfully");
  };

  const resetToDefaults = () => {
    Alert.alert(
      "Reset Permissions",
      "This will reset all permissions for this role to default values. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setRolePermissions((prev) => ({
              ...prev,
              [selectedRole]: DEFAULT_ROLE_PERMISSIONS[selectedRole],
            }));
          },
        },
      ],
    );
  };

  const getPermissionCount = (role: UserRole) => {
    const permissions = rolePermissions[role];
    const granted = Object.values(permissions).filter(Boolean).length;
    return `${granted}/${PERMISSIONS.length}`;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Roles & Permissions Manager
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Configure access control for each user role
        </Text>
      </View>

      {/* Role Selector */}
      <View
        style={[styles.roleSelector, { backgroundColor: theme.colors.surface }]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={[
                styles.roleCard,
                selectedRole === role.key && {
                  backgroundColor: role.color,
                  transform: [{ scale: 1.05 }],
                },
              ]}
              onPress={() => setSelectedRole(role.key)}
            >
              <Text
                style={[
                  styles.roleIcon,
                  selectedRole === role.key && { transform: [{ scale: 1.2 }] },
                ]}
              >
                {role.icon}
              </Text>
              <Text
                style={[
                  styles.roleLabel,
                  {
                    color:
                      selectedRole === role.key ? "#fff" : theme.colors.text,
                  },
                ]}
              >
                {role.label}
              </Text>
              <Text
                style={[
                  styles.roleCount,
                  {
                    color:
                      selectedRole === role.key
                        ? "#fff"
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {getPermissionCount(role.key)} permissions
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Permissions List */}
      <ScrollView
        style={styles.permissionsList}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => {
          const categoryPermissions = PERMISSIONS.filter(
            (p) => p.category === category,
          );
          const isExpanded = expandedCategories[category];
          const enabledCount = categoryPermissions.filter(
            (p) => rolePermissions[selectedRole][p.id],
          ).length;

          return (
            <View
              key={category}
              style={[
                styles.categorySection,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category)}
              >
                <View style={styles.categoryInfo}>
                  <Text
                    style={[styles.categoryTitle, { color: theme.colors.text }]}
                  >
                    {isExpanded ? "📂" : "📁"} {category}
                  </Text>
                  <Text
                    style={[
                      styles.categoryCount,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {enabledCount}/{categoryPermissions.length} enabled
                  </Text>
                </View>

                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={[
                      styles.bulkButton,
                      { backgroundColor: theme.colors.success },
                    ]}
                    onPress={() => bulkToggleCategory(category, true)}
                  >
                    <Text style={styles.bulkButtonText}>✓ All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.bulkButton,
                      { backgroundColor: theme.colors.error },
                    ]}
                    onPress={() => bulkToggleCategory(category, false)}
                  >
                    <Text style={styles.bulkButtonText}>✗ None</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.permissionsContainer}>
                  {categoryPermissions.map((permission) => {
                    const isEnabled =
                      rolePermissions[selectedRole][permission.id];

                    return (
                      <View
                        key={permission.id}
                        style={[
                          styles.permissionItem,
                          { borderBottomColor: theme.colors.border },
                        ]}
                      >
                        <View style={styles.permissionInfo}>
                          <View style={styles.permissionHeader}>
                            <Text
                              style={[
                                styles.permissionName,
                                { color: theme.colors.text },
                              ]}
                            >
                              {permission.name}
                              {permission.critical && (
                                <Text
                                  style={[
                                    styles.criticalBadge,
                                    { color: theme.colors.error },
                                  ]}
                                >
                                  {" "}
                                  ⚠️ CRITICAL
                                </Text>
                              )}
                            </Text>
                            <Switch
                              value={isEnabled}
                              onValueChange={() =>
                                togglePermission(permission.id)
                              }
                              trackColor={{
                                false: theme.colors.border,
                                true: theme.colors.primary,
                              }}
                              thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
                            />
                          </View>
                          <Text
                            style={[
                              styles.permissionDescription,
                              { color: theme.colors.textSecondary },
                            ]}
                          >
                            {permission.description}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[styles.actionBar, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.textSecondary },
          ]}
          onPress={resetToDefaults}
        >
          <Text style={styles.actionButtonText}>🔄 Reset to Defaults</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={savePermissions}
        >
          <Text style={styles.actionButtonText}>💾 Save Changes</Text>
        </TouchableOpacity>
      </View>
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
  },
  roleSelector: {
    padding: 16,
  },
  roleCard: {
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 120,
    backgroundColor: "#f3f4f6",
  },
  roleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  roleCount: {
    fontSize: 10,
    textAlign: "center",
  },
  permissionsList: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },
  categoryActions: {
    flexDirection: "row",
    gap: 8,
  },
  bulkButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bulkButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  permissionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  permissionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  permissionName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  criticalBadge: {
    fontSize: 10,
    fontWeight: "700",
  },
  permissionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
