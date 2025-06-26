import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DocumentScannerService,
  ScannedDocument,
  LegalDocumentFields,
} from "@/services/documentScanner";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface DocumentScannerProps {
  visible: boolean;
  onClose: () => void;
  onDocumentScanned: (document: ScannedDocument) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  visible,
  onClose,
  onDocumentScanned,
}) => {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scannedDocument, setScannedDocument] =
    useState<ScannedDocument | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleScanWithCamera = async () => {
    try {
      setScanning(true);
      const document = await DocumentScannerService.scanWithCamera();

      if (document) {
        setScannedDocument(document);
        setShowResults(true);
        await processDocument(document);
      }
    } catch (error) {
      console.error("Camera scan error:", error);
      Alert.alert(
        "Error",
        "Failed to scan document with camera. Please try again.",
      );
    } finally {
      setScanning(false);
    }
  };

  const handleSelectFromDevice = async () => {
    try {
      setScanning(true);
      const document = await DocumentScannerService.selectFromDevice();

      if (document) {
        setScannedDocument(document);
        setShowResults(true);
        await processDocument(document);
      }
    } catch (error) {
      console.error("Document selection error:", error);
      Alert.alert("Error", "Failed to select document. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const processDocument = async (document: ScannedDocument) => {
    try {
      setProcessing(true);

      // If it's an image and doesn't have extracted text, process it
      if (document.type.startsWith("image/") && !document.extractedText) {
        // The service already handles OCR in the scan/select methods
        // This is just for additional processing if needed
      }
    } catch (error) {
      console.error("Document processing error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptDocument = () => {
    if (scannedDocument) {
      onDocumentScanned(scannedDocument);
      handleClose();
    }
  };

  const handleRetry = () => {
    setScannedDocument(null);
    setShowResults(false);
  };

  const handleClose = () => {
    setScannedDocument(null);
    setShowResults(false);
    onClose();
  };

  const renderScanOptions = () => (
    <View style={styles.scanOptionsContainer}>
      <Text style={[styles.title, { color: theme.text }]}>
        Scan Legal Document
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Choose how you'd like to add your document
      </Text>

      <View style={styles.optionsGrid}>
        <TouchableOpacity
          onPress={handleScanWithCamera}
          disabled={scanning}
          style={[
            styles.optionCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Ionicons name="camera" size={32} color={theme.primary} />
          </View>
          <Text style={[styles.optionTitle, { color: theme.text }]}>
            Scan with Camera
          </Text>
          <Text
            style={[styles.optionDescription, { color: theme.textSecondary }]}
          >
            Take a photo of your document for instant OCR scanning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSelectFromDevice}
          disabled={scanning}
          style={[
            styles.optionCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.optionIcon,
              { backgroundColor: theme.secondary + "20" },
            ]}
          >
            <Ionicons name="folder-open" size={32} color={theme.secondary} />
          </View>
          <Text style={[styles.optionTitle, { color: theme.text }]}>
            Select from Device
          </Text>
          <Text
            style={[styles.optionDescription, { color: theme.textSecondary }]}
          >
            Choose an image or PDF from your device gallery
          </Text>
        </TouchableOpacity>
      </View>

      {scanning && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {scanning ? "Opening scanner..." : "Processing document..."}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <View style={[styles.infoIcon, { backgroundColor: theme.info + "20" }]}>
          <Ionicons name="information-circle" size={16} color={theme.info} />
        </View>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Supported formats: JPG, PNG, PDF. The app will automatically extract
          text and legal information.
        </Text>
      </View>
    </View>
  );

  const renderExtractedFields = (fields: LegalDocumentFields) => (
    <View style={styles.fieldsContainer}>
      <Text style={[styles.fieldsTitle, { color: theme.text }]}>
        Extracted Information
      </Text>

      {fields.documentType && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Document Type:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.documentType.replace("_", " ")}
          </Text>
        </View>
      )}

      {fields.caseNumber && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Case Number:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.caseNumber}
          </Text>
        </View>
      )}

      {fields.courtName && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Court:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.courtName}
          </Text>
        </View>
      )}

      {fields.judgeName && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Judge:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.judgeName}
          </Text>
        </View>
      )}

      {fields.date && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Date:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.date}
          </Text>
        </View>
      )}

      {fields.sections && fields.sections.length > 0 && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Legal Sections:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.sections.join(", ")}
          </Text>
        </View>
      )}

      {fields.complainantName && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Complainant:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.complainantName}
          </Text>
        </View>
      )}

      {fields.accusedName && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Accused:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.accusedName}
          </Text>
        </View>
      )}

      {fields.policeStation && (
        <View style={styles.fieldItem}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Police Station:
          </Text>
          <Text style={[styles.fieldValue, { color: theme.text }]}>
            {fields.policeStation}
          </Text>
        </View>
      )}
    </View>
  );

  const renderScanResults = () => (
    <ScrollView
      style={styles.resultsContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Document Scanned Successfully
      </Text>

      <Card style={styles.documentPreview} padding="medium">
        <View style={styles.documentHeader}>
          <View
            style={[
              styles.documentIcon,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Ionicons
              name={
                scannedDocument?.type.startsWith("image/")
                  ? "image"
                  : "document"
              }
              size={24}
              color={theme.primary}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={[styles.documentName, { color: theme.text }]}>
              {scannedDocument?.name}
            </Text>
            <Text style={[styles.documentSize, { color: theme.textSecondary }]}>
              {scannedDocument ? Math.round(scannedDocument.size / 1024) : 0} KB
            </Text>
          </View>
        </View>

        {scannedDocument?.type.startsWith("image/") && (
          <Image
            source={{ uri: scannedDocument.uri }}
            style={styles.documentImage}
            contentFit="contain"
          />
        )}
      </Card>

      {processing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.processingText, { color: theme.textSecondary }]}>
            Extracting text and legal information...
          </Text>
        </View>
      )}

      {scannedDocument?.extractedFields &&
        !processing &&
        renderExtractedFields(scannedDocument.extractedFields)}

      {scannedDocument?.extractedText && !processing && (
        <Card style={styles.extractedTextContainer} padding="medium">
          <Text style={[styles.extractedTextTitle, { color: theme.text }]}>
            Extracted Text
          </Text>
          <ScrollView style={styles.extractedTextScroll} nestedScrollEnabled>
            <Text
              style={[styles.extractedText, { color: theme.textSecondary }]}
            >
              {scannedDocument.extractedText}
            </Text>
          </ScrollView>
        </Card>
      )}

      <View style={styles.actionButtons}>
        <Button
          title="Accept Document"
          onPress={handleAcceptDocument}
          fullWidth
          gradient
          style={styles.actionButton}
        />
        <Button
          title="Scan Again"
          onPress={handleRetry}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.header,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Document Scanner
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          {!showResults ? renderScanOptions() : renderScanResults()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  scanOptionsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  optionsGrid: {
    marginBottom: Spacing.xl,
  },
  optionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  optionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  optionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.md,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  resultsContainer: {
    flex: 1,
  },
  documentPreview: {
    marginBottom: Spacing.lg,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  documentSize: {
    fontSize: FontSizes.sm,
  },
  documentImage: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.md,
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },
  processingText: {
    fontSize: FontSizes.sm,
    marginLeft: Spacing.sm,
  },
  fieldsContainer: {
    marginBottom: Spacing.lg,
  },
  fieldsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  fieldItem: {
    marginBottom: Spacing.sm,
  },
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  fieldValue: {
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
  extractedTextContainer: {
    marginBottom: Spacing.lg,
    maxHeight: 200,
  },
  extractedTextTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  extractedTextScroll: {
    maxHeight: 120,
  },
  extractedText: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  actionButtons: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});
