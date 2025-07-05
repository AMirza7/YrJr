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
import { router } from "expo-router";
import { scannerService } from "@/services/scanner";
import { DocumentScanResult } from "@/types/scanner";
import Toast, { ToastType } from "@/components/ui/Toast";
import ProgressIndicator from "@/components/scanner/ProgressIndicator";
import OCRResultView from "@/components/scanner/OCRResultView";
import AIActionsPanel from "@/components/scanner/AIActionsPanel";
import LegalDisclaimer from "@/components/scanner/LegalDisclaimer";

interface DocumentScannerProps {
  onScanComplete?: (result: DocumentScanResult) => void;
  onClose?: () => void;
}

export default function DocumentScanner({
  onScanComplete,
  onClose,
}: DocumentScannerProps) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<DocumentScanResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");
  const [showFirstTimeDisclaimer, setShowFirstTimeDisclaimer] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const showToastMessage = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleFileUpload = async () => {
    // Show first time disclaimer if needed
    if (isFirstTime) {
      setShowFirstTimeDisclaimer(true);
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const fileUri = await scannerService.pickDocument();

      if (!fileUri) {
        setLoading(false);
        return;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.1;
        });
      }, 200);

      const result = await scannerService.scanDocument(fileUri);

      clearInterval(progressInterval);
      setUploadProgress(1);

      setScanResult(result);
      onScanComplete?.(result);

      showToastMessage("✅ Scan successful! Document processed.", "success");
    } catch (error) {
      setUploadProgress(0);
      showToastMessage("❌ Scan failed. Please try again.", "error");
      console.error("Scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    setUploadProgress(0);
    handleFileUpload();
  };

  const handleFirstTimeAccept = () => {
    setIsFirstTime(false);
    setShowFirstTimeDisclaimer(false);
    handleFileUpload();
  };

  const handleFieldUpdate = (key: string, value: string) => {
    if (!scanResult) return;

    setScanResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          keyFields: {
            ...prev.data.keyFields,
            [key]: value,
          },
        },
      };
    });

    showToastMessage("Field updated successfully", "success");
  };

  const handleGeneratePetition = () => {
    if (!scanResult) return;

    Alert.alert(
      "Generate Petition",
      "This will open the petition form with auto-filled data from the scan.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            // Navigate to petition form with scan data
            router.push("/petition-form");
          },
        },
      ],
    );
  };

  const handleSaveToHistory = async () => {
    if (!scanResult) return;

    try {
      // Already saved in service, just show confirmation
      Alert.alert("Saved", "Document has been saved to your scan history.");
    } catch (error) {
      Alert.alert("Error", "Failed to save to history.");
    }
  };

  const handleExportAsWord = () => {
    if (!scanResult) return;

    Alert.alert(
      "Export as Word",
      "This feature will be available soon. You can currently copy the text or save to history.",
      [{ text: "OK" }],
    );
  };

  if (loading) {
    return (
      <>
        <ProgressIndicator
          visible={loading}
          title="Processing Document"
          message="Extracting text and analyzing legal content"
          progress={uploadProgress}
          type="upload"
        />
        <Toast
          visible={showToast}
          message={toastMessage}
          type={toastType}
          onHide={() => setShowToast(false)}
          actionText={toastType === "error" ? "🔁 Retry" : undefined}
          onAction={toastType === "error" ? handleRetry : undefined}
        />
      </>
    );
  }

  if (scanResult) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>📄 Document Scan Results</Text>
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

        {/* Key Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Key Fields Detected</Text>
          <View style={styles.fieldsContainer}>
            {scanResult.data.keyFields.petitioner && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Petitioner:</Text>
                <Text style={styles.fieldValue}>
                  {scanResult.data.keyFields.petitioner}
                </Text>
              </View>
            )}
            {scanResult.data.keyFields.propertyAddress && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Property Address:</Text>
                <Text style={styles.fieldValue}>
                  {scanResult.data.keyFields.propertyAddress}
                </Text>
              </View>
            )}
            {scanResult.data.keyFields.ipcSections &&
              scanResult.data.keyFields.ipcSections.length > 0 && (
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>IPC Sections:</Text>
                  <Text style={styles.fieldValue}>
                    {scanResult.data.keyFields.ipcSections.join(", ")}
                  </Text>
                </View>
              )}
            {scanResult.data.keyFields.dates &&
              scanResult.data.keyFields.dates.length > 0 && (
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Dates:</Text>
                  <Text style={styles.fieldValue}>
                    {scanResult.data.keyFields.dates.join(", ")}
                  </Text>
                </View>
              )}
            {scanResult.data.keyFields.caseNumber && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Case Number:</Text>
                <Text style={styles.fieldValue}>
                  {scanResult.data.keyFields.caseNumber}
                </Text>
              </View>
            )}
            {scanResult.data.keyFields.court && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Court:</Text>
                <Text style={styles.fieldValue}>
                  {scanResult.data.keyFields.court}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Full Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Full Extracted Text</Text>
          <ScrollView style={styles.textContainer} nestedScrollEnabled>
            <Text style={styles.extractedText}>{scanResult.data.fullText}</Text>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleGeneratePetition}
          >
            <Text style={styles.primaryButtonText}>📋 Generate Petition</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSaveToHistory}
            >
              <Text style={styles.secondaryButtonText}>💾 Save to History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleExportAsWord}
            >
              <Text style={styles.secondaryButtonText}>📄 Export as Word</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.title}>📄 Document Scanner</Text>
        <Text style={styles.subtitle}>
          Upload PDF, JPG, or PNG files for OCR processing
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}
        >
          <Text style={styles.uploadIcon}>📁</Text>
          <Text style={styles.uploadText}>Choose File</Text>
          <Text style={styles.uploadSubtext}>PDF, JPG, PNG supported</Text>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>✨ Features</Text>
          <Text style={styles.featureItem}>• Automatic text extraction</Text>
          <Text style={styles.featureItem}>• Legal document recognition</Text>
          <Text style={styles.featureItem}>• Key field highlighting</Text>
          <Text style={styles.featureItem}>• Auto-fill petition forms</Text>
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
    color: "#1e40af",
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
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  featuresContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
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
    marginBottom: 8,
    lineHeight: 20,
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
  section: {
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
  fieldsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  textContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
  },
  extractedText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
    fontFamily: "monospace",
  },
  actionsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "500",
  },
});
