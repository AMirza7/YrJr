import { httpClient, ApiResponse } from "@/services/httpClient";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";

// Messages API types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: "text" | "image" | "document" | "audio" | "video" | "location";
  attachments: MessageAttachment[];
  isRead: boolean;
  isDelivered: boolean;
  timestamp: Date;
  editedAt?: Date;
  replyTo?: string;
  reactions: MessageReaction[];
  metadata?: {
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
    duration?: number; // for audio/video
    fileName?: string; // for documents
  };
}

export interface MessageAttachment {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
}

export interface MessageReaction {
  userId: string;
  reaction: "👍" | "👎" | "❤️" | "😊" | "😢" | "😮" | "😡";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  groupDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    caseNumber?: string;
    tags?: string[];
    priority?: "low" | "medium" | "high" | "urgent";
  };
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  joinedAt: Date;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  messageType?: "text" | "image" | "document" | "audio" | "video";
  attachments?: File[];
  replyTo?: string;
  metadata?: any;
}

export interface CreateConversationRequest {
  participantIds: string[];
  isGroup?: boolean;
  groupName?: string;
  groupDescription?: string;
  caseNumber?: string;
  tags?: string[];
}

export interface MessageFilters {
  search?: string;
  messageType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  senderId?: string;
  hasAttachments?: boolean;
  page?: number;
  limit?: number;
}

// Mock data
const MOCK_PARTICIPANTS: ConversationParticipant[] = [
  {
    id: "user_001",
    name: "Advocate Rajesh Kumar",
    role: "lawyer",
    avatar: "https://cdn.yrjr.app/avatars/user_001.jpg",
    isOnline: true,
    joinedAt: new Date("2024-01-15"),
  },
  {
    id: "user_002",
    name: "Priya Sharma",
    role: "junior_lawyer",
    avatar: "https://cdn.yrjr.app/avatars/user_002.jpg",
    isOnline: false,
    lastSeen: new Date("2024-12-14T10:30:00Z"),
    joinedAt: new Date("2024-02-01"),
  },
  {
    id: "user_003",
    name: "Assistant Manager",
    role: "lawyer_assistant",
    avatar: "https://cdn.yrjr.app/avatars/user_003.jpg",
    isOnline: true,
    joinedAt: new Date("2024-03-01"),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg_001",
    conversationId: "conv_001",
    senderId: "user_002",
    receiverId: "user_001",
    content:
      "Sir, I have prepared the draft for the bail application. Please review when you have time.",
    messageType: "text",
    attachments: [],
    isRead: true,
    isDelivered: true,
    timestamp: new Date("2024-12-15T09:15:00Z"),
    reactions: [
      {
        userId: "user_001",
        reaction: "👍",
        timestamp: new Date("2024-12-15T09:20:00Z"),
      },
    ],
  },
  {
    id: "msg_002",
    conversationId: "conv_001",
    senderId: "user_001",
    receiverId: "user_002",
    content:
      "Great work! I will review it by evening. Also, please check the case citations in paragraph 3.",
    messageType: "text",
    attachments: [],
    isRead: true,
    isDelivered: true,
    timestamp: new Date("2024-12-15T09:22:00Z"),
    replyTo: "msg_001",
    reactions: [],
  },
  {
    id: "msg_003",
    conversationId: "conv_001",
    senderId: "user_002",
    receiverId: "user_001",
    content: "I have attached the revised draft with proper citations.",
    messageType: "document",
    attachments: [
      {
        id: "att_001",
        url: "https://cdn.yrjr.app/documents/bail_application_draft.pdf",
        fileName: "Bail_Application_Draft_v2.pdf",
        fileSize: 245760,
        mimeType: "application/pdf",
      },
    ],
    isRead: false,
    isDelivered: true,
    timestamp: new Date("2024-12-15T14:30:00Z"),
    reactions: [],
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_001",
    participants: [MOCK_PARTICIPANTS[0], MOCK_PARTICIPANTS[1]],
    lastMessage: MOCK_MESSAGES[2],
    unreadCount: 1,
    isGroup: false,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-15T14:30:00Z"),
    metadata: {
      caseNumber: "CRL.M.C. 456/2024",
      tags: ["bail application", "urgent"],
      priority: "high",
    },
  },
  {
    id: "conv_002",
    participants: [MOCK_PARTICIPANTS[0], MOCK_PARTICIPANTS[2]],
    lastMessage: {
      id: "msg_004",
      conversationId: "conv_002",
      senderId: "user_003",
      receiverId: "user_001",
      content: "The client documents have been organized as requested.",
      messageType: "text",
      attachments: [],
      isRead: true,
      isDelivered: true,
      timestamp: new Date("2024-12-14T16:45:00Z"),
      reactions: [],
    },
    unreadCount: 0,
    isGroup: false,
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-14T16:45:00Z"),
  },
  {
    id: "conv_003",
    participants: MOCK_PARTICIPANTS,
    lastMessage: {
      id: "msg_005",
      conversationId: "conv_003",
      senderId: "user_001",
      receiverId: "",
      content:
        "Team meeting scheduled for tomorrow at 11 AM. Please prepare case status updates.",
      messageType: "text",
      attachments: [],
      isRead: true,
      isDelivered: true,
      timestamp: new Date("2024-12-14T18:00:00Z"),
      reactions: [],
    },
    unreadCount: 0,
    isGroup: true,
    groupName: "Legal Team Discussion",
    groupDescription: "Main discussion group for legal team coordination",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-12-14T18:00:00Z"),
  },
];

