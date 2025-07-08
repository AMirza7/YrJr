import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useModal } from "@/contexts/ModalContext";
import * as DocumentPicker from "expo-document-picker";

const { width, height } = Dimensions.get("window");

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "image" | "voice" | "system";
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  reactions?: {
    emoji: string;
    userId: string;
    userName: string;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: Date;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  caseReference?: string;
  contractDetails?: {
    service: string;
    amount: number;
    duration: string;
    status: "active" | "completed" | "paused";
  };
}

interface MessagingSystemProps {
  currentUserId: string;
  onClose?: () => void;
}

export default function MessagingSystem({
  currentUserId,
  onClose,
}: MessagingSystemProps) {
  const { showSuccess, showError, showConfirm } = useModal();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const conversations: Conversation[] = [
    {
      id: "1",
      participants: [
        {
          id: "user1",
          name: "Advocate Priya Sharma",
          role: "Verified Lawyer",
          avatar: "👩‍⚖️",
          isOnline: true,
        },
        {
          id: currentUserId,
          name: "You",
          role: "Client",
          avatar: "👤",
          isOnline: true,
        },
      ],
      unreadCount: 2,
      isPinned: true,
      caseReference: "Criminal Case #CR-2024-001",
      contractDetails: {
        service: "Legal Consultation & Case Handling",
        amount: 25000,
        duration: "3 months",
        status: "active",
      },
    },
    {
      id: "2",
      participants: [
        {
          id: "clerk1",
          name: "Rahul Kumar",
          role: "Legal Clerk",
          avatar: "📋",
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: currentUserId,
          name: "You",
          role: "Client",
          avatar: "👤",
          isOnline: true,
        },
      ],
      unreadCount: 0,
      isPinned: false,
      caseReference: "Document Preparation",
      contractDetails: {
        service: "Legal Document Drafting",
        amount: 5000,
        duration: "1 month",
        status: "active",
      },
    },
  ];

  const messages: { [key: string]: Message[] } = {
    "1": [
      {
        id: "1",
        senderId: "user1",
        senderName: "Advocate Priya Sharma",
        senderRole: "Lawyer",
        content:
          "Good morning! I've reviewed your case documents. We have a strong foundation for the bail application.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
      {
        id: "2",
        senderId: currentUserId,
        senderName: "You",
        senderRole: "Client",
        content: "Thank you for the update. When can we file the application?",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
      {
        id: "3",
        senderId: "user1",
        senderName: "Advocate Priya Sharma",
        senderRole: "Lawyer",
        content:
          "I'll prepare the bail application today. We can file it tomorrow morning at the Sessions Court.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: "text",
        isRead: false,
      },
      {
        id: "4",
        senderId: "user1",
        senderName: "Advocate Priya Sharma",
        senderRole: "Lawyer",
        content:
          "I've attached the draft application for your review. Please check and let me know if any changes are needed.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: "file",
        fileName: "Bail_Application_Draft.pdf",
        isRead: false,
        reactions: [{ emoji: "👍", userId: currentUserId, userName: "You" }],
      },
    ],
    "2": [
      {
        id: "5",
        senderId: "clerk1",
        senderName: "Rahul Kumar",
        senderRole: "Legal Clerk",
        content:
          "Hello! I've completed the first draft of your contract. It includes all the clauses we discussed.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
      {
        id: "6",
        senderId: currentUserId,
        senderName: "You",
        senderRole: "Client",
        content: "Great! Please send me the draft for review.",
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        type: "text",
        isRead: true,
      },
    ],
  };

  const emojis = ["😊", "👍", "👏", "❤️", "😂", "😮", "😢", "😡"];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getParticipantInfo = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== currentUserId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In a real app, this would send the message to the server
    showSuccess("Message sent successfully");
    setNewMessage("");
    setIsTyping(false);

    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf", "application/msword"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        showSuccess("File attached successfully");
      }
    } catch (error) {
      showError("Failed to attach file");
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    // In a real app, this would update the message on the server
    showSuccess(`Reaction ${emoji} added`);
    setShowEmojiPicker(false);
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const participant = getParticipantInfo(item);
    if (!participant) return null;

    return (
      <TouchableOpacity
        style={[
          styles.conversationItem,
          selectedConversation === item.id && styles.conversationItemSelected,
          item.isPinned && styles.conversationItemPinned,
        ]}
        onPress={() => setSelectedConversation(item.id)}
      >
        <View style={styles.conversationAvatar}>
          <Text style={styles.avatarText}>{participant.avatar}</Text>
          {participant.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName}>{participant.name}</Text>
            <View style={styles.conversationMeta}>
              {item.isPinned && <Text style={styles.pinIcon}>📌</Text>}
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.participantRole}>{participant.role}</Text>

          {item.caseReference && (
            <Text style={styles.caseReference}>📁 {item.caseReference}</Text>
          )}

          {item.contractDetails && (
            <View style={styles.contractInfo}>
              <Text style={styles.contractService}>
                {item.contractDetails.service}
              </Text>
              <View style={styles.contractMeta}>
                <Text style={styles.contractAmount}>
                  ₹{item.contractDetails.amount.toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.contractStatus,
                    styles[`status${item.contractDetails.status}`],
                  ]}
                >
                  <Text style={styles.contractStatusText}>
                    {item.contractDetails.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {item.lastMessage && (
            <Text style={styles.lastMessage}>
              {item.lastMessage.type === "file"
                ? "📎 File"
                : item.lastMessage.content}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwnMessage = message.senderId === currentUserId;
    const messages_list = selectedConversation
      ? messages[selectedConversation] || []
      : [];
    const isLastMessage = index === messages_list.length - 1;

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isOwnMessage
            ? styles.ownMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {!isOwnMessage && (
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{message.senderName}</Text>
            <Text style={styles.senderRole}>{message.senderRole}</Text>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {message.type === "file" ? (
            <View style={styles.fileMessage}>
              <Text style={styles.fileIcon}>📎</Text>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{message.fileName}</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
              ]}
            >
              {message.content}
            </Text>
          )}

          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {formatTime(message.timestamp)}
            </Text>
            {isOwnMessage && (
              <Text style={styles.messageStatus}>
                {message.isRead ? "✓✓" : "✓"}
              </Text>
            )}
          </View>
        </View>

        {message.reactions && message.reactions.length > 0 && (
          <View style={styles.reactions}>
            {message.reactions.map((reaction, idx) => (
              <View key={idx} style={styles.reaction}>
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.reactButton}
          onPress={() => setShowEmojiPicker(true)}
        >
          <Text style={styles.reactIcon}>😊</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderConversationView = () => {
    if (!selectedConversation) {
      return (
        <View style={styles.noConversation}>
          <Text style={styles.noConversationIcon}>💬</Text>
          <Text style={styles.noConversationTitle}>Select a conversation</Text>
          <Text style={styles.noConversationText}>
            Choose a conversation from the list to start messaging
          </Text>
        </View>
      );
    }

    const conversation = conversations.find(
      (c) => c.id === selectedConversation,
    );
    const participant = conversation ? getParticipantInfo(conversation) : null;
    const conversationMessages = messages[selectedConversation] || [];

    return (
      <View style={styles.conversationView}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedConversation(null)}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          {participant && (
            <View style={styles.participantInfo}>
              <Text style={styles.chatParticipantAvatar}>
                {participant.avatar}
              </Text>
              <View style={styles.chatParticipantDetails}>
                <Text style={styles.chatParticipantName}>
                  {participant.name}
                </Text>
                <Text style={styles.chatParticipantStatus}>
                  {participant.isOnline
                    ? "🟢 Online"
                    : `Last seen ${formatTime(participant.lastSeen || new Date())}`}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => showSuccess("More options coming soon!")}
          >
            <Text style={styles.moreIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Contract Info Banner */}
        {conversation?.contractDetails && (
          <View style={styles.contractBanner}>
            <Text style={styles.contractBannerTitle}>Active Contract</Text>
            <Text style={styles.contractBannerService}>
              {conversation.contractDetails.service}
            </Text>
            <View style={styles.contractBannerMeta}>
              <Text style={styles.contractBannerAmount}>
                ₹{conversation.contractDetails.amount.toLocaleString()}
              </Text>
              <Text style={styles.contractBannerDuration}>
                {conversation.contractDetails.duration}
              </Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {conversationMessages.map((message, index) =>
            renderMessage(message, index),
          )}

          {isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>
                {participant?.name} is typing...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleFileUpload}
          >
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            multiline
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onClose}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => showSuccess("New chat feature coming soon!")}
        >
          <Text style={styles.newChatIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Conversations List */}
        <View
          style={[
            styles.conversationsList,
            selectedConversation && styles.conversationsListHidden,
          ]}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search conversations..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Conversation View */}
        <View
          style={[
            styles.conversationViewContainer,
            !selectedConversation && styles.conversationViewHidden,
          ]}
        >
          {renderConversationView()}
        </View>
      </View>

      {/* Emoji Picker Modal */}
      <Modal
        visible={showEmojiPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <TouchableOpacity
          style={styles.emojiModalOverlay}
          onPress={() => setShowEmojiPicker(false)}
        >
          <View style={styles.emojiPicker}>
            <Text style={styles.emojiPickerTitle}>Add Reaction</Text>
            <View style={styles.emojiGrid}>
              {emojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => addReaction("", emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
    paddingTop: 50,
  },
  headerBackButton: {
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
  newChatButton: {
    padding: 8,
  },
  newChatIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  conversationsList: {
    flex: 1,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  conversationsListHidden: {
    display: "none",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  conversationItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  conversationItemSelected: {
    backgroundColor: "#f0f9ff",
  },
  conversationItemPinned: {
    backgroundColor: "#fef7ff",
  },
  conversationAvatar: {
    position: "relative",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 32,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: "#10b981",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  conversationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pinIcon: {
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  participantRole: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
    marginBottom: 8,
  },
  caseReference: {
    fontSize: 12,
    color: "#8b5cf6",
    marginBottom: 8,
  },
  contractInfo: {
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  contractService: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 4,
  },
  contractMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contractAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  contractStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusactive: {
    backgroundColor: "#d1fae5",
  },
  statuscompleted: {
    backgroundColor: "#e0e7ff",
  },
  statuspaused: {
    backgroundColor: "#fef3c7",
  },
  contractStatusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6b7280",
    numberOfLines: 2,
  },
  conversationViewContainer: {
    flex: 2,
  },
  conversationViewHidden: {
    display: "none",
  },
  noConversation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noConversationIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noConversationTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  noConversationText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  conversationView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  participantInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chatParticipantAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  chatParticipantDetails: {
    flex: 1,
  },
  chatParticipantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  chatParticipantStatus: {
    fontSize: 12,
    color: "#6b7280",
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: "#6b7280",
  },
  contractBanner: {
    backgroundColor: "#fef7ff",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  contractBannerTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b5cf6",
    marginBottom: 4,
  },
  contractBannerService: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  contractBannerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contractBannerAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  contractBannerDuration: {
    fontSize: 12,
    color: "#6b7280",
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  ownMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  senderInfo: {
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  senderRole: {
    fontSize: 10,
    color: "#9ca3af",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 12,
  },
  ownMessageBubble: {
    backgroundColor: "#8b5cf6",
  },
  otherMessageBubble: {
    backgroundColor: "#f3f4f6",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#111827",
  },
  fileMessage: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  downloadButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  downloadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },
  messageStatus: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },
  reactions: {
    flexDirection: "row",
    marginTop: 4,
  },
  reaction: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactButton: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reactIcon: {
    fontSize: 16,
  },
  typingIndicator: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  typingText: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 20,
    color: "#6b7280",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 20,
    padding: 12,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  sendIcon: {
    color: "#fff",
    fontSize: 16,
  },
  emojiModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiPicker: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 280,
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  emojiButton: {
    padding: 8,
  },
  emojiText: {
    fontSize: 24,
  },
});
