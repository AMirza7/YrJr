import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User, LegalTemplate } from "@/types";
import { canAccessFeature } from "@/constants/roles";
import BackButton from "@/components/navigation/BackButton";
import { shareTemplate } from "@/utils/shareUtils";

// Mock templates data
const MOCK_TEMPLATES: LegalTemplate[] = [
  {
    id: "1",
    title: "Sale Deed Agreement",
    category: "Property Law",
    description: "Comprehensive sale deed template for property transactions",
    content: `SALE DEED

THIS DEED OF SALE is executed on this _____ day of _______, 20__ at _______.

BETWEEN:

Vendor: [Name], [Age], [Occupation], son/daughter of [Father's Name], resident of [Address], hereinafter called "THE VENDOR" (which expression shall, unless excluded by or repugnant to the context, include his heirs, successors, legal representatives and assigns) of the ONE PART.

AND

Purchaser: [Name], [Age], [Occupation], son/daughter of [Father's Name], resident of [Address], hereinafter called "THE PURCHASER" (which expression shall, unless excluded by or repugnant to the context, include his heirs, successors, legal representatives and assigns) of the OTHER PART.

WHEREAS the Vendor is the absolute owner in possession of the property described in the Schedule hereunder...

[Content continues...]`,
    tags: ["sale deed", "property", "real estate", "agreement"],
    version: "1.2",
    createdBy: "admin",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    downloads: 1250,
    rating: 4.8,
    isPublic: true,
    requiredRole: ["lawyer", "junior_lawyer", "lawyer_assistant"],
    subscriptionRequired: "free",
  },
  {
    id: "2",
    title: "Employment Contract",
    category: "Labour Law",
    description:
      "Standard employment contract template with all essential clauses",
    content:
      "EMPLOYMENT AGREEMENT\n\nThis Employment Agreement is entered into...",
    tags: ["employment", "contract", "labour", "hr"],
    version: "2.1",
    createdBy: "admin",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-25T11:00:00Z",
    downloads: 890,
    rating: 4.6,
    isPublic: true,
    requiredRole: ["lawyer", "junior_lawyer", "lawyer_assistant"],
    subscriptionRequired: "pro",
  },
  {
    id: "3",
    title: "Power of Attorney",
    category: "General",
    description: "General Power of Attorney template for various purposes",
    content: "POWER OF ATTORNEY\n\nKNOW ALL MEN BY THESE PRESENTS...",
    tags: ["power of attorney", "authorization", "legal"],
    version: "1.0",
    createdBy: "admin",
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-08T14:00:00Z",
    downloads: 2100,
    rating: 4.9,
    isPublic: true,
    requiredRole: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "law_office_helper",
    ],
    subscriptionRequired: "free",
  },
  {
    id: "4",
    title: "Rental Agreement",
    category: "Property Law",
    description: "Residential rental agreement with tenant protection clauses",
    content: "RENTAL AGREEMENT\n\nThis Rental Agreement is made...",
    tags: ["rental", "lease", "property", "tenant"],
    version: "1.5",
    createdBy: "admin",
    createdAt: "2024-01-12T16:00:00Z",
    updatedAt: "2024-01-22T10:00:00Z",
    downloads: 1500,
    rating: 4.7,
    isPublic: true,
    requiredRole: ["lawyer", "junior_lawyer", "lawyer_assistant"],
    subscriptionRequired: "free",
  },
  {
    id: "5",
    title: "Non-Disclosure Agreement",
    category: "Corporate Law",
    description: "Comprehensive NDA template for business confidentiality",
    content: "NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement...",
    tags: ["nda", "confidentiality", "business", "corporate"],
    version: "2.0",
    createdBy: "admin",
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
    downloads: 750,
    rating: 4.5,
    isPublic: true,
    requiredRole: ["lawyer", "junior_lawyer"],
    subscriptionRequired: "pro",
  },
];

const CATEGORIES = [
  "All",
  "Property Law",
  "Labour Law",
  "Corporate Law",
  "Family Law",
  "Criminal Law",
  "General",
];

