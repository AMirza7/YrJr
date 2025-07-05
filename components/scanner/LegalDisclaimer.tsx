import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from "react-native";

interface LegalDisclaimerProps {
  compact?: boolean;
  showFirstTimeModal?: boolean;
  onFirstTimeAccept?: () => void;
}

export default function LegalDisclaimer({
  compact = false,
  showFirstTimeModal = false,
  onFirstTimeAccept,
}: LegalDisclaimerProps) {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  const openPrivacyPolicy = () => {
    Linking.openURL("https://example.com/privacy-policy");
  };

  const openTermsOfService = () => {
    Linking.openURL("https://example.com/terms-of-service");
  };

  const CompactDisclaimer = () => (
    <View style={styles.compactContainer}>
      <Text style={styles.compactText}>
        �� By uploading, you confirm that you have the right to use this
        document. We encrypt your data and never share it.{" "}
        <Text style={styles.link} onPress={() => setShowFullDisclaimer(true)}>
          Learn more
        </Text>
      </Text>
    </View>
  );

  const FullDisclaimer = () => (
    <Modal
      visible={showFullDisclaimer || showFirstTimeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFullDisclaimer(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>🔐 Privacy & Security Notice</Text>

            <Text style={styles.modalSubtitle}>
              Your data security and privacy are our top priorities
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Document Rights</Text>
              <Text style={styles.sectionText}>
                By uploading documents, you confirm that:
                {"\n"}• You have the legal right to use and process these
                documents
                {"\n"}• The documents don't contain confidential information of
                third parties
                {"\n"}• You're authorized to extract and analyze the content
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔒 Data Encryption</Text>
              <Text style={styles.sectionText}>
                Your documents are protected with:
                {"\n"}• End-to-end encryption during upload and storage
                {"\n"}• AES-256 encryption for data at rest
                {"\n"}• Secure deletion after processing (if requested)
                {"\n"}• No permanent storage without explicit consent
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚫 Data Sharing Policy</Text>
              <Text style={styles.sectionText}>
                We never share your data:
                {"\n"}• No third-party access to your documents
                {"\n"}• No selling of personal information
                {"\n"}• No marketing use of scanned content
                {"\n"}• Processing occurs on secure, isolated servers
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚖️ Legal Compliance</Text>
              <Text style={styles.sectionText}>
                This app complies with:
                {"\n"}• Indian Information Technology Act, 2000
                {"\n"}• Personal Data Protection Bill guidelines
                {"\n"}• Legal document handling standards
                {"\n"}• Attorney-client privilege requirements
              </Text>
            </View>

            <View style={styles.linksContainer}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={openPrivacyPolicy}
              >
                <Text style={styles.linkButtonText}>📄 Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={openTermsOfService}
              >
                <Text style={styles.linkButtonText}>📜 Terms of Service</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>📞 Contact Information</Text>
              <Text style={styles.contactText}>
                For privacy concerns or data deletion requests:
                {"\n"}Email: privacy@yrjr-legal.com
                {"\n"}Phone: +91-XXXX-XXXXXX
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            {showFirstTimeModal ? (
              <>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => {
                    onFirstTimeAccept?.();
                  }}
                >
                  <Text style={styles.acceptButtonText}>
                    ✅ I Understand & Agree
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFullDisclaimer(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  if (compact) {
    return (
      <>
        <CompactDisclaimer />
        <FullDisclaimer />
      </>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Text style={styles.fullTitle}>🔐 Legal Notice</Text>
      <Text style={styles.fullText}>
        By using this scanner, you confirm that you have the right to process
        these documents. We encrypt your data and never share it with third
        parties.
      </Text>

      <View style={styles.fullLinks}>
        <TouchableOpacity onPress={openPrivacyPolicy}>
          <Text style={styles.fullLinkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={openTermsOfService}>
          <Text style={styles.fullLinkText}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={() => setShowFullDisclaimer(true)}>
          <Text style={styles.fullLinkText}>Full Disclosure</Text>
        </TouchableOpacity>
      </View>

      <FullDisclaimer />
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  compactText: {
    fontSize: 12,
    color: "#92400e",
    lineHeight: 16,
  },
  fullContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    padding: 16,
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  fullText: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
    marginBottom: 12,
  },
  fullLinks: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  fullLinkText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  separator: {
    fontSize: 12,
    color: "#94a3b8",
    marginHorizontal: 8,
  },
  link: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  linksContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  linkButton: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  linkButtonText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  contactInfo: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  acceptButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
});
