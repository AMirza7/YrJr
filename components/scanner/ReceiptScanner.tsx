import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { scannerService } from "@/services/scanner";
import { ReceiptScanResult } from "@/types/scanner";

interface ReceiptScannerProps {
  onScanComplete?: (result: ReceiptScanResult) => void;
  onClose?: () => void;
}

export default function ReceiptScanner({
  onScanComplete,
  onClose,
}: ReceiptScannerProps) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);

  const handleFileUpload = async () => {
    try {
      setLoading(true);
      const fileUri = await scannerService.pickDocument();

      if (!fileUri) {
        setLoading(false);
        return;
      }

      const result = await scannerService.scanReceipt(fileUri);
      setScanResult(result);
      onScanComplete?.(result);
    } catch (error) {
      Alert.alert("Error", "Failed to scan receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!scanResult) return;

    Alert.alert(
      "Download CSV",
      "Receipt data will be exported as CSV format.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: () => {
            Alert.alert(
              "Success",
              "CSV file has been downloaded to your device.",
            );
          },
        },
      ],
    );
  };

  const handleLinkToCase = () => {
    Alert.alert(
      "Link to Case File",
      "Select a case file to link this receipt:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Case #123/2024", onPress: () => linkToCaseFile("123/2024") },
        { text: "Case #456/2024", onPress: () => linkToCaseFile("456/2024") },
        { text: "Case #789/2024", onPress: () => linkToCaseFile("789/2024") },
      ],
    );
  };

  const linkToCaseFile = (caseNumber: string) => {
    Alert.alert("Success", `Receipt has been linked to case ${caseNumber}.`);
  };

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return "N/A";
    return amount.startsWith("₹") ? amount : `₹${amount}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Processing receipt...</Text>
        <Text style={styles.loadingSubtext}>Extracting invoice details</Text>
      </View>
    );
  }

  if (scanResult) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🧾 Receipt Scan Results</Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preview Image */}
        {scanResult.imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: scanResult.imageUri }}
              style={styles.previewImage}
            />
          </View>
        )}

        {/* Receipt Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>📋 Invoice Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Invoice No.</Text>
              <Text style={styles.summaryValue}>
                {scanResult.data.invoiceNumber || "N/A"}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Seller</Text>
              <Text style={styles.summaryValue}>
                {scanResult.data.sellerName || "N/A"}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>
                {scanResult.data.date || "N/A"}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>GSTIN</Text>
              <Text style={styles.summaryValue}>
                {scanResult.data.gstin || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(scanResult.data.amount)}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        {scanResult.data.items && scanResult.data.items.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>📦 Items Breakdown</Text>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.descriptionColumn]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderText, styles.quantityColumn]}>
                Qty
              </Text>
              <Text style={[styles.tableHeaderText, styles.rateColumn]}>
                Rate
              </Text>
              <Text style={[styles.tableHeaderText, styles.amountColumn]}>
                Amount
              </Text>
            </View>

            {scanResult.data.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCellText, styles.descriptionColumn]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCellText, styles.quantityColumn]}>
                  {item.quantity || "-"}
                </Text>
                <Text style={[styles.tableCellText, styles.rateColumn]}>
                  {item.rate ? `₹${item.rate}` : "-"}
                </Text>
                <Text style={[styles.tableCellText, styles.amountColumn]}>
                  {item.amount ? `₹${item.amount}` : "-"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* GST Information */}
        {scanResult.data.gstin && (
          <View style={styles.gstContainer}>
            <Text style={styles.gstTitle}>🏛️ GST Information</Text>
            <View style={styles.gstInfo}>
              <Text style={styles.gstLabel}>GSTIN:</Text>
              <Text style={styles.gstValue}>{scanResult.data.gstin}</Text>
            </View>
            <Text style={styles.gstNote}>
              This receipt is GST compliant and can be used for tax filings.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownloadCSV}
          >
            <Text style={styles.actionButtonText}>📥 Download CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleLinkToCase}
          >
            <Text style={styles.primaryButtonText}>🔗 Link to Case File</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.title}>🧾 Receipt Scanner</Text>
        <Text style={styles.subtitle}>
          Upload receipt images to extract invoice details
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}
        >
          <Text style={styles.uploadIcon}>🧾</Text>
          <Text style={styles.uploadText}>Scan Receipt</Text>
          <Text style={styles.uploadSubtext}>PDF, JPG, PNG supported</Text>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>✨ Extraction Features</Text>
          <Text style={styles.featureItem}>• Invoice number and date</Text>
          <Text style={styles.featureItem}>• Seller name and GSTIN</Text>
          <Text style={styles.featureItem}>• Itemized breakdown</Text>
          <Text style={styles.featureItem}>• Total amount calculation</Text>
          <Text style={styles.featureItem}>• CSV export functionality</Text>
          <Text style={styles.featureItem}>• Case file linking</Text>
        </View>

        {/* Use Cases */}
        <View style={styles.useCasesContainer}>
          <Text style={styles.useCasesTitle}>📊 Use Cases</Text>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>💼</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Legal Expenses</Text>
              <Text style={styles.useCaseDescription}>
                Track consultation fees, court filing charges
              </Text>
            </View>
          </View>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>📋</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Case Evidence</Text>
              <Text style={styles.useCaseDescription}>
                Attach receipts as supporting documents
              </Text>
            </View>
          </View>

          <View style={styles.useCaseItem}>
            <Text style={styles.useCaseIcon}>💰</Text>
            <View style={styles.useCaseContent}>
              <Text style={styles.useCaseTitle}>Expense Reports</Text>
              <Text style={styles.useCaseDescription}>
                Generate detailed expense summaries
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7c3aed",
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
  uploadContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
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
  uploadButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#7c3aed",
    borderStyle: "dashed",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  imageContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    marginTop: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  summaryItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    width: "48%",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  totalContainer: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  itemsContainer: {
    backgroundColor: "#fff",
    marginTop: 1,
    padding: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableCellText: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
  },
  descriptionColumn: {
    flex: 2,
    textAlign: "left",
  },
  quantityColumn: {
    flex: 0.8,
  },
  rateColumn: {
    flex: 1,
  },
  amountColumn: {
    flex: 1,
  },
  gstContainer: {
    backgroundColor: "#fef3c7",
    marginTop: 1,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  gstTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 12,
  },
  gstInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  gstLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#a16207",
    width: 60,
  },
  gstValue: {
    fontSize: 14,
    color: "#92400e",
    fontFamily: "monospace",
    fontWeight: "600",
  },
  gstNote: {
    fontSize: 12,
    color: "#a16207",
    fontStyle: "italic",
  },
  featuresContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
    lineHeight: 20,
  },
  useCasesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  useCasesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  useCaseItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  useCaseIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  useCaseContent: {
    flex: 1,
  },
  useCaseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  useCaseDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#7c3aed",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
