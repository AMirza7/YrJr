import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useModal } from "@/contexts/ModalContext";
import VerifyIdentity from "@/components/verification/VerifyIdentity";
import AdvancedFlashcards from "@/components/learning/AdvancedFlashcards";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import ProfessionalProfile from "@/components/profiles/ProfessionalProfile";
import EnhancedDataExport from "@/components/admin/EnhancedDataExport";

export default function TestComponents() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const { showSuccess, showError, showConfirm, showAlert } = useModal();

  // Mock flashcard data
  const mockFlashcards = [
    {
      id: "1",
      question: "What is the punishment for murder under IPC Section 302?",
      answer: "Death penalty or life imprisonment under Section 302 of IPC",
      category: "Criminal Law",
      difficulty: "medium" as const,
      tags: ["IPC", "murder"],
      mastery: 65,
    },
    {
      id: "2",
      question: "Define consideration in contract law",
      answer: "Something of value given in exchange for a promise",
      category: "Contract Law",
      difficulty: "easy" as const,
      tags: ["contract", "consideration"],
      mastery: 85,
    },
  ];

  const testButtons = [
    {
      title: "🔐 Test Identity Verification",
      description: "Multi-step verification for professionals",
      onPress: () => setActiveComponent("verify"),
    },
    {
      title: "🧠 Test Advanced Flashcards",
      description: "Gaming-enhanced learning system",
      onPress: () => setActiveComponent("flashcards"),
    },
    {
      title: "💬 Test Messaging System",
      description: "Professional communication platform",
      onPress: () => setActiveComponent("messaging"),
    },
    {
      title: "👨‍⚖️ Test Professional Profile",
      description: "Enhanced profile pages",
      onPress: () => setActiveComponent("profile"),
    },
    {
      title: "📊 Test Admin Export",
      description: "Advanced data export system",
      onPress: () => setShowExportModal(true),
    },
    {
      title: "✅ Test Success Modal",
      description: "Premium success modal",
      onPress: () => showSuccess("This is a success message!"),
    },
    {
      title: "❌ Test Error Modal",
      description: "Premium error modal",
      onPress: () => showError("This is an error message!"),
    },
    {
      title: "⚠️ Test Confirm Modal",
      description: "Premium confirmation modal",
      onPress: () =>
        showConfirm(
          "Delete Item",
          "Are you sure you want to delete this item?",
          () => showSuccess("Item deleted!"),
          "destructive",
        ),
    },
  ];

  const handleClose = () => {
    setActiveComponent(null);
  };

  const handleVerificationComplete = (data: any) => {
    showSuccess("Verification completed successfully!");
    setActiveComponent(null);
  };

  const handleExport = (config: any) => {
    showSuccess("Export started successfully!");
  };

  if (activeComponent) {
    switch (activeComponent) {
      case "verify":
        return (
          <VerifyIdentity
            userType="lawyer"
            onVerificationComplete={handleVerificationComplete}
            onClose={handleClose}
          />
        );
      case "flashcards":
        return (
          <AdvancedFlashcards cards={mockFlashcards} onClose={handleClose} />
        );
      case "messaging":
        return (
          <MessagingSystem currentUserId="user123" onClose={handleClose} />
        );
      case "profile":
        return (
          <ProfessionalProfile
            professionalId="prof123"
            onClose={handleClose}
            onHire={(id) => showSuccess(`Hired professional ${id}!`)}
            onMessage={(id) => showSuccess(`Messaging ${id}!`)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Component Tests</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🧪 Component Testing</Text>
        <Text style={styles.subtitle}>
          Test all the newly implemented components and features
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 New Components</Text>
          {testButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.testButton}
              onPress={button.onPress}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonTitle}>{button.title}</Text>
                <Text style={styles.buttonDescription}>
                  {button.description}
                </Text>
              </View>
              <Text style={styles.buttonArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Implementation Status</Text>

          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>✅</Text>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Case Folders Route Fixed</Text>
              <Text style={styles.statusDescription}>
                Route moved to tabs directory
              </Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>✅</Text>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Native Modals Replaced</Text>
              <Text style={styles.statusDescription}>
                All Alert.alert replaced with custom modals
              </Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>✅</Text>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Theme System Fixed</Text>
              <Text style={styles.statusDescription}>
                Proper theme switching implemented
              </Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>✅</Text>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>
                Advanced Components Created
              </Text>
              <Text style={styles.statusDescription}>
                5 new premium components added
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <EnhancedDataExport
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </SafeAreaView>
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  buttonArrow: {
    fontSize: 20,
    color: "#8b5cf6",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
});
