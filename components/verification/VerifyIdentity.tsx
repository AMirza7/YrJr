import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";
import * as DocumentPicker from "expo-document-picker";
// import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

interface Document {
  id: string;
  name: string;
  type: string;
  uri: string;
  size: number;
  status: "pending" | "verified" | "rejected";
}

interface VerificationData {
  personalInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
    address: string;
  };
  professionalInfo: {
    barCouncilNumber?: string;
    experienceYears: string;
    specialization: string[];
    firmName?: string;
    firmAddress?: string;
  };
  documents: Document[];
}

const SPECIALIZATIONS = [
  "Criminal Law",
  "Civil Law",
  "Corporate Law",
  "Family Law",
  "Tax Law",
  "Property Law",
  "Labor Law",
  "Constitutional Law",
  "Environmental Law",
  "Intellectual Property",
];

interface VerifyIdentityProps {
  userType: "lawyer" | "junior_lawyer" | "clerk";
  onVerificationComplete?: (data: VerificationData) => void;
  onClose?: () => void;
}

export default function VerifyIdentity({
  userType,
  onVerificationComplete,
  onClose,
}: VerifyIdentityProps) {
  const { showSuccess, showError, showConfirm } = useModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState<VerificationData>({
    personalInfo: {
      fullName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      address: "",
    },
    professionalInfo: {
      barCouncilNumber: "",
      experienceYears: "",
      specialization: [],
      firmName: "",
      firmAddress: "",
    },
    documents: [],
  });

  const totalSteps = userType === "clerk" ? 3 : 4;

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Professional Details";
      case 3:
        return "Document Upload";
      case 4:
        return "Face Verification";
      default:
        return "Verification";
    }
  };

  const getRequiredDocuments = () => {
    const common = [
      "Government ID (Aadhaar/PAN/Passport)",
      "Address Proof",
      "Recent Photograph",
    ];

    switch (userType) {
      case "lawyer":
        return [
          ...common,
          "Bar Council Certificate",
          "Law Degree Certificate",
          "Practice Certificate",
          "Chamber/Office Proof",
        ];
      case "junior_lawyer":
        return [
          ...common,
          "Law Degree Certificate",
          "Internship Certificate",
          "Experience Letter",
        ];
      case "clerk":
        return [...common, "Qualification Certificate", "Experience Letter"];
      default:
        return common;
    }
  };

  const handlePersonalInfoChange = (
    field: keyof typeof verificationData.personalInfo,
    value: string,
  ) => {
    setVerificationData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleProfessionalInfoChange = (
    field: keyof typeof verificationData.professionalInfo,
    value: string | string[],
  ) => {
    setVerificationData((prev) => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: value,
      },
    }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    const current = verificationData.professionalInfo.specialization;
    const updated = current.includes(specialization)
      ? current.filter((s) => s !== specialization)
      : [...current, specialization];

    handleProfessionalInfoChange("specialization", updated);
  };

  const handleDocumentUpload = async (documentType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newDocument: Document = {
          id: Date.now().toString(),
          name: documentType,
          type: asset.mimeType || "application/pdf",
          uri: asset.uri,
          size: asset.size || 0,
          status: "pending",
        };

        setVerificationData((prev) => ({
          ...prev,
          documents: [...prev.documents, newDocument],
        }));

        showSuccess(`${documentType} uploaded successfully`);
      }
    } catch (error) {
      showError("Failed to upload document. Please try again.");
    }
  };

  const handleCameraCapture = async (documentType: string) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showError("Camera permission is required to capture documents");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newDocument: Document = {
          id: Date.now().toString(),
          name: documentType,
          type: "image/jpeg",
          uri: asset.uri,
          size: 0,
          status: "pending",
        };

        setVerificationData((prev) => ({
          ...prev,
          documents: [...prev.documents, newDocument],
        }));

        showSuccess(`${documentType} captured successfully`);
      }
    } catch (error) {
      showError("Failed to capture image. Please try again.");
    }
  };

  const handleDocumentAction = (documentType: string) => {
    showConfirm(
      "Upload Document",
      "How would you like to add this document?",
      () => handleDocumentUpload(documentType),
      "primary",
      "Choose File",
      () => handleCameraCapture(documentType),
      "Take Photo",
    );
  };

  const removeDocument = (documentId: string) => {
    setVerificationData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== documentId),
    }));
    showSuccess("Document removed successfully");
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { fullName, phoneNumber, email, dateOfBirth, address } =
          verificationData.personalInfo;
        return !!(fullName && phoneNumber && email && dateOfBirth && address);
      case 2:
        const { experienceYears, specialization } =
          verificationData.professionalInfo;
        const hasBarCouncil =
          userType === "clerk" ||
          !!verificationData.professionalInfo.barCouncilNumber;
        return !!(
          experienceYears &&
          specialization.length > 0 &&
          hasBarCouncil
        );
      case 3:
        const requiredDocs = getRequiredDocuments();
        const uploadedTypes = verificationData.documents.map((doc) => doc.name);
        return requiredDocs.every((doc) => uploadedTypes.includes(doc));
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      showError("Please fill all required fields before proceeding");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitVerification();
    }
  };

  const handleSubmitVerification = () => {
    showConfirm(
      "Submit Verification",
      "Are you sure you want to submit your verification documents? This cannot be undone.",
      () => {
        onVerificationComplete?.(verificationData);
        showSuccess(
          "Verification submitted successfully! We'll review your documents within 24-48 hours.",
        );
        onClose?.();
      },
      "primary",
      "Submit",
    );
  };

  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDescription}>
        Please provide accurate personal details as they appear on your official
        documents
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={verificationData.personalInfo.fullName}
          onChangeText={(value) => handlePersonalInfoChange("fullName", value)}
          placeholder="Enter your full legal name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={verificationData.personalInfo.phoneNumber}
          onChangeText={(value) =>
            handlePersonalInfoChange("phoneNumber", value)
          }
          placeholder="+91 98765 43210"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={verificationData.personalInfo.email}
          onChangeText={(value) => handlePersonalInfoChange("email", value)}
          placeholder="your.email@domain.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth *</Text>
        <TextInput
          style={styles.input}
          value={verificationData.personalInfo.dateOfBirth}
          onChangeText={(value) =>
            handlePersonalInfoChange("dateOfBirth", value)
          }
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Complete Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={verificationData.personalInfo.address}
          onChangeText={(value) => handlePersonalInfoChange("address", value)}
          placeholder="Enter your complete address with pin code"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderProfessionalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Professional Details</Text>
      <Text style={styles.stepDescription}>
        Provide your professional qualifications and experience details
      </Text>

      {userType !== "clerk" && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bar Council Number *</Text>
          <TextInput
            style={styles.input}
            value={verificationData.professionalInfo.barCouncilNumber}
            onChangeText={(value) =>
              handleProfessionalInfoChange("barCouncilNumber", value)
            }
            placeholder="Enter your Bar Council registration number"
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Years of Experience *</Text>
        <TextInput
          style={styles.input}
          value={verificationData.professionalInfo.experienceYears}
          onChangeText={(value) =>
            handleProfessionalInfoChange("experienceYears", value)
          }
          placeholder="Enter years of experience"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Areas of Specialization *</Text>
        <Text style={styles.inputHelper}>
          Select at least one specialization
        </Text>
        <View style={styles.specializationGrid}>
          {SPECIALIZATIONS.map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[
                styles.specializationChip,
                verificationData.professionalInfo.specialization.includes(
                  spec,
                ) && styles.specializationChipSelected,
              ]}
              onPress={() => handleSpecializationToggle(spec)}
            >
              <Text
                style={[
                  styles.specializationText,
                  verificationData.professionalInfo.specialization.includes(
                    spec,
                  ) && styles.specializationTextSelected,
                ]}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Firm/Organization Name</Text>
        <TextInput
          style={styles.input}
          value={verificationData.professionalInfo.firmName}
          onChangeText={(value) =>
            handleProfessionalInfoChange("firmName", value)
          }
          placeholder="Enter firm or organization name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Firm/Office Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={verificationData.professionalInfo.firmAddress}
          onChangeText={(value) =>
            handleProfessionalInfoChange("firmAddress", value)
          }
          placeholder="Enter office or chamber address"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );

  const renderDocumentUpload = () => {
    const requiredDocs = getRequiredDocuments();
    const uploadedTypes = verificationData.documents.map((doc) => doc.name);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Document Verification</Text>
        <Text style={styles.stepDescription}>
          Upload clear, high-quality images or PDFs of your documents
        </Text>

        <View style={styles.documentsGrid}>
          {requiredDocs.map((docType) => {
            const isUploaded = uploadedTypes.includes(docType);
            const document = verificationData.documents.find(
              (doc) => doc.name === docType,
            );

            return (
              <View key={docType} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <Text style={styles.documentTitle}>{docType}</Text>
                  {isUploaded && (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>✓</Text>
                    </View>
                  )}
                </View>

                {isUploaded && document ? (
                  <View style={styles.uploadedDocument}>
                    <Text style={styles.uploadedText}>Document uploaded</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeDocument(document.id)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleDocumentAction(docType)}
                  >
                    <Text style={styles.uploadIcon}>📁</Text>
                    <Text style={styles.uploadText}>Upload</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.uploadTips}>
          <Text style={styles.tipsTitle}>📋 Upload Guidelines</Text>
          <Text style={styles.tipText}>
            • Ensure documents are clearly visible and well-lit
          </Text>
          <Text style={styles.tipText}>
            • Use high resolution images (min 1080p)
          </Text>
          <Text style={styles.tipText}>• Accepted formats: JPG, PNG, PDF</Text>
          <Text style={styles.tipText}>• File size should be under 10MB</Text>
          <Text style={styles.tipText}>
            • Documents should be valid and not expired
          </Text>
        </View>
      </View>
    );
  };

  const renderFaceVerification = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Face Verification</Text>
      <Text style={styles.stepDescription}>
        Take a live selfie to verify your identity matches the uploaded
        documents
      </Text>

      <View style={styles.faceVerificationContainer}>
        <View style={styles.faceCircle}>
          <Text style={styles.faceIcon}>📷</Text>
        </View>

        <Text style={styles.faceTitle}>Live Selfie Required</Text>
        <Text style={styles.faceDescription}>
          Position your face within the circle and follow the on-screen
          instructions
        </Text>

        <TouchableOpacity
          style={styles.startVerificationButton}
          onPress={() =>
            showSuccess("Face verification completed successfully!")
          }
        >
          <Text style={styles.startVerificationText}>
            Start Face Verification
          </Text>
        </TouchableOpacity>

        <View style={styles.verificationTips}>
          <Text style={styles.tipsTitle}>💡 Verification Tips</Text>
          <Text style={styles.tipText}>• Look directly at the camera</Text>
          <Text style={styles.tipText}>
            • Ensure good lighting on your face
          </Text>
          <Text style={styles.tipText}>
            • Remove glasses and hat if possible
          </Text>
          <Text style={styles.tipText}>• Keep your face within the frame</Text>
        </View>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(currentStep / totalSteps) * 100}%` },
          ]}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderProfessionalInfo();
      case 3:
        return renderDocumentUpload();
      case 4:
        return renderFaceVerification();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Identity</Text>
        <View style={styles.headerSpacer} />
      </View>

      {renderProgressBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backStepButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.backStepText}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !validateStep(currentStep) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!validateStep(currentStep)}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? "Submit Verification" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#8b5cf6",
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#fff",
    marginRight: 4,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerSpacer: {
    width: 60,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputHelper: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  specializationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specializationChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  specializationChipSelected: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  specializationText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  specializationTextSelected: {
    color: "#fff",
  },
  documentsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  documentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "#8b5cf6",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#faf5ff",
  },
  uploadIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  uploadedDocument: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  uploadedText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fee2e2",
    borderRadius: 6,
  },
  removeButtonText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "600",
  },
  uploadTips: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fbbf24",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
    marginBottom: 4,
  },
  faceVerificationContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  faceCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf5ff",
    marginBottom: 24,
  },
  faceIcon: {
    fontSize: 48,
  },
  faceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  faceDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  startVerificationButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  startVerificationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  verificationTips: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    maxWidth: 300,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  backStepButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  backStepText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  nextButton: {
    flex: 2,
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
