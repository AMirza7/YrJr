import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/auth";
import { User } from "@/types";
import BackButton from "@/components/navigation/BackButton";
import * as DocumentPicker from "expo-document-picker";

interface ClerkTemplate {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdBy: string;
  createdByName: string;
  downloads: number;
  rating: number;
  thumbnailUrl?: string;
  fileUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (templateData: any) => void;
}

function UploadModal({ visible, onClose, onSubmit }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const categories = [
    "Legal Documents",
    "Court Applications",
    "Contracts",
    "Agreements",
    "Notices",
    "Petitions",
    "Forms",
    "Other",
  ];

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select file");
    }
  };

  const handleSubmit = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      !category ||
      !selectedFile
    ) {
      Alert.alert("Error", "Please fill all required fields and select a file");
      return;
    }

    const templateData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      file: selectedFile,
    };

    onSubmit(templateData);

    // Reset form
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setSelectedFile(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Upload Template</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Template Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter template title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe what this template is for..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryTag,
                      category === cat && styles.categoryTagSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Upload File *</Text>
              <TouchableOpacity
                style={styles.fileButton}
                onPress={handleFileSelect}
              >
                <Text style={styles.fileButtonText}>
                  {selectedFile
                    ? selectedFile.name
                    : "Select Document (PDF, DOC, DOCX)"}
                </Text>
                <Text style={styles.fileButtonIcon}>📎</Text>
              </TouchableOpacity>
              {selectedFile && (
                <Text style={styles.fileInfo}>
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(1)} KB)
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit for Review</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your template will be reviewed by our team before being made
            available to lawyers. This process usually takes 1-2 business days.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ClerkTemplatesScreen() {
  const [templates, setTemplates] = useState<ClerkTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ClerkTemplate[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = [
    "All",
    "Legal Documents",
    "Court Applications",
    "Contracts",
    "Agreements",
    "Notices",
    "Petitions",
    "Forms",
  ];

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, selectedCategory]);

  const checkAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      loadTemplates();
    } catch (error) {
      router.replace("/login");
    }
  };

  const loadTemplates = async () => {
    try {
      // Mock template data
      const mockTemplates: ClerkTemplate[] = [
        {
          id: "template_1",
          title: "Bail Application Template",
          description:
            "Professional bail application format with all necessary sections and legal references",
          price: 150,
          category: "Court Applications",
          createdBy: "clerk_1",
          createdByName: "Ravi Kumar",
          downloads: 45,
          rating: 4.8,
          isApproved: true,
          createdAt: "2024-01-10",
        },
        {
          id: "template_2",
          title: "Service Agreement Draft",
          description:
            "Comprehensive service agreement template for legal service providers",
          price: 200,
          category: "Agreements",
          createdBy: "clerk_2",
          createdByName: "Priya Sharma",
          downloads: 32,
          rating: 4.6,
          isApproved: true,
          createdAt: "2024-01-08",
        },
        {
          id: "template_3",
          title: "Legal Notice Format",
          description:
            "Standard legal notice template with proper formatting and legal language",
          price: 100,
          category: "Notices",
          createdBy: "clerk_1",
          createdByName: "Ravi Kumar",
          downloads: 67,
          rating: 4.9,
          isApproved: true,
          createdAt: "2024-01-05",
        },
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = templates;

    if (selectedCategory !== "all" && selectedCategory !== "All") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory,
      );
    }

    setFilteredTemplates(filtered);
  };

  const handlePurchase = (template: ClerkTemplate) => {
    if (!user) return;

    Alert.alert(
      "Purchase Template",
      `Purchase "${template.title}" for ₹${template.price}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Purchase",
          onPress: () => {
            router.push({
              pathname: "/payment-options",
              params: {
                amount: template.price.toString(),
                plan: `Template: ${template.title}`,
              },
            });
          },
        },
      ],
    );
  };

  const handleUploadTemplate = (templateData: any) => {
    setShowUploadModal(false);
    Alert.alert(
      "Template Submitted",
      "Your template has been submitted for review. We'll notify you once it's approved and available for purchase.",
      [{ text: "OK" }],
    );
  };

  const canUpload =
    user?.role === "legal_clerk_typist" || user?.role === "admin";

  const renderTemplate = ({ item }: { item: ClerkTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle}>{item.title}</Text>
        <Text style={styles.templatePrice}>₹{item.price}</Text>
      </View>

      <Text style={styles.templateDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.templateMeta}>
        <Text style={styles.categoryBadge}>{item.category}</Text>
        <Text style={styles.createdBy}>by {item.createdByName}</Text>
      </View>

      <View style={styles.templateStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>⭐ {item.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.downloads}</Text>
          <Text style={styles.statLabel}>Downloads</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={() => handlePurchase(item)}
      >
        <Text style={styles.purchaseButtonText}>Purchase ₹{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Templates Marketplace</Text>
          <Text style={styles.headerSubtitle}>
            Professional legal document templates
          </Text>
        </View>
        {canUpload && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setShowUploadModal(true)}
          >
            <Text style={styles.uploadButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryFilter,
                selectedCategory === item.toLowerCase() && styles.activeFilter,
              ]}
              onPress={() => setSelectedCategory(item.toLowerCase())}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === item.toLowerCase() &&
                    styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.templatesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No Templates Found</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for new templates or try a different category.
            </Text>
          </View>
        }
      />

      <UploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadTemplate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#7C3AED",
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
  uploadButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filtersList: {
    paddingVertical: 4,
  },
  categoryFilter: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#7C3AED",
  },
  filterText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
  },
  templatesList: {
    padding: 16,
  },
  templateCard: {
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
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  templatePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  templateDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  templateMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  createdBy: {
    fontSize: 12,
    color: "#6b7280",
  },
  templateStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  purchaseButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
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
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#7C3AED",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  placeholder: {
    width: 26,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  categoryTagSelected: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  categoryText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  fileButton: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  fileButtonText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  fileButtonIcon: {
    fontSize: 16,
  },
  fileInfo: {
    fontSize: 12,
    color: "#059669",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
    fontStyle: "italic",
  },
});
