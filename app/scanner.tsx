import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import { canAccessFeature } from "@/constants/roles";
import BackButton from "@/components/navigation/BackButton";
import { shareDocument } from "@/utils/shareUtils";
import {
  documentScannerService,
  ScanResult,
  ExtractedLegalFields,
} from "@/services/documentScanner";

export default function DocumentScanner() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);

  const documentTypes = [
    {
      type: "fir",
      name: "FIR",
      icon: "🚔",
      description: "First Information Report",
    },
    {
      type: "court_order",
      name: "Court Order",
      icon: "⚖️",
      description: "Court orders and judgments",
    },
    {
      type: "notice",
      name: "Legal Notice",
      icon: "📋",
      description: "Legal notices and summons",
    },
    {
      type: "contract",
      name: "Contract",
      icon: "📝",
      description: "Agreements and contracts",
    },
    {
      type: "petition",
      name: "Petition",
      icon: "📄",
      description: "Petitions and applications",
    },
    {
      type: "affidavit",
      name: "Affidavit",
      icon: "✍️",
      description: "Sworn statements",
    },
  ];

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (
        !canAccessFeature(
          currentUser.role,
          currentUser.subscriptionTier,
          "scanner",
        )
      ) {
        Alert.alert(
          "Access Restricted",
          "Document scanner requires Pro subscription or higher.",
          [{ text: "OK", onPress: () => router.back() }],
        );
        return;
      }

      setUser(currentUser);
      loadRecentScans();
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentScans = async () => {
    // In a real app, this would load from storage
    // For demo, we'll use empty array initially
    setRecentScans([]);
  };

  const handleScanWithCamera = async () => {
    setScanning(true);
    try {
      const result = await documentScannerService.scanWithCamera();

      if (result.success) {
        setScanResult(result);
        // Add to recent scans
        setRecentScans((prev) => [result, ...prev.slice(0, 4)]);
        Alert.alert("Success!", "Document scanned and processed successfully.");
      } else {
        Alert.alert("Scan Failed", result.error || "Failed to scan document");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred during scanning");
    } finally {
      setScanning(false);
    }
  };

  const handleScanFromGallery = async () => {
    setScanning(true);
    try {
      const result = await documentScannerService.scanFromGallery();

      if (result.success) {
        setScanResult(result);
        // Add to recent scans
        setRecentScans((prev) => [result, ...prev.slice(0, 4)]);
        Alert.alert("Success!", "Document processed successfully.");
      } else {
        Alert.alert(
          "Processing Failed",
          result.error || "Failed to process document",
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred during processing");
    } finally {
      setScanning(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!scanResult?.imageUri) return;

    const success = await documentScannerService.saveToGallery(
      scanResult.imageUri,
    );
    if (success) {
      Alert.alert("Saved", "Document saved to gallery successfully.");
    } else {
      Alert.alert("Error", "Failed to save document to gallery.");
    }
  };

  const handleShareDocument = async () => {
    if (!scanResult) return;

    const extractedData = scanResult.extractedFields
      ? documentScannerService.formatExtractedData(scanResult.extractedFields)
      : [];

    const shareText = `
Legal Document Scan Results:

${
  scanResult.extractedFields
    ? `Document Type: ${documentScannerService.getDocumentTypeName(scanResult.extractedFields.documentType)}\n`
    : ""
}
${extractedData.map((item) => `${item.label}: ${item.value}`).join("\n")}

${scanResult.extractedText ? "\nFull Text:\n" + scanResult.extractedText : ""}
    `.trim();

    try {
      await shareDocument(shareText);
    } catch (error) {
      console.error("Error sharing document:", error);
      Alert.alert("Error", "Failed to share document. Please try again.");
    }
  };

  const clearScanResult = () => {
    setScanResult(null);
  };

  const renderScanResult = () => {
    if (!scanResult) return null;

    const extractedData = scanResult.extractedFields
      ? documentScannerService.formatExtractedData(scanResult.extractedFields)
      : [];

    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>📄 Scan Results</Text>
          <TouchableOpacity
            onPress={clearScanResult}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {scanResult.imageUri && (
          <Image
            source={{ uri: scanResult.imageUri }}
            style={styles.scannedImage}
          />
        )}

        {scanResult.extractedFields && (
          <View style={styles.documentTypeCard}>
            <Text style={styles.documentTypeIcon}>
              {documentScannerService.getDocumentTypeIcon(
                scanResult.extractedFields.documentType,
              )}
            </Text>
            <Text style={styles.documentTypeName}>
              {documentScannerService.getDocumentTypeName(
                scanResult.extractedFields.documentType,
              )}
            </Text>
          </View>
        )}

        {extractedData.length > 0 && (
          <View style={styles.extractedFieldsCard}>
            <Text style={styles.sectionTitle}>📋 Extracted Information</Text>
            {extractedData.map((item, index) => (
              <View key={index} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{item.label}:</Text>
                <Text style={styles.fieldValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

        {scanResult.extractedText && (
          <View style={styles.textCard}>
            <Text style={styles.sectionTitle}>📝 Full Text</Text>
            <ScrollView style={styles.textScrollView} nestedScrollEnabled>
              <Text style={styles.extractedText}>
                {scanResult.extractedText}
              </Text>
            </ScrollView>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveToGallery}
          >
            <Text style={styles.actionButtonText}>💾 Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShareDocument}
          >
            <Text style={styles.actionButtonText}>📤 Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.push("/(tabs)/notes")}
          >
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
              📝 Save to Notes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRecentScan = ({
    item,
    index,
  }: {
    item: ScanResult;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.recentScanCard}
      onPress={() => setScanResult(item)}
    >
      <View style={styles.recentScanHeader}>
        <Text style={styles.recentScanIcon}>
          {item.extractedFields
            ? documentScannerService.getDocumentTypeIcon(
                item.extractedFields.documentType,
              )
            : "📄"}
        </Text>
        <View style={styles.recentScanInfo}>
          <Text style={styles.recentScanTitle}>
            {item.extractedFields
              ? documentScannerService.getDocumentTypeName(
                  item.extractedFields.documentType,
                )
              : "Scanned Document"}
          </Text>
          <Text style={styles.recentScanSubtitle}>
            {item.extractedFields?.caseNumber ||
              item.extractedFields?.firNumber ||
              "Recent scan"}
          </Text>
        </View>
      </View>

      {item.imageUri && (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.recentScanThumbnail}
        />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading scanner...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
        <Text style={styles.title}>Document Scanner</Text>
        <Text style={styles.subtitle}>AI-powered OCR for legal documents</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scan Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 Scan Document</Text>

          <View style={styles.scanOptions}>
            <TouchableOpacity
              style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
              onPress={handleScanWithCamera}
              disabled={scanning}
            >
              <Text style={styles.scanButtonIcon}>📱</Text>
              <Text style={styles.scanButtonText}>Take Photo</Text>
              <Text style={styles.scanButtonSubtext}>Use camera to scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
              onPress={handleScanFromGallery}
              disabled={scanning}
            >
              <Text style={styles.scanButtonIcon}>🖼️</Text>
              <Text style={styles.scanButtonText}>From Gallery</Text>
              <Text style={styles.scanButtonSubtext}>
                Select existing photo
              </Text>
            </TouchableOpacity>
          </View>

          {scanning && (
            <View style={styles.scanningIndicator}>
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text style={styles.scanningText}>Processing document...</Text>
              <Text style={styles.scanningSubtext}>
                Extracting text and analyzing content
              </Text>
            </View>
          )}
        </View>

        {/* Document Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Supported Documents</Text>
          <View style={styles.documentTypesGrid}>
            {documentTypes.map((doc, index) => (
              <View key={index} style={styles.documentTypeItem}>
                <Text style={styles.documentTypeIcon}>{doc.icon}</Text>
                <Text style={styles.documentTypeName}>{doc.name}</Text>
                <Text style={styles.documentTypeDescription}>
                  {doc.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Scan Results */}
        {renderScanResult()}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕒 Recent Scans</Text>
            {recentScans.map((scan, index) => (
              <View key={index}>{renderRecentScan({ item: scan, index })}</View>
            ))}
          </View>
        )}

        {/* OCR Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ OCR Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✅ Automatic text extraction</Text>
            <Text style={styles.featureItem}>
              ⚖️ Legal document recognition
            </Text>
            <Text style={styles.featureItem}>📝 Field auto-completion</Text>
            <Text style={styles.featureItem}>🔍 Case number detection</Text>
            <Text style={styles.featureItem}>📅 Date extraction</Text>
            <Text style={styles.featureItem}>👥 Party identification</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#7c3aed",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 16,
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
  scanOptions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  scanButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  scanButtonSubtext: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  scanningIndicator: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  scanningText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginTop: 12,
  },
  scanningSubtext: {
    fontSize: 14,
    color: "#3b82f6",
    marginTop: 4,
  },
  documentTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  documentTypeItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  documentTypeName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  documentTypeDescription: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  resultContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "bold",
  },
  scannedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  documentTypeCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  extractedFieldsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    width: 100,
  },
  fieldValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  textCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  textScrollView: {
    maxHeight: 150,
  },
  extractedText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
    fontFamily: "monospace",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#7c3aed",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  primaryButtonText: {
    color: "#fff",
  },
  recentScanCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentScanHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  recentScanIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  recentScanInfo: {
    flex: 1,
  },
  recentScanTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  recentScanSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  recentScanThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 12,
  },
  featuresList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 20,
  },
});
