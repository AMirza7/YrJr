import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import BackButton from "@/components/navigation/BackButton";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  readAt?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage: Message;
  unreadCount: number;
  caseId?: string;
  messages: Message[];
}

export default function MessagesScreen() {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setError(null);

      // API call to GET /api/messages/conversations
      const response = await fetch("/api/messages/conversations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations. Please try again.");

      // Fallback to mock data for demo
      setConversations([
        {
          id: "conv_1",
          participantId: "user_2",
          participantName: "Advocate Rajesh Kumar",
          participantRole: "Senior Lawyer",
          unreadCount: 2,
          caseId: "CS/2024/001234",
          lastMessage: {
            id: "msg_5",
            senderId: "user_2",
            senderName: "Advocate Rajesh Kumar",
            content:
              "I've reviewed the documents. We should meet tomorrow to discuss the strategy for the hearing.",
            sentAt: "2024-02-15T10:30:00Z",
          },
          messages: [
            {
              id: "msg_1",
              senderId: "current_user",
              senderName: "You",
              content:
                "Hi Rajesh, I've uploaded the property documents for the ABC vs XYZ case.",
              sentAt: "2024-02-15T09:00:00Z",
              readAt: "2024-02-15T09:05:00Z",
            },
            {
              id: "msg_2",
              senderId: "user_2",
              senderName: "Advocate Rajesh Kumar",
              content: "Thank you. I'll review them and get back to you.",
              sentAt: "2024-02-15T09:15:00Z",
              readAt: "2024-02-15T09:20:00Z",
            },
            {
              id: "msg_3",
              senderId: "current_user",
              senderName: "You",
              content:
                "Also, the client wants to know about the timeline for the case.",
              sentAt: "2024-02-15T09:30:00Z",
              readAt: "2024-02-15T10:00:00Z",
            },
            {
              id: "msg_4",
              senderId: "user_2",
              senderName: "Advocate Rajesh Kumar",
              content:
                "Based on the court schedule, we can expect the hearing within 2-3 weeks.",
              sentAt: "2024-02-15T10:15:00Z",
            },
            {
              id: "msg_5",
              senderId: "user_2",
              senderName: "Advocate Rajesh Kumar",
              content:
                "I've reviewed the documents. We should meet tomorrow to discuss the strategy for the hearing.",
              sentAt: "2024-02-15T10:30:00Z",
            },
          ],
        },
        {
          id: "conv_2",
          participantId: "user_3",
          participantName: "John Doe",
          participantRole: "Client",
          unreadCount: 0,
          caseId: "CS/2024/005678",
          lastMessage: {
            id: "msg_7",
            senderId: "current_user",
            senderName: "You",
            content:
              "I'll prepare the employment contract review and send it to you by tomorrow.",
            sentAt: "2024-02-14T16:45:00Z",
            readAt: "2024-02-14T17:00:00Z",
          },
          messages: [
            {
              id: "msg_6",
              senderId: "user_3",
              senderName: "John Doe",
              content:
                "Hello, I need help with reviewing my employment contract. Can you assist?",
              sentAt: "2024-02-14T15:30:00Z",
              readAt: "2024-02-14T16:00:00Z",
            },
            {
              id: "msg_7",
              senderId: "current_user",
              senderName: "You",
              content:
                "I'll prepare the employment contract review and send it to you by tomorrow.",
              sentAt: "2024-02-14T16:45:00Z",
              readAt: "2024-02-14T17:00:00Z",
            },
          ],
        },
        {
          id: "conv_3",
          participantId: "user_4",
          participantName: "Legal Assistant Team",
          participantRole: "Support Team",
          unreadCount: 1,
          lastMessage: {
            id: "msg_9",
            senderId: "user_4",
            senderName: "Legal Assistant Team",
            content:
              "Your case filing for CS/2024/009876 has been completed successfully.",
            sentAt: "2024-02-13T14:20:00Z",
          },
          messages: [
            {
              id: "msg_8",
              senderId: "current_user",
              senderName: "You",
              content:
                "Please file the documents for the corporate merger case.",
              sentAt: "2024-02-13T10:00:00Z",
              readAt: "2024-02-13T10:30:00Z",
            },
            {
              id: "msg_9",
              senderId: "user_4",
              senderName: "Legal Assistant Team",
              content:
                "Your case filing for CS/2024/009876 has been completed successfully.",
              sentAt: "2024-02-13T14:20:00Z",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleConversationPress = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowChat(true);

    // Mark conversation as read
    if (conversation.unreadCount > 0) {
      const updatedConversations = conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv,
      );
      setConversations(updatedConversations);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);

    try {
      // API call to POST /api/messages
      const messageData = {
        recipientId: selectedConversation.participantId,
        content: newMessage.trim(),
        caseId: selectedConversation.caseId,
      };

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sentMessage = await response.json();

      // Update local state with the new message
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: "current_user",
        senderName: "You",
        content: newMessage.trim(),
        sentAt: new Date().toISOString(),
        readAt: new Date().toISOString(),
      };

      const updatedConversation = {
        ...selectedConversation,
        lastMessage: newMsg,
        messages: [...selectedConversation.messages, newMsg],
      };

      setSelectedConversation(updatedConversation);

      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id ? updatedConversation : conv,
      );
      setConversations(updatedConversations);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getRoleEmoji = (role: string) => {
    switch (role.toLowerCase()) {
      case "senior lawyer":
      case "lawyer":
        return "⚖️";
      case "client":
        return "👤";
      case "support team":
      case "legal assistant":
        return "📋";
      default:
        return "💬";
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationCard,
        { backgroundColor: theme.colors.surface },
      ]}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.participantInfo}>
          <Text style={styles.roleEmoji}>
            {getRoleEmoji(item.participantRole)}
          </Text>
          <View style={styles.participantDetails}>
            <Text
              style={[styles.participantName, { color: theme.colors.text }]}
            >
              {item.participantName}
            </Text>
            <Text
              style={[
                styles.participantRole,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.participantRole}
            </Text>
          </View>
        </View>

        <View style={styles.conversationMeta}>
          <Text
            style={[styles.messageTime, { color: theme.colors.textSecondary }]}
          >
            {formatMessageTime(item.lastMessage.sentAt)}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Text
        style={[styles.lastMessage, { color: theme.colors.textSecondary }]}
        numberOfLines={2}
      >
        {item.lastMessage.senderName === "You" ? "You: " : ""}
        {item.lastMessage.content}
      </Text>

      {item.caseId && (
        <Text style={[styles.caseInfo, { color: theme.colors.textSecondary }]}>
          📁 Case: {item.caseId}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === "current_user";

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isCurrentUser
                ? theme.colors.primary
                : theme.colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isCurrentUser ? "#fff" : theme.colors.text },
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTimestamp,
              {
                color: isCurrentUser
                  ? "rgba(255,255,255,0.8)"
                  : theme.colors.textSecondary,
              },
            ]}
          >
            {formatMessageTime(item.sentAt)}
            {isCurrentUser && item.readAt && " ✓✓"}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <BackButton color="#fff" />
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Loading conversations...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <BackButton color="#fff" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchConversations}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Conversations
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Your messages and conversations will appear here.
              </Text>
            </View>
          )
        }
      />

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedConversation && (
          <View
            style={[
              styles.chatContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View
              style={[
                styles.chatHeader,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatParticipantName}>
                  {selectedConversation.participantName}
                </Text>
                <Text style={styles.chatParticipantRole}>
                  {selectedConversation.participantRole}
                </Text>
              </View>
            </View>

            <FlatList
              data={selectedConversation.messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            />

            <View
              style={[
                styles.messageInputContainer,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <TextInput
                style={[
                  styles.messageInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.textSecondary}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: newMessage.trim()
                      ? theme.colors.primary
                      : theme.colors.border,
                    opacity: sendingMessage ? 0.6 : 1,
                  },
                ]}
                onPress={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
              >
                <Text style={styles.sendButtonText}>
                  {sendingMessage ? "..." : "Send"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  conversationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  roleEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  participantRole: {
    fontSize: 12,
  },
  conversationMeta: {
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  caseInfo: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  // Chat Modal Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginRight: 16,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatParticipantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  chatParticipantRole: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  sentMessage: {
    alignItems: "flex-end",
  },
  receivedMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTimestamp: {
    fontSize: 11,
  },
  messageInputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-end",
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
