import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "copilot";
  timestamp: Date;
  type: "text" | "analytics" | "suggestion";
}

interface AdminCopilotProps {
  visible: boolean;
  onClose: () => void;
  analyticsContext?: {
    totalUsers: number;
    pendingApprovals: number;
    systemHealth: string;
    recentActivity: any[];
  };
}

export default function AdminCopilot({
  visible,
  onClose,
  analyticsContext,
}: AdminCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your Admin Copilot. I can help you with platform analytics, user management, system monitoring, and administrative tasks. How can I assist you today?",
      sender: "copilot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickActions = [
    "Show pending approvals summary",
    "System health check",
    "User growth analytics",
    "Revenue insights",
    "Performance metrics",
    "Security audit",
  ];

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const generateCopilotResponse = async (
    userMessage: string,
  ): Promise<string> => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTyping(false);

    const message = userMessage.toLowerCase();

    if (message.includes("pending approvals") || message.includes("approval")) {
      const pendingCount = analyticsContext?.pendingApprovals || 12;
      return `**Pending Approvals Summary:**\n\n📋 **${pendingCount} applications pending review**\n\n**Breakdown:**\n• 8 Lawyer applications\n• 3 Junior Lawyer applications\n• 1 Law Office Helper\n\n**Average processing time:** 2.3 days\n**Priority items:** 3 applications pending >5 days\n\n**Recommendation:** Review high-priority items first to maintain service standards.`;
    }

    if (message.includes("system health") || message.includes("health check")) {
      return `**System Health Status:**\n\n🟢 **Overall Status: HEALTHY**\n\n**Infrastructure:**\n• Server uptime: 99.98%\n• Database performance: Optimal\n• API response time: 145ms avg\n• Storage usage: 67% (within limits)\n\n**Security:**\n• No failed login attempts detected\n• SSL certificates valid\n• Firewall active\n\n**Recommendations:**\n• Schedule database maintenance for next weekend\n• Consider scaling storage in Q2`;
    }

    if (message.includes("user growth") || message.includes("analytics")) {
      const totalUsers = analyticsContext?.totalUsers || 1247;
      return `**User Growth Analytics:**\n\n📈 **Total Users: ${totalUsers}**\n\n**This Month:**\n• New registrations: +89 users\n• Growth rate: +7.8% vs last month\n• Conversion rate: 68% (signup to verified)\n\n**Role Distribution:**\n• Law Students: 45%\n• Lawyers: 28%\n• Junior Lawyers: 18%\n• Others: 9%\n\n**Key Insights:**\n• Mobile signups increased 23%\n• Weekend registrations up 15%`;
    }

    if (message.includes("revenue") || message.includes("financial")) {
      return `**Revenue Insights:**\n\n💰 **Monthly Recurring Revenue: ₹2,34,500**\n\n**Subscription Breakdown:**\n• Premium: ₹1,45,000 (62%)\n• Pro: ₹67,500 (29%)\n• Free to Paid conversion: 12%\n\n**Growth Metrics:**\n• MRR growth: +15% vs last month\n• Churn rate: 3.2% (industry avg: 5%)\n• Average revenue per user: ₹188\n\n**Opportunities:**\n• 234 users eligible for Pro upgrade\n• 89 trial users ending this week`;
    }

    if (message.includes("performance") || message.includes("metrics")) {
      return `**Performance Metrics:**\n\n⚡ **App Performance:**\n• Page load time: 1.2s avg\n• Crash rate: 0.03%\n• User session duration: 8.5 min avg\n\n**Feature Usage:**\n• Document scanner: 89% adoption\n• AI chat: 67% weekly usage\n• Templates: 45% monthly usage\n• Case folders: 34% adoption\n\n**User Engagement:**\n• Daily active users: 78%\n• Weekly retention: 85%\n• Feature completion rate: 73%`;
    }

    if (message.includes("security") || message.includes("audit")) {
      return `**Security Audit Summary:**\n\n🔒 **Security Status: SECURE**\n\n**Authentication:**\n• Two-factor auth adoption: 67%\n• Failed login attempts: 0 (last 24h)\n• Password strength: 89% strong passwords\n\n**Data Protection:**\n• All data encrypted at rest\n• HTTPS enforced (100%)\n• Regular backups: 3x daily\n• GDPR compliance: Active\n\n**Recommendations:**\n• Encourage 2FA for all users\n• Review API rate limits\n• Schedule security penetration test`;
    }

    // Default response
    return `I can help you with:\n\n**User Management:**\n• Approval workflows\n• User analytics\n• Bulk operations\n\n**System Monitoring:**\n• Performance metrics\n• Health checks\n• Security audits\n\n**Analytics & Insights:**\n• Revenue tracking\n• Growth analysis\n• Feature usage\n\n**Administrative Tasks:**\n• Feature toggles\n• Broadcast messages\n• System maintenance\n\nWhat specific area would you like to explore?`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const copilotResponse = await generateCopilotResponse(inputText);

    const copilotMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: copilotResponse,
      sender: "copilot",
      timestamp: new Date(),
      type: "analytics",
    };

    setMessages((prev) => [...prev, copilotMessage]);
  };

  const handleQuickAction = (action: string) => {
    setInputText(action);
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
        message.sender === "user" ? styles.userMessage : styles.copilotMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          message.sender === "user"
            ? styles.userMessageText
            : styles.copilotMessageText,
        ]}
      >
        {message.content}
      </Text>

      <Text
        style={[
          styles.messageTime,
          message.sender === "user"
            ? styles.userMessageTime
            : styles.copilotMessageTime,
        ]}
      >
        {formatTimestamp(message.timestamp)}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🤖 Admin Copilot</Text>
            <Text style={styles.subtitle}>AI-powered admin assistant</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
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
            <View style={[styles.messageBubble, styles.copilotMessage]}>
              <Text style={styles.typingIndicator}>
                Copilot is analyzing...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActions}
        >
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action)}
            >
              <Text style={styles.quickActionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about users, analytics, system health..."
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#8b5cf6",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd6fe",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    maxWidth: "85%",
  },
  userMessage: {
    backgroundColor: "#3b82f6",
    alignSelf: "flex-end",
  },
  copilotMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  copilotMessageText: {
    color: "#1e293b",
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  copilotMessageTime: {
    color: "#64748b",
  },
  typingIndicator: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
  quickActions: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  quickActionButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quickActionText: {
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
    backgroundColor: "#fff",
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
    backgroundColor: "#8b5cf6",
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
});
