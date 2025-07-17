import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import BackButton from "@/components/navigation/BackButton";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  thumbnailUrl?: string;
  ocrText?: string;
  caseId?: string;
  description?: string;
}

export default function DocumentsScreen() {
  const { theme } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setError(null);

      // API call to GET /api/documents
      const response = await fetch("/api/documents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents. Please try again.");

      // Fallback to mock data for demo
      setDocuments([
        {
          id: "1",
          name: "Property_Ownership_Certificate.pdf",
          type: "pdf",
          size: 2048576, // 2MB
          uploadedAt: "2024-01-15T10:00:00Z",
          uploadedBy: "Advocate Rajesh Kumar",
          url: "https://example.com/documents/property_cert.pdf",
          thumbnailUrl: "https://example.com/thumbnails/property_cert.jpg",
          ocrText:
            "Property ownership certificate for Plot No. 123, ABC Colony...",
          caseId: "CS/2024/001234",
          description:
            "Official property ownership certificate from registrar office",
        },
        {
          id: "2",
          name: "Employment_Contract.docx",
          type: "docx",
          size: 512000, // 500KB
          uploadedAt: "2024-01-12T14:30:00Z",
          uploadedBy: "John Doe",
          url: "https://example.com/documents/employment_contract.docx",
          ocrText: "Employment contract between XYZ Corp and John Doe...",
          caseId: "CS/2024/005678",
          description: "Original employment contract document",
        },
        {
          id: "3",
          name: "Court_Order_Scan.jpg",
          type: "jpg",
          size: 3145728, // 3MB
          uploadedAt: "2024-01-10T09:15:00Z",
          uploadedBy: "Court Registry",
          url: "https://example.com/documents/court_order.jpg",
          thumbnailUrl: "https://example.com/thumbnails/court_order.jpg",
          ocrText:
            "HIGH COURT ORDER - Case No. CS/2024/001234 - The court hereby orders...",
          description: "Court order document scanned copy",
        },
        {
          id: "4",
          name: "Financial_Statement.xlsx",
          type: "xlsx",
          size: 1024000, // 1MB
          uploadedAt: "2024-01-08T16:45:00Z",
          uploadedBy: "ABC Accounting Firm",
          url: "https://example.com/documents/financial_statement.xlsx",
          caseId: "CS/2024/009876",
          description: "Company financial statements for merger case",
        },
        {
          id: "5",
          name: "Witness_Statement.pdf",
          type: "pdf",
          size: 768000, // 750KB
          uploadedAt: "2024-01-05T11:20:00Z",
          uploadedBy: "Witness John Smith",
          url: "https://example.com/documents/witness_statement.pdf",
          ocrText:
            "I, John Smith, hereby state under oath that on the date of...",
          caseId: "CS/2024/001234",
          description: "Sworn witness statement document",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const handleViewDocument = async (document: Document) => {
    try {
      // Check if URL can be opened
      const supported = await Linking.canOpenURL(document.url);

      if (supported) {
        await Linking.openURL(document.url);
      } else {
        Alert.alert(
          "Cannot Open Document",
          "Unable to open this document type on your device.",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open document. Please try again later.", [
        { text: "OK" },
      ]);
    }
  };

  const handleDocumentPress = (document: Document) => {
    Alert.alert(
      document.name,
      `${document.description || "Document details"}\n\nSize: ${formatFileSize(document.size)}\nUploaded: ${formatDate(document.uploadedAt)}\nBy: ${document.uploadedBy}${document.caseId ? `\nCase: ${document.caseId}` : ""}${document.ocrText ? "\n\nOCR Text Available" : ""}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "View", onPress: () => handleViewDocument(document) },
        ...(document.ocrText
          ? [
              {
                text: "View OCR Text",
                onPress: () => showOCRText(document),
              },
            ]
          : []),
      ],
    );
  };

  const showOCRText = (document: Document) => {
    Alert.alert(
      "OCR Text - " + document.name,
      document.ocrText || "No OCR text available",
      [{ text: "Close" }],
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      case "txt":
        return "📃";
      default:
        return "📁";
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "#dc2626";
      case "doc":
      case "docx":
        return "#2563eb";
      case "xls":
      case "xlsx":
        return "#16a34a";
      case "jpg":
      case "jpeg":
      case "png":
        return "#ea580c";
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={[styles.documentCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleDocumentPress(item)}
    >
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <Text style={styles.fileIcon}>{getFileIcon(item.type)}</Text>
          <View style={styles.documentDetails}>
            <Text
              style={[styles.documentName, { color: theme.colors.text }]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <View style={styles.documentMeta}>
              <View
                style={[
                  styles.fileTypeBadge,
                  { backgroundColor: getFileTypeColor(item.type) },
                ]}
              >
                <Text style={styles.fileTypeText}>
                  {item.type.toUpperCase()}
                </Text>
              </View>
              <Text
                style={[styles.fileSize, { color: theme.colors.textSecondary }]}
              >
                {formatFileSize(item.size)}
              </Text>
              {item.ocrText && <Text style={styles.ocrBadge}>OCR</Text>}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewDocument(item)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      {item.description && (
        <Text
          style={[
            styles.documentDescription,
            { color: theme.colors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      )}

      <View style={styles.documentFooter}>
        <Text
          style={[styles.uploadInfo, { color: theme.colors.textSecondary }]}
        >
          📤 {item.uploadedBy}
        </Text>
        <Text
          style={[styles.uploadDate, { color: theme.colors.textSecondary }]}
        >
          {formatDate(item.uploadedAt)}
        </Text>
      </View>

      {item.caseId && (
        <Text style={[styles.caseInfo, { color: theme.colors.textSecondary }]}>
          📁 Case: {item.caseId}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <BackButton color="#fff" />
          <Text style={styles.headerTitle}>Documents</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading documents...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Documents</Text>
          <Text style={styles.headerSubtitle}>
            {documents.length} document{documents.length !== 1 ? "s" : ""} • OCR
            enabled
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDocuments}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Documents Found
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Your uploaded documents will appear here.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 12,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  documentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fileTypeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  fileSize: {
    fontSize: 12,
    fontWeight: "500",
  },
  ocrBadge: {
    backgroundColor: "#16a34a",
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  viewButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  documentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  documentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  uploadInfo: {
    fontSize: 12,
  },
  uploadDate: {
    fontSize: 12,
  },
  caseInfo: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
