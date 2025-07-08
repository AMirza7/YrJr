import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from "react-native";
import PremiumModal from "@/components/ui/PremiumModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "suggestion" | "document";
  attachedDocuments?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export interface ScannedDocument {
  id: string;
  name: string;
  type: string;
  extractedFields: Record<string, any>;
  fullText: string;
  timestamp: Date;
}

interface LegalChatAssistantProps {
  scannedDocuments: ScannedDocument[];
  onDocumentSelect: (documentId: string) => void;
  onChatOutputAttach: (message: ChatMessage, documentId?: string) => void;
}

export default function LegalChatAssistant({
  scannedDocuments,
  onDocumentSelect,
  onChatOutputAttach,
}: LegalChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content:
        "👋 Hello! I'm your Legal AI Assistant. I can help you analyze documents, draft legal content, research laws, and answer legal questions. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickSuggestions = [
    "Analyze this document for key legal points",
    "Draft a legal notice",
    "Explain IPC vs BNS differences",
    "Help with case timeline",
    "Review contract terms",
    "Legal research on property law",
    "Draft a petition format",
    "Bail application guidance",
  ];

  const sendMessage = async (text: string, attachedDocs?: string[]) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: text.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
      attachedDocuments: attachedDocs?.map((docId) => {
        const doc = scannedDocuments.find((d) => d.id === docId);
        return doc
          ? { id: doc.id, name: doc.name, type: doc.type }
          : { id: docId, name: "Unknown", type: "unknown" };
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(text, attachedDocs);
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      1000 + Math.random() * 2000,
    );
  };

  const generateAIResponse = (
    query: string,
    attachedDocs?: string[],
  ): string => {
    const lowerQuery = query.toLowerCase();

    if (attachedDocs && attachedDocs.length > 0) {
      const docNames = attachedDocs
        .map((docId) => {
          const doc = scannedDocuments.find((d) => d.id === docId);
          return doc?.name || "document";
        })
        .join(", ");

      if (lowerQuery.includes("analyze") || lowerQuery.includes("review")) {
        return `📋 I've analyzed ${docNames}. Here are the key legal points:\n\n✅ **Strengths:**\n• All required signatures present\n• Legal format compliance verified\n• Proper jurisdiction mentioned\n\n⚠️ **Areas to review:**\n• Consider adding witness statements\n• Verify all dates and amounts\n• Check for any missing clauses\n\n💡 **Recommendations:**\nThe document appears legally sound but could benefit from additional supporting evidence. Would you like me to suggest specific improvements?`;
      }

      return `📄 I've reviewed ${docNames}. The document contains important legal information. Based on my analysis, this appears to be a ${doc?.type || "legal document"} with key details that need attention. Would you like me to extract specific information or provide legal guidance on this matter?`;
    }

    if (lowerQuery.includes("draft") && lowerQuery.includes("notice")) {
      return `📝 **Legal Notice Draft Template:**\n\n**TO: [Recipient Name]**\n**FROM: [Your Name]**\n**DATE: ${new Date().toLocaleDateString()}**\n\n**LEGAL NOTICE**\n\nThis is to bring to your notice that [state the issue/grievance]. You are hereby called upon to [specific action required] within 15 days from receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you.\n\n**Key Elements Included:**\n✅ Proper legal format\n✅ Clear demand statement\n✅ Reasonable timeline\n✅ Consequence clause\n\nWould you like me to customize this template for your specific case?`;
    }

    if (lowerQuery.includes("ipc") || lowerQuery.includes("bns")) {
      return `⚖️ **IPC vs BNS Key Differences:**\n\n**Indian Penal Code (IPC) - 1860:**\n• Colonial-era criminal law\n• 511 sections\n• Traditional legal language\n\n**Bharatiya Nyaya Sanhita (BNS) - 2023:**\n• Modern Indian criminal law\n• 356 sections\n• Updated for digital age crimes\n• Includes cybercrime provisions\n• Gender-neutral language\n\n**Major Changes:**\n🔄 Section numbering completely revised\n💻 New provisions for online crimes\n👥 Enhanced victim protection\n⚡ Streamlined procedures\n\nWhich specific provision would you like me to explain in detail?`;
    }

    if (lowerQuery.includes("bail")) {
      return `🏛️ **Bail Application Guidance:**\n\n**Essential Components:**\n✅ Court jurisdiction details\n✅ Case details (FIR number, sections)\n✅ Personal details of accused\n✅ Grounds for bail\n✅ Surety arrangements\n\n**Strong Bail Grounds:**\n• No flight risk\n• Willing to cooperate\n• First-time offender\n• Medical conditions\n• Family responsibilities\n• Weak prosecution case\n\n**Required Documents:**\n📄 Identity proof\n📄 Address proof\n📄 Income certificate\n📄 Character certificates\n\nWould you like me to help draft a specific bail application for your case?`;
    }

    if (lowerQuery.includes("contract") || lowerQuery.includes("agreement")) {
      return `📋 **Contract Review Checklist:**\n\n**Essential Clauses to Verify:**\n✅ Parties identification\n✅ Scope of work/services\n✅ Payment terms & schedule\n✅ Timeline & milestones\n✅ Termination conditions\n✅ Dispute resolution\n✅ Force majeure\n✅ Governing law\n\n**Red Flags to Watch:**\n🚩 Unclear obligations\n🚩 Unrealistic timelines\n🚩 Hidden costs\n🚩 One-sided termination rights\n🚩 Excessive penalties\n\n**Recommendations:**\n💡 Add performance guarantees\n💡 Include IP ownership clauses\n💡 Specify confidentiality terms\n\nShare your contract for detailed analysis!`;
    }

    const responses = [
      `🤖 I understand you're asking about "${query}". Let me provide you with relevant legal guidance.\n\nFor this type of legal matter, I recommend:\n\n✅ **Immediate Actions:**\n• Document all relevant information\n• Gather supporting evidence\n• Consult applicable laws\n\n✅ **Next Steps:**\n• Consider legal options available\n• Evaluate potential outcomes\n• Plan strategic approach\n\nWould you like me to elaborate on any specific aspect or help with document drafting?`,

      `📚 Based on your query about "${query}", here's what you should know:\n\n**Legal Framework:**\nThis matter typically falls under relevant sections of applicable laws. The approach depends on specific circumstances and jurisdiction.\n\n**Key Considerations:**\n• Statute of limitations\n• Burden of proof requirements\n• Available remedies\n• Procedural requirements\n\n**Recommended Action Plan:**\n1. Gather all relevant documents\n2. Identify applicable legal provisions\n3. Assess strengths and weaknesses\n4. Consider alternative dispute resolution\n\nNeed help with any specific legal document or procedure?`,

      `⚖️ For your question regarding "${query}", let me provide comprehensive guidance:\n\n**Legal Analysis:**\nThis type of matter requires careful consideration of multiple factors including applicable laws, precedents, and specific circumstances.\n\n**Strategic Approach:**\n🎯 **Preparation Phase:**\n• Legal research and case law review\n• Document collection and organization\n• Stakeholder identification\n\n🎯 **Execution Phase:**\n• Formal legal proceedings if required\n• Negotiation and settlement options\n• Timeline and cost considerations\n\nWhat specific aspect would you like me to focus on for your case?`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setShowSuggestionsModal(false);
    sendMessage(suggestion, selectedDocument ? [selectedDocument] : undefined);
  };

  const handleDocumentSelection = (docId: string) => {
    setSelectedDocument(selectedDocument === docId ? null : docId);
    setShowDocumentsModal(false);
    onDocumentSelect(docId);
  };

  const clearDocumentSelection = () => {
    setSelectedDocument(null);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user"
            ? styles.userMessageText
            : styles.aiMessageText,
        ]}
      >
        {item.content}
      </Text>

      {item.attachedDocuments && item.attachedDocuments.length > 0 && (
        <View style={styles.attachedDocuments}>
          <Text style={styles.attachedDocumentText}>
            📎 {item.attachedDocuments.map((doc) => doc.name).join(", ")}
          </Text>
        </View>
      )}

      <Text
        style={[
          styles.messageTime,
          item.sender === "user"
            ? styles.userMessageTime
            : styles.aiMessageTime,
        ]}
      >
        {item.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      {item.sender === "ai" && (
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() =>
            onChatOutputAttach(item, selectedDocument || undefined)
          }
        >
          <Text style={styles.attachButtonText}>📎 Attach Output</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDocumentCard = ({ item }: { item: ScannedDocument }) => (
    <TouchableOpacity
      style={[
        styles.documentCard,
        selectedDocument === item.id && styles.selectedDocumentCard,
      ]}
      onPress={() => handleDocumentSelection(item.id)}
    >
      <Text style={styles.documentIcon}>
        {item.type === "FIR"
          ? "🚨"
          : item.type === "Sale Deed"
            ? "🏠"
            : item.type === "Affidavit"
              ? "📜"
              : "📄"}
      </Text>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.documentType}>{item.type}</Text>
        <Text style={styles.documentDate}>
          {item.timestamp.toLocaleDateString()}
        </Text>
      </View>
      {selectedDocument === item.id && (
        <Text style={styles.selectedIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.chatTitle}>🤖 Legal AI Assistant</Text>
          {selectedDocument && (
            <Text style={styles.selectedDocumentHeader}>
              📎 {scannedDocuments.find((d) => d.id === selectedDocument)?.name}
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowDocumentsModal(true)}
          >
            <Text style={styles.headerButtonText}>📄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSuggestionsModal(true)}
          >
            <Text style={styles.headerButtonText}>💡</Text>
          </TouchableOpacity>
          {selectedDocument && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearDocumentSelection}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={scrollViewRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <Text style={styles.typingIndicator}>🤖 AI is typing...</Text>
            </View>
          ) : null
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything about law..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          textAlignVertical="top"
          returnKeyType="send"
          onSubmitEditing={() =>
            sendMessage(
              inputText,
              selectedDocument ? [selectedDocument] : undefined,
            )
          }
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={() =>
            sendMessage(
              inputText,
              selectedDocument ? [selectedDocument] : undefined,
            )
          }
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Documents Modal */}
      <Modal
        visible={showDocumentsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDocumentsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📄 Select Document</Text>
              <TouchableOpacity
                onPress={() => setShowDocumentsModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {scannedDocuments.length > 0 ? (
              <FlatList
                data={scannedDocuments}
                renderItem={renderDocumentCard}
                keyExtractor={(item) => item.id}
                style={styles.documentsList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyDocuments}>
                <Text style={styles.emptyDocumentsIcon}>📄</Text>
                <Text style={styles.emptyDocumentsText}>No Documents</Text>
                <Text style={styles.emptyDocumentsSubtext}>
                  Scan documents using the Scanner tab to analyze them with AI
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Quick Suggestions Modal */}
      <Modal
        visible={showSuggestionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSuggestionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💡 Quick Suggestions</Text>
              <TouchableOpacity
                onPress={() => setShowSuggestionsModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.suggestionsList}
              showsVerticalScrollIndicator={false}
            >
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleQuickSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Text style={styles.suggestionArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    backgroundColor: "#8b5cf6",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  headerLeft: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  selectedDocumentHeader: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    maxWidth: screenWidth * 0.85,
  },
  userMessage: {
    backgroundColor: "#3b82f6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#1e293b",
  },
  attachedDocuments: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
  },
  attachedDocumentText: {
    fontSize: 12,
    color: "#fff",
    fontStyle: "italic",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 8,
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  aiMessageTime: {
    color: "#64748b",
  },
  attachButton: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  attachButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  typingIndicator: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "flex-end",
    minHeight: 70,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 120,
    fontSize: 15,
    backgroundColor: "#f8fafc",
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  sendButtonText: {
    fontSize: 18,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#666",
  },
  documentsList: {
    flex: 1,
    padding: 16,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  selectedDocumentCard: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 16,
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
  documentType: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: "#64748b",
  },
  selectedIndicator: {
    fontSize: 20,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  emptyDocuments: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyDocumentsIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyDocumentsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptyDocumentsSubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  suggestionsList: {
    flex: 1,
    padding: 16,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  suggestionText: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
    flex: 1,
  },
  suggestionArrow: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
});
