import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";

export interface ScanData {
  type: "fir" | "sale_deed" | "affidavit" | "notice" | "complaint" | "other";
  extractedFields: Record<string, any>;
  fullText: string;
  confidence: number;
}

interface AutoDrafterProps {
  scanData: ScanData;
  onSaveDraft: (draftContent: string, title: string) => void;
  onExportWord: (draftContent: string, title: string) => void;
  onExportPDF: (draftContent: string, title: string) => void;
}

interface SimpleTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  content: string;
}

export default function AutoDrafter({
  scanData,
  onSaveDraft,
  onExportWord,
  onExportPDF,
}: AutoDrafterProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<SimpleTemplate | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [step, setStep] = useState<"templates" | "edit" | "preview">(
    "templates",
  );
  const { showError } = useModal();
  const { width: screenWidth } = Dimensions.get("window");

  // Simple templates based on scan data
  const getTemplates = (): SimpleTemplate[] => {
    const baseTemplates: SimpleTemplate[] = [
      {
        id: "bail_application",
        name: "Bail Application",
        icon: "🆓",
        description: "Apply for bail in criminal cases",
        content: `IN THE COURT OF ${scanData.extractedFields.court_name || "[COURT NAME]"}

CRIMINAL MISC. APPLICATION NO. _____ OF ${scanData.extractedFields.year || new Date().getFullYear()}

${scanData.extractedFields.applicant_name || "[APPLICANT NAME]"}     ...APPLICANT
VERSUS
STATE OF ${scanData.extractedFields.state || "[STATE]"}     ...RESPONDENT

APPLICATION FOR GRANT OF BAIL

TO,
THE HON'BLE COURT

MOST RESPECTFULLY SHOWETH:

1. That the applicant is a law-abiding citizen and has been falsely implicated in FIR No. ${scanData.extractedFields.fir_number || "[FIR NUMBER]"} dated ${scanData.extractedFields.fir_date || "[FIR DATE]"} registered at Police Station ${scanData.extractedFields.police_station || "[POLICE STATION]"} under Sections ${scanData.extractedFields.ipc_sections || "[IPC SECTIONS]"} of the Indian Penal Code.

2. That the applicant is ready to abide by any terms and conditions that this Hon'ble Court may deem fit to impose.

3. That the applicant is not a flight risk and will cooperate with the investigation.

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to grant bail to the applicant on such terms and conditions as this Hon'ble Court may deem fit and proper.

For this act of kindness, the applicant shall ever pray.

                                                    [ADVOCATE NAME]
                                                    Advocate for Applicant`,
      },
      {
        id: "complaint_application",
        name: "Complaint Application",
        icon: "📋",
        description: "File a complaint in magistrate court",
        content: `IN THE COURT OF ${scanData.extractedFields.court_name || "[MAGISTRATE COURT]"}

COMPLAINT CASE NO. _____ OF ${scanData.extractedFields.year || new Date().getFullYear()}

${scanData.extractedFields.applicant_name || "[COMPLAINANT NAME]"}     ...COMPLAINANT
VERSUS
${scanData.extractedFields.accused_name || "[ACCUSED NAME]"}     ...ACCUSED

COMPLAINT UNDER SECTION 200 CR.P.C.

TO,
THE HON'BLE MAGISTRATE

MOST RESPECTFULLY SHOWETH:

1. That the complainant is a law-abiding citizen residing at [ADDRESS].

2. That on ${scanData.extractedFields.incident_date || "[DATE]"}, the accused committed the offence of [OFFENCE DESCRIPTION] at [PLACE].

3. That the complainant tried to resolve the matter amicably but the accused refused to cooperate.

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Take cognizance of the offence;
(b) Issue summons to the accused;
(c) Award appropriate punishment as per law.

                                                    [COMPLAINANT SIGNATURE]
                                                    Complainant`,
      },
      {
        id: "legal_notice",
        name: "Legal Notice",
        icon: "📧",
        description: "Send a formal legal notice",
        content: `LEGAL NOTICE

TO: ${scanData.extractedFields.recipient_name || "[RECIPIENT NAME]"}
${scanData.extractedFields.recipient_address || "[RECIPIENT ADDRESS]"}

THROUGH: ${scanData.extractedFields.advocate_name || "[ADVOCATE NAME]"}

Sir/Madam,

1. I am instructed by my client ${scanData.extractedFields.client_name || "[CLIENT NAME]"} to serve upon you this legal notice and to state as under:

2. That my client has a genuine grievance against you regarding [MATTER DESCRIPTION].

3. That despite repeated requests, you have failed to [SPECIFIC DEMAND].

4. That your actions have caused financial and mental agony to my client.

NOTICE:
You are hereby called upon to [SPECIFIC DEMAND] within 15 days from the receipt of this notice, failing which my client will be constrained to initiate appropriate legal proceedings against you for recovery of damages and other reliefs as may be deemed fit.

Take notice that if you fail to comply with the above demand within the stipulated time, my client will initiate legal proceedings against you without any further notice.

Date: ${new Date().toLocaleDateString("en-IN")}
Place: [PLACE]

                                                    [ADVOCATE NAME]
                                                    Advocate for [CLIENT NAME]`,
      },
    ];

    return baseTemplates;
  };

  const templates = getTemplates();

  const handleTemplateSelect = (template: SimpleTemplate) => {
    setSelectedTemplate(template);
    setDraftContent(template.content);
    setDraftTitle(template.name);
    setStep("edit");
  };

  const handlePreview = () => {
    if (!draftContent.trim()) {
      showError("Error", "Please add some content to the draft");
      return;
    }
    setStep("preview");
  };

  const handleSave = () => {
    if (!draftTitle.trim()) {
      showError("Error", "Please provide a title for the draft");
      return;
    }
    onSaveDraft(draftContent, draftTitle);
  };

  // Step 1: Template Selection
  if (step === "templates") {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📝 Choose Document Type</Text>
          <Text style={styles.subtitle}>
            Select the type of legal document you want to create
          </Text>
        </View>

        <View style={styles.detectedInfo}>
          <Text style={styles.detectedTitle}>🔍 Detected Information</Text>
          <Text style={styles.detectedText}>
            From scanned document: {scanData.type.toUpperCase()}
          </Text>
          {scanData.extractedFields.fir_number && (
            <Text style={styles.detectedField}>
              FIR: {scanData.extractedFields.fir_number}
            </Text>
          )}
          {scanData.extractedFields.applicant_name && (
            <Text style={styles.detectedField}>
              Name: {scanData.extractedFields.applicant_name}
            </Text>
          )}
        </View>

        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleTemplateSelect(template)}
            >
              <Text style={styles.templateIcon}>{template.icon}</Text>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>
                  {template.description}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // Step 2: Edit Content
  if (step === "edit") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStep("templates")}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>✏️ Edit Document</Text>
          <TouchableOpacity style={styles.previewBtn} onPress={handlePreview}>
            <Text style={styles.previewText}>Preview →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editContainer}>
          <Text style={styles.fieldLabel}>Document Title</Text>
          <TextInput
            style={styles.titleInput}
            value={draftTitle}
            onChangeText={setDraftTitle}
            placeholder="Enter document title"
          />

          <Text style={styles.fieldLabel}>Document Content</Text>
          <TextInput
            style={styles.contentInput}
            value={draftContent}
            onChangeText={setDraftContent}
            placeholder="Enter your content here..."
            multiline
            textAlignVertical="top"
          />

          <View style={styles.helpBox}>
            <Text style={styles.helpTitle}>💡 Editing Tips</Text>
            <Text style={styles.helpText}>
              • Replace [PLACEHOLDERS] with actual information{"\n"}• Add or
              remove paragraphs as needed{"\n"}• Review all details before
              saving
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Step 3: Preview & Export
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setStep("edit")}
        >
          <Text style={styles.backText}>← Edit</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👁️ Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.previewContainer}>
        <View style={styles.documentPreview}>
          <Text style={styles.documentTitle}>{draftTitle}</Text>
          <Text style={styles.documentContent}>{draftContent}</Text>
        </View>
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>💾 Save Draft</Text>
        </TouchableOpacity>

        <View style={styles.exportRow}>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => onExportWord(draftContent, draftTitle)}
          >
            <Text style={styles.exportBtnText}>📄 Word</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => onExportPDF(draftContent, draftTitle)}
          >
            <Text style={styles.exportBtnText}>📋 PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: "#1D4ED8",
    fontWeight: "500",
  },
  previewBtn: {
    padding: 8,
  },
  previewText: {
    fontSize: 16,
    color: "#1D4ED8",
    fontWeight: "500",
  },
  placeholder: {
    width: 60,
  },
  detectedInfo: {
    backgroundColor: "#EFF6FF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1D4ED8",
  },
  detectedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 8,
  },
  detectedText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  detectedField: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  templatesContainer: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templateIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  arrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  editContainer: {
    flex: 1,
    padding: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  contentInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 300,
    fontFamily: "monospace",
  },
  helpBox: {
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D97706",
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
  },
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  documentPreview: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  documentContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    fontFamily: "monospace",
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  saveBtn: {
    backgroundColor: "#059669",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exportRow: {
    flexDirection: "row",
    gap: 12,
  },
  exportBtn: {
    flex: 1,
    backgroundColor: "#1D4ED8",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  exportBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
