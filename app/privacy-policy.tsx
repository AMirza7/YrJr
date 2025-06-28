import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BackButton from "@/components/navigation/BackButton";

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Settings" color="#fff" />
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>Last updated: January 2024</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionText}>
            YRJR Legal Assistant ("we," "our," or "us") is committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our mobile application and legal services platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer of Legal Advice</Text>
          <Text style={styles.warningText}>
            IMPORTANT: This application provides legal information and tools for
            educational and organizational purposes only. It does NOT constitute
            legal advice. The content provided should not be considered as legal
            counsel or create an attorney-client relationship. Always consult
            with a qualified lawyer for specific legal matters.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>

          <Text style={styles.subTitle}>Personal Information</Text>
          <Text style={styles.sectionText}>
            • Name, email address, and phone number{"\n"}• Professional
            credentials (Bar Council Number for lawyers){"\n"}• Practice
            specialization and experience details{"\n"}• Profile information and
            biography{"\n"}• Payment and billing information
          </Text>

          <Text style={styles.subTitle}>Usage Data</Text>
          <Text style={styles.sectionText}>
            • App usage patterns and feature interactions{"\n"}• Device
            information and technical specifications{"\n"}• Location data (with
            explicit permission){"\n"}• Search queries and preferences{"\n"}•
            Communication and support interactions
          </Text>

          <Text style={styles.subTitle}>Sensitive Data</Text>
          <Text style={styles.sectionText}>
            • Legal case information and documents{"\n"}• Client confidential
            information (encrypted){"\n"}• Biometric data for authentication
            {"\n"}• Secure notes and personal documents
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            • Provide and maintain our legal services platform{"\n"}• Process
            user authentication and account management{"\n"}• Enable secure
            document storage and access{"\n"}• Facilitate legal template
            downloads and case management{"\n"}• Send important notifications
            and updates{"\n"}• Improve our services through analytics{"\n"}•
            Ensure platform security and prevent fraud{"\n"}• Comply with legal
            obligations and regulations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage and Security</Text>
          <Text style={styles.sectionText}>
            We implement industry-standard security measures to protect your
            data:
          </Text>
          <Text style={styles.sectionText}>
            • End-to-end encryption for sensitive information{"\n"}• Secure
            cloud storage with regular backups{"\n"}• Multi-factor
            authentication options{"\n"}• Regular security audits and
            penetration testing{"\n"}• Compliance with ISO 27001 security
            standards{"\n"}• Data minimization and retention policies
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Information Sharing and Disclosure
          </Text>
          <Text style={styles.sectionText}>
            We do NOT sell, trade, or rent your personal information. We may
            share information only in these circumstances:
          </Text>
          <Text style={styles.sectionText}>
            • With your explicit consent{"\n"}• To comply with legal obligations
            or court orders{"\n"}• To protect rights, property, or safety{"\n"}•
            With trusted service providers under strict confidentiality{"\n"}•
            In case of business merger or acquisition (with notice)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights Under Indian Law</Text>
          <Text style={styles.sectionText}>
            Under the Digital Personal Data Protection Act, 2023 and other
            applicable laws, you have the right to:
          </Text>
          <Text style={styles.sectionText}>
            • Access your personal data{"\n"}• Correct inaccurate information
            {"\n"}• Delete your account and data{"\n"}• Data portability and
            download{"\n"}• Withdraw consent for data processing{"\n"}• File
            complaints with data protection authorities{"\n"}• Opt-out of
            marketing communications
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.warningText}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:{"\n\n"}• We disclaim all
            warranties, express or implied{"\n"}• We are not liable for any
            indirect, incidental, or consequential damages{"\n"}• Our total
            liability shall not exceed the amount paid by you{"\n"}• We are not
            responsible for third-party content or services{"\n"}• Users assume
            full responsibility for their use of the platform
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Responsibility</Text>
          <Text style={styles.sectionText}>
            Legal professionals using this platform must:
          </Text>
          <Text style={styles.sectionText}>
            • Maintain client confidentiality at all times{"\n"}• Comply with
            Bar Council of India regulations{"\n"}• Ensure accuracy of
            professional credentials{"\n"}• Not engage in unauthorized practice
            of law{"\n"}• Report any security breaches immediately{"\n"}• Use
            the platform ethically and responsibly
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prohibited Uses</Text>
          <Text style={styles.sectionText}>
            You agree NOT to use this platform for:
          </Text>
          <Text style={styles.sectionText}>
            • Any unlawful or fraudulent activities{"\n"}• Harassment or abuse
            of other users{"\n"}• Unauthorized access to system resources{"\n"}•
            Distribution of malware or harmful content{"\n"}• Violation of
            intellectual property rights{"\n"}• Circumventing security measures
            {"\n"}• Commercial use without proper authorization
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Jurisdiction and Dispute Resolution
          </Text>
          <Text style={styles.sectionText}>
            • This Privacy Policy is governed by Indian law{"\n"}• Disputes will
            be resolved through arbitration in Mumbai, India{"\n"}• Any legal
            proceedings must be filed in Mumbai courts{"\n"}• We comply with all
            applicable Indian regulations{"\n"}• International users consent to
            Indian jurisdiction
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.sectionText}>
            • Account data: Retained while account is active{"\n"}• Legal
            documents: Retained as per legal requirements{"\n"}• Usage logs:
            Retained for 2 years maximum{"\n"}• Payment data: Retained for 7
            years (compliance){"\n"}• Marketing data: Deleted upon opt-out{"\n"}
            • Backup data: Securely deleted after retention period
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our service is not intended for children under 18. We do not
            knowingly collect personal information from children. If you believe
            we have collected information from a child, please contact us
            immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>International Transfers</Text>
          <Text style={styles.sectionText}>
            Your data may be transferred to and processed in countries outside
            India. We ensure adequate protection through appropriate safeguards
            and compliance with applicable data protection laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy periodically. Material changes
            will be notified through the app and email. Continued use after
            changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.sectionText}>
            For privacy-related questions or to exercise your rights:
          </Text>
          <Text style={styles.contactText}>
            Email: privacy@yrjr.app{"\n"}
            Phone: +91-XXXX-XXXXXX{"\n"}
            Address: Mumbai, Maharashtra, India{"\n"}
            Data Protection Officer: dpo@yrjr.app
          </Text>
        </View>

        <View style={styles.acknowledgment}>
          <Text style={styles.acknowledgmentText}>
            By using YRJR Legal Assistant, you acknowledge that you have read,
            understood, and agree to be bound by this Privacy Policy and our
            Terms of Service.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 YRJR Legal Assistant. All rights reserved.{"\n"}
            This document is legally binding and enforceable.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#374151",
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
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#dc2626",
    lineHeight: 22,
    fontWeight: "500",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  contactText: {
    fontSize: 14,
    color: "#059669",
    lineHeight: 22,
    fontWeight: "500",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  acknowledgment: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
    marginBottom: 20,
  },
  acknowledgmentText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 22,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
});
