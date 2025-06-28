import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import BackButton from "@/components/navigation/BackButton";

const FAQ_DATA = [
  {
    question: "How do I access premium features?",
    answer:
      "Premium features are available with Pro and Premium subscriptions. Go to Settings > Subscription to upgrade your plan.",
  },
  {
    question: "How accurate is the AI section comparator?",
    answer:
      "Our AI comparator uses trained models on Indian legal texts with 95%+ accuracy. However, always verify with legal experts for critical cases.",
  },
  {
    question: "Can I use this app offline?",
    answer:
      "Basic features like saved templates and notes work offline. Advanced features like AI comparator require internet connection.",
  },
  {
    question: "Is my data secure and confidential?",
    answer:
      "Yes, we use end-to-end encryption for all sensitive data. Your legal documents and notes are protected with bank-level security.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Go to Settings > Subscription > Manage Plan. You can cancel anytime with no cancellation fees.",
  },
  {
    question: "Can I export my documents?",
    answer:
      "Yes, all documents can be exported as PDF or Word formats. Pro users get unlimited exports.",
  },
];

const CONTACT_OPTIONS = [
  {
    title: "Email Support",
    subtitle: "Get help via email",
    icon: "📧",
    action: () => Linking.openURL("mailto:support@yrjr.app"),
    info: "support@yrjr.app",
  },
  {
    title: "Phone Support",
    subtitle: "Call us directly",
    icon: "📞",
    action: () => Linking.openURL("tel:+919876543210"),
    info: "+91-9876543210",
  },
  {
    title: "WhatsApp Support",
    subtitle: "Chat on WhatsApp",
    icon: "💬",
    action: () => Linking.openURL("whatsapp://send?phone=919876543210"),
    info: "Available 9 AM - 6 PM",
  },
  {
    title: "Video Consultation",
    subtitle: "Book a session",
    icon: "🎥",
    action: () =>
      Alert.alert(
        "Coming Soon",
        "Video consultations will be available in the next update.",
      ),
    info: "Premium feature",
  },
];

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }

    Alert.alert(
      "Feedback Submitted",
      "Thank you for your feedback! We'll get back to you within 24 hours.",
      [
        {
          text: "OK",
          onPress: () => {
            setFeedbackText("");
            setFeedbackCategory("general");
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Settings" color="#fff" />
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>We're here to help you</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/privacy-policy")}
            >
              <Text style={styles.quickActionIcon}>🔒</Text>
              <Text style={styles.quickActionText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/terms-of-service")}
            >
              <Text style={styles.quickActionIcon}>📋</Text>
              <Text style={styles.quickActionText}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/subscription")}
            >
              <Text style={styles.quickActionIcon}>💳</Text>
              <Text style={styles.quickActionText}>Subscription</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact Us</Text>
          {CONTACT_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactOption}
              onPress={option.action}
            >
              <Text style={styles.contactIcon}>{option.icon}</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                <Text style={styles.contactDetail}>{option.info}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
          {FAQ_DATA.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Text style={styles.faqIcon}>
                  {expandedFAQ === index ? "−" : "+"}
                </Text>
              </TouchableOpacity>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Feedback Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💭 Send Feedback</Text>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackLabel}>Category</Text>
            <View style={styles.categoryButtons}>
              {["general", "bug", "feature", "complaint"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    feedbackCategory === category &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => setFeedbackCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      feedbackCategory === category &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.feedbackLabel}>Your Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              multiline
              numberOfLines={4}
              placeholder="Tell us about your experience, report bugs, or suggest improvements..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitFeedback}
            >
              <Text style={styles.submitButtonText}>📤 Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ App Information</Text>
          <View style={styles.appInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.01.15</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>React Native</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>YRJR Legal Tech</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Emergency Legal Help</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyText}>
              For urgent legal matters, contact:
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => Linking.openURL("tel:1860")}
            >
              <Text style={styles.emergencyButtonText}>
                📞 National Emergency Number: 1860
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => Linking.openURL("tel:1091")}
            >
              <Text style={styles.emergencyButtonText}>
                ⚖️ Women Helpline: 1091
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#059669",
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
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  contactOption: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 20,
    color: "#9ca3af",
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    marginRight: 16,
  },
  faqIcon: {
    fontSize: 20,
    color: "#059669",
    fontWeight: "bold",
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
  },
  categoryButtonActive: {
    backgroundColor: "#059669",
  },
  categoryButtonText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#059669",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  appInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  emergencyCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  emergencyText: {
    fontSize: 14,
    color: "#991b1b",
    marginBottom: 12,
    fontWeight: "500",
  },
  emergencyButton: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  emergencyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