// Mock delay utility
const mockDelay = (ms: number = Config.MOCK_API_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Messages API service
export class MessagesApiService {
  // Get conversations list
  static async getConversations(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<Conversation[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const startIndex = (page - 1) * limit;
      const paginatedConversations = MOCK_CONVERSATIONS.slice(
        startIndex,
        startIndex + limit,
      );

      Logger.debug("Mock conversations fetched:", {
        total: MOCK_CONVERSATIONS.length,
        page,
        limit,
        returned: paginatedConversations.length,
      });

      return {
        success: true,
        data: paginatedConversations,
        message: "Conversations fetched successfully",
        pagination: {
          page,
          limit,
          total: MOCK_CONVERSATIONS.length,
          totalPages: Math.ceil(MOCK_CONVERSATIONS.length / limit),
        },
      };
    }

    return httpClient.get<Conversation[]>(
      `/messages/conversations?page=${page}&limit=${limit}`,
    );
  }

  // Get messages for a conversation
  static async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<ApiResponse<Message[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const conversationMessages = MOCK_MESSAGES.filter(
        (msg) => msg.conversationId === conversationId,
      );
      const startIndex = (page - 1) * limit;
      const paginatedMessages = conversationMessages.slice(
        startIndex,
        startIndex + limit,
      );

      return {
        success: true,
        data: paginatedMessages,
        message: "Messages fetched successfully",
        pagination: {
          page,
          limit,
          total: conversationMessages.length,
          totalPages: Math.ceil(conversationMessages.length / limit),
        },
      };
    }

    return httpClient.get<Message[]>(
      `/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    );
  }

  // Send a message
  static async sendMessage(
    messageData: SendMessageRequest,
  ): Promise<ApiResponse<Message>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(800);

      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: messageData.conversationId,
        senderId: "current_user_id", // This would be from auth context
        receiverId: "", // Would be determined by conversation participants
        content: messageData.content,
        messageType: messageData.messageType || "text",
        attachments: [], // Would handle file uploads
        isRead: false,
        isDelivered: true,
        timestamp: new Date(),
        reactions: [],
        replyTo: messageData.replyTo,
        metadata: messageData.metadata,
      };

      // Add to mock messages
      MOCK_MESSAGES.push(newMessage);

      // Update conversation's last message
      const conversation = MOCK_CONVERSATIONS.find(
        (c) => c.id === messageData.conversationId,
      );
      if (conversation) {
        conversation.lastMessage = newMessage;
        conversation.updatedAt = new Date();
      }

      return {
        success: true,
        data: newMessage,
        message: "Message sent successfully",
      };
    }

    return httpClient.post<Message>("/messages/send", messageData);
  }

  // Create new conversation
  static async createConversation(
    conversationData: CreateConversationRequest,
  ): Promise<ApiResponse<Conversation>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const participants = MOCK_PARTICIPANTS.filter((p) =>
        conversationData.participantIds.includes(p.id),
      );

      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        participants,
        unreadCount: 0,
        isGroup: conversationData.isGroup || false,
        groupName: conversationData.groupName,
        groupDescription: conversationData.groupDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          caseNumber: conversationData.caseNumber,
          tags: conversationData.tags,
          priority: "medium",
        },
      };

      MOCK_CONVERSATIONS.unshift(newConversation);

      return {
        success: true,
        data: newConversation,
        message: "Conversation created successfully",
      };
    }

    return httpClient.post<Conversation>(
      "/messages/conversations",
      conversationData,
    );
  }

  // Mark messages as read
  static async markAsRead(
    conversationId: string,
    messageIds: string[],
  ): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(300);

      // Update mock messages
      MOCK_MESSAGES.forEach((msg) => {
        if (
          msg.conversationId === conversationId &&
          messageIds.includes(msg.id)
        ) {
          msg.isRead = true;
        }
      });

      // Update conversation unread count
      const conversation = MOCK_CONVERSATIONS.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.unreadCount = Math.max(
          0,
          conversation.unreadCount - messageIds.length,
        );
      }

      return {
        success: true,
        data: {},
        message: "Messages marked as read",
      };
    }

    return httpClient.put(`/messages/conversations/${conversationId}/read`, {
      messageIds,
    });
  }

  // Delete message
  static async deleteMessage(messageId: string): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const messageIndex = MOCK_MESSAGES.findIndex(
        (msg) => msg.id === messageId,
      );
      if (messageIndex > -1) {
        MOCK_MESSAGES.splice(messageIndex, 1);
      }

      return {
        success: true,
        data: {},
        message: "Message deleted successfully",
      };
    }

    return httpClient.delete(`/messages/${messageId}`);
  }

  // Edit message
  static async editMessage(
    messageId: string,
    newContent: string,
  ): Promise<ApiResponse<Message>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const message = MOCK_MESSAGES.find((msg) => msg.id === messageId);
      if (!message) {
        throw {
          success: false,
          message: "Message not found",
          statusCode: 404,
        };
      }

      message.content = newContent;
      message.editedAt = new Date();

      return {
        success: true,
        data: message,
        message: "Message edited successfully",
      };
    }

    return httpClient.put<Message>(`/messages/${messageId}`, {
      content: newContent,
    });
  }

  // Add reaction to message
  static async addReaction(
    messageId: string,
    reaction: MessageReaction["reaction"],
  ): Promise<ApiResponse<Message>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const message = MOCK_MESSAGES.find((msg) => msg.id === messageId);
      if (!message) {
        throw {
          success: false,
          message: "Message not found",
          statusCode: 404,
        };
      }

      // Remove existing reaction from same user
      message.reactions = message.reactions.filter(
        (r) => r.userId !== "current_user_id",
      );

      // Add new reaction
      message.reactions.push({
        userId: "current_user_id",
        reaction,
        timestamp: new Date(),
      });

      return {
        success: true,
        data: message,
        message: "Reaction added successfully",
      };
    }

    return httpClient.post<Message>(`/messages/${messageId}/reactions`, {
      reaction,
    });
  }

  // Search messages
  static async searchMessages(
    query: string,
    filters: MessageFilters = {},
  ): Promise<ApiResponse<Message[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(1500);

      let filteredMessages = MOCK_MESSAGES.filter((msg) =>
        msg.content.toLowerCase().includes(query.toLowerCase()),
      );

      if (filters.messageType) {
        filteredMessages = filteredMessages.filter(
          (msg) => msg.messageType === filters.messageType,
        );
      }

      if (filters.senderId) {
        filteredMessages = filteredMessages.filter(
          (msg) => msg.senderId === filters.senderId,
        );
      }

      if (filters.hasAttachments) {
        filteredMessages = filteredMessages.filter(
          (msg) => msg.attachments.length > 0,
        );
      }

      return {
        success: true,
        data: filteredMessages,
        message: "Search completed successfully",
      };
    }

    return httpClient.post<Message[]>("/messages/search", { query, filters });
  }

  // Get conversation info
  static async getConversationInfo(
    conversationId: string,
  ): Promise<ApiResponse<Conversation>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const conversation = MOCK_CONVERSATIONS.find(
        (c) => c.id === conversationId,
      );
      if (!conversation) {
        throw {
          success: false,
          message: "Conversation not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: conversation,
        message: "Conversation info fetched successfully",
      };
    }

    return httpClient.get<Conversation>(
      `/messages/conversations/${conversationId}`,
    );
  }

  // Update conversation settings
  static async updateConversation(
    conversationId: string,
    updates: Partial<CreateConversationRequest>,
  ): Promise<ApiResponse<Conversation>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const conversation = MOCK_CONVERSATIONS.find(
        (c) => c.id === conversationId,
      );
      if (!conversation) {
        throw {
          success: false,
          message: "Conversation not found",
          statusCode: 404,
        };
      }

      if (updates.groupName) conversation.groupName = updates.groupName;
      if (updates.groupDescription)
        conversation.groupDescription = updates.groupDescription;
      if (updates.tags)
        conversation.metadata = {
          ...conversation.metadata,
          tags: updates.tags,
        };
      conversation.updatedAt = new Date();

      return {
        success: true,
        data: conversation,
        message: "Conversation updated successfully",
      };
    }

    return httpClient.put<Conversation>(
      `/messages/conversations/${conversationId}`,
      updates,
    );
  }

  // Get unread count
  static async getUnreadCount(): Promise<
    ApiResponse<{ total: number; byConversation: Record<string, number> }>
  > {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const total = MOCK_CONVERSATIONS.reduce(
        (sum, conv) => sum + conv.unreadCount,
        0,
      );
      const byConversation = MOCK_CONVERSATIONS.reduce(
        (acc, conv) => {
          if (conv.unreadCount > 0) {
            acc[conv.id] = conv.unreadCount;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        success: true,
        data: { total, byConversation },
        message: "Unread count fetched successfully",
      };
    }

    return httpClient.get("/messages/unread-count");
  }
}

export default MessagesApiService;
