import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category:
    | "IPC"
    | "CrPC"
    | "CPC"
    | "Family"
    | "Property"
    | "Labor"
    | "Constitutional"
    | "Tax";
  subcategory: string;
  content: string;
  placeholders: Array<{
    key: string;
    label: string;
    type: "text" | "date" | "number" | "address" | "select";
    options?: string[];
    required: boolean;
  }>;
  tags: string[];
  difficulty: "Basic" | "Intermediate" | "Advanced";
  estimatedTime: string;
}

interface LegalTemplatesLibraryProps {
  templates: LegalTemplate[];
  scannedData?: Record<string, any>;
  userProfile?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  onTemplateSelect: (template: LegalTemplate) => void;
  onSaveDraft: (templateId: string, filledData: Record<string, any>) => void;
  onDownloadWord: (templateId: string, filledData: Record<string, any>) => void;
  onAttachToFolder: (
    templateId: string,
    filledData: Record<string, any>,
    folderId: string,
  ) => void;
}

export default function LegalTemplatesLibrary({
  templates,
  scannedData = {},
  userProfile,
  onTemplateSelect,
  onSaveDraft,
  onDownloadWord,
  onAttachToFolder,
}: LegalTemplatesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] =
    useState<LegalTemplate | null>(null);
  const [filledData, setFilledData] = useState<Record<string, any>>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const categories = [
    { value: "All", icon: "📚", color: "#6366f1" },
    { value: "IPC", icon: "⚖️", color: "#ef4444" },
    { value: "CrPC", icon: "🏛️", color: "#f97316" },
    { value: "CPC", icon: "📋", color: "#3b82f6" },
    { value: "Family", icon: "👨‍👩‍👧‍👦", color: "#10b981" },
    { value: "Property", icon: "🏠", color: "#8b5cf6" },
    { value: "Labor", icon: "👷", color: "#06b6d4" },
    { value: "Constitutional", icon: "🏛️", color: "#f59e0b" },
    { value: "Tax", icon: "💰", color: "#84cc16" },
  ];

  const mockTemplates: LegalTemplate[] = [
    {
      id: "bail_application",
      title: "Bail Application",
      description: "Standard bail application under Section 437/438 CrPC",
      category: "CrPC",
      subcategory: "Bail Matters",
      content: `IN THE COURT OF {COURT_NAME}

CRIMINAL MISC. APPLICATION NO. _____ OF {YEAR}

{APPLICANT_NAME}                                   ...APPLICANT

                    VERSUS

STATE OF {STATE}                                   ...RESPONDENT

APPLICATION FOR GRANT OF BAIL UNDER SECTION 437/438 CR.P.C.

TO,
THE HON'BLE JUDGE,

The humble petition of the applicant above named most respectfully showeth:

1. That the applicant is a law-abiding citizen and has been falsely implicated in FIR No. {FIR_NUMBER} dated {FIR_DATE} registered at Police Station {POLICE_STATION} under Sections {IPC_SECTIONS} of the Indian Penal Code.

2. That the applicant has been arrested on {ARREST_DATE} and is currently in judicial custody.

3. That the offences alleged against the applicant are bailable and punishable with imprisonment less than 7 years.

4. That the applicant has deep roots in society and is not likely to abscond or tamper with evidence.

5. That the applicant is ready to furnish bail bond and surety as may be required by this Hon'ble Court.

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to grant bail to the applicant.

                                                    {APPLICANT_NAME}
                                                    Through Counsel`,
      placeholders: [
        {
          key: "COURT_NAME",
          label: "Court Name",
          type: "text",
          required: true,
        },
        { key: "YEAR", label: "Year", type: "number", required: true },
        {
          key: "APPLICANT_NAME",
          label: "Applicant Name",
          type: "text",
          required: true,
        },
        { key: "STATE", label: "State", type: "text", required: true },
        {
          key: "FIR_NUMBER",
          label: "FIR Number",
          type: "text",
          required: true,
        },
        { key: "FIR_DATE", label: "FIR Date", type: "date", required: true },
        {
          key: "POLICE_STATION",
          label: "Police Station",
          type: "text",
          required: true,
        },
        {
          key: "IPC_SECTIONS",
          label: "IPC Sections",
          type: "text",
          required: true,
        },
        {
          key: "ARREST_DATE",
          label: "Arrest Date",
          type: "date",
          required: true,
        },
      ],
      tags: ["bail", "criminal", "arrest", "custody"],
      difficulty: "Basic",
      estimatedTime: "30 minutes",
    },
    {
      id: "sale_deed_cancellation",
      title: "Sale Deed Cancellation Suit",
      description:
        "Suit for cancellation of sale deed due to fraud or misrepresentation",
      category: "Property",
      subcategory: "Property Disputes",
      content: `IN THE COURT OF {COURT_NAME}

CIVIL SUIT NO. _____ OF {YEAR}

{PLAINTIFF_NAME}                                   ...PLAINTIFF

                    VERSUS

{DEFENDANT_NAME}                                   ...DEFENDANT

PLAINT FOR CANCELLATION OF SALE DEED

TO,
THE HON'BLE JUDGE,

The plaintiff above named most respectfully submits as follows:

1. That the plaintiff is the owner of property bearing {PROPERTY_DESCRIPTION} situated at {PROPERTY_ADDRESS}.

2. That on {SALE_DEED_DATE}, the plaintiff executed a sale deed in favor of the defendant for a consideration of Rs. {SALE_AMOUNT}.

3. That the said sale deed was executed under fraud, coercion, and misrepresentation by the defendant.

4. That the defendant has {FRAUD_DETAILS}.

5. That the plaintiff seeks cancellation of the said sale deed and restoration of title.

PRAYER:
(a) Cancel the sale deed dated {SALE_DEED_DATE}
(b) Declare plaintiff's title over the property
(c) Grant such other relief as deemed fit

                                                    {PLAINTIFF_NAME}
                                                    Through Counsel`,
      placeholders: [
        {
          key: "COURT_NAME",
          label: "Court Name",
          type: "text",
          required: true,
        },
        { key: "YEAR", label: "Year", type: "number", required: true },
        {
          key: "PLAINTIFF_NAME",
          label: "Plaintiff Name",
          type: "text",
          required: true,
        },
        {
          key: "DEFENDANT_NAME",
          label: "Defendant Name",
          type: "text",
          required: true,
        },
        {
          key: "PROPERTY_DESCRIPTION",
          label: "Property Description",
          type: "text",
          required: true,
        },
        {
          key: "PROPERTY_ADDRESS",
          label: "Property Address",
          type: "address",
          required: true,
        },
        {
          key: "SALE_DEED_DATE",
          label: "Sale Deed Date",
          type: "date",
          required: true,
        },
        {
          key: "SALE_AMOUNT",
          label: "Sale Amount",
          type: "number",
          required: true,
        },
        {
          key: "FRAUD_DETAILS",
          label: "Fraud Details",
          type: "text",
          required: true,
        },
      ],
      tags: ["property", "sale deed", "cancellation", "fraud"],
      difficulty: "Intermediate",
      estimatedTime: "45 minutes",
    },
    // Add more templates...
  ];

  const allTemplates = templates.length > 0 ? templates : mockTemplates;

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.icon || "📄";
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.color || "#64748b";
  };

  const handleTemplateSelect = (template: LegalTemplate) => {
    setSelectedTemplate(template);

    // Pre-fill with scanned data and user profile
    const prefilled: Record<string, any> = {};

    template.placeholders.forEach((placeholder) => {
      // Try to match with scanned data
      if (scannedData) {
        Object.entries(scannedData).forEach(([key, value]) => {
          if (
            key.toLowerCase().includes(placeholder.key.toLowerCase()) ||
            placeholder.key.toLowerCase().includes(key.toLowerCase())
          ) {
            prefilled[placeholder.key] = value;
          }
        });
      }

      // Try to match with user profile
      if (userProfile) {
        if (
          placeholder.key.toLowerCase().includes("name") &&
          !prefilled[placeholder.key]
        ) {
          prefilled[placeholder.key] = userProfile.name;
        }
        if (
          placeholder.key.toLowerCase().includes("address") &&
          !prefilled[placeholder.key]
        ) {
          prefilled[placeholder.key] = userProfile.address;
        }
      }

      // Set current year for year fields
      if (
        placeholder.key.toLowerCase().includes("year") &&
        !prefilled[placeholder.key]
      ) {
        prefilled[placeholder.key] = new Date().getFullYear().toString();
      }
    });

    setFilledData(prefilled);
    setShowTemplateModal(true);
    onTemplateSelect(template);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFilledData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generatePreview = () => {
    if (!selectedTemplate) return "";

    let content = selectedTemplate.content;
    Object.entries(filledData).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, "g");
      content = content.replace(regex, value || `{${key}}`);
    });

    return content;
  };

  const validateForm = () => {
    if (!selectedTemplate) return false;

    const requiredFields = selectedTemplate.placeholders.filter(
      (p) => p.required,
    );
    return requiredFields.every((field) => filledData[field.key]?.trim());
  };

  const TemplateCard = ({ template }: { template: LegalTemplate }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleTemplateSelect(template)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateIcon}>
          {getCategoryIcon(template.category)}
        </Text>
        <View style={styles.templateInfo}>
          <Text style={styles.templateTitle}>{template.title}</Text>
          <Text style={styles.templateDescription}>{template.description}</Text>
        </View>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(template.category) + "20" },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: getCategoryColor(template.category) },
            ]}
          >
            {template.category}
          </Text>
        </View>
      </View>

      <View style={styles.templateMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>📊 {template.difficulty}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>⏱️ {template.estimatedTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>
            📋 {template.placeholders.length} fields
          </Text>
        </View>
      </View>

      <View style={styles.templateTags}>
        {template.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderPlaceholderField = (
    placeholder: LegalTemplate["placeholders"][0],
  ) => {
    switch (placeholder.type) {
      case "select":
        return (
          <View key={placeholder.key} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {placeholder.label} {placeholder.required && "*"}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {placeholder.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    filledData[placeholder.key] === option &&
                      styles.selectOptionSelected,
                  ]}
                  onPress={() => handleFieldChange(placeholder.key, option)}
                >
                  <Text style={styles.selectOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      default:
        return (
          <View key={placeholder.key} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {placeholder.label} {placeholder.required && "*"}
            </Text>
            <TextInput
              style={[
                styles.fieldInput,
                placeholder.type === "address" && styles.addressInput,
              ]}
              placeholder={`Enter ${placeholder.label.toLowerCase()}`}
              value={filledData[placeholder.key] || ""}
              onChangeText={(value) =>
                handleFieldChange(placeholder.key, value)
              }
              multiline={placeholder.type === "address"}
              keyboardType={
                placeholder.type === "number" ? "numeric" : "default"
              }
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Legal Templates Library</Text>
        <Text style={styles.subtitle}>Smart templates with AI pre-filling</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates, categories, or keywords..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          numColumns={3}
          keyExtractor={(item) => item.value}
          renderItem={({ item: category }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === category.value &&
                  styles.categoryButtonSelected,
                { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category.value)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.value && {
                    color: category.color,
                  },
                ]}
                numberOfLines={1}
              >
                {category.value}
              </Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.categoryGrid}
        />
      </View>

      {/* Templates List */}
      <FlatList
        data={filteredTemplates}
        renderItem={({ item }) => <TemplateCard template={item} />}
        keyExtractor={(item) => item.id}
        style={styles.templatesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No templates found</Text>
            <Text style={styles.emptyMessage}>
              Try adjusting your search or category filter
            </Text>
          </View>
        }
      />

      {/* Template Editor Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTemplateModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTemplate?.title}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  !validateForm() && styles.actionButtonDisabled,
                ]}
                onPress={() => {
                  if (selectedTemplate && validateForm()) {
                    onSaveDraft(selectedTemplate.id, filledData);
                    Alert.alert("Success", "Draft saved successfully");
                  }
                }}
                disabled={!validateForm()}
              >
                <Text style={styles.actionButtonText}>💾 Save Draft</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Form Fields */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>📝 Fill Template Fields</Text>
              {selectedTemplate?.placeholders.map(renderPlaceholderField)}
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.sectionTitle}>👁️ Document Preview</Text>
              <ScrollView style={styles.previewContainer}>
                <Text style={styles.previewText}>{generatePreview()}</Text>
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.downloadButton]}
              onPress={() => {
                if (selectedTemplate && validateForm()) {
                  onDownloadWord(selectedTemplate.id, filledData);
                  Alert.alert("Success", "Document downloaded as Word file");
                }
              }}
              disabled={!validateForm()}
            >
              <Text style={styles.footerButtonText}>📄 Download Word</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.attachButton]}
              onPress={() => {
                if (selectedTemplate && validateForm()) {
                  Alert.alert(
                    "Attach to Folder",
                    "Choose a case folder to attach this document",
                  );
                }
              }}
              disabled={!validateForm()}
            >
              <Text style={styles.footerButtonText}>📎 Attach to Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd6fe",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryGrid: {
    justifyContent: "space-between",
  },
  categoryButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    margin: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flex: 1,
    maxWidth: "30%",
    minHeight: 80,
  },
  categoryButtonSelected: {
    backgroundColor: "#f0f9ff",
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  templatesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
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
    color: "#1e293b",
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
  },
  templateMeta: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metaItem: {
    marginRight: 16,
  },
  metaLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  templateTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyState: {
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
  emptyMessage: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
  },
  formSection: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },
  selectOption: {
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectOptionSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  selectOptionText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  previewSection: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  previewContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 16,
    maxHeight: 300,
  },
  previewText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
    fontFamily: "monospace",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  downloadButton: {
    backgroundColor: "#10b981",
  },
  attachButton: {
    backgroundColor: "#3b82f6",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
