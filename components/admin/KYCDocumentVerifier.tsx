import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";

interface ExtractedData {
  barCouncilNo?: string;
  name?: string;
  city?: string;
  specialization?: string[];
  issueDate?: string;
  validity?: string;
  confidence: number;
}

interface DocumentData {
  id: string;
  name: string;
  type:
    | "bar_council_certificate"
    | "id_proof"
    | "address_proof"
    | "specialization_certificate";
  uri: string;
  extractedData?: ExtractedData;
  verified: boolean;
  aiReview: "pending" | "approved" | "flagged" | "rejected";
  mismatchFlags: string[];
}

interface UserFormData {
  name: string;
  barCouncilNumber: string;
  city: string;
  specialization: string[];
}

interface KYCDocumentVerifierProps {
  visible: boolean;
  onClose: () => void;
  userFormData: UserFormData;
  documents: DocumentData[];
  onDocumentVerify: (documentId: string, verified: boolean) => void;
  onFinalDecision: (approved: boolean, comments: string) => void;
}

export default function KYCDocumentVerifier({
  visible,
  onClose,
  userFormData,
  documents,
  onDocumentVerify,
  onFinalDecision,
}: KYCDocumentVerifierProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(
    null,
  );
  const [showFinalReview, setShowFinalReview] = useState(false);
  const [finalComments, setFinalComments] = useState("");

  // Mock OCR extraction - in real app, this would call an OCR service
  const mockOCRExtraction = (document: DocumentData): ExtractedData => {
    switch (document.type) {
      case "bar_council_certificate":
        return {
          barCouncilNo: "D/12345/2019",
          name: "Rajesh Kumar Sharma",
          city: "New Delhi",
          specialization: ["Criminal Law", "Civil Law"],
          issueDate: "15-06-2019",
          validity: "Valid till 2029",
          confidence: 0.94,
        };
      case "id_proof":
        return {
          name: "Rajesh Kumar Sharma",
          confidence: 0.97,
        };
      case "address_proof":
        return {
          name: "Rajesh Kumar Sharma",
          city: "New Delhi",
          confidence: 0.91,
        };
      default:
        return { confidence: 0.85 };
    }
  };

  const getDocumentIcon = (type: DocumentData["type"]) => {
    const icons = {
      bar_council_certificate: "⚖️",
      id_proof: "🆔",
      address_proof: "🏠",
      specialization_certificate: "📜",
    };
    return icons[type];
  };

  const getDocumentName = (type: DocumentData["type"]) => {
    const names = {
      bar_council_certificate: "Bar Council Certificate",
      id_proof: "Identity Proof",
      address_proof: "Address Proof",
      specialization_certificate: "Specialization Certificate",
    };
    return names[type];
  };

  const detectMismatches = (extracted: ExtractedData): string[] => {
    const mismatches: string[] = [];

    if (
      extracted.name &&
      extracted.name.toLowerCase() !== userFormData.name.toLowerCase()
    ) {
      mismatches.push(
        `Name mismatch: Form has "${userFormData.name}", document shows "${extracted.name}"`,
      );
    }

    if (
      extracted.barCouncilNo &&
      extracted.barCouncilNo !== userFormData.barCouncilNumber
    ) {
      mismatches.push(
        `Bar Council No mismatch: Form has "${userFormData.barCouncilNumber}", document shows "${extracted.barCouncilNo}"`,
      );
    }

    if (
      extracted.city &&
      extracted.city.toLowerCase() !== userFormData.city.toLowerCase()
    ) {
      mismatches.push(
        `City mismatch: Form has "${userFormData.city}", document shows "${extracted.city}"`,
      );
    }

    if (extracted.specialization && extracted.specialization.length > 0) {
      const formSpecs = userFormData.specialization.map((s) => s.toLowerCase());
      const docSpecs = extracted.specialization.map((s) => s.toLowerCase());
      const missingSpecs = docSpecs.filter((spec) => !formSpecs.includes(spec));
      if (missingSpecs.length > 0) {
        mismatches.push(
          `Specialization mismatch: Document shows additional: ${missingSpecs.join(", ")}`,
        );
      }
    }

    return mismatches;
  };

  const processDocuments = () => {
    // Process all documents with OCR
    const processedDocs = documents.map((doc) => {
      const extractedData = mockOCRExtraction(doc);
      const mismatchFlags = detectMismatches(extractedData);

      return {
        ...doc,
        extractedData,
        mismatchFlags,
        aiReview:
          mismatchFlags.length > 0
            ? ("flagged" as const)
            : extractedData.confidence > 0.9
              ? ("approved" as const)
              : ("pending" as const),
      };
    });

    return processedDocs;
  };

  const processedDocuments = processDocuments();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "#10b981";
    if (confidence >= 0.8) return "#f59e0b";
    return "#ef4444";
  };

  const getAIReviewColor = (review: string) => {
    switch (review) {
      case "approved":
        return "#10b981";
      case "flagged":
        return "#f59e0b";
      case "rejected":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const DocumentCard = ({ document }: { document: DocumentData }) => (
    <TouchableOpacity
      style={[
        styles.documentCard,
        document.aiReview === "flagged" && styles.documentCardFlagged,
        document.aiReview === "approved" && styles.documentCardApproved,
      ]}
      onPress={() => setSelectedDocument(document)}
    >
      <View style={styles.documentHeader}>
        <Text style={styles.documentIcon}>
          {getDocumentIcon(document.type)}
        </Text>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName}>
            {getDocumentName(document.type)}
          </Text>
          <Text style={styles.documentFileName}>{document.name}</Text>
        </View>

        <View style={styles.documentStatus}>
          <View
            style={[
              styles.aiReviewBadge,
              { backgroundColor: getAIReviewColor(document.aiReview) + "20" },
            ]}
          >
            <Text
              style={[
                styles.aiReviewText,
                { color: getAIReviewColor(document.aiReview) },
              ]}
            >
              {document.aiReview.toUpperCase()}
            </Text>
          </View>

          {document.extractedData && (
            <View
              style={[
                styles.confidenceBadge,
                {
                  backgroundColor:
                    getConfidenceColor(document.extractedData.confidence) +
                    "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.confidenceText,
                  {
                    color: getConfidenceColor(
                      document.extractedData.confidence,
                    ),
                  },
                ]}
              >
                {Math.round(document.extractedData.confidence * 100)}%
              </Text>
            </View>
          )}
        </View>
      </View>

      {document.mismatchFlags.length > 0 && (
        <View style={styles.mismatchContainer}>
          <Text style={styles.mismatchTitle}>⚠️ Mismatches Detected:</Text>
          {document.mismatchFlags.slice(0, 2).map((flag, index) => (
            <Text key={index} style={styles.mismatchText}>
              • {flag}
            </Text>
          ))}
          {document.mismatchFlags.length > 2 && (
            <Text style={styles.moreFlags}>
              +{document.mismatchFlags.length - 2} more
            </Text>
          )}
        </View>
      )}

      {document.extractedData && (
        <View style={styles.extractedDataPreview}>
          <Text style={styles.extractedTitle}>📄 Extracted Data:</Text>
          {document.extractedData.name && (
            <Text style={styles.extractedItem}>
              Name: {document.extractedData.name}
            </Text>
          )}
          {document.extractedData.barCouncilNo && (
            <Text style={styles.extractedItem}>
              Bar Council: {document.extractedData.barCouncilNo}
            </Text>
          )}
          {document.extractedData.city && (
            <Text style={styles.extractedItem}>
              City: {document.extractedData.city}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const allDocumentsProcessed = processedDocuments.every(
    (doc) => doc.aiReview !== "pending",
  );
  const hasFlags = processedDocuments.some(
    (doc) => doc.mismatchFlags.length > 0,
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🔍 KYC Document Verification</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* User Form Data Summary */}
          <View style={styles.formDataSection}>
            <Text style={styles.sectionTitle}>📋 Form Submitted Data</Text>
            <View style={styles.formDataCard}>
              <View style={styles.formDataRow}>
                <Text style={styles.formDataLabel}>Name:</Text>
                <Text style={styles.formDataValue}>{userFormData.name}</Text>
              </View>
              <View style={styles.formDataRow}>
                <Text style={styles.formDataLabel}>Bar Council No:</Text>
                <Text style={styles.formDataValue}>
                  {userFormData.barCouncilNumber}
                </Text>
              </View>
              <View style={styles.formDataRow}>
                <Text style={styles.formDataLabel}>City:</Text>
                <Text style={styles.formDataValue}>{userFormData.city}</Text>
              </View>
              <View style={styles.formDataRow}>
                <Text style={styles.formDataLabel}>Specialization:</Text>
                <Text style={styles.formDataValue}>
                  {userFormData.specialization.join(", ")}
                </Text>
              </View>
            </View>
          </View>

          {/* AI Processing Status */}
          <View style={styles.aiStatusSection}>
            <Text style={styles.sectionTitle}>🤖 AI Document Analysis</Text>
            <View
              style={[
                styles.aiStatusCard,
                hasFlags ? styles.aiStatusWarning : styles.aiStatusSuccess,
              ]}
            >
              <Text style={styles.aiStatusText}>
                {hasFlags
                  ? "⚠️ Mismatches detected - Manual review required"
                  : "✅ All documents verified successfully"}
              </Text>
              <Text style={styles.aiStatusSubtext}>
                {processedDocuments.length} documents processed •{" "}
                {
                  processedDocuments.filter((d) => d.aiReview === "approved")
                    .length
                }{" "}
                approved
              </Text>
            </View>
          </View>

          {/* Documents List */}
          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>📄 Uploaded Documents</Text>
            {processedDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </View>

          {/* Final Decision */}
          {allDocumentsProcessed && (
            <View style={styles.finalDecisionSection}>
              <Text style={styles.sectionTitle}>✅ Final Admin Decision</Text>
              <View style={styles.finalDecisionCard}>
                <Text style={styles.finalDecisionText}>
                  All documents have been processed by AI. Review the analysis
                  above and make your final decision.
                </Text>

                <View style={styles.finalDecisionButtons}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => {
                      Alert.alert(
                        "Approve Application",
                        "Are you sure you want to approve this KYC application?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Approve",
                            onPress: () =>
                              onFinalDecision(
                                true,
                                "Approved after document verification",
                              ),
                          },
                        ],
                      );
                    }}
                  >
                    <Text style={styles.approveButtonText}>
                      ✅ Approve Application
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => {
                      Alert.alert(
                        "Reject Application",
                        "Are you sure you want to reject this KYC application?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Reject",
                            onPress: () =>
                              onFinalDecision(
                                false,
                                "Rejected due to document mismatches",
                              ),
                          },
                        ],
                      );
                    }}
                  >
                    <Text style={styles.rejectButtonText}>
                      ❌ Reject Application
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Document Detail Modal */}
        <Modal
          visible={selectedDocument !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedDocument(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.documentModal}>
              {selectedDocument && (
                <>
                  <Text style={styles.modalTitle}>
                    {getDocumentName(selectedDocument.type)}
                  </Text>
                  <Image
                    source={{ uri: selectedDocument.uri }}
                    style={styles.documentImage}
                  />

                  {selectedDocument.extractedData && (
                    <View style={styles.fullExtractedData}>
                      <Text style={styles.extractedDataTitle}>
                        Extracted Information:
                      </Text>
                      <Text style={styles.extractedDataText}>
                        {JSON.stringify(
                          selectedDocument.extractedData,
                          null,
                          2,
                        )}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setSelectedDocument(null)}
                  >
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formDataSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  formDataCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formDataRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  formDataLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    width: 120,
  },
  formDataValue: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
    fontWeight: "600",
  },
  aiStatusSection: {
    marginBottom: 20,
  },
  aiStatusCard: {
    borderRadius: 12,
    padding: 16,
  },
  aiStatusSuccess: {
    backgroundColor: "#f0fdf4",
    borderColor: "#10b981",
    borderWidth: 1,
  },
  aiStatusWarning: {
    backgroundColor: "#fffbeb",
    borderColor: "#f59e0b",
    borderWidth: 1,
  },
  aiStatusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  aiStatusSubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  documentsSection: {
    marginBottom: 20,
  },
  documentCard: {
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
  documentCardFlagged: {
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  documentCardApproved: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  documentFileName: {
    fontSize: 12,
    color: "#64748b",
  },
  documentStatus: {
    alignItems: "flex-end",
    gap: 4,
  },
  aiReviewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiReviewText: {
    fontSize: 10,
    fontWeight: "700",
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: "700",
  },
  mismatchContainer: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  mismatchTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  mismatchText: {
    fontSize: 12,
    color: "#92400e",
    marginBottom: 4,
  },
  moreFlags: {
    fontSize: 12,
    color: "#92400e",
    fontStyle: "italic",
  },
  extractedDataPreview: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  extractedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  extractedItem: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  finalDecisionSection: {
    marginBottom: 20,
  },
  finalDecisionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finalDecisionText: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  finalDecisionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  documentModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxWidth: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  documentImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: "contain",
  },
  fullExtractedData: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  extractedDataTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  extractedDataText: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "monospace",
  },
  closeModalButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
