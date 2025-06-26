import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthContext";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width: screenWidth } = Dimensions.get("window");

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "account" | "features" | "legal" | "technical";
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "bug" | "feature" | "support" | "feedback";
}

const FAQS: FAQ[] = [
  {
    id: "1",
    question: "How do I file an FIR using the app?",
    answer:
      "Navigate to Legal Templates > FIR Draft Template. Fill in the required details and generate your FIR draft. You can then print or save it to submit at your local police station.",
    category: "legal",
  },
  {
    id: "2",
    question: "What are the different user roles and their access levels?",
    answer:
      "We have 5 user roles: Lawyer (full access), Junior Lawyer (most features), Lawyer Assistant (client management + basic features), Law Office Helper (administrative tools), and Law Student (learning resources + basic search).",
    category: "account",
  },
  {
    id: "3",
    question: "How do I enable biometric login?",
    answer:
      "Go to Profile > Security Settings > Enable Biometric Authentication. Ensure your device has Face ID/Touch ID enabled in system settings first.",
    category: "features",
  },
  {
    id: "4",
    question: "Can I use the voice assistant in regional languages?",
    answer:
      "Yes! Our AI assistant supports 12+ Indian languages including Hindi, Tamil, Telugu, Bengali, and more. You can change the language in Profile > Language Settings.",
    category: "features",
  },
  {
    id: "5",
    question: "How does the document scanner work?",
    answer:
      "Use the Document Scanner to photograph legal documents. Our OCR technology extracts text and identifies legal fields like case numbers, sections, and parties automatically.",
    category: "features",
  },
  {
    id: "6",
    question: "Is my data secure in the app?",
    answer:
      "Yes! We use end-to-end encryption for all sensitive data. The Secure Vault feature provides additional biometric protection for confidential documents.",
    category: "general",
  },
  {
    id: "7",
    question: "How do I sync court dates with my calendar?",
    answer:
      "Go to Case Timeline > Add Hearing, or use the Calendar Sync feature to automatically add court dates to your device calendar with reminders.",
    category: "features",
  },
  {
    id: "8",
    question: "What's the difference between IPC and BNS?",
    answer:
      "Use our Section Comparator tool to see side-by-side comparisons. BNS (Bharatiya Nyaya Sanhita) is the new criminal code replacing IPC sections with modernized provisions.",
    category: "legal",
  },
  {
    id: "9",
    question: "App is running slowly. How to fix?",
    answer:
      "Try: 1) Restart the app, 2) Clear app cache, 3) Ensure you have the latest version, 4) Check internet connectivity, 5) Restart your device if needed.",
    category: "technical",
  },
  {
    id: "10",
    question: "How do I cancel my subscription?",
    answer:
      "Currently, all accounts are demo accounts with full access. In the production version, you'll be able to manage subscriptions through Profile > Subscription Management.",
    category: "account",
  },
];

const USER_GUIDE_SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "rocket",
    color: "#8B5CF6",
    steps: [
      "Download and install YrJr Legal Assistant",
      "Choose your role (Lawyer, Student, etc.)",
      "Complete profile setup and verification",
      "Explore your personalized dashboard",
      "Set up biometric authentication for security",
    ],
  },
  {
    id: "core-features",
    title: "Core Features",
    icon: "star",
    color: "#06B6D4",
    steps: [
      "Smart Search: Find laws, cases, and judgments instantly",
      "AI Assistant: Get legal guidance in your language",
      "Document Scanner: Digitize and extract legal document data",
      "Legal Templates: Generate professional legal documents",
      "Calendar Sync: Never miss a court hearing again",
    ],
  },
  {
    id: "advanced-tools",
    title: "Advanced Tools",
    icon: "cog",
    color: "#10B981",
    steps: [
      "Section Comparator: Compare IPC vs BNS sections",
      "Secure Vault: Store sensitive documents securely",
      "Case Timeline: Track case progress visually",
      "Flashcards: Learn with spaced repetition",
      "Client Folders: Organize cases by client (for lawyers)",
    ],
  },
  {
    id: "tips-tricks",
    title: "Tips & Tricks",
    icon: "bulb",
    color: "#F59E0B",
    steps: [
      "Use voice commands for hands-free search",
      "Pin important updates to Legal Pinboard",
      "Set up notification preferences for case updates",
      "Use offline mode for basic features",
      "Export documents as PDF for sharing",
    ],
  },
];

