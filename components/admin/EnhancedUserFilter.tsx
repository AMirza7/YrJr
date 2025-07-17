import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { UserRole, SubscriptionTier } from "@/types";

interface FilterOptions {
  roles: UserRole[];
  subscriptionTypes: SubscriptionTier[];
  regions: string[];
  loginMethods: string[];
  lastActiveRange: string;
  searchQuery: string;
}

interface EnhancedUserFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export default function EnhancedUserFilter({
  filters,
  onFiltersChange,
  onClearFilters,
}: EnhancedUserFilterProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showSubscriptionSelector, setShowSubscriptionSelector] =
    useState(false);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [showLoginMethodSelector, setShowLoginMethodSelector] = useState(false);

  const availableRoles: UserRole[] = [
    "lawyer",
    "junior_lawyer",
    "lawyer_assistant",
    "law_office_helper",
    "law_student",
    "admin",
  ];

  const availableSubscriptions: SubscriptionTier[] = ["free", "pro", "premium"];

  const availableRegions = [
    "Delhi NCR",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Other Cities",
  ];

  const availableLoginMethods = [
    "Email/Password",
    "Google OAuth",
    "Phone Number",
    "Biometric",
    "Apple ID",
  ];

  const lastActiveRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "year", label: "This Year" },
    { value: "never", label: "Never Logged In" },
  ];

  const getRoleName = (role: UserRole) => {
    const names: Record<UserRole, string> = {
      lawyer: "Senior Lawyer",
      junior_lawyer: "Junior Lawyer",
      lawyer_assistant: "Assistant",
      law_office_helper: "Office Helper",
      law_student: "Law Student",
      admin: "Administrator",
    };
    return names[role];
  };

  const getSubscriptionName = (tier: SubscriptionTier) => {
    const names: Record<SubscriptionTier, string> = {
      free: "Free",
      pro: "Pro",
      premium: "Premium",
    };
    return names[tier];
  };

  const toggleRole = (role: UserRole) => {
    const updatedRoles = filters.roles.includes(role)
      ? filters.roles.filter((r) => r !== role)
      : [...filters.roles, role];

    onFiltersChange({ ...filters, roles: updatedRoles });
  };

  const toggleSubscription = (subscription: SubscriptionTier) => {
    const updatedSubscriptions = filters.subscriptionTypes.includes(
      subscription,
    )
      ? filters.subscriptionTypes.filter((s) => s !== subscription)
      : [...filters.subscriptionTypes, subscription];

    onFiltersChange({ ...filters, subscriptionTypes: updatedSubscriptions });
  };

  const toggleRegion = (region: string) => {
    const updatedRegions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region];

    onFiltersChange({ ...filters, regions: updatedRegions });
  };

  const toggleLoginMethod = (method: string) => {
    const updatedMethods = filters.loginMethods.includes(method)
      ? filters.loginMethods.filter((m) => m !== method)
      : [...filters.loginMethods, method];

    onFiltersChange({ ...filters, loginMethods: updatedMethods });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.roles.length +
      filters.subscriptionTypes.length +
      filters.regions.length +
      filters.loginMethods.length +
      (filters.lastActiveRange ? 1 : 0) +
      (filters.searchQuery ? 1 : 0)
    );
  };

  const Chip = ({
    label,
    onRemove,
    color = "#3b82f6",
  }: {
    label: string;
    onRemove: () => void;
    color?: string;
  }) => (
    <View
      style={[
        styles.chip,
        { backgroundColor: color + "20", borderColor: color },
      ]}
    >
      <Text style={[styles.chipText, { color }]}>{label}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.chipRemove}>
        <Text style={[styles.chipRemoveText, { color }]}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const MultiSelectModal = ({
    visible,
    onClose,
    title,
    options,
    selectedOptions,
    onToggle,
    renderOptionName,
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: any[];
    selectedOptions: any[];
    onToggle: (option: any) => void;
    renderOptionName: (option: any) => string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView style={styles.optionsList}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selectedOptions.includes(option) && styles.optionItemSelected,
                ]}
                onPress={() => onToggle(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {renderOptionName(option)}
                </Text>
                {selectedOptions.includes(option) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, email, or ID..."
          value={filters.searchQuery}
          onChangeText={(text) =>
            onFiltersChange({ ...filters, searchQuery: text })
          }
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.roles.length > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowRoleSelector(true)}
        >
          <Text style={styles.filterButtonText}>
            👤 Role {filters.roles.length > 0 && `(${filters.roles.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.subscriptionTypes.length > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowSubscriptionSelector(true)}
        >
          <Text style={styles.filterButtonText}>
            💳 Subscription{" "}
            {filters.subscriptionTypes.length > 0 &&
              `(${filters.subscriptionTypes.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.regions.length > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowRegionSelector(true)}
        >
          <Text style={styles.filterButtonText}>
            📍 Region{" "}
            {filters.regions.length > 0 && `(${filters.regions.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.loginMethods.length > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowLoginMethodSelector(true)}
        >
          <Text style={styles.filterButtonText}>
            🔑 Login Method{" "}
            {filters.loginMethods.length > 0 &&
              `(${filters.loginMethods.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Last Active Filter */}
      <View style={styles.lastActiveContainer}>
        <Text style={styles.lastActiveLabel}>📅 Last Active:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {lastActiveRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.lastActiveOption,
                filters.lastActiveRange === range.value &&
                  styles.lastActiveOptionSelected,
              ]}
              onPress={() =>
                onFiltersChange({
                  ...filters,
                  lastActiveRange:
                    filters.lastActiveRange === range.value ? "" : range.value,
                })
              }
            >
              <Text
                style={[
                  styles.lastActiveOptionText,
                  filters.lastActiveRange === range.value &&
                    styles.lastActiveOptionTextSelected,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Active Filters Chips */}
      {getActiveFiltersCount() > 0 && (
        <View style={styles.activeFiltersContainer}>
          <View style={styles.activeFiltersHeader}>
            <Text style={styles.activeFiltersTitle}>
              Active Filters ({getActiveFiltersCount()})
            </Text>
            <TouchableOpacity
              onPress={onClearFilters}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsContainer}
          >
            {filters.roles.map((role) => (
              <Chip
                key={role}
                label={getRoleName(role)}
                onRemove={() => toggleRole(role)}
                color="#8b5cf6"
              />
            ))}

            {filters.subscriptionTypes.map((subscription) => (
              <Chip
                key={subscription}
                label={getSubscriptionName(subscription)}
                onRemove={() => toggleSubscription(subscription)}
                color="#10b981"
              />
            ))}

            {filters.regions.map((region) => (
              <Chip
                key={region}
                label={region}
                onRemove={() => toggleRegion(region)}
                color="#f59e0b"
              />
            ))}

            {filters.loginMethods.map((method) => (
              <Chip
                key={method}
                label={method}
                onRemove={() => toggleLoginMethod(method)}
                color="#ef4444"
              />
            ))}

            {filters.lastActiveRange && (
              <Chip
                label={
                  lastActiveRanges.find(
                    (r) => r.value === filters.lastActiveRange,
                  )?.label || ""
                }
                onRemove={() =>
                  onFiltersChange({ ...filters, lastActiveRange: "" })
                }
                color="#06b6d4"
              />
            )}
          </ScrollView>
        </View>
      )}

      {/* Multi-select Modals */}
      <MultiSelectModal
        visible={showRoleSelector}
        onClose={() => setShowRoleSelector(false)}
        title="Select User Roles"
        options={availableRoles}
        selectedOptions={filters.roles}
        onToggle={toggleRole}
        renderOptionName={getRoleName}
      />

      <MultiSelectModal
        visible={showSubscriptionSelector}
        onClose={() => setShowSubscriptionSelector(false)}
        title="Select Subscription Types"
        options={availableSubscriptions}
        selectedOptions={filters.subscriptionTypes}
        onToggle={toggleSubscription}
        renderOptionName={getSubscriptionName}
      />

      <MultiSelectModal
        visible={showRegionSelector}
        onClose={() => setShowRegionSelector(false)}
        title="Select Regions"
        options={availableRegions}
        selectedOptions={filters.regions}
        onToggle={toggleRegion}
        renderOptionName={(region) => region}
      />

      <MultiSelectModal
        visible={showLoginMethodSelector}
        onClose={() => setShowLoginMethodSelector(false)}
        title="Select Login Methods"
        options={availableLoginMethods}
        selectedOptions={filters.loginMethods}
        onToggle={toggleLoginMethod}
        renderOptionName={(method) => method}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  lastActiveContainer: {
    marginBottom: 16,
  },
  lastActiveLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 8,
  },
  lastActiveOption: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  lastActiveOptionSelected: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
  lastActiveOptionText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  lastActiveOptionTextSelected: {
    color: "#fff",
  },
  activeFiltersContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
  },
  activeFiltersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#fef2f2",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "500",
  },
  chipsContainer: {
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  chipRemove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  chipRemoveText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionItemSelected: {
    backgroundColor: "#eff6ff",
  },
  optionText: {
    fontSize: 16,
    color: "#1e293b",
  },
  optionTextSelected: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
