import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  Image,
} from "react-native";
import { scannerService } from "@/services/scanner";
import { IDCardScanResult } from "@/types/scanner";

interface IDCardScannerProps {
  onScanComplete?: (result: IDCardScanResult) => void;
  onClose?: () => void;
}

export default function IDCardScanner({
  onScanComplete,
  onClose,
}: IDCardScannerProps) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<IDCardScanResult | null>(null);
  const [masked, setMasked] = useState(false);

  const handleFileUpload = async () => {
    try {
      setLoading(true);
      const fileUri = await scannerService.pickDocument();

      if (!fileUri) {
        setLoading(false);
        return;
      }

      const result = await scannerService.scanIDCard(fileUri);
      setScanResult(result);
      onScanComplete?.(result);
    } catch (error) {
      Alert.alert("Error", "Failed to scan ID card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getIDTypeIcon = (type: IDCardScanResult["data"]["idType"]) => {
    switch (type) {
      case "PAN":
        return "🏛️";
      case "Aadhaar":
        return "🆔";
      case "Voter ID":
        return "🗳️";
      case "Driver License":
        return "🚗";
      default:
        return "📄";
    }
  };

  const getIDTypeColor = (type: IDCardScanResult["data"]["idType"]) => {
    switch (type) {
      case "PAN":
        return "#dc2626";
      case "Aadhaar":
        return "#2563eb";
      case "Voter ID":
        return "#059669";
      case "Driver License":
        return "#7c3aed";
      default:
        return "#64748b";
    }
  };

  const maskIDNumber = (idNumber: string) => {
    if (!masked) return idNumber;

    if (idNumber.length <= 4) return idNumber;
    const visiblePart = idNumber.slice(-4);
    const maskedPart = "*".repeat(idNumber.length - 4);
    return maskedPart + visiblePart;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Processing ID card...</Text>
        <Text style={styles.loadingSubtext}>
          Extracting information securely
        </Text>
      </View>
    );
  }

  if (scanResult) {
    const idTypeColor = getIDTypeColor(scanResult.data.idType);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🆔 ID Card Scan Results</Text>
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

        {/* ID Card Display */}
        <View style={styles.cardContainer}>
          <View style={[styles.cardHeader, { backgroundColor: idTypeColor }]}>
            <Text style={styles.cardIcon}>
              {getIDTypeIcon(scanResult.data.idType)}
            </Text>
            <Text style={styles.cardType}>{scanResult.data.idType}</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Name:</Text>
              <Text style={styles.fieldValue}>{scanResult.data.name}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>ID Number:</Text>
              <View style={styles.idNumberContainer}>
                <Text style={[styles.fieldValue, styles.idNumber]}>
                  {maskIDNumber(scanResult.data.idNumber)}
                </Text>
                <View style={styles.maskToggle}>
                  <Text style={styles.maskLabel}>Mask ID</Text>
                  <Switch
                    value={masked}
                    onValueChange={setMasked}
                    trackColor={{ false: "#e2e8f0", true: idTypeColor }}
                    thumbColor={masked ? "#fff" : "#64748b"}
                  />
                </View>
              </View>
            </View>

            {scanResult.data.dateOfBirth && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Date of Birth:</Text>
                <Text style={styles.fieldValue}>
                  {scanResult.data.dateOfBirth}
                </Text>
              </View>
            )}

            {scanResult.data.address && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Address:</Text>
                <Text style={[styles.fieldValue, styles.addressValue]}>
                  {scanResult.data.address}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Secure Processing</Text>
            <Text style={styles.securityText}>
              Your ID information is processed locally and encrypted before
              storage
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💾 Save to Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>📄 Generate Document</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.title}>🆔 ID Card Scanner</Text>
        <Text style={styles.subtitle}>
          Upload photos of ID cards to extract information
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}
        >
          <Text style={styles.uploadIcon}>📱</Text>
          <Text style={styles.uploadText}>Scan ID Card</Text>
          <Text style={styles.uploadSubtext}>Camera or Gallery</Text>
        </TouchableOpacity>

        {/* Supported IDs */}
        <View style={styles.supportedContainer}>
          <Text style={styles.supportedTitle}>📋 Supported ID Types</Text>

          <View style={styles.idTypesGrid}>
            <View style={styles.idTypeItem}>
              <Text style={styles.idTypeIcon}>🏛️</Text>
              <Text style={styles.idTypeName}>PAN Card</Text>
            </View>

            <View style={styles.idTypeItem}>
              <Text style={styles.idTypeIcon}>🆔</Text>
              <Text style={styles.idTypeName}>Aadhaar</Text>
            </View>

            <View style={styles.idTypeItem}>
              <Text style={styles.idTypeIcon}>🗳️</Text>
              <Text style={styles.idTypeName}>Voter ID</Text>
            </View>

            <View style={styles.idTypeItem}>
              <Text style={styles.idTypeIcon}>🚗</Text>
              <Text style={styles.idTypeName}>Driving License</Text>
            </View>
          </View>
        </View>

        {/* Security Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>🔒 Security Features</Text>
          <Text style={styles.featureItem}>• End-to-end encryption</Text>
          <Text style={styles.featureItem}>• Optional ID masking</Text>
          <Text style={styles.featureItem}>• Secure local processing</Text>
          <Text style={styles.featureItem}>
            • No data sent to external servers
          </Text>
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
    color: "#dc2626",
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
    borderColor: "#dc2626",
    borderStyle: "dashed",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
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
  cardContainer: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  cardBody: {
    padding: 20,
  },
  fieldRow: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  idNumberContainer: {
    gap: 12,
  },
  idNumber: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "600",
  },
  maskToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  maskLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  addressValue: {
    lineHeight: 22,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: "#a16207",
    lineHeight: 16,
  },
  supportedContainer: {
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
  supportedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  idTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  idTypeItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    width: "22%",
    minWidth: 70,
  },
  idTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  idTypeName: {
    fontSize: 10,
    fontWeight: "500",
    color: "#475569",
    textAlign: "center",
  },
  featuresContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
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
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
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
    backgroundColor: "#dc2626",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
