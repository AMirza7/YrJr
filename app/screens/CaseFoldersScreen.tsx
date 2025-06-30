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
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import BackButton from "@/components/navigation/BackButton";

interface CaseFolder {
  id: string;
  title: string;
  caseNumber: string;
  clientName: string;
  status: string;
  createdAt: string;
  nextHearing?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export default function CaseFoldersScreen() {
  const { theme } = useTheme();
  const [folders, setFolders] = useState<CaseFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setError(null);

      // API call to GET /api/cases/folders
      const response = await fetch("/api/cases/folders", {
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
      setFolders(data);
    } catch (error) {
      console.error("Error fetching case folders:", error);
      setError("Failed to load case folders. Please try again.");

      // Fallback to mock data for demo
      setFolders([
        {
          id: "1",
          title: "Property Dispute - ABC vs XYZ",
          caseNumber: "CS/2024/001234",
          clientName: "ABC Private Limited",
          status: "Active",
          createdAt: "2024-01-15T10:00:00Z",
          nextHearing: "2024-02-15T10:00:00Z",
          priority: "high",
        },
        {
          id: "2",
          title: "Employment Contract Violation",
          caseNumber: "CS/2024/005678",
          clientName: "John Doe",
          status: "Pending Review",
          createdAt: "2024-01-10T14:30:00Z",
          priority: "medium",
        },
        {
          id: "3",
          title: "Corporate Merger Legal Review",
          caseNumber: "CS/2024/009876",
          clientName: "Tech Solutions Inc",
          status: "Completed",
          createdAt: "2024-01-05T09:15:00Z",
          priority: "low",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFolders();
  };

  const handleFolderPress = (folder: CaseFolder) => {
    // Navigate to case details screen
    Alert.alert(
      "Case Folder",
      `Opening ${folder.title}\nCase Number: ${folder.caseNumber}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open",
          onPress: () => {
            // Navigate to case details
            // router.push(`/case-details/${folder.id}`);
          },
        },
      ],
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#ea580c";
      case "medium":
        return "#d97706";
      case "low":
        return "#16a34a";
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#16a34a";
      case "pending review":
        return "#d97706";
      case "completed":
        return "#6b7280";
      case "on hold":
        return "#dc2626";
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderFolderItem = ({ item }: { item: CaseFolder }) => (
    <TouchableOpacity
      style={[styles.folderCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleFolderPress(item)}
    >
      <View style={styles.folderHeader}>
        <View style={styles.folderTitleContainer}>
          <Text
            style={[styles.folderTitle, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.folderDetails}>
        <Text
          style={[styles.caseNumber, { color: theme.colors.textSecondary }]}
        >
          Case: {item.caseNumber}
        </Text>
        <Text
          style={[styles.clientName, { color: theme.colors.textSecondary }]}
        >
          Client: {item.clientName}
        </Text>
      </View>

      <View style={styles.folderMeta}>
        <Text
          style={[styles.createdDate, { color: theme.colors.textSecondary }]}
        >
          📅 Created: {formatDate(item.createdAt)}
        </Text>
        {item.nextHearing && (
          <Text style={[styles.nextHearing, { color: "#ea580c" }]}>
            ⚖️ Next Hearing: {formatDate(item.nextHearing)}
          </Text>
        )}
      </View>
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
          <Text style={styles.headerTitle}>Case Folders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading case folders...
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
          <Text style={styles.headerTitle}>Case Folders</Text>
          <Text style={styles.headerSubtitle}>
            {folders.length} folders found
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFolders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={folders}
        renderItem={renderFolderItem}
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Case Folders Found
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Your case folders will appear here once you create them.
            </Text>
          </View>
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
  folderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  folderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  folderTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  folderDetails: {
    marginBottom: 12,
    gap: 4,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: "500",
  },
  clientName: {
    fontSize: 14,
  },
  folderMeta: {
    gap: 4,
  },
  createdDate: {
    fontSize: 12,
  },
  nextHearing: {
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