export default function TemplatesHub() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<LegalTemplate[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "rating">(
    "popular",
  );

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, searchQuery, selectedCategory, sortBy]);

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
          "templates",
        )
      ) {
        Alert.alert(
          "Access Restricted",
          "Templates feature requires appropriate subscription level.",
          [
            {
              text: "OK",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/home");
                }
              },
            },
          ],
        );
        return;
      }

      setUser(currentUser);

      // Filter templates based on user role and subscription
      const accessibleTemplates = MOCK_TEMPLATES.filter((template) => {
        const hasRoleAccess =
          template.requiredRole.includes(currentUser.role) ||
          currentUser.role === "admin";
        const hasSubscriptionAccess = canAccessFeature(
          currentUser.role,
          currentUser.subscriptionTier,
          "templates",
        );
        return hasRoleAccess && hasSubscriptionAccess;
      });

      setTemplates(accessibleTemplates);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = templates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads;
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  };

  const handleDownload = async (template: LegalTemplate) => {
    Alert.alert("Download Template", `Download "${template.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Download",
        onPress: () => {
          // Simulate download
          Alert.alert("Success", "Template downloaded successfully!");
          // In real app, this would download the file or open editor
        },
      },
    ]);
  };

  const handlePreview = (template: LegalTemplate) => {
    Alert.alert(template.title, template.content.substring(0, 200) + "...", [
      { text: "Close", style: "cancel" },
      { text: "Download", onPress: () => handleDownload(template) },
    ]);
  };

  const handleShare = async (template: LegalTemplate) => {
    const shareText = `📄 ${template.title}\n\n📝 ${template.description}\n\n🏛️ Shared from YRJR Legal Assistant`;

    Alert.alert(
      "Share Template",
      "Choose how you'd like to share this template:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy to Clipboard",
          onPress: async () => {
            try {
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(shareText);
                Alert.alert("✅ Success", "Template copied to clipboard!");
              } else {
                Alert.alert("📋 Template Content", shareText, [
                  { text: "Done" },
                ]);
              }
            } catch (error) {
              Alert.alert("📋 Template Content", shareText, [{ text: "Done" }]);
            }
          },
        },
      ],
    );
  };

  const TemplateCard = ({ template }: { template: LegalTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateTitle}>{template.title}</Text>
          <Text style={styles.templateCategory}>{template.category}</Text>
          <Text style={styles.templateDescription}>{template.description}</Text>
        </View>
        <View style={styles.templateMeta}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {template.rating}</Text>
          </View>
          {template.subscriptionRequired === "pro" && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
          {template.subscriptionRequired === "premium" && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.templateTags}>
        {template.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.templateStats}>
        <Text style={styles.statText}>📥 {template.downloads} downloads</Text>
        <Text style={styles.statText}>📅 v{template.version}</Text>
        <Text style={styles.statText}>
          {new Date(template.updatedAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.templateActions}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => handlePreview(template)}
        >
          <Text style={styles.previewButtonText}>👁️ Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(template)}
        >
          <Text style={styles.downloadButtonText}>⬇️ Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare(template)}
        >
          <Text style={styles.shareButtonText}>📤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Home" color="#fff" />
        <Text style={styles.title}>Legal Templates Hub</Text>
        <Text style={styles.subtitle}>
          Professional legal document templates
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates, tags, or categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.categoryTabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortSection}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {[
            { key: "popular", label: "Most Popular" },
            { key: "recent", label: "Recently Updated" },
            { key: "rating", label: "Highest Rated" },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.sortOptionActive,
              ]}
              onPress={() => setSortBy(option.key as any)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Templates List */}
      <ScrollView
        style={styles.templatesList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}

        {filteredTemplates.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📄</Text>
            <Text style={styles.emptyStateTitle}>No templates found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your search or filter criteria
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
    backgroundColor: "#f9fafb",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#059669",
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
  filtersSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryTabs: {
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: "#059669",
  },
  categoryTabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryTabTextActive: {
    color: "#fff",
  },
  sortSection: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  sortLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginRight: 12,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    marginBottom: 4,
  },
  sortOptionActive: {
    backgroundColor: "#dbeafe",
  },
  sortOptionText: {
    fontSize: 12,
    color: "#6b7280",
  },
  sortOptionTextActive: {
    color: "#1e40af",
    fontWeight: "500",
  },
  templatesList: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
    marginRight: 12,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
    marginBottom: 6,
  },
  templateDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  templateMeta: {
    alignItems: "flex-end",
  },
  rating: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#d97706",
    fontWeight: "500",
  },
  proBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    color: "#1e40af",
    fontWeight: "bold",
  },
  premiumBadge: {
    backgroundColor: "#fce7f3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    color: "#be185d",
    fontWeight: "bold",
  },
  templateTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
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
  templateStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  statText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  templateActions: {
    flexDirection: "row",
    gap: 8,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  previewButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  downloadButton: {
    flex: 1,
    backgroundColor: "#059669",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  shareButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});
