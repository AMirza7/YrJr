import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { scannerService } from "@/services/scanner";
import { ScanResult, ScannerType } from "@/types/scanner";
import BackButton from "@/components/navigation/BackButton";
import ExportModal from "@/components/scanner/ExportModal";

export default function ScannerHistoryScreen() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ScannerType | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "type">("date");
  const [exportModalVisible, setExportModalVisible] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchQuery, selectedType, sortBy]);

  const loadHistory = async () => {
    try {
      const data = await scannerService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (scan) =>
          scan.extractedText
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          scan.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((scan) => scan.type === selectedType);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else {
        return a.type.localeCompare(b.type);
      }
    });

    setFilteredHistory(filtered);
  };

  const getScannerTypeIcon = (type: ScannerType) => {
    const icons = {
      document: "📄",
      barcode: "📊",
      qr: "📱",
      id_card: "🆔",
      receipt: "🧾",
      signature: "✍️",
      text: "📝",
    };
    return icons[type];
  };

  const getScannerTypeName = (type: ScannerType) => {
    const names = {
      document: "Document",
      barcode: "Barcode",
      qr: "QR Code",
      id_card: "ID Card",
      receipt: "Receipt",
      signature: "Signature",
      text: "Text Extract",
    };
    return names[type];
  };

  const getTypeColor = (type: ScannerType) => {
    const colors = {
      document: "#2563eb",
      barcode: "#059669",
      qr: "#059669",
      id_card: "#dc2626",
      receipt: "#7c3aed",
      signature: "#ea580c",
      text: "#0891b2",
    };
    return colors[type];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPreviewText = (scan: ScanResult) => {
    if (scan.extractedText) {
      return (
        scan.extractedText.substring(0, 300) +
        (scan.extractedText.length > 300 ? "..." : "")
      );
    }
    return `${getScannerTypeName(scan.type)} scan result`;
  };

  const handleScanPress = (scan: ScanResult) => {
    Alert.alert(getScannerTypeName(scan.type), getPreviewText(scan), [
      { text: "Close", style: "cancel" },
      { text: "View Details", onPress: () => viewScanDetails(scan) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteScan(scan.id),
      },
    ]);
  };

  const viewScanDetails = (scan: ScanResult) => {
    // Navigate to appropriate scanner with the scan data
    router.push({
      pathname: "/(tabs)/scanner",
      params: { scanId: scan.id },
    });
  };

  const deleteScan = async (scanId: string) => {
    Alert.alert(
      "Delete Scan",
      "Are you sure you want to delete this scan? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await scannerService.deleteScanFromHistory(scanId);
              await loadHistory();
              Alert.alert("Success", "Scan deleted successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete scan.");
            }
          },
        },
      ],
    );
  };

  const exportHistory = () => {
    setExportModalVisible(true);
  };

  const filterTypes: Array<{
    value: ScannerType | "all";
    label: string;
    icon: string;
  }> = [
    { value: "all", label: "All Types", icon: "📊" },
    { value: "document", label: "Documents", icon: "📄" },
    { value: "barcode", label: "Barcodes", icon: "📊" },
    { value: "qr", label: "QR Codes", icon: "📱" },
    { value: "id_card", label: "ID Cards", icon: "🆔" },
    { value: "receipt", label: "Receipts", icon: "🧾" },
    { value: "signature", label: "Signatures", icon: "✍️" },
    { value: "text", label: "Text", icon: "📝" },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading scan history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Scanner" color="#fff" />
        <Text style={styles.title}>📁 Scan History</Text>
        <TouchableOpacity onPress={exportHistory} style={styles.exportButton}>
          <Text style={styles.exportButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search scans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilters}
        >
          {filterTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeFilter,
                selectedType === type.value && styles.typeFilterSelected,
              ]}
              onPress={() => setSelectedType(type.value)}
            >
              <Text style={styles.typeFilterIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.typeFilterText,
                  selectedType === type.value && styles.typeFilterTextSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "date" && styles.sortButtonSelected,
            ]}
            onPress={() => setSortBy("date")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "date" && styles.sortButtonTextSelected,
              ]}
            >
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "type" && styles.sortButtonSelected,
            ]}
            onPress={() => setSortBy("type")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "type" && styles.sortButtonTextSelected,
              ]}
            >
              Type
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredHistory.length} of {history.length} scans
        </Text>
      </View>

      {/* History List */}
      <ScrollView
        style={styles.historyList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHistory} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No scans found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || selectedType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start scanning documents to see them here"}
            </Text>
          </View>
        ) : (
          filteredHistory.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              style={styles.historyItem}
              onPress={() => handleScanPress(scan)}
            >
              <View style={styles.historyHeader}>
                <View style={styles.historyTypeContainer}>
                  <Text style={styles.historyTypeIcon}>
                    {getScannerTypeIcon(scan.type)}
                  </Text>
                  <View style={styles.historyTypeInfo}>
                    <Text style={styles.historyTypeName}>
                      {getScannerTypeName(scan.type)}
                    </Text>
                    <Text style={styles.historyDate}>
                      {formatDate(scan.timestamp)}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.historyTypeBadge,
                    { backgroundColor: getTypeColor(scan.type) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.historyTypeBadgeText,
                      { color: getTypeColor(scan.type) },
                    ]}
                  >
                    {scan.confidence
                      ? `${Math.round(scan.confidence * 100)}%`
                      : "Processed"}
                  </Text>
                </View>
              </View>

              {scan.imageUri && (
                <Image
                  source={{ uri: scan.imageUri }}
                  style={styles.historyImage}
                />
              )}

              <Text style={styles.historyPreview}>{getPreviewText(scan)}</Text>

              <View style={styles.historyFooter}>
                <Text style={styles.historyId}>ID: {scan.id.slice(-8)}</Text>
                <Text style={styles.historyArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  exportButtonText: {
    fontSize: 20,
  },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
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
    fontSize: 16,
    color: "#1e293b",
  },
  typeFilters: {
    marginBottom: 16,
  },
  typeFilter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  typeFilterSelected: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  typeFilterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  typeFilterText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  typeFilterTextSelected: {
    color: "#fff",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortLabel: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sortButtonSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  sortButtonText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  sortButtonTextSelected: {
    color: "#fff",
  },
  resultsHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  resultsCount: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  historyList: {
    flex: 1,
    padding: 20,
  },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyTypeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  historyTypeInfo: {
    flex: 1,
  },
  historyTypeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: "#64748b",
  },
  historyTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  historyTypeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  historyImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: "cover",
  },
  historyPreview: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyId: {
    fontSize: 12,
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  historyArrow: {
    fontSize: 16,
    color: "#94a3b8",
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
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});
