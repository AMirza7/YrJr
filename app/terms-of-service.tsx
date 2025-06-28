import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BackButton from "@/components/navigation/BackButton";

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Settings" color="#fff" />
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>Last updated: January 2024</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using YRJR Legal Assistant ("Service"), you accept
            and agree to be bound by these Terms of Service ("Terms"). If you do
            not agree to these Terms, you must not use our Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRITICAL LEGAL DISCLAIMERS</Text>
          <Text style={styles.warningText}>
            🚨 NO LEGAL ADVICE: This platform provides legal information and
            tools for educational purposes only. It does NOT constitute legal
            advice, create an attorney-client relationship, or substitute for
            professional legal counsel.{"\n\n"}
            🚨 NO WARRANTIES: We provide the service "AS IS" without any
            warranties, express or implied. We disclaim all warranties of
            merchantability, fitness for a particular purpose, and
            non-infringement.{"\n\n"}
            🚨 USE AT YOUR OWN RISK: You assume full responsibility for any
            decisions made based on information from this platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Description</Text>
          <Text style={styles.sectionText}>YRJR Legal Assistant provides:</Text>
          <Text style={styles.sectionText}>
            • Legal information and educational resources{"\n"}• Document
            templates and forms{"\n"}• Case management and organization tools
            {"\n"}• Legal research and comparison features{"\n"}• Professional
            networking platform{"\n"}• Secure document storage{"\n"}• Learning
            and flashcard systems
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            User Eligibility and Registration
          </Text>
          <Text style={styles.sectionText}>
            • You must be at least 18 years old to use this Service{"\n"}• Legal
            professionals must provide accurate credentials{"\n"}• You must have
            legal capacity to enter into agreements{"\n"}• One account per
            person; sharing accounts is prohibited{"\n"}• You are responsible
            for maintaining account security{"\n"}• False information may result
            in account termination
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Verification</Text>
          <Text style={styles.sectionText}>For legal professionals:</Text>
          <Text style={styles.sectionText}>
            • Bar Council registration numbers will be verified{"\n"}• False
            credentials will result in immediate termination{"\n"}• Verification
            badges are granted at our discretion{"\n"}• Professional conduct
            rules apply to all interactions{"\n"}• Unauthorized practice of law
            is strictly prohibited
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prohibited Uses and Conduct</Text>
          <Text style={styles.warningText}>
            Users are STRICTLY PROHIBITED from:
          </Text>
          <Text style={styles.sectionText}>
            • Using the platform for any illegal activities{"\n"}• Providing
            legal advice without proper authorization{"\n"}• Violating client
            confidentiality or professional ethics{"\n"}• Harassing,
            threatening, or abusing other users{"\n"}• Sharing false or
            misleading information{"\n"}• Attempting to hack or breach security
            measures{"\n"}• Using the platform for commercial gain without
            permission{"\n"}• Uploading malicious code or viruses{"\n"}•
            Violating intellectual property rights{"\n"}• Creating fake accounts
            or impersonating others
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.warningText}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:{"\n\n"}• TOTAL LIABILITY
            LIMITATION: Our total liability shall not exceed the amount you paid
            for the Service in the 12 months preceding the claim{"\n\n"}• NO
            CONSEQUENTIAL DAMAGES: We are not liable for any indirect,
            incidental, punitive, or consequential damages{"\n\n"}• NO
            PROFESSIONAL LIABILITY: We are not liable for professional
            malpractice or negligence claims{"\n\n"}• THIRD-PARTY CONTENT: We
            are not responsible for third-party content, links, or services
            {"\n\n"}• FORCE MAJEURE: We are not liable for delays or failures
            due to circumstances beyond our control
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indemnification</Text>
          <Text style={styles.sectionText}>
            You agree to indemnify, defend, and hold harmless YRJR Legal
            Assistant, its officers, directors, employees, and agents from any
            claims, damages, losses, costs, or expenses arising from:
          </Text>
          <Text style={styles.sectionText}>
            • Your use of the Service{"\n"}
            �� Your violation of these Terms{"\n"}• Your violation of any
            third-party rights{"\n"}• Your professional negligence or
            malpractice{"\n"}• Any content you upload or share{"\n"}• Your
            breach of confidentiality obligations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>
          <Text style={styles.sectionText}>
            • All platform content is owned by YRJR Legal Assistant or licensors
            {"\n"}• Users retain rights to their original content{"\n"}• Limited
            license granted for personal/professional use only{"\n"}• No
            redistribution or commercial use without permission{"\n"}• Templates
            are licensed, not sold{"\n"}• Legal precedents and statutes remain
            in public domain{"\n"}• Trademark and copyright infringement is
            prohibited
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Subscription and Payment Terms
          </Text>
          <Text style={styles.sectionText}>
            • Subscription fees are charged in advance{"\n"}• All fees are
            non-refundable unless required by law{"\n"}• Automatic renewal
            unless cancelled{"\n"}• Price changes with 30 days notice{"\n"}•
            Failed payments may result in service suspension{"\n"}• Taxes are
            additional and user's responsibility{"\n"}• Dispute resolution
            through Indian payment regulations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Protection and Privacy</Text>
          <Text style={styles.sectionText}>
            • Your privacy is governed by our Privacy Policy{"\n"}• We comply
            with Indian data protection laws{"\n"}• Client data must be handled
            per professional obligations{"\n"}• Users responsible for their own
            data backup{"\n"}• We use industry-standard security measures{"\n"}•
            Data breaches will be reported as required by law{"\n"}•
            Cross-border data transfers are adequately protected
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Service Availability and Modifications
          </Text>
          <Text style={styles.sectionText}>
            • Service availability is not guaranteed{"\n"}• Scheduled
            maintenance may cause temporary outages{"\n"}• We may modify
            features with reasonable notice{"\n"}• Emergency changes may be made
            without notice{"\n"}• Service may be suspended for security reasons
            {"\n"}• We reserve the right to discontinue features{"\n"}• No
            compensation for service interruptions
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Termination</Text>
          <Text style={styles.sectionText}>
            We may terminate or suspend accounts for:
          </Text>
          <Text style={styles.sectionText}>
            • Violation of these Terms{"\n"}• Fraudulent or illegal activities
            {"\n"}• Professional misconduct{"\n"}• Non-payment of fees{"\n"}•
            Harm to other users or the platform{"\n"}• Legal or regulatory
            requirements{"\n"}• Extended inactivity (with notice)
          </Text>
          <Text style={styles.sectionText}>
            Upon termination, your access ends immediately, but these Terms
            continue to apply to past use.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Dispute Resolution and Jurisdiction
          </Text>
          <Text style={styles.warningText}>
            MANDATORY ARBITRATION:{"\n\n"}• All disputes must be resolved
            through binding arbitration{"\n"}• Arbitration conducted under
            Indian Arbitration Act, 2015{"\n"}• Seat of arbitration: Mumbai,
            Maharashtra, India{"\n"}• Language: English{"\n"}• No class actions
            or collective proceedings{"\n"}• Appeals limited to grounds
            specified in Indian law{"\n"}• Courts in Mumbai have exclusive
            jurisdiction for enforcement
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Governing Law and Compliance</Text>
          <Text style={styles.sectionText}>
            • These Terms are governed by Indian law{"\n"}• We comply with
            Information Technology Act, 2000{"\n"}• Digital Personal Data
            Protection Act, 2023 applies{"\n"}• Bar Council of India rules
            govern legal professionals{"\n"}• Foreign users subject to Indian
            jurisdiction{"\n"}• Consumer protection laws may provide additional
            rights{"\n"}• Professional licensing requirements must be met
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Force Majeure</Text>
          <Text style={styles.sectionText}>
            We are not liable for delays or failures due to circumstances beyond
            our reasonable control, including but not limited to natural
            disasters, government actions, pandemics, cyber attacks, or
            infrastructure failures.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Severability and Waiver</Text>
          <Text style={styles.sectionText}>
            • Invalid provisions do not affect validity of remaining Terms{"\n"}
            • Our failure to enforce any right is not a waiver{"\n"}• Waivers
            must be in writing{"\n"}• These Terms supersede all prior agreements
            {"\n"}• Modifications must be agreed to in writing{"\n"}• No
            third-party beneficiaries except as specified
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Professional Responsibility Notice
          </Text>
          <Text style={styles.warningText}>
            LAWYERS AND LEGAL PROFESSIONALS:{"\n\n"}
            You remain fully responsible for:{"\n"}• Compliance with
            professional conduct rules{"\n"}• Client confidentiality and
            privilege{"\n"}• Competent representation{"\n"}• Conflict of
            interest rules{"\n"}• Continuing legal education requirements{"\n"}•
            Accurate billing and time records{"\n"}• Proper client communication
            {"\n\n"}
            This platform does not relieve you of any professional obligations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.sectionText}>
            For questions about these Terms:
          </Text>
          <Text style={styles.contactText}>
            Email: legal@yrjr.app{"\n"}
            Phone: +91-XXXX-XXXXXX{"\n"}
            Address: Mumbai, Maharashtra, India{"\n"}
            Legal Department: terms@yrjr.app
          </Text>
        </View>

        <View style={styles.acknowledgment}>
          <Text style={styles.acknowledgmentText}>
            By using YRJR Legal Assistant, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service. You
            also acknowledge that you have read our Privacy Policy and
            understand how we collect, use, and protect your information.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 YRJR Legal Assistant. All rights reserved.{"\n"}
            These Terms constitute a legally binding agreement.{"\n"}
            Violation may result in civil and criminal liability.
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
    backgroundColor: "#1f2937",
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