export default function HelpSupportScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "guide">(
    "faq",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
    category: "support",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeInValue = useSharedValue(0);
  const slideValue = useSharedValue(screenWidth);

  React.useEffect(() => {
    fadeInValue.value = withTiming(1, { duration: 500 });
    slideValue.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const categories = [
    { id: "all", label: "All", icon: "list" },
    { id: "general", label: "General", icon: "help-circle" },
    { id: "account", label: "Account", icon: "person" },
    { id: "features", label: "Features", icon: "star" },
    { id: "legal", label: "Legal", icon: "scales" },
    { id: "technical", label: "Technical", icon: "construct" },
  ];

  const contactCategories = [
    { id: "support", label: "General Support" },
    { id: "bug", label: "Report Bug" },
    { id: "feature", label: "Feature Request" },
    { id: "feedback", label: "Feedback" },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? FAQS
      : FAQS.filter((faq) => faq.category === selectedCategory);

  const handleTabChange = (tab: "faq" | "contact" | "guide") => {
    setActiveTab(tab);
    // Reset animations
    fadeInValue.value = 0;
    slideValue.value = screenWidth;
    fadeInValue.value = withTiming(1, { duration: 300 });
    slideValue.value = withSpring(0, { damping: 15, stiffness: 100 });
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleContactSubmit = async () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill in subject and message fields.",
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    Alert.alert(
      "Message Sent!",
      "Thank you for contacting us. We'll get back to you within 24 hours.",
      [
        {
          text: "OK",
          onPress: () => {
            setContactForm({
              ...contactForm,
              subject: "",
              message: "",
            });
          },
        },
      ],
    );

    setIsSubmitting(false);
  };

  const handleCallSupport = () => {
    Alert.alert("Call Support", "Would you like to call our support team?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call Now", onPress: () => Linking.openURL("tel:+918009999999") },
    ]);
  };

  const handleEmailSupport = () => {
    Linking.openURL(
      "mailto:support@yrjr.app?subject=YrJr Legal Assistant Support",
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeInValue.value,
    transform: [{ translateX: slideValue.value }],
  }));

  const renderFAQs = () => (
    <Animated.View style={[styles.tabContent, animatedStyle]}>
      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
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
                    ? theme.primary
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
                  ? theme.textInverse
                  : theme.textSecondary
              }
            />
            <Text
              style={[
                styles.categoryChipText,
                {
                  color:
                    selectedCategory === category.id
                      ? theme.textInverse
                      : theme.textSecondary,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQ List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} style={styles.faqCard} padding="none">
            <TouchableOpacity
              onPress={() => toggleFAQ(faq.id)}
              style={styles.faqHeader}
            >
              <Text style={[styles.faqQuestion, { color: theme.text }]}>
                {faq.question}
              </Text>
              <Ionicons
                name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>

            {expandedFAQ === faq.id && (
              <View
                style={[styles.faqAnswer, { borderTopColor: theme.border }]}
              >
                <Text
                  style={[styles.faqAnswerText, { color: theme.textSecondary }]}
                >
                  {faq.answer}
                </Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderContact = () => (
    <Animated.View style={[styles.tabContent, animatedStyle]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Contact Options */}
        <View style={styles.quickContactContainer}>
          <TouchableOpacity
            onPress={handleCallSupport}
            style={[
              styles.quickContactCard,
              { backgroundColor: theme.surface },
            ]}
          >
            <View
              style={[
                styles.quickContactIcon,
                { backgroundColor: theme.success + "20" },
              ]}
            >
              <Ionicons name="call" size={24} color={theme.success} />
            </View>
            <Text style={[styles.quickContactTitle, { color: theme.text }]}>
              Call Support
            </Text>
            <Text
              style={[
                styles.quickContactSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              +91 8009999999
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmailSupport}
            style={[
              styles.quickContactCard,
              { backgroundColor: theme.surface },
            ]}
          >
            <View
              style={[
                styles.quickContactIcon,
                { backgroundColor: theme.info + "20" },
              ]}
            >
              <Ionicons name="mail" size={24} color={theme.info} />
            </View>
            <Text style={[styles.quickContactTitle, { color: theme.text }]}>
              Email Support
            </Text>
            <Text
              style={[
                styles.quickContactSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              support@yrjr.app
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Form */}
        <Card style={styles.contactForm} padding="large">
          <Text style={[styles.formTitle, { color: theme.text }]}>
            Send us a Message
          </Text>

          <View style={styles.formField}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categorySelector}
            >
              {contactCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() =>
                    setContactForm({ ...contactForm, category: cat.id as any })
                  }
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor:
                        contactForm.category === cat.id
                          ? theme.primary + "20"
                          : theme.background,
                      borderColor:
                        contactForm.category === cat.id
                          ? theme.primary
                          : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      {
                        color:
                          contactForm.category === cat.id
                            ? theme.primary
                            : theme.textSecondary,
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Subject *
            </Text>
            <TextInput
              value={contactForm.subject}
              onChangeText={(text) =>
                setContactForm({ ...contactForm, subject: text })
              }
              placeholder="Brief description of your inquiry"
              placeholderTextColor={theme.textTertiary}
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          </View>

          <View style={styles.formField}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Message *
            </Text>
            <TextInput
              value={contactForm.message}
              onChangeText={(text) =>
                setContactForm({ ...contactForm, message: text })
              }
              placeholder="Describe your issue or question in detail..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.textInput,
                styles.textArea,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          </View>

          <Button
            title={isSubmitting ? "Sending..." : "Send Message"}
            onPress={handleContactSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
            gradient
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </Animated.View>
  );

  const renderGuide = () => (
    <Animated.View style={[styles.tabContent, animatedStyle]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {USER_GUIDE_SECTIONS.map((section, index) => (
          <Card key={section.id} style={styles.guideCard} padding="large">
            <View style={styles.guideHeader}>
              <View
                style={[
                  styles.guideIcon,
                  { backgroundColor: section.color + "20" },
                ]}
              >
                <Ionicons
                  name={section.icon as any}
                  size={24}
                  color={section.color}
                />
              </View>
              <Text style={[styles.guideTitle, { color: theme.text }]}>
                {section.title}
              </Text>
            </View>

            <View style={styles.guideSteps}>
              {section.steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.guideStep}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: section.color },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumberText,
                        { color: theme.textInverse },
                      ]}
                    >
                      {stepIndex + 1}
                    </Text>
                  </View>
                  <Text
                    style={[styles.stepText, { color: theme.textSecondary }]}
                  >
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        ))}

        {/* Additional Resources */}
        <Card style={styles.resourcesCard} padding="large">
          <Text style={[styles.resourcesTitle, { color: theme.text }]}>
            Additional Resources
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://yrjr.app/docs")}
            style={[styles.resourceItem, { borderBottomColor: theme.border }]}
          >
            <Ionicons name="document-text" size={20} color={theme.primary} />
            <Text style={[styles.resourceText, { color: theme.text }]}>
              Complete Documentation
            </Text>
            <Ionicons name="open" size={16} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://yrjr.app/tutorials")}
            style={[styles.resourceItem, { borderBottomColor: theme.border }]}
          >
            <Ionicons name="play-circle" size={20} color={theme.primary} />
            <Text style={[styles.resourceText, { color: theme.text }]}>
              Video Tutorials
            </Text>
            <Ionicons name="open" size={16} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://yrjr.app/community")}
            style={styles.resourceItem}
          >
            <Ionicons name="people" size={20} color={theme.primary} />
            <Text style={[styles.resourceText, { color: theme.text }]}>
              Community Forum
            </Text>
            <Ionicons name="open" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </Animated.View>
  );

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
          Help & Support
        </Text>

        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View
        style={[
          styles.tabNavigation,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleTabChange("faq")}
          style={[
            styles.tabButton,
            activeTab === "faq" && {
              borderBottomColor: theme.primary,
              borderBottomWidth: 2,
            },
          ]}
        >
          <Ionicons
            name="help-circle"
            size={20}
            color={activeTab === "faq" ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabButtonText,
              {
                color:
                  activeTab === "faq" ? theme.primary : theme.textSecondary,
              },
            ]}
          >
            FAQs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange("contact")}
          style={[
            styles.tabButton,
            activeTab === "contact" && {
              borderBottomColor: theme.primary,
              borderBottomWidth: 2,
            },
          ]}
        >
          <Ionicons
            name="mail"
            size={20}
            color={
              activeTab === "contact" ? theme.primary : theme.textSecondary
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              {
                color:
                  activeTab === "contact" ? theme.primary : theme.textSecondary,
              },
            ]}
          >
            Contact
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange("guide")}
          style={[
            styles.tabButton,
            activeTab === "guide" && {
              borderBottomColor: theme.primary,
              borderBottomWidth: 2,
            },
          ]}
        >
          <Ionicons
            name="book"
            size={20}
            color={activeTab === "guide" ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabButtonText,
              {
                color:
                  activeTab === "guide" ? theme.primary : theme.textSecondary,
              },
            ]}
          >
            Guide
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === "faq" && renderFAQs()}
        {activeTab === "contact" && renderContact()}
        {activeTab === "guide" && renderGuide()}
      </View>
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
  tabNavigation: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  tabButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  categoriesContainer: {
    marginVertical: Spacing.md,
  },
  categoriesContent: {
    paddingRight: Spacing.lg,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  categoryChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  faqCard: {
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.sm,
  },
  faqAnswer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
  },
  faqAnswerText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
  quickContactContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  quickContactCard: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  quickContactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  quickContactTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  quickContactSubtitle: {
    fontSize: FontSizes.xs,
    textAlign: "center",
  },
  contactForm: {
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.lg,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  categorySelector: {
    marginTop: Spacing.xs,
  },
  categoryOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    minHeight: 48,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  guideCard: {
    marginBottom: Spacing.lg,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  guideIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  guideTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  guideSteps: {
    gap: Spacing.md,
  },
  guideStep: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  stepText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  resourcesCard: {
    marginBottom: Spacing.xl,
  },
  resourcesTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.lg,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  resourceText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
});
