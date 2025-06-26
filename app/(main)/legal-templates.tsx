import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchBar } from "@/components/ui/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  fields: TemplateField[];
  content: string;
  isPopular: boolean;
  downloads: number;
  lastUpdated: Date;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  preview?: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "number";
  placeholder: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

type TemplateCategory =
  | "affidavit"
  | "power_of_attorney"
  | "fir_draft"
  | "complaint_letter"
  | "notice"
  | "petition"
  | "agreement"
  | "application";

export default function LegalTemplatesScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<LegalTemplate[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TemplateCategory | "all"
  >("all");
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<LegalTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateData, setTemplateData] = useState<Record<string, string>>({});

  const categories: {
    id: TemplateCategory | "all";
    title: string;
    icon: string;
  }[] = [
    { id: "all", title: "All Templates", icon: "grid" },
    { id: "affidavit", title: "Affidavit", icon: "document-text" },
    { id: "power_of_attorney", title: "Power of Attorney", icon: "key" },
    { id: "fir_draft", title: "FIR Draft", icon: "shield" },
    { id: "complaint_letter", title: "Complaint", icon: "mail" },
    { id: "notice", title: "Legal Notice", icon: "warning" },
    { id: "petition", title: "Petition", icon: "document" },
    { id: "agreement", title: "Agreement", icon: "handshake" },
    { id: "application", title: "Application", icon: "clipboard" },
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      // Mock templates data
      const mockTemplates: LegalTemplate[] = [
        {
          id: "1",
          title: "General Affidavit",
          description:
            "A general purpose affidavit template for sworn statements",
          category: "affidavit",
          fields: [
            {
              id: "name",
              label: "Full Name",
              type: "text",
              placeholder: "Enter your full name",
              required: true,
            },
            {
              id: "age",
              label: "Age",
              type: "number",
              placeholder: "Enter your age",
              required: true,
            },
            {
              id: "address",
              label: "Address",
              type: "textarea",
              placeholder: "Enter your complete address",
              required: true,
            },
            {
              id: "statement",
              label: "Statement",
              type: "textarea",
              placeholder: "Enter your sworn statement",
              required: true,
            },
            {
              id: "date",
              label: "Date",
              type: "date",
              placeholder: "Select date",
              required: true,
            },
          ],
          content: `AFFIDAVIT

I, {name}, aged {age} years, residing at {address}, do hereby solemnly affirm and state as under:

1. That I am the deponent herein and I know the facts and circumstances of the case.

2. That {statement}

3. That the facts stated hereinabove are true to the best of my knowledge and belief.

Deponent
{name}

Place: ___________
Date: {date}

VERIFICATION

I, the above named deponent do hereby verify that the contents of my above affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.

Deponent
{name}`,
          isPopular: true,
          downloads: 1250,
          lastUpdated: new Date(),
          difficulty: "beginner",
          estimatedTime: "15 minutes",
          preview: "A sworn statement template for legal proceedings...",
        },
        {
          id: "2",
          title: "Power of Attorney - General",
          description:
            "General power of attorney template for legal representation",
          category: "power_of_attorney",
          fields: [
            {
              id: "principal_name",
              label: "Principal Name",
              type: "text",
              placeholder: "Name of person giving power",
              required: true,
            },
            {
              id: "attorney_name",
              label: "Attorney Name",
              type: "text",
              placeholder: "Name of person receiving power",
              required: true,
            },
            {
              id: "principal_address",
              label: "Principal Address",
              type: "textarea",
              placeholder: "Principal's address",
              required: true,
            },
            {
              id: "attorney_address",
              label: "Attorney Address",
              type: "textarea",
              placeholder: "Attorney's address",
              required: true,
            },
            {
              id: "powers",
              label: "Powers Granted",
              type: "textarea",
              placeholder: "Describe the powers being granted",
              required: true,
            },
            {
              id: "date",
              label: "Date",
              type: "date",
              placeholder: "Select date",
              required: true,
            },
          ],
          content: `POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS that I, {principal_name}, residing at {principal_address}, do hereby nominate, constitute and appoint {attorney_name}, residing at {attorney_address}, as my true and lawful attorney to act for me and on my behalf and in my name to:

{powers}

I hereby give and grant unto my said attorney full power and authority to do and perform all and every act and thing whatsoever requisite and necessary to be done in and about the premises as fully to all intents and purposes as I might or could do if personally present.

IN WITNESS WHEREOF, I have hereunto set my hand this {date}.

{principal_name}
(Principal)

Witnessed by:
1. ________________
2. ________________`,
          isPopular: true,
          downloads: 890,
          lastUpdated: new Date(),
          difficulty: "intermediate",
          estimatedTime: "25 minutes",
          preview:
            "Legal document to authorize another person to act on your behalf...",
        },
        {
          id: "3",
          title: "FIR Draft Template",
          description: "Template for drafting First Information Report",
          category: "fir_draft",
          fields: [
            {
              id: "complainant_name",
              label: "Complainant Name",
              type: "text",
              placeholder: "Your full name",
              required: true,
            },
            {
              id: "complainant_address",
              label: "Complainant Address",
              type: "textarea",
              placeholder: "Your complete address",
              required: true,
            },
            {
              id: "incident_date",
              label: "Date of Incident",
              type: "date",
              placeholder: "When did the incident occur",
              required: true,
            },
            {
              id: "incident_place",
              label: "Place of Incident",
              type: "text",
              placeholder: "Where did the incident occur",
              required: true,
            },
            {
              id: "accused_name",
              label: "Accused Name",
              type: "text",
              placeholder: "Name of accused (if known)",
              required: false,
            },
            {
              id: "incident_details",
              label: "Incident Details",
              type: "textarea",
              placeholder: "Detailed description of the incident",
              required: true,
            },
            {
              id: "sections",
              label: "Applicable Sections",
              type: "text",
              placeholder: "IPC/BNS sections if known",
              required: false,
            },
          ],
          content: `FIRST INFORMATION REPORT

To,
The Station House Officer,
Police Station: ___________

Sir,

I, {complainant_name}, residing at {complainant_address}, would like to lodge a complaint regarding the following incident:

Date of Incident: {incident_date}
Place of Incident: {incident_place}
Accused: {accused_name}

Details of the Incident:
{incident_details}

I request you to kindly register an FIR and take necessary legal action against the accused under appropriate sections of law{sections ? ' including ' + sections : ''}.

I am ready to cooperate with the investigation and will be available as and when required.

Thanking you,

{complainant_name}
Complainant

Date: ___________
Place: ___________`,
          isPopular: false,
          downloads: 456,
          lastUpdated: new Date(),
          difficulty: "beginner",
          estimatedTime: "20 minutes",
          preview:
            "Template for filing First Information Report with police...",
        },
        {
          id: "4",
          title: "Legal Notice Template",
          description:
            "Professional legal notice template for various purposes",
          category: "notice",
          fields: [
            {
              id: "sender_name",
              label: "Sender Name",
              type: "text",
              placeholder: "Your name or client name",
              required: true,
            },
            {
              id: "sender_address",
              label: "Sender Address",
              type: "textarea",
              placeholder: "Complete address",
              required: true,
            },
            {
              id: "recipient_name",
              label: "Recipient Name",
              type: "text",
              placeholder: "Name of person/entity",
              required: true,
            },
            {
              id: "recipient_address",
              label: "Recipient Address",
              type: "textarea",
              placeholder: "Recipient address",
              required: true,
            },
            {
              id: "notice_purpose",
              label: "Purpose of Notice",
              type: "textarea",
              placeholder: "Reason for sending notice",
              required: true,
            },
            {
              id: "demand",
              label: "Demand/Action Required",
              type: "textarea",
              placeholder: "What action is required",
              required: true,
            },
            {
              id: "time_limit",
              label: "Time Limit",
              type: "text",
              placeholder: "e.g., 15 days, 30 days",
              required: true,
            },
            {
              id: "consequences",
              label: "Consequences",
              type: "textarea",
              placeholder: "What will happen if demand is not met",
              required: true,
            },
          ],
          content: `LEGAL NOTICE

To,
{recipient_name}
{recipient_address}

NOTICE UNDER SECTION 80 OF THE CODE OF CIVIL PROCEDURE, 1908

Sir/Madam,

I, {sender_name}, residing at {sender_address}, through this legal notice, would like to bring to your notice the following:

1. That {notice_purpose}

2. That {demand}

3. That you are hereby called upon to {demand} within {time_limit} from the date of receipt of this notice.

4. That if you fail to comply with the above demand within the stipulated time, {consequences}

Take notice that this legal notice is being served upon you to provide you an opportunity to comply with the just and legal demands mentioned herein before initiating appropriate legal proceedings against you.

Yours faithfully,

{sender_name}

Date: ___________
Place: ___________`,
          isPopular: true,
          downloads: 1120,
          lastUpdated: new Date(),
          difficulty: "intermediate",
          estimatedTime: "30 minutes",
          preview: "Professional legal notice for various legal matters...",
        },
        {
          id: "5",
          title: "Consumer Complaint",
          description: "Template for filing complaints in consumer court",
          category: "complaint_letter",
          fields: [
            {
              id: "complainant_name",
              label: "Complainant Name",
              type: "text",
              placeholder: "Your name",
              required: true,
            },
            {
              id: "complainant_address",
              label: "Complainant Address",
              type: "textarea",
              placeholder: "Your address",
              required: true,
            },
            {
              id: "opposite_party",
              label: "Opposite Party",
              type: "text",
              placeholder: "Business/service provider name",
              required: true,
            },
            {
              id: "op_address",
              label: "Opposite Party Address",
              type: "textarea",
              placeholder: "Business address",
              required: true,
            },
            {
              id: "transaction_date",
              label: "Transaction Date",
              type: "date",
              placeholder: "Date of purchase/service",
              required: true,
            },
            {
              id: "amount",
              label: "Transaction Amount",
              type: "number",
              placeholder: "Amount paid",
              required: true,
            },
            {
              id: "deficiency",
              label: "Service Deficiency",
              type: "textarea",
              placeholder: "Describe the problem",
              required: true,
            },
            {
              id: "relief_sought",
              label: "Relief Sought",
              type: "textarea",
              placeholder: "What remedy do you want",
              required: true,
            },
          ],
          content: `CONSUMER COMPLAINT

To,
The President,
District Consumer Disputes Redressal Commission
___________

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

Between:
{complainant_name}
{complainant_address}
... Complainant

Vs.

{opposite_party}
{op_address}
... Opposite Party

FACTS OF THE CASE:

1. That the complainant purchased goods/availed services from the opposite party on {transaction_date} for an amount of Rs. {amount}.

2. That {deficiency}

3. That despite several requests, the opposite party has failed to provide satisfactory service/remedy.

4. That the act of the opposite party amounts to deficiency in service and unfair trade practice.

PRAYER:

In view of the above facts, it is most respectfully prayed that this Hon'ble Commission may be pleased to:

{relief_sought}

Any other relief that this Hon'ble Commission deems fit and proper may also be granted.

{complainant_name}
Complainant

Place: ___________
Date: ___________`,
          isPopular: false,
          downloads: 234,
          lastUpdated: new Date(),
          difficulty: "advanced",
          estimatedTime: "45 minutes",
          preview: "Template for consumer court complaints...",
        },
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
      Alert.alert("Error", "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query),
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplatePress = (template: LegalTemplate) => {
    setSelectedTemplate(template);
    setTemplateData({});
    setShowTemplateModal(true);
  };

  const handleGenerateDocument = () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.fields
      .filter((field) => field.required && !templateData[field.id])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in the following required fields:\n${missingFields.join("\n")}`,
      );
      return;
    }

    // Generate document by replacing placeholders
    let generatedContent = selectedTemplate.content;
    selectedTemplate.fields.forEach((field) => {
      const value = templateData[field.id] || "";
      generatedContent = generatedContent.replace(
        new RegExp(`{${field.id}}`, "g"),
        value,
      );
    });

    // In a real app, you would save/export the document
    Alert.alert(
      "Document Generated",
      "Your legal document has been generated successfully!",
      [
        {
          text: "View Document",
          onPress: () => {
            // Navigate to document viewer or save
            console.log("Generated document:", generatedContent);
          },
        },
        {
          text: "Download PDF",
          onPress: () => {
            // Generate and download PDF
            Alert.alert(
              "Coming Soon",
              "PDF download feature will be available soon",
            );
          },
        },
        { text: "Close", onPress: () => setShowTemplateModal(false) },
      ],
    );
  };

  const renderTemplateCard = (template: LegalTemplate) => (
    <TouchableOpacity
      key={template.id}
      onPress={() => handleTemplatePress(template)}
    >
      <Card style={styles.templateCard} padding="medium">
        <View style={styles.templateHeader}>
          <View style={styles.templateInfo}>
            <Text style={[styles.templateTitle, { color: theme.text }]}>
              {template.title}
            </Text>
            <Text
              style={[
                styles.templateDescription,
                { color: theme.textSecondary },
              ]}
            >
              {template.description}
            </Text>
          </View>

          {template.isPopular && (
            <View
              style={[
                styles.popularBadge,
                { backgroundColor: theme.warning + "20" },
              ]}
            >
              <Ionicons name="star" size={12} color={theme.warning} />
              <Text style={[styles.popularText, { color: theme.warning }]}>
                Popular
              </Text>
            </View>
          )}
        </View>

        <View style={styles.templateMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.textTertiary}
            />
            <Text style={[styles.metaText, { color: theme.textTertiary }]}>
              {template.estimatedTime}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="download-outline"
              size={16}
              color={theme.textTertiary}
            />
            <Text style={[styles.metaText, { color: theme.textTertiary }]}>
              {template.downloads}
            </Text>
          </View>

          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor: getDifficultyColor(template.difficulty) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(template.difficulty) },
              ]}
            >
              {template.difficulty}
            </Text>
          </View>
        </View>

        {template.preview && (
          <Text
            style={[styles.templatePreview, { color: theme.textSecondary }]}
          >
            {template.preview}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  const renderTemplateModal = () => (
    <Modal
      visible={showTemplateModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowTemplateModal(false)}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: theme.background }]}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowTemplateModal(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {selectedTemplate?.title}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.formTitle, { color: theme.text }]}>
            Fill in the required information
          </Text>

          {selectedTemplate?.fields.map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                {field.label}
                {field.required && (
                  <Text style={{ color: theme.error }}> *</Text>
                )}
              </Text>

              <TextInput
                value={templateData[field.id] || ""}
                onChangeText={(text) =>
                  setTemplateData((prev) => ({ ...prev, [field.id]: text }))
                }
                placeholder={field.placeholder}
                placeholderTextColor={theme.textTertiary}
                multiline={field.type === "textarea"}
                numberOfLines={field.type === "textarea" ? 4 : 1}
                keyboardType={field.type === "number" ? "numeric" : "default"}
                style={[
                  styles.fieldInput,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    color: theme.text,
                    minHeight: field.type === "textarea" ? 80 : 48,
                  },
                ]}
                textAlignVertical={field.type === "textarea" ? "top" : "center"}
              />
            </View>
          ))}

          <View style={styles.modalActions}>
            <Button
              title="Generate Document"
              onPress={handleGenerateDocument}
              fullWidth
              gradient
              style={styles.generateButton}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "beginner":
        return theme.success;
      case "intermediate":
        return theme.warning;
      case "advanced":
        return theme.error;
      default:
        return theme.textTertiary;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <EmptyState type="loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Legal Templates
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search templates..."
            showVoice={false}
            showFilter={false}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? theme.primary + "20"
                      : theme.surface,
                  borderColor:
                    selectedCategory === category.id
                      ? theme.primary
                      : theme.border,
                },
              ]}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.id
                    ? theme.primary
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.id
                        ? theme.primary
                        : theme.textSecondary,
                  },
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Templates */}
        <View style={styles.templatesContainer}>
          {filteredTemplates.length === 0 ? (
            <EmptyState
              type="no_templates"
              title="No Templates Found"
              subtitle="Try adjusting your search or category filter"
              actionTitle="Clear Filters"
              onActionPress={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            />
          ) : (
            filteredTemplates.map(renderTemplateCard)
          )}
        </View>
      </ScrollView>

      {renderTemplateModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  templatesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  templateCard: {
    marginBottom: Spacing.md,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  templateInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  templateTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  templateDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  popularText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  templateMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: FontSizes.xs,
    marginLeft: Spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  difficultyText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textTransform: "capitalize",
  },
  templatePreview: {
    fontSize: FontSizes.sm,
    fontStyle: "italic",
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    flex: 1,
    textAlign: "center",
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  formTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.lg,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
  },
  modalActions: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  generateButton: {
    marginBottom: Spacing.md,
  },
});
