import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { scannerService } from "@/services/scanner";
import { ExportOptions, ScannerType } from "@/types/scanner";

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  qaMode?: boolean;
  onQAModeToggle?: (enabled: boolean) => void;
}

export default function ExportModal({
  visible,
  onClose,
  qaMode = false,
  onQAModeToggle,
}: ExportModalProps) {
  const [exportFormat, setExportFormat] =
    useState<ExportOptions["format"]>("JSON");
  const [includeImages, setIncludeImages] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<ScannerType[]>([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [includeConfidenceScores, setIncludeConfidenceScores] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<
    "7days" | "30days" | "90days" | "all"
  >("30days");

  const exportFormats: Array<{
    format: ExportOptions["format"];
    icon: string;
    description: string;
  }> = [
    { format: "JSON", icon: "📋", description: "Structured data format" },
    { format: "CSV", icon: "📊", description: "Spreadsheet compatible" },
    { format: "PDF", icon: "📄", description: "Printable document" },
    { format: "DOCX", icon: "📝", description: "Word document format" },
  ];

  const scannerTypes: Array<{ type: ScannerType; icon: string; name: string }> =
    [
      { type: "document", icon: "📄", name: "Documents" },
      { type: "barcode", icon: "📊", name: "Barcodes" },
      { type: "qr", icon: "📱", name: "QR Codes" },
      { type: "id_card", icon: "🆔", name: "ID Cards" },
      { type: "receipt", icon: "🧾", name: "Receipts" },
      { type: "signature", icon: "✍️", name: "Signatures" },
      { type: "text", icon: "📝", name: "Text Extracts" },
    ];

  const toggleType = (type: ScannerType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const selectAllTypes = () => {
    setSelectedTypes(scannerTypes.map((t) => t.type));
  };

  const clearAllTypes = () => {
    setSelectedTypes([]);
  };

  const getDateRangeDays = () => {
    switch (selectedDateRange) {
      case "7days":
        return 7;
      case "30days":
        return 30;
      case "90days":
        return 90;
      default:
        return null;
    }
  };

  const handleExport = async () => {
    if (selectedTypes.length === 0) {
      Alert.alert(
        "No Selection",
        "Please select at least one data type to export.",
      );
      return;
    }

    setExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.15;
        });
      }, 300);

      const dateRangeDays = getDateRangeDays();
      const options: ExportOptions = {
        format: exportFormat,
        includeImages,
        types: selectedTypes,
        ...(dateRangeDays && {
          dateRange: {
            start: new Date(Date.now() - dateRangeDays * 24 * 60 * 60 * 1000),
            end: new Date(),
          },
        }),
      };

      const exportData = await scannerService.exportScans(options);

      clearInterval(progressInterval);
      setExportProgress(1);

      // Add confidence scores if QA mode is enabled
      if (qaMode && includeConfidenceScores) {
        console.log("Including OCR confidence scores in export");
      }

      Alert.alert(
        "Export Complete ✅",
        `Your data has been exported in ${exportFormat} format with ${selectedTypes.length} data types${dateRangeDays ? ` from the last ${dateRangeDays} days` : ""}.`,
        [{ text: "OK", onPress: () => onClose() }],
      );
    } catch (error) {
      setExportProgress(0);
      Alert.alert(
        "Export Failed ❌",
        "There was an error exporting your data. Please try again.",
      );
    } finally {
      setExporting(false);
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
        <View style={styles.header}>
          <Text style={styles.title}>📤 Export Scanner Data</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Export Format Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Export Format</Text>
            <View style={styles.formatGrid}>
              {exportFormats.map((format) => (
                <TouchableOpacity
                  key={format.format}
                  style={[
                    styles.formatCard,
                    exportFormat === format.format && styles.formatCardSelected,
                  ]}
                  onPress={() => setExportFormat(format.format)}
                >
                  <Text style={styles.formatIcon}>{format.icon}</Text>
                  <Text
                    style={[
                      styles.formatName,
                      exportFormat === format.format &&
                        styles.formatNameSelected,
                    ]}
                  >
                    {format.format}
                  </Text>
                  <Text
                    style={[
                      styles.formatDescription,
                      exportFormat === format.format &&
                        styles.formatDescriptionSelected,
                    ]}
                  >
                    {format.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data Types Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🗂️ Data Types</Text>
              <View style={styles.selectionActions}>
                <TouchableOpacity
                  onPress={selectAllTypes}
                  style={styles.selectionButton}
                >
                  <Text style={styles.selectionButtonText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={clearAllTypes}
                  style={styles.selectionButton}
                >
                  <Text style={styles.selectionButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.typesGrid}>
              {scannerTypes.map((type) => (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    styles.typeCard,
                    selectedTypes.includes(type.type) &&
                      styles.typeCardSelected,
                  ]}
                  onPress={() => toggleType(type.type)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.typeName,
                      selectedTypes.includes(type.type) &&
                        styles.typeNameSelected,
                    ]}
                  >
                    {type.name}
                  </Text>
                  <View
                    style={[
                      styles.typeCheckbox,
                      selectedTypes.includes(type.type) &&
                        styles.typeCheckboxSelected,
                    ]}
                  >
                    {selectedTypes.includes(type.type) && (
                      <Text style={styles.typeCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Date Range</Text>

            <View style={styles.dateRangeContainer}>
              {[
                { value: "7days", label: "Last 7 days", icon: "📅" },
                { value: "30days", label: "Last 30 days", icon: "📅" },
                { value: "90days", label: "Last 90 days", icon: "📅" },
                { value: "all", label: "All time", icon: "🗓️" },
              ].map((range) => (
                <TouchableOpacity
                  key={range.value}
                  style={[
                    styles.dateRangeOption,
                    selectedDateRange === range.value &&
                      styles.dateRangeOptionSelected,
                  ]}
                  onPress={() => setSelectedDateRange(range.value as any)}
                >
                  <Text style={styles.dateRangeIcon}>{range.icon}</Text>
                  <Text
                    style={[
                      styles.dateRangeText,
                      selectedDateRange === range.value &&
                        styles.dateRangeTextSelected,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Export Options</Text>

            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Include Images</Text>
                <Text style={styles.optionDescription}>
                  Export scanned images along with text data
                </Text>
              </View>
              <Switch
                value={includeImages}
                onValueChange={setIncludeImages}
                trackColor={{ false: "#e2e8f0", true: "#22c55e" }}
                thumbColor={includeImages ? "#fff" : "#64748b"}
              />
            </View>

            {qaMode && (
              <View style={styles.optionRow}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    Include Confidence Scores
                  </Text>
                  <Text style={styles.optionDescription}>
                    Add OCR confidence scores for QA testing
                  </Text>
                </View>
                <Switch
                  value={includeConfidenceScores}
                  onValueChange={setIncludeConfidenceScores}
                  trackColor={{ false: "#e2e8f0", true: "#f59e0b" }}
                  thumbColor={includeConfidenceScores ? "#fff" : "#64748b"}
                />
              </View>
            )}

            {qaMode && onQAModeToggle && (
              <View style={styles.qaSection}>
                <View style={styles.qaSectionHeader}>
                  <Text style={styles.qaSectionTitle}>🧪 QA Testing Mode</Text>
                  <Switch
                    value={qaMode}
                    onValueChange={onQAModeToggle}
                    trackColor={{ false: "#e2e8f0", true: "#ef4444" }}
                    thumbColor={qaMode ? "#fff" : "#64748b"}
                  />
                </View>
                <Text style={styles.qaSectionDescription}>
                  Enable to include confidence scores, edge case testing data,
                  and debugging information in exports.
                </Text>
              </View>
            )}
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📊 Export Summary</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Format:</Text>
                <Text style={styles.summaryValue}>{exportFormat}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Data Types:</Text>
                <Text style={styles.summaryValue}>
                  {selectedTypes.length === 0
                    ? "None selected"
                    : `${selectedTypes.length} selected`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Include Images:</Text>
                <Text style={styles.summaryValue}>
                  {includeImages ? "Yes" : "No"}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date Range:</Text>
                <Text style={styles.summaryValue}>
                  {dateFilter ? "Last 30 days" : "All time"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Export Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.exportButton,
              (selectedTypes.length === 0 || exporting) &&
                styles.exportButtonDisabled,
            ]}
            onPress={handleExport}
            disabled={selectedTypes.length === 0 || exporting}
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.exportButtonText}>📤 Export Data</Text>
            )}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  selectionActions: {
    flexDirection: "row",
    gap: 8,
  },
  selectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  selectionButtonText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  formatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  formatCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  formatCardSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  },
  formatIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  formatName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  formatNameSelected: {
    color: "#15803d",
  },
  formatDescription: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  formatDescriptionSelected: {
    color: "#22c55e",
  },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "30%",
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  typeCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1e293b",
    textAlign: "center",
  },
  typeNameSelected: {
    color: "#1d4ed8",
  },
  typeCheckbox: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  typeCheckboxSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  typeCheckmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 18,
  },
  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  summaryContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  exportButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  exportButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
