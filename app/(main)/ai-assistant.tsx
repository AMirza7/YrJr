import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { VoiceAssistantService } from "@/services/voiceAssistant";
import {
  LegalTheme,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: "text" | "suggestion" | "legal_info" | "case_reference";
  metadata?: {
    sections?: string[];
    caseNumbers?: string[];
    suggestions?: string[];
  };
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  prompt: string;
}

export default function AIAssistantScreen() {
  const colorScheme = useColorScheme();
  const theme = LegalTheme[colorScheme ?? "light"];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const micScale = useSharedValue(1);
  const typingOpacity = useSharedValue(0);

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "File FIR",
      icon: "shield",
      color: theme.error,
      prompt: "How do I file an FIR? What documents are needed?",
    },
    {
      id: "2",
      title: "Bail Process",
      icon: "key",
      color: theme.warning,
      prompt: "What is the process for applying for bail?",
    },
    {
      id: "3",
      title: "Legal Notices",
      icon: "mail",
      color: theme.info,
      prompt: "How to send a legal notice? What are the requirements?",
    },
    {
      id: "4",
      title: "IPC Sections",
      icon: "library",
      color: theme.secondary,
      prompt: "Explain IPC Section 420 - cheating and dishonestly",
    },
    {
      id: "5",
      title: "Consumer Rights",
      icon: "shield-checkmark",
      color: theme.success,
      prompt:
        "What are my rights as a consumer under the Consumer Protection Act?",
    },
    {
      id: "6",
      title: "Property Law",
      icon: "home",
      color: theme.accent,
      prompt: "What are the legal requirements for property transfer?",
    },
  ];

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (isTyping) {
      typingOpacity.value = withTiming(1, { duration: 300 });
    } else {
      typingOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isTyping]);

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: "1",
      content:
        "Hello! I'm your AI Legal Assistant. I can help you with legal questions, explain laws, guide you through procedures, and provide general legal information. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      type: "text",
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: text.trim(),
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse = await generateAIResponse(text.trim());

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (
    userInput: string,
  ): Promise<ChatMessage> => {
    const input = userInput.toLowerCase();

    // Legal knowledge base responses
    if (input.includes("fir") || input.includes("first information report")) {
      return {
        id: Date.now().toString(),
        content: `To file an FIR (First Information Report), follow these steps:

1. **Visit the nearest police station** in the jurisdiction where the crime occurred
2. **Provide details** including:
   - Date, time, and place of incident
   - Names of accused (if known)
   - Detailed description of the incident
   - Any witnesses present

3. **Required documents**:
   - Identity proof
   - Address proof
   - Any evidence related to the crime

4. **Important points**:
   - FIR should be filed immediately after the incident
   - You have the right to get a copy of the FIR
   - If police refuse to register FIR, you can approach the Superintendent of Police

Would you like me to help you draft an FIR or explain any specific aspect?`,
        isUser: false,
        timestamp: new Date(),
        type: "legal_info",
        metadata: {
          suggestions: [
            "Draft FIR template",
            "Police station locator",
            "Legal rights during FIR",
          ],
        },
      };
    }

    if (input.includes("bail")) {
      return {
        id: Date.now().toString(),
        content: `Bail application process in India:

**Types of Bail:**
1. **Regular Bail** - Applied when person is in custody
2. **Anticipatory Bail** - Applied before arrest
3. **Interim Bail** - Temporary relief

**Documents Required:**
- Bail application
- Case details and FIR copy
- Character certificate
- Surety documents
- Property documents (if required)

**Process:**
1. File bail application in appropriate court
2. Court examines the case details
3. Hearing is conducted
4. If granted, complete formalities with surety

**Factors considered:**
- Nature of offense
- Previous criminal record
- Flight risk
- Evidence tampering possibility

Need help with a specific type of bail application?`,
        isUser: false,
        timestamp: new Date(),
        type: "legal_info",
        metadata: {
          suggestions: [
            "Bail application format",
            "Surety requirements",
            "Bail conditions",
          ],
        },
      };
    }

    if (input.includes("420") || input.includes("cheating")) {
      return {
        id: Date.now().toString(),
        content: `**IPC Section 420 - Cheating and Dishonestly**

**Definition:** Whoever cheats and thereby dishonestly induces the person deceived to deliver any property or to make, alter or destroy the whole or any part of a valuable security shall be punished.

**Punishment:** Imprisonment up to 7 years and fine

**Essential Elements:**
1. Cheating (as defined in Section 415)
2. Dishonest inducement
3. Delivery of property or valuable security

**Examples:**
- Fake investment schemes
- Forged documents for property
- Credit card fraud
- Online scams

**Note:** Under the new Bharatiya Nyaya Sanhita (BNS), this is covered under Section 316.

Do you need information about filing a complaint or understanding a specific case?`,
        isUser: false,
        timestamp: new Date(),
        type: "legal_info",
        metadata: {
          sections: ["IPC 420", "BNS 316"],
          suggestions: [
            "How to file complaint",
            "Related sections",
            "Recent judgments",
          ],
        },
      };
    }

    if (input.includes("consumer") || input.includes("consumer protection")) {
      return {
        id: Date.now().toString(),
        content: `**Consumer Rights under Consumer Protection Act 2019:**

**Fundamental Rights:**
1. **Right to Safety** - Protection against hazardous goods
2. **Right to Information** - Complete product/service information
3. **Right to Choose** - Access to variety of goods at competitive prices
4. **Right to be Heard** - Voice complaints and get them addressed
5. **Right to Redressal** - Fair settlement of genuine grievances
6. **Right to Consumer Education** - Knowledge about consumer rights

**How to File Complaint:**
- District Consumer Commission (up to ₹1 crore)
- State Consumer Commission (₹1 crore to ₹10 crore)  
- National Consumer Commission (above ₹10 crore)

**Required Documents:**
- Proof of purchase
- Deficiency details
- Communication with seller/service provider
- Supporting evidence

Would you like help drafting a consumer complaint?`,
        isUser: false,
        timestamp: new Date(),
        type: "legal_info",
        metadata: {
          suggestions: [
            "File consumer complaint",
            "Consumer forum locator",
            "Complaint format",
          ],
        },
      };
    }

    if (input.includes("property") || input.includes("transfer")) {
      return {
        id: Date.now().toString(),
        content: `**Property Transfer Legal Requirements:**

**For Sale Deed:**
1. **Title Verification** - Check clear title
2. **Registration** - Mandatory registration at Sub-Registrar office
3. **Stamp Duty** - Varies by state (3-10% of property value)
4. **Registration Fee** - Usually 1% of property value

**Required Documents:**
- Sale deed (executed on stamp paper)
- Title documents
- Property tax receipts
- NOC from society/local authority
- Identity and address proof
- PAN cards of both parties

**Due Diligence:**
- Verify ownership chain
- Check for encumbrances
- Confirm approvals and permissions
- Verify property tax status

**Important:** Always involve a qualified lawyer for property transactions.

Need specific guidance for your property transaction?`,
        isUser: false,
        timestamp: new Date(),
        type: "legal_info",
        metadata: {
          suggestions: [
            "Property verification checklist",
            "Registration process",
            "Required documents",
          ],
        },
      };
    }

    if (input.includes("legal notice")) {
      return {
        id: Date.now().toString(),
        content: `**Legal Notice - Purpose and Process:**

**When to Send:**
- Breach of contract
- Recovery of money
- Property disputes
- Employment issues
- Before filing a suit (mandatory in some cases)

**Essential Components:**
1. **Header** - "Legal Notice"
2. **Parties** - Sender and recipient details
3. **Facts** - Clear statement of facts
4. **Cause of Action** - Legal basis for notice
5. **Demand** - Specific relief sought
6. **Time Limit** - Usually 15-30 days
7. **Consequences** - Action if demand not met

**Legal Requirements:**
- Must be in writing
- Should be sent by registered post
- Keep acknowledgment receipt
- Can be sent by lawyer or party themselves

**Sample Format:**
1. Sender's details
2. Recipient's details  
3. Subject of notice
4. Statement of facts
5. Legal demand
6. Time for compliance
7. Consequences of non-compliance

Would you like a legal notice template for your specific situation?`,
        isUser: false,
        timestamp: new Date(),
        type: "legal_info",
        metadata: {
          suggestions: [
            "Legal notice template",
            "Sample formats",
            "Lawyer consultation",
          ],
        },
      };
    }

    // General AI response for other queries
    return {
      id: Date.now().toString(),
      content: `I understand you're asking about "${userInput}". While I can provide general legal information, for specific legal advice, I recommend consulting with a qualified lawyer.

Here are some ways I can help:
• Explain legal procedures and processes
• Provide information about laws and sections
• Guide you through document preparation
• Suggest next steps for common legal issues

Could you please provide more details about your specific legal question? I'll do my best to provide relevant information and guidance.`,
      isUser: false,
      timestamp: new Date(),
      type: "text",
      metadata: {
        suggestions: [
          "Find a lawyer",
          "Legal procedures",
          "Document templates",
        ],
      },
    };
  };

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      micScale.value = withSequence(
        withSpring(1.2),
        withSpring(1),
        withSpring(1.2),
        withSpring(1),
      );

      const isInitialized = await VoiceAssistantService.initialize();
      if (!isInitialized) {
        Alert.alert("Voice Error", "Unable to initialize voice recognition");
        return;
      }

      const success = await VoiceAssistantService.startListening();
      if (!success) {
        Alert.alert("Voice Error", "Unable to start voice recognition");
      }
    } catch (error) {
      console.error("Voice input error:", error);
      Alert.alert("Voice Error", "Voice recognition is not available");
    } finally {
      setIsListening(false);
      micScale.value = withSpring(1);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt);
  };

  const handleSuggestionPress = (suggestion: string) => {
    if (suggestion === "Find a lawyer") {
      router.push("/(main)/(tabs)/directory");
    } else if (suggestion === "Document templates") {
      router.push("/(main)/legal-templates");
    } else {
      sendMessage(suggestion);
    }
  };

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const typingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: typingOpacity.value,
  }));

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Card
        style={[
          styles.messageCard,
          { backgroundColor: item.isUser ? theme.primary : theme.surface },
        ]}
        padding="medium"
      >
        <Text
          style={[
            styles.messageText,
            { color: item.isUser ? theme.textInverse : theme.text },
          ]}
        >
          {item.content}
        </Text>

        <Text
          style={[
            styles.messageTime,
            {
              color: item.isUser
                ? theme.textInverse + "80"
                : theme.textTertiary,
            },
          ]}
        >
          {item.timestamp.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        {item.metadata?.suggestions && (
          <View style={styles.suggestionsContainer}>
            {item.metadata.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSuggestionPress(suggestion)}
                style={[
                  styles.suggestionChip,
                  {
                    borderColor: theme.primary,
                    backgroundColor: theme.primary + "10",
                  },
                ]}
              >
                <Text style={[styles.suggestionText, { color: theme.primary }]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {item.metadata?.sections && (
          <View style={styles.sectionsContainer}>
            <Text
              style={[styles.sectionsLabel, { color: theme.textSecondary }]}
            >
              Related Sections:
            </Text>
            {item.metadata.sections.map((section, index) => (
              <View
                key={index}
                style={[
                  styles.sectionTag,
                  { backgroundColor: theme.info + "20" },
                ]}
              >
                <Text style={[styles.sectionText, { color: theme.info }]}>
                  {section}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );

  const renderTypingIndicator = () => (
    <Animated.View style={[styles.typingContainer, typingAnimatedStyle]}>
      <Card
        style={[styles.typingCard, { backgroundColor: theme.surface }]}
        padding="medium"
      >
        <View style={styles.typingDots}>
          <View
            style={[styles.typingDot, { backgroundColor: theme.textTertiary }]}
          />
          <View
            style={[styles.typingDot, { backgroundColor: theme.textTertiary }]}
          />
          <View
            style={[styles.typingDot, { backgroundColor: theme.textTertiary }]}
          />
        </View>
        <Text style={[styles.typingText, { color: theme.textTertiary }]}>
          AI is thinking...
        </Text>
      </Card>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.quickActionsTitle, { color: theme.text }]}>
        Quick Questions
      </Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => handleQuickAction(action)}
            style={[
              styles.quickActionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: action.color + "20" },
              ]}
            >
              <Ionicons
                name={action.icon as any}
                size={20}
                color={action.color}
              />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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

        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            AI Legal Assistant
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Get instant legal guidance
          </Text>
        </View>

        <View
          style={[
            styles.aiIndicator,
            { backgroundColor: theme.success + "20" },
          ]}
        >
          <View style={[styles.aiDot, { backgroundColor: theme.success }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListHeaderComponent={
            messages.length === 1 ? renderQuickActions : undefined
          }
        />

        {/* Typing Indicator */}
        {renderTypingIndicator()}

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.surface, borderTopColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.background, borderColor: theme.border },
            ]}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about law..."
              placeholderTextColor={theme.textTertiary}
              style={[styles.textInput, { color: theme.text }]}
              multiline
              maxLength={500}
            />

            <Animated.View style={micAnimatedStyle}>
              <TouchableOpacity
                onPress={handleVoiceInput}
                disabled={isListening}
                style={[
                  styles.voiceButton,
                  {
                    backgroundColor: isListening
                      ? theme.primary
                      : theme.primary + "20",
                  },
                ]}
              >
                <Ionicons
                  name={isListening ? "mic" : "mic-outline"}
                  size={20}
                  color={isListening ? theme.textInverse : theme.primary}
                />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || loading}
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim()
                    ? theme.primary
                    : theme.textTertiary,
                },
              ]}
            >
              <Ionicons name="send" size={20} color={theme.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  aiIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  quickActionsContainer: {
    marginVertical: Spacing.xl,
  },
  quickActionsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  quickActionCard: {
    width: "48%",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: "center",
  },
  messageContainer: {
    marginVertical: Spacing.xs,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageCard: {
    maxWidth: "80%",
    minWidth: "20%",
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  messageTime: {
    fontSize: FontSizes.xs,
    textAlign: "right",
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  suggestionChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  sectionsContainer: {
    marginTop: Spacing.sm,
  },
  sectionsLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  sectionTag: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  sectionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  typingContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: "flex-start",
  },
  typingCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDots: {
    flexDirection: "row",
    marginRight: Spacing.sm,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  typingText: {
    fontSize: FontSizes.sm,
    fontStyle: "italic",
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    maxHeight: 100,
    marginRight: Spacing.sm,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
