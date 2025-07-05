import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchResult {
  id: string;
  type:
    | "user"
    | "case"
    | "template"
    | "document"
    | "section"
    | "scan"
    | "admin_action";
  title: string;
  subtitle: string;
  description: string;
  metadata: Record<string, any>;
  relevanceScore: number;
  lastModified: string;
  actionUrl?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "user_123",
    type: "user",
    title: "Adv. Priya Sharma",
    subtitle: "Senior Lawyer • Verified",
    description:
      "Specializes in Criminal Law and Civil Law. Bar Council No: DL/2019/12345",
    metadata: {
      email: "priya.sharma@example.com",
      role: "lawyer",
      verified: true,
    },
    relevanceScore: 95,
    lastModified: "2024-01-15T10:30:00Z",
    actionUrl: "/admin/users/user_123",
  },
  {
    id: "case_456",
    type: "case",
    title: "Civil Case CIV/2024/001",
    subtitle: "Property Dispute",
    description: "Land ownership dispute between parties in Delhi High Court",
    metadata: {
      court: "Delhi High Court",
      status: "active",
      nextHearing: "2024-01-20",
    },
    relevanceScore: 88,
    lastModified: "2024-01-14T16:20:00Z",
    actionUrl: "/cases/case_456",
  },
  {
    id: "template_789",
    type: "template",
    title: "Lease Agreement Template",
    subtitle: "Property & Real Estate",
    description: "Standard lease agreement template for residential properties",
    metadata: { category: "Property", downloads: 156, rating: 4.8 },
    relevanceScore: 82,
    lastModified: "2024-01-13T09:15:00Z",
    actionUrl: "/templates/template_789",
  },
  {
    id: "section_ipc302",
    type: "section",
    title: "IPC Section 302",
    subtitle: "Punishment for murder",
    description:
      "Whoever commits murder shall be punished with death, or imprisonment for life",
    metadata: { act: "Indian Penal Code", chapter: "XVI", amendments: 0 },
    relevanceScore: 90,
    lastModified: "2024-01-10T12:00:00Z",
    actionUrl: "/legal-search/ipc/302",
  },
  {
    id: "scan_012",
    type: "scan",
    title: "Document Scan - Contract.pdf",
    subtitle: "Scanned by Rajesh Kumar",
    description:
      "OCR extracted text contains rental agreement terms and conditions",
    metadata: { scanType: "document", confidence: 94, extractedFields: 12 },
    relevanceScore: 75,
    lastModified: "2024-01-15T08:45:00Z",
    actionUrl: "/scanner/history/scan_012",
  },
  {
    id: "admin_345",
    type: "admin_action",
    title: "User Approval Action",
    subtitle: "Admin Sarah approved lawyer verification",
    description: "Approved Adv. Priya Sharma's lawyer verification request",
    metadata: {
      adminId: "admin_001",
      action: "USER_APPROVED",
      targetUser: "user_123",
    },
    relevanceScore: 70,
    lastModified: "2024-01-15T10:30:00Z",
    actionUrl: "/admin/audit/admin_345",
  },
];

const searchCategories = [
  { key: "all", label: "All Results", icon: "🔍" },
  { key: "user", label: "Users", icon: "👥" },
  { key: "case", label: "Cases", icon: "⚖️" },
  { key: "template", label: "Templates", icon: "📄" },
  { key: "document", label: "Documents", icon: "📁" },
  { key: "section", label: "Legal Sections", icon: "📖" },
  { key: "scan", label: "Scans", icon: "📷" },
  { key: "admin_action", label: "Admin Actions", icon: "⚙️" },
];

