import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";

export default function DocumentScanner() {
  const [scannedDocuments, setScannedDocuments] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const documentTypes = [
    { type: "FIR", icon: "🚔", description: "First Information Report" },
    {
      type: "Court Order",
      icon: "⚖️",
      description: "Court orders and judgments",
    },
    {
      type: "Legal Notice",
      icon: "📋",
      description: "Legal notices and summons",
    },
    { type: "Contract", icon: "📝", description: "Agreements and contracts" },
    { type: "Evidence", icon: "📸", description: "Documentary evidence" },
    { type: "Identity", icon: "🆔", description: "ID cards and certificates" },
  ];

  const handleScanDocument = (documentType: string) => {
    setIsScanning(true);

    Alert.alert(
      "Document Scanner",
      `This would open the camera to scan ${documentType} documents with OCR text extraction and automatic field recognition.`,
      [
        { text: "Cancel", onPress: () => setIsScanning(false) },
        {
          text: "Scan Document",
          onPress: () => simulateScan(documentType),
        },
      ],
    );
  };

  const simulateScan = (documentType: string) => {
    setTimeout(() => {
      const mockDocument = {
        id: Date.now().toString(),
        type: documentType,
        name: `${documentType}_${Date.now()}`,
        scanDate: new Date(),
        ocrText: `This is extracted text from the ${documentType} document. OCR technology would extract all readable text from the document for search and analysis purposes.`,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        pages: 1,
        size: "2.3 MB",
      };

      setScannedDocuments([mockDocument, ...scannedDocuments]);
      setIsScanning(false);

      Alert.alert(
        "Scan Complete",
        `${documentType} scanned successfully with ${mockDocument.confidence}% accuracy!`,
      );
    }, 2000);
  };

  const renderDocumentType = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.documentTypeCard}
      onPress={() => handleScanDocument(item.type)}
    >
      <Text style={styles.documentTypeIcon}>{item.icon}</Text>
      <Text style={styles.documentTypeName}>{item.type}</Text>
      <Text style={styles.documentTypeDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderScannedDocument = ({ item }: { item: any }) => (
    <View style={styles.scannedDocCard}>
      <View style={styles.docHeader}>
        <View style={styles.docInfo}>
          <Text style={styles.docName}>{item.name}</Text>
          <Text style={styles.docType}>{item.type}</Text>
        </View>
        <View style={styles.docStats}>
          <Text style={styles.confidenceText}>{item.confidence}% accuracy</Text>
          <Text style={styles.docSize}>{item.size}</Text>
        </View>
      </View>

      <Text style={styles.ocrPreview} numberOfLines={3}>
        OCR Text: {item.ocrText}
      </Text>

      <View style={styles.docActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👁️ View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📤 Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🔍 Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🧬 Document Scanner</Text>
        <Text style={styles.subtitle}>AI-powered OCR for legal documents</Text>
      </View>

      {/* Scan Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Scan Document Types</Text>
        <FlatList
          data={documentTypes}
          renderItem={renderDocumentType}
          keyExtractor={(item) => item.type}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.documentTypeRow}
        />
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Scanner Features</Text>
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI-Powered OCR</Text>
              <Text style={styles.featureDescription}>
                Advanced text recognition with legal document understanding
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📋</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Auto Field Detection</Text>
              <Text style={styles.featureDescription}>
                Automatically identifies and extracts key legal fields
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Search</Text>
              <Text style={styles.featureDescription}>
                Search through scanned documents using extracted text
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>☁️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Cloud Backup</Text>
              <Text style={styles.featureDescription}>
                Secure cloud storage with encryption for all documents
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scanned Documents */}
      {scannedDocuments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📄 Recent Scans ({scannedDocuments.length})
          </Text>
          {scannedDocuments.map((doc, index) =>
            renderScannedDocument({ item: doc }),
          )}
        </View>
      )}

      {/* Loading State */}
      {isScanning && (
        <View style={styles.scanningOverlay}>
          <View style={styles.scanningContainer}>
            <Text style={styles.scanningIcon}>📷</Text>
            <Text style={styles.scanningText}>Scanning Document...</Text>
            <Text style={styles.scanningSubtext}>Processing with AI OCR</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  documentTypeRow: {
    justifyContent: "space-between",
  },
  documentTypeCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  documentTypeName: {
    fontSize: 14,
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
  featuresContainer: {
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  scannedDocCard: {
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
  docHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  docType: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "500",
  },
  docStats: {
    alignItems: "flex-end",
  },
  confidenceText: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "600",
  },
  docSize: {
    fontSize: 10,
    color: "#6b7280",
  },
  ocrPreview: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
    marginBottom: 12,
    fontStyle: "italic",
  },
  docActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  scanningOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanningContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  scanningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  scanningSubtext: {
    fontSize: 14,
    color: "#6b7280",
  },
});
