import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";

interface ExportFilter {
  id: string;
  label: string;
  options: string[];
  selectedOptions: string[];
}

interface ExportConfig {
  format: "csv" | "xlsx" | "json" | "pdf";
  dateRange: {
    start: Date;
    end: Date;
    preset: "today" | "week" | "month" | "quarter" | "year" | "custom";
  };
  dataTypes: string[];
  filters: ExportFilter[];
  includeMetadata: boolean;
  compression: boolean;
  password: string;
  deliveryMethod: "download" | "email" | "cloud";
  emailRecipients: string[];
}

interface EnhancedDataExportProps {
  visible: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
}

export default function EnhancedDataExport({
  visible,
  onClose,
  onExport,
}: EnhancedDataExportProps) {
  const { showSuccess, showError } = useModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: "xlsx",
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
      preset: "month",
    },
    dataTypes: [],
    filters: [],
    includeMetadata: true,
    compression: false,
    password: "",
    deliveryMethod: "download",
    emailRecipients: [],
  });

  const formatOptions = [
    {
      value: "csv",
      label: "CSV",
      icon: "📊",
      description: "Comma-separated values",
    },
    {
      value: "xlsx",
      label: "Excel",
      icon: "📋",
      description: "Microsoft Excel format",
    },
    {
      value: "json",
      label: "JSON",
      icon: "📄",
      description: "JavaScript Object Notation",
    },
    {
      value: "pdf",
      label: "PDF",
      icon: "📕",
      description: "Portable Document Format",
    },
  ];

  const dataTypeOptions = [
    { id: "users", label: "User Accounts", count: 1247, icon: "👥" },
    { id: "lawyers", label: "Lawyer Profiles", count: 89, icon: "⚖️" },
    { id: "cases", label: "Case Files", count: 456, icon: "📁" },
    {
      id: "transactions",
      label: "Financial Transactions",
      count: 789,
      icon: "💰",
    },
    { id: "documents", label: "Document Scans", count: 2341, icon: "📄" },
    { id: "analytics", label: "Usage Analytics", count: 15000, icon: "📊" },
    { id: "support", label: "Support Tickets", count: 234, icon: "🎫" },
    { id: "reviews", label: "Reviews & Ratings", count: 567, icon: "⭐" },
  ];

  const datePresets = [
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
    { value: "quarter", label: "Last 3 months" },
    { value: "year", label: "Last 12 months" },
    { value: "custom", label: "Custom range" },
  ];

  const deliveryMethods = [
    {
      value: "download",
      label: "Direct Download",
      icon: "⬇️",
      description: "Download immediately",
    },
    {
      value: "email",
      label: "Email Delivery",
      icon: "📧",
      description: "Send to email addresses",
    },
    {
      value: "cloud",
      label: "Cloud Storage",
      icon: "☁️",
      description: "Upload to cloud storage",
    },
  ];

  const handleDataTypeToggle = (dataTypeId: string) => {
    setExportConfig((prev) => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataTypeId)
        ? prev.dataTypes.filter((id) => id !== dataTypeId)
        : [...prev.dataTypes, dataTypeId],
    }));
  };

  const handleDatePresetChange = (preset: string) => {
    const now = new Date();
    let start = new Date();

    switch (preset) {
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    setExportConfig((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        preset: preset as any,
        start,
        end: now,
      },
    }));
  };

  const validateConfig = () => {
    if (exportConfig.dataTypes.length === 0) {
      showError("Please select at least one data type to export");
      return false;
    }

    if (
      exportConfig.deliveryMethod === "email" &&
      exportConfig.emailRecipients.length === 0
    ) {
      showError("Please add at least one email recipient");
      return false;
    }

    return true;
  };

  const handleExport = () => {
    if (!validateConfig()) return;

    onExport(exportConfig);
    showSuccess("Export job started! You'll be notified when it's ready.");
    onClose();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
              currentStep === step && styles.stepCircleCurrent,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Data Types</Text>
      <Text style={styles.stepDescription}>
        Choose which data to include in your export
      </Text>

      <View style={styles.dataTypesGrid}>
        {dataTypeOptions.map((dataType) => (
          <TouchableOpacity
            key={dataType.id}
            style={[
              styles.dataTypeCard,
              exportConfig.dataTypes.includes(dataType.id) &&
                styles.dataTypeCardSelected,
            ]}
            onPress={() => handleDataTypeToggle(dataType.id)}
          >
            <Text style={styles.dataTypeIcon}>{dataType.icon}</Text>
            <Text style={styles.dataTypeLabel}>{dataType.label}</Text>
            <Text style={styles.dataTypeCount}>
              {dataType.count.toLocaleString()} records
            </Text>
            {exportConfig.dataTypes.includes(dataType.id) && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Date Range & Filters</Text>
      <Text style={styles.stepDescription}>
        Specify time period and filtering options
      </Text>

      {/* Date Range */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date Range</Text>
        <View style={styles.datePresets}>
          {datePresets.map((preset) => (
            <TouchableOpacity
              key={preset.value}
              style={[
                styles.presetButton,
                exportConfig.dateRange.preset === preset.value &&
                  styles.presetButtonActive,
              ]}
              onPress={() => handleDatePresetChange(preset.value)}
            >
              <Text
                style={[
                  styles.presetText,
                  exportConfig.dateRange.preset === preset.value &&
                    styles.presetTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {exportConfig.dateRange.preset === "custom" && (
          <View style={styles.customDateInputs}>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {exportConfig.dateRange.start.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>
                {exportConfig.dateRange.end.toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Advanced Filters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Options</Text>

        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionLabel}>Include Metadata</Text>
            <Text style={styles.optionDescription}>
              Export creation timestamps, user IDs, etc.
            </Text>
          </View>
          <Switch
            value={exportConfig.includeMetadata}
            onValueChange={(value) =>
              setExportConfig((prev) => ({
                ...prev,
                includeMetadata: value,
              }))
            }
          />
        </View>

        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionLabel}>Compress Archive</Text>
            <Text style={styles.optionDescription}>
              Reduce file size with ZIP compression
            </Text>
          </View>
          <Switch
            value={exportConfig.compression}
            onValueChange={(value) =>
              setExportConfig((prev) => ({
                ...prev,
                compression: value,
              }))
            }
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Export Format</Text>
      <Text style={styles.stepDescription}>
        Choose your preferred file format
      </Text>

      <View style={styles.formatOptions}>
        {formatOptions.map((format) => (
          <TouchableOpacity
            key={format.value}
            style={[
              styles.formatCard,
              exportConfig.format === format.value && styles.formatCardSelected,
            ]}
            onPress={() =>
              setExportConfig((prev) => ({
                ...prev,
                format: format.value as any,
              }))
            }
          >
            <Text style={styles.formatIcon}>{format.icon}</Text>
            <Text style={styles.formatLabel}>{format.label}</Text>
            <Text style={styles.formatDescription}>{format.description}</Text>
            {exportConfig.format === format.value && (
              <View style={styles.formatSelectedIndicator}>
                <Text style={styles.formatSelectedIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Password Protection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security (Optional)</Text>
        <TextInput
          style={styles.passwordInput}
          value={exportConfig.password}
          onChangeText={(password) =>
            setExportConfig((prev) => ({
              ...prev,
              password,
            }))
          }
          placeholder="Set password to protect exported file"
          placeholderTextColor="#9ca3af"
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Delivery Method</Text>
      <Text style={styles.stepDescription}>
        How would you like to receive the exported data?
      </Text>

      <View style={styles.deliveryOptions}>
        {deliveryMethods.map((method) => (
          <TouchableOpacity
            key={method.value}
            style={[
              styles.deliveryCard,
              exportConfig.deliveryMethod === method.value &&
                styles.deliveryCardSelected,
            ]}
            onPress={() =>
              setExportConfig((prev) => ({
                ...prev,
                deliveryMethod: method.value as any,
              }))
            }
          >
            <Text style={styles.deliveryIcon}>{method.icon}</Text>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryLabel}>{method.label}</Text>
              <Text style={styles.deliveryDescription}>
                {method.description}
              </Text>
            </View>
            {exportConfig.deliveryMethod === method.value && (
              <View style={styles.deliverySelectedIndicator}>
                <Text style={styles.deliverySelectedIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {exportConfig.deliveryMethod === "email" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Recipients</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Enter email addresses (comma separated)"
            placeholderTextColor="#9ca3af"
            value={exportConfig.emailRecipients.join(", ")}
            onChangeText={(text) =>
              setExportConfig((prev) => ({
                ...prev,
                emailRecipients: text
                  .split(",")
                  .map((email) => email.trim())
                  .filter(Boolean),
              }))
            }
          />
        </View>
      )}

      {/* Export Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Export Summary</Text>
        <View style={styles.summaryItems}>
          <Text style={styles.summaryItem}>
            📊 Data Types: {exportConfig.dataTypes.length} selected
          </Text>
          <Text style={styles.summaryItem}>
            📅 Date Range: {exportConfig.dateRange.preset}
          </Text>
          <Text style={styles.summaryItem}>
            📄 Format:{" "}
            {formatOptions.find((f) => f.value === exportConfig.format)?.label}
          </Text>
          <Text style={styles.summaryItem}>
            🚀 Delivery:{" "}
            {
              deliveryMethods.find(
                (d) => d.value === exportConfig.deliveryMethod,
              )?.label
            }
          </Text>
        </View>
      </View>
    </View>
  );

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Data Selection";
      case 2:
        return "Filters & Range";
      case 3:
        return "Format & Security";
      case 4:
        return "Delivery & Summary";
      default:
        return "Export Data";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Export Data</Text>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => {
              if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
              } else {
                handleExport();
              }
            }}
          >
            <Text style={styles.headerActionText}>
              {currentStep < 4 ? "Next" : "Export"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Title */}
        <View style={styles.stepHeader}>
          <Text style={styles.currentStepTitle}>
            {getStepTitle(currentStep)}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              currentStep === 1 &&
                exportConfig.dataTypes.length === 0 &&
                styles.nextButtonDisabled,
            ]}
            onPress={() => {
              if (currentStep < 4) {
                if (currentStep === 1 && exportConfig.dataTypes.length === 0) {
                  showError("Please select at least one data type");
                  return;
                }
                setCurrentStep(currentStep + 1);
              } else {
                handleExport();
              }
            }}
            disabled={currentStep === 1 && exportConfig.dataTypes.length === 0}
          >
            <Text style={styles.nextButtonText}>
              {currentStep < 4 ? "Continue" : "Start Export"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingTop: 50,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerAction: {
    padding: 8,
  },
  headerActionText: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: "#8b5cf6",
  },
  stepCircleCurrent: {
    backgroundColor: "#8b5cf6",
    borderWidth: 2,
    borderColor: "#a855f7",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: "#8b5cf6",
  },
  stepHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  currentStepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  dataTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  dataTypeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  dataTypeCardSelected: {
    borderColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
  },
  dataTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  dataTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  dataTypeCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#8b5cf6",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  datePresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  presetButtonActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  presetText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  presetTextActive: {
    color: "#fff",
  },
  customDateInputs: {
    flexDirection: "row",
    gap: 12,
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  dateLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  formatOptions: {
    gap: 12,
    marginBottom: 24,
  },
  formatCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  formatCardSelected: {
    borderColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
  },
  formatIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  formatLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  formatSelectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#8b5cf6",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formatSelectedIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  passwordInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  deliveryOptions: {
    gap: 12,
    marginBottom: 24,
  },
  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  deliveryCardSelected: {
    borderColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
  },
  deliveryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  deliveryDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  deliverySelectedIndicator: {
    backgroundColor: "#8b5cf6",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deliverySelectedIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emailInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  summary: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  summaryItems: {
    gap: 4,
  },
  summaryItem: {
    fontSize: 14,
    color: "#1e40af",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  nextButton: {
    flex: 2,
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