export default function DeepSearch() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Priya Sharma",
    "Contract template",
    "IPC 302",
    "Property dispute",
  ]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery, selectedCategory]);

  const performSearch = async () => {
    setIsSearching(true);

    // Simulate API search
    setTimeout(() => {
      let filteredResults = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      if (selectedCategory !== "all") {
        filteredResults = filteredResults.filter(
          (result) => result.type === selectedCategory,
        );
      }

      // Sort by relevance score
      filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "user":
        return "👤";
      case "case":
        return "⚖️";
      case "template":
        return "📄";
      case "document":
        return "📁";
      case "section":
        return "📖";
      case "scan":
        return "📷";
      case "admin_action":
        return "⚙️";
      default:
        return "🔍";
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderSearchResult = (result: SearchResult) => (
    <TouchableOpacity
      key={result.id}
      style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => {
        // In real app, this would navigate to the result
        console.log(`Navigate to: ${result.actionUrl}`);
      }}
    >
      <View style={styles.resultHeader}>
        <View style={styles.resultInfo}>
          <View style={styles.resultTitleRow}>
            <Text style={styles.resultIcon}>{getTypeIcon(result.type)}</Text>
            <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
              {result.title}
            </Text>
            <View
              style={[
                styles.relevanceBadge,
                { backgroundColor: getRelevanceColor(result.relevanceScore) },
              ]}
            >
              <Text style={styles.relevanceText}>{result.relevanceScore}%</Text>
            </View>
          </View>

          <Text
            style={[styles.resultSubtitle, { color: theme.colors.primary }]}
          >
            {result.subtitle}
          </Text>

          <Text
            style={[
              styles.resultDescription,
              { color: theme.colors.textSecondary },
            ]}
          >
            {result.description}
          </Text>

          <View style={styles.resultMeta}>
            <Text
              style={[styles.resultType, { color: theme.colors.textSecondary }]}
            >
              {result.type.replace("_", " ").toUpperCase()}
            </Text>
            <Text
              style={[styles.resultDate, { color: theme.colors.textSecondary }]}
            >
              {new Date(result.lastModified).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Metadata */}
      {Object.keys(result.metadata).length > 0 && (
        <View
          style={[
            styles.metadataContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {Object.entries(result.metadata)
            .slice(0, 3)
            .map(([key, value]) => (
              <View key={key} style={styles.metadataItem}>
                <Text
                  style={[
                    styles.metadataKey,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </Text>
                <Text
                  style={[styles.metadataValue, { color: theme.colors.text }]}
                >
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
                </Text>
              </View>
            ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          🔍 Deep Search
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Search across users, cases, templates, sections, and system data
        </Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Search anything..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && (
            <View style={styles.searchLoading}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}
        </View>

        {/* Recent Searches */}
        {searchQuery === "" && recentSearches.length > 0 && (
          <View style={styles.recentSearches}>
            <Text
              style={[
                styles.recentTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Recent Searches
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.recentChip,
                    { backgroundColor: theme.colors.background },
                  ]}
                  onPress={() => handleSearch(search)}
                >
                  <Text
                    style={[
                      styles.recentChipText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {search}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
      >
        {searchCategories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                {
                  color:
                    selectedCategory === category.key
                      ? "#fff"
                      : theme.colors.text,
                },
              ]}
            >
              {category.label}
            </Text>
            {selectedCategory === category.key && searchQuery && (
              <View style={styles.resultCount}>
                <Text style={styles.resultCountText}>{results.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Results */}
      <ScrollView
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.length > 2 && (
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
              Search Results ({results.length})
            </Text>
            {results.length > 0 && (
              <Text
                style={[
                  styles.resultsSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Showing results for "{searchQuery}"
              </Text>
            )}
          </View>
        )}

        {isSearching ? (
          <View
            style={[
              styles.loadingContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Searching across all data...
            </Text>
          </View>
        ) : results.length > 0 ? (
          results.map(renderSearchResult)
        ) : searchQuery.length > 2 ? (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No results found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              Try adjusting your search terms or category filter
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.welcomeState,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.welcomeIcon}>🚀</Text>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Deep Search Ready
            </Text>
            <Text
              style={[
                styles.welcomeSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              Search across users, cases, templates, legal sections, documents,
              and admin actions. Start typing to see results from across the
              entire system.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchLoading: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  recentSearches: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  recentChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  recentChipText: {
    fontSize: 12,
  },
  categoryFilter: {
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  resultCount: {
    marginLeft: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  resultCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 12,
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  resultIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  resultTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  relevanceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  relevanceText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  resultSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultType: {
    fontSize: 10,
    fontWeight: "600",
  },
  resultDate: {
    fontSize: 10,
  },
  metadataContainer: {
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metadataKey: {
    fontSize: 11,
    flex: 1,
  },
  metadataValue: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "right",
  },
  loadingContainer: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  welcomeState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  welcomeSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
