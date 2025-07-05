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
} from "react-native";

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
        "Hello! I'm your Legal AI Assistant. I can help you understand scanned documents, explain legal sections, and suggest appropriate legal actions. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedDocument, setSelectedDocument] =
    useState<ScannedDocument | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickSuggestions = [
    "Which petition should I file?",
    "Explain Section 420 IPC",
    "Prepare a criminal complaint",
    "Analyze this FIR document",
    "What are my legal options?",
    "Draft a bail application",
  ];

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const generateAIResponse = async (
    userMessage: string,
    document?: ScannedDocument,
  ): Promise<string> => {
    // Simulate AI processing
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTyping(false);

    const message = userMessage.toLowerCase();

    if (message.includes("section 420")) {
      return "Section 420 of the Indian Penal Code deals with 'Cheating and dishonestly inducing delivery of property.' It carries a punishment of imprisonment up to 7 years and fine. Key elements include:\n\n1. Dishonest intention\n2. Deception of victim\n3. Inducing victim to deliver property\n4. Actual delivery of property\n\nWould you like me to help draft a complaint under this section?";
    }

    if (
      message.includes("which petition") ||
      message.includes("what should i file")
    ) {
      if (document) {
        if (document.type === "fir") {
          return "Based on your FIR document, I recommend filing a **Bail Application** under Section 437/438 CrPC. The document shows charges under IPC sections that are bailable. Key steps:\n\n1. File bail application in appropriate court\n2. Prepare supporting affidavits\n3. Arrange for surety\n4. Submit within 15 days of arrest\n\nWould you like me to draft the bail application for you?";
        }
        if (document.type === "sale_deed") {
          return "Based on your Sale Deed, common legal actions include:\n\n1. **Specific Performance Suit** - if buyer defaults\n2. **Cancellation of Sale Deed** - for fraud/misrepresentation\n3. **Partition Suit** - for joint property disputes\n4. **Possession Suit** - for recovery of property\n\nWhich situation applies to your case?";
        }
      }
      return "To suggest the right petition, I need more context. Could you please:\n\n1. Share details about your legal issue\n2. Attach relevant scanned documents\n3. Specify the nature of dispute (criminal/civil/family)\n\nThis will help me provide accurate legal guidance.";
    }

    if (message.includes("criminal complaint")) {
      return "To prepare a criminal complaint, I need the following information:\n\n**Essential Details:**\n1. Complainant details (Name, Address, Occupation)\n2. Accused details\n3. Facts and circumstances\n4. Applicable IPC sections\n5. Relief sought\n\n**Required Documents:**\n- Identity proof\n- Address proof\n- Supporting evidence\n- Witness statements\n\nWould you like me to create a template complaint form?";
    }

    if (message.includes("analyze") && document) {
      const analysis = `**Document Analysis:**\n\n**Type:** ${document.type.toUpperCase()}\n**Date:** ${document.timestamp.toLocaleDateString()}\n\n**Key Findings:**\n`;

      if (document.extractedFields) {
        let details = "";
        Object.entries(document.extractedFields).forEach(([key, value]) => {
          if (value) {
            details += `• ${key}: ${value}\n`;
          }
        });
        return (
          analysis +
          details +
          "\n**Legal Implications:**\nBased on this document, you may need to consider filing appropriate legal proceedings. Would you like specific recommendations?"
        );
      }

      return (
        analysis +
        "Document uploaded successfully. Please specify what aspect you'd like me to analyze."
      );
    }

    // Default response
    return "I understand you're seeking legal assistance. Could you please provide more specific details about your legal issue? You can also:\n\n• Ask about specific IPC/CrPC sections\n• Upload documents for analysis\n• Request petition drafting help\n• Seek procedural guidance\n\nHow can I help you today?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      ...(selectedDocument && {
        attachedDocuments: [
          {
            id: selectedDocument.id,
            name: selectedDocument.name,
            type: selectedDocument.type,
          },
        ],
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const aiResponse = await generateAIResponse(
      inputText,
      selectedDocument || undefined,
    );

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleDocumentSelect = (document: ScannedDocument) => {
    setSelectedDocument(document);
    onDocumentSelect(document.id);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        message.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          message.sender === "user"
            ? styles.userMessageText
            : styles.aiMessageText,
        ]}
      >
        {message.content}
      </Text>

      {message.attachedDocuments && (
        <View style={styles.attachedDocuments}>
          {message.attachedDocuments.map((doc) => (
            <Text key={doc.id} style={styles.attachedDocumentText}>
              📎 {doc.name}
            </Text>
          ))}
        </View>
      )}

      <Text
        style={[
          styles.messageTime,
          message.sender === "user"
            ? styles.userMessageTime
            : styles.aiMessageTime,
        ]}
      >
        {formatTimestamp(message.timestamp)}
      </Text>

      {message.sender === "ai" && (
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => onChatOutputAttach(message, selectedDocument?.id)}
        >
          <Text style={styles.attachButtonText}>📎 Attach to Document</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const DocumentCard = ({ document }: { document: ScannedDocument }) => (
    <TouchableOpacity
      style={[
        styles.documentCard,
        selectedDocument?.id === document.id && styles.selectedDocumentCard,
      ]}
      onPress={() => handleDocumentSelect(document)}
    >
      <Text style={styles.documentIcon}>📄</Text>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{document.name}</Text>
        <Text style={styles.documentType}>{document.type.toUpperCase()}</Text>
        <Text style={styles.documentDate}>
          {document.timestamp.toLocaleDateString()}
        </Text>
      </View>
      {selectedDocument?.id === document.id && (
        <Text style={styles.selectedIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Chat Panel */}
      <View style={styles.chatPanel}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>🤖 Legal AI Assistant</Text>
          {selectedDocument && (
            <TouchableOpacity
              style={styles.clearSelectionButton}
              onPress={() => setSelectedDocument(null)}
            >
              <Text style={styles.clearSelectionText}>Clear Selection</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <Text style={styles.typingIndicator}>AI is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickSuggestions}
        >
          {quickSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleQuickSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything about your legal documents..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>

      {/* Documents Panel */}
      <View style={styles.documentsPanel}>
        <Text style={styles.documentsPanelTitle}>
          📂 Your Scanned Documents
        </Text>

        {scannedDocuments.length === 0 ? (
          <View style={styles.emptyDocuments}>
            <Text style={styles.emptyDocumentsIcon}>📄</Text>
            <Text style={styles.emptyDocumentsText}>No documents yet</Text>
            <Text style={styles.emptyDocumentsSubtext}>
              Scan documents to get AI assistance
            </Text>
          </View>
        ) : (
          <FlatList
            data={scannedDocuments}
            renderItem={({ item }) => <DocumentCard document={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        {selectedDocument && (
          <View style={styles.selectedDocumentDetails}>
            <Text style={styles.selectedDocumentTitle}>
              Selected Document Fields:
            </Text>
            <ScrollView style={styles.fieldsContainer}>
              {Object.entries(selectedDocument.extractedFields || {}).map(
                ([key, value]) => (
                  <View key={key} style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>{key}:</Text>
                    <Text style={styles.fieldValue}>
                      {value || "Not detected"}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  chatPanel: {
    flex: 2,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#8b5cf6",
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  clearSelectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
  },
  clearSelectionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#3b82f6",
    alignSelf: "flex-end",
  },
  aiMessage: {
    backgroundColor: "#f1f5f9",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#1e293b",
  },
  attachedDocuments: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
  },
  attachedDocumentText: {
    fontSize: 12,
    color: "#fff",
    fontStyle: "italic",
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  aiMessageTime: {
    color: "#64748b",
  },
  attachButton: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  attachButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  typingIndicator: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
  quickSuggestions: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionButton: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  suggestionText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  documentsPanel: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  documentsPanelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  emptyDocuments: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDocumentsIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.3,
  },
  emptyDocumentsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  emptyDocumentsSubtext: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedDocumentCard: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  documentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  documentType: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 10,
    color: "#94a3b8",
  },
  selectedIndicator: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  selectedDocumentDetails: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedDocumentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  fieldsContainer: {
    maxHeight: 200,
  },
  fieldRow: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 12,
    color: "#1e293b",
  },
});
