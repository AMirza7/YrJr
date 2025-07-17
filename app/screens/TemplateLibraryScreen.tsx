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
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import BackButton from "@/components/navigation/BackButton";

interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  placeholders: string[];
  createdAt: string;
  updatedAt: string;
  downloads: number;
  rating: number;
  isPublic: boolean;
  requiredRole: string[];
  tags: string[];
}

export default function TemplateLibraryScreen() {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<LegalTemplate[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "All",
    "Contract Law",
    "Criminal Law",
    "Civil Law",
    "Property Law",
    "Employment Law",
    "Corporate Law",
    "Family Law",
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, searchQuery, selectedCategory]);

  const fetchTemplates = async () => {
    try {
      setError(null);

      // API call to GET /api/legal-templates
      const response = await fetch("/api/legal-templates", {
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
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching legal templates:", error);
      setError("Failed to load templates. Please try again.");

      // Fallback to mock data for demo
      setTemplates([
        {
          id: "1",
          title: "Employment Contract Template",
          description:
            "Comprehensive employment contract template with standard terms and conditions for hiring employees in India.",
          category: "Employment Law",
          content:
            "EMPLOYMENT AGREEMENT\n\nThis Employment Agreement is entered into on [DATE] between [COMPANY_NAME], a company incorporated under the laws of India (the 'Company') and [EMPLOYEE_NAME] (the 'Employee').\n\n1. POSITION AND DUTIES\nThe Employee shall serve as [POSITION] and shall perform duties as assigned by the Company.\n\n2. COMPENSATION\nThe Employee shall receive a salary of INR [SALARY] per month...",
          placeholders: [
            "DATE",
            "COMPANY_NAME",
            "EMPLOYEE_NAME",
            "POSITION",
            "SALARY",
          ],
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          downloads: 1250,
          rating: 4.8,
          isPublic: true,
          requiredRole: ["lawyer", "junior_lawyer", "lawyer_assistant"],
          tags: ["employment", "contract", "hiring", "terms"],
        },
        {
          id: "2",
          title: "Property Sale Agreement",
          description:
            "Legal template for property sale transactions including all necessary clauses for buyer and seller protection.",
          category: "Property Law",
          content:
            "AGREEMENT FOR SALE OF IMMOVABLE PROPERTY\n\nThis Agreement is made on [DATE] between [SELLER_NAME] (the 'Seller') and [BUYER_NAME] (the 'Buyer') for the sale of property located at [PROPERTY_ADDRESS].\n\n1. PROPERTY DETAILS\nThe property measuring [AREA] square feet/meters is being sold for a total consideration of INR [AMOUNT]...",
          placeholders: [
            "DATE",
            "SELLER_NAME",
            "BUYER_NAME",
            "PROPERTY_ADDRESS",
            "AREA",
            "AMOUNT",
          ],
          createdAt: "2024-01-12T14:30:00Z",
          updatedAt: "2024-01-12T14:30:00Z",
          downloads: 890,
          rating: 4.6,
          isPublic: true,
          requiredRole: ["lawyer", "junior_lawyer"],
          tags: ["property", "sale", "real estate", "agreement"],
        },
        {
          id: "3",
          title: "Criminal Bail Application",
          description:
            "Standard format for bail application in criminal cases with all required legal provisions and arguments.",
          category: "Criminal Law",
          content:
            "BAIL APPLICATION\n\nTO,\nThe Honorable [COURT_NAME]\n[COURT_ADDRESS]\n\nSir/Madam,\n\nRespectfully submitted that the applicant [APPLICANT_NAME] seeks regular bail in Case No. [CASE_NUMBER] under Sections [SECTIONS] of the Indian Penal Code...",
          placeholders: [
            "COURT_NAME",
            "COURT_ADDRESS",
            "APPLICANT_NAME",
            "CASE_NUMBER",
            "SECTIONS",
          ],
          createdAt: "2024-01-10T09:15:00Z",
          updatedAt: "2024-01-10T09:15:00Z",
          downloads: 670,
          rating: 4.9,
          isPublic: true,
          requiredRole: ["lawyer"],
          tags: ["criminal", "bail", "application", "court"],
        },
        {
          id: "4",
          title: "Non-Disclosure Agreement (NDA)",
          description:
            "Comprehensive NDA template for protecting confidential business information in commercial transactions.",
          category: "Contract Law",
          content:
            "NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement ('Agreement') is entered into on [DATE] between [DISCLOSING_PARTY] ('Disclosing Party') and [RECEIVING_PARTY] ('Receiving Party').\n\n1. CONFIDENTIAL INFORMATION\nFor purposes of this Agreement, 'Confidential Information' means...",
          placeholders: ["DATE", "DISCLOSING_PARTY", "RECEIVING_PARTY"],
          createdAt: "2024-01-08T16:45:00Z",
          updatedAt: "2024-01-08T16:45:00Z",
          downloads: 1100,
          rating: 4.7,
          isPublic: true,
          requiredRole: ["lawyer", "junior_lawyer", "lawyer_assistant"],
          tags: ["nda", "confidentiality", "business", "agreement"],
        },
        {
          id: "5",
          title: "Divorce Petition Format",
          description:
            "Legal format for filing divorce petition under Hindu Marriage Act with grounds and relief sought.",
          category: "Family Law",
          content:
            "PETITION FOR DIVORCE\n\nTO,\nThe Honorable Family Court\n[COURT_ADDRESS]\n\nRespectfully submitted:\n\n1. That the petitioner [PETITIONER_NAME] was married to the respondent [RESPONDENT_NAME] on [MARRIAGE_DATE] according to Hindu rites and customs...",
          placeholders: [
            "COURT_ADDRESS",
            "PETITIONER_NAME",
            "RESPONDENT_NAME",
            "MARRIAGE_DATE",
          ],
          createdAt: "2024-01-05T11:20:00Z",
          updatedAt: "2024-01-05T11:20:00Z",
          downloads: 520,
          rating: 4.5,
          isPublic: true,
          requiredRole: ["lawyer", "junior_lawyer"],
          tags: ["divorce", "family", "petition", "marriage"],
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = templates;

    // Apply category filter
    if (selectedCategory !== "all" && selectedCategory !== "All") {
      filtered = filtered.filter(
        (template) =>
          template.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    setFilteredTemplates(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTemplates();
  };

  const handleUseTemplate = (template: LegalTemplate) => {
    Alert.alert(
      "Use Template",
      `Would you like to use "${template.title}"?\n\nThis template includes ${template.placeholders.length} customizable fields and has been downloaded ${template.downloads} times.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Preview", onPress: () => showTemplatePreview(template) },
        { text: "Use Template", onPress: () => useTemplate(template) },
      ],
    );
  };

  const showTemplatePreview = (template: LegalTemplate) => {
    Alert.alert(
      `Preview - ${template.title}`,
      template.content.substring(0, 300) +
        "...\n\nCustomizable fields:\n" +
        template.placeholders.join(", "),
      [
        { text: "Close", style: "cancel" },
        { text: "Use Template", onPress: () => useTemplate(template) },
      ],
    );
  };

  const useTemplate = (template: LegalTemplate) => {
    // Navigate to template editor or implement template usage logic
    Alert.alert(
      "Template Selected",
      `Template "${template.title}" is ready for customization. You can now fill in the required fields and generate your document.`,
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate to template editor
            // router.push(`/template-editor/${template.id}`);
          },
        },
      ],
    );
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("✨");
    }
    return stars.join("");
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor:
            selectedCategory === item.toLowerCase()
              ? theme.colors.primary
              : theme.colors.surface,
        },
      ]}
      onPress={() => setSelectedCategory(item.toLowerCase())}
    >
      <Text
        style={[
          styles.categoryChipText,
          {
            color:
              selectedCategory === item.toLowerCase()
                ? "#fff"
                : theme.colors.text,
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderTemplateItem = ({ item }: { item: LegalTemplate }) => (
    <TouchableOpacity
      style={[styles.templateCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleUseTemplate(item)}
    >
      <View style={styles.templateHeader}>
        <View style={styles.templateTitleContainer}>
          <Text
            style={[styles.templateTitle, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={[styles.templateCategory, { color: theme.colors.primary }]}
          >
            {item.category}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.useButton}
          onPress={() => handleUseTemplate(item)}
        >
          <Text style={styles.useButtonText}>Use</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.templateDescription,
          { color: theme.colors.textSecondary },
        ]}
        numberOfLines={3}
      >
        {item.description}
      </Text>

      <View style={styles.templateMeta}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStars}>{getRatingStars(item.rating)}</Text>
          <Text
            style={[styles.ratingText, { color: theme.colors.textSecondary }]}
          >
            {item.rating.toFixed(1)}
          </Text>
        </View>

        <Text
          style={[styles.downloadsText, { color: theme.colors.textSecondary }]}
        >
          📥 {formatDownloads(item.downloads)} downloads
        </Text>
      </View>

      <View style={styles.templateTags}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {item.placeholders.length > 0 && (
          <View style={styles.placeholderBadge}>
            <Text style={styles.placeholderText}>
              {item.placeholders.length} fields
            </Text>
          </View>
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
          <Text style={styles.headerTitle}>Template Library</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading templates...
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
          <Text style={styles.headerTitle}>Template Library</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} available
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTemplates}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Search templates..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilters}
        />
      </View>

      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplateItem}
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
                No Templates Found
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Try adjusting your search or category filter.
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
  filtersContainer: {
    padding: 16,
    gap: 12,
  },
  searchInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  categoryFilters: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  templateTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  templateCategory: {
    fontSize: 12,
    fontWeight: "500",
  },
  useButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  useButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  templateDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  templateMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingStars: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
  },
  downloadsText: {
    fontSize: 12,
  },
  templateTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#6b7280",
  },
  placeholderBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 11,
    color: "#1e40af",
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
