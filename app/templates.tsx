import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { dataService } from "@/services/dataService";
import { LegalTemplate } from "@/types/features";

export default function LegalTemplatesHub() {
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<LegalTemplate[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<LegalTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Criminal Law",
    "Civil Law",
    "Corporate Law",
    "Family Law",
    "Labour Law",
    "Tax Law",
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchQuery]);

  const loadTemplates = async () => {
    try {
      const data = await dataService.getLegalTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== "all" && selectedCategory !== "All") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          template.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: LegalTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      Alert.alert(
        "Use Template",
        `Template "${selectedTemplate.title}" will be prepared for editing. This feature will open a document editor.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Use Template",
            onPress: () => {
              setShowTemplateModal(false);
              Alert.alert(
                "Coming Soon",
                "Template editor will be implemented in the next update",
              );
            },
          },
        ],
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Criminal Law":
        return "⚖️";
      case "Civil Law":
        return "🏛️";
      case "Corporate Law":
        return "🏢";
      case "Family Law":
        return "👨‍👩‍👧‍👦";
      case "Labour Law":
        return "👷";
      case "Tax Law":
        return "💰";
      default:
        return "📋";
    }
  };

  const renderTemplate = ({ item }: { item: LegalTemplate }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleTemplateSelect(item)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateIcon}>
          {getCategoryIcon(item.category)}
        </Text>
        <View style={styles.templateInfo}>
          <Text style={styles.templateTitle}>{item.title}</Text>
          <Text style={styles.templateCategory}>{item.category}</Text>
        </View>
        <View style={styles.templateStats}>
          <Text style={styles.downloadsText}>↓ {item.downloads}</Text>
        </View>
      </View>

      <Text style={styles.templateDescription}>{item.description}</Text>

      <View style={styles.templateFooter}>
        <Text style={styles.placeholdersCount}>
          📝 {item.placeholders?.length || 0} fields to fill
        </Text>
        <Text style={styles.templateDate}>
          Updated: {new Date(item.updatedAt).toLocaleDateString("en-IN")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor:
            selectedCategory === item.toLowerCase() ? "#7c3aed" : "#f3f4f6",
        },
      ]}
      onPress={() => setSelectedCategory(item.toLowerCase())}
    >
      <Text
        style={[
          styles.categoryChipText,
          {
            color: selectedCategory === item.toLowerCase() ? "#fff" : "#374151",
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>📋 Legal Templates Hub</Text>
        <Text style={styles.subtitle}>
          {filteredTemplates.length} templates available
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilters}
        />
      </View>

      {/* Templates List */}
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={loadTemplates}
      />

      {/* Template Detail Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Template Preview</Text>
            <TouchableOpacity onPress={handleUseTemplate}>
              <Text style={styles.modalUse}>Use Template</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedTemplate && (
              <>
                <View style={styles.templateDetailHeader}>
                  <Text style={styles.templateDetailIcon}>
                    {getCategoryIcon(selectedTemplate.category)}
                  </Text>
                  <View style={styles.templateDetailInfo}>
                    <Text style={styles.templateDetailTitle}>
                      {selectedTemplate.title}
                    </Text>
                    <Text style={styles.templateDetailCategory}>
                      {selectedTemplate.category}
                    </Text>
                    <Text style={styles.templateDetailDescription}>
                      {selectedTemplate.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.placeholdersSection}>
                  <Text style={styles.placeholdersTitle}>
                    📝 Fields to Fill (
                    {selectedTemplate.placeholders?.length || 0})
                  </Text>
                  <View style={styles.placeholdersList}>
                    {selectedTemplate.placeholders?.map(
                      (placeholder, index) => (
                        <View key={index} style={styles.placeholderItem}>
                          <Text style={styles.placeholderText}>
                            {placeholder}
                          </Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>

                <View style={styles.templateContentSection}>
                  <Text style={styles.contentTitle}>📄 Template Content</Text>
                  <ScrollView style={styles.contentPreview} nestedScrollEnabled>
                    <Text style={styles.contentText}>
                      {selectedTemplate.content}
                    </Text>
                  </ScrollView>
                </View>

                <View style={styles.templateMetadata}>
                  <Text style={styles.metadataText}>
                    Downloads: {selectedTemplate.downloads}
                  </Text>
                  <Text style={styles.metadataText}>
                    Created:{" "}
                    {new Date(selectedTemplate.createdAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </Text>
                  <Text style={styles.metadataText}>
                    Updated:{" "}
                    {new Date(selectedTemplate.updatedAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  searchContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  categoryFilters: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  templateCard: {
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
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  templateIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  templateCategory: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "500",
  },
  templateStats: {
    alignItems: "flex-end",
  },
  downloadsText: {
    fontSize: 10,
    color: "#6b7280",
  },
  templateDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  templateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholdersCount: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  templateDate: {
    fontSize: 10,
    color: "#9ca3af",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalCancel: {
    color: "#6b7280",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalUse: {
    color: "#7c3aed",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  templateDetailHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  templateDetailIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  templateDetailInfo: {
    flex: 1,
  },
  templateDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  templateDetailCategory: {
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "500",
    marginBottom: 8,
  },
  templateDetailDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  placeholdersSection: {
    marginBottom: 20,
  },
  placeholdersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  placeholdersList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  placeholderItem: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "500",
  },
  templateContentSection: {
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  contentPreview: {
    maxHeight: 200,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
  },
  contentText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
    fontFamily: "monospace",
  },
  templateMetadata: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  metadataText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
});
