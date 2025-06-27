// Comprehensive API hooks for all major modules
import {
  useApi,
  useApiMutation,
  usePaginatedApi,
  useDebouncedApi,
} from "./useApi";
import AuthApiService from "@/services/api/authApi";
import CourtOrdersApiService from "@/services/api/courtOrdersApi";
import MessagesApiService from "@/services/api/messagesApi";
import LawyersApiService from "@/services/api/lawyersApi";
import {
  CaseManagementApiService,
  NotificationsApiService,
  SecureVaultApiService,
  TemplatesApiService,
  AIAssistantApiService,
  DocumentScannerApiService,
} from "@/services/api";

// Re-export types for convenience
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  OTPRequest,
  OTPVerifyRequest,
  UpdateProfileRequest,
} from "@/services/api/authApi";

export type {
  CourtOrder,
  CourtOrderFilters,
  BookmarkRequest,
} from "@/services/api/courtOrdersApi";

export type {
  Message,
  Conversation,
  SendMessageRequest,
  CreateConversationRequest,
  MessageFilters,
} from "@/services/api/messagesApi";

export type {
  Lawyer,
  LawyerFilters,
  LawyerReview,
  ConsultationRequest,
  ReviewRequest,
} from "@/services/api/lawyersApi";

// ==================== AUTH HOOKS ====================

// Login hook
export const useLogin = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.login, options);
};

// Register hook
export const useRegister = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.register, options);
};

// Send OTP hook
export const useSendOTP = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.sendOTP, options);
};

// Verify OTP hook
export const useVerifyOTP = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.verifyOTP, options);
};

// Get user profile hook
export const useProfile = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(AuthApiService.getProfile, options);
};

// Update profile hook
export const useUpdateProfile = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.updateProfile, options);
};

// Change password hook
export const useChangePassword = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.changePassword, options);
};

// Logout hook
export const useLogout = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AuthApiService.logout, options);
};

// ==================== COURT ORDERS HOOKS ====================

// Get court orders with pagination
export const useCourtOrders = (
  filters?: any,
  options?: {
    limit?: number;
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return usePaginatedApi(
    (page: number, limit: number) =>
      CourtOrdersApiService.getCourtOrders({ ...filters, page, limit }),
    options,
  );
};

// Get single court order
export const useCourtOrder = (
  id: string,
  options?: {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return useApi(() => CourtOrdersApiService.getCourtOrderById(id), {
    ...options,
    dependencies: [id],
  });
};

// Search court orders
export const useSearchCourtOrders = (
  query: string,
  options?: {
    delay?: number;
    minLength?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return useDebouncedApi(
    (searchQuery: string) =>
      CourtOrdersApiService.searchCourtOrders(searchQuery),
    query,
    options,
  );
};

// Toggle bookmark
export const useToggleBookmark = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(CourtOrdersApiService.toggleBookmark, options);
};

// Get bookmarked orders
export const useBookmarkedOrders = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(CourtOrdersApiService.getBookmarkedOrders, options);
};

// Download order document
export const useDownloadOrder = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(CourtOrdersApiService.downloadOrderDocument, options);
};

// Get court order statistics
export const useCourtOrderStats = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(CourtOrdersApiService.getOrderStatistics, options);
};

// ==================== MESSAGES HOOKS ====================

// Get conversations
export const useConversations = (options?: {
  limit?: number;
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return usePaginatedApi(MessagesApiService.getConversations, options);
};

// Get messages for conversation
export const useMessages = (
  conversationId: string,
  options?: {
    limit?: number;
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return usePaginatedApi(
    (page: number, limit: number) =>
      MessagesApiService.getMessages(conversationId, page, limit),
    { ...options, dependencies: [conversationId] },
  );
};

// Send message
export const useSendMessage = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(MessagesApiService.sendMessage, options);
};

// Create conversation
export const useCreateConversation = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(MessagesApiService.createConversation, options);
};

// Mark messages as read
export const useMarkAsRead = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(MessagesApiService.markAsRead, options);
};

// Delete message
export const useDeleteMessage = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(MessagesApiService.deleteMessage, options);
};

// Edit message
export const useEditMessage = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(MessagesApiService.editMessage, options);
};

// Add reaction
export const useAddReaction = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(MessagesApiService.addReaction, options);
};

// Search messages
export const useSearchMessages = (
  query: string,
  filters?: any,
  options?: {
    delay?: number;
    minLength?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return useDebouncedApi(
    (searchQuery: string) =>
      MessagesApiService.searchMessages(searchQuery, filters),
    query,
    options,
  );
};

// Get unread count
export const useUnreadCount = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(MessagesApiService.getUnreadCount, options);
};

// ==================== LAWYERS HOOKS ====================

// Get lawyers with filters
export const useLawyers = (
  filters?: any,
  options?: {
    limit?: number;
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return usePaginatedApi(
    (page: number, limit: number) =>
      LawyersApiService.getLawyers({ ...filters, page, limit }),
    options,
  );
};

// Get single lawyer
export const useLawyer = (
  id: string,
  options?: {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return useApi(() => LawyersApiService.getLawyerById(id), {
    ...options,
    dependencies: [id],
  });
};

// Get lawyer reviews
export const useLawyerReviews = (
  lawyerId: string,
  options?: {
    limit?: number;
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return usePaginatedApi(
    (page: number, limit: number) =>
      LawyersApiService.getLawyerReviews(lawyerId, page, limit),
    { ...options, dependencies: [lawyerId] },
  );
};

// Submit review
export const useSubmitReview = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(LawyersApiService.submitReview, options);
};

// Request consultation
export const useRequestConsultation = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(LawyersApiService.requestConsultation, options);
};

// Get lawyer availability
export const useLawyerAvailability = (
  lawyerId: string,
  dateFrom: Date,
  dateTo: Date,
  options?: {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return useApi(
    () => LawyersApiService.getLawyerAvailability(lawyerId, dateFrom, dateTo),
    { ...options, dependencies: [lawyerId, dateFrom, dateTo] },
  );
};

// Mark review as helpful
export const useMarkReviewHelpful = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(LawyersApiService.markReviewHelpful, options);
};

// Get specializations
export const useSpecializations = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(LawyersApiService.getSpecializations, options);
};

// Get featured lawyers
export const useFeaturedLawyers = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(LawyersApiService.getFeaturedLawyers, options);
};

// ==================== CASE MANAGEMENT HOOKS ====================

// Get cases with filtering
export const useCases = (
  filters?: any,
  options?: {
    limit?: number;
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return usePaginatedApi(
    (page: number, limit: number) =>
      CaseManagementApiService.getCases({ ...filters, page, limit }),
    options,
  );
};

// Create new case
export const useCreateCase = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(CaseManagementApiService.createCase, options);
};

// Update case
export const useUpdateCase = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(
    ({ id, data }: { id: string; data: any }) =>
      CaseManagementApiService.updateCase(id, data),
    options,
  );
};

// ==================== NOTIFICATIONS HOOKS ====================

// Get notifications
export const useNotifications = (options?: {
  limit?: number;
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return usePaginatedApi(NotificationsApiService.getNotifications, options);
};

// Mark notification as read
export const useMarkNotificationRead = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(NotificationsApiService.markAsRead, options);
};

// Get unread notifications count
export const useUnreadNotificationCount = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(NotificationsApiService.getUnreadCount, options);
};

// ==================== SECURE VAULT HOOKS ====================

// Get vault documents
export const useVaultDocuments = (options?: {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApi(SecureVaultApiService.getDocuments, options);
};

// Upload document to vault
export const useUploadVaultDocument = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}) => {
  return useApiMutation(
    ({ file, metadata }: { file: any; metadata: any }) =>
      SecureVaultApiService.uploadDocument(file, metadata),
    options,
  );
};

// ==================== TEMPLATES HOOKS ====================

// Get legal templates
export const useTemplates = (
  category?: string,
  options?: {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
  },
) => {
  return useApi(() => TemplatesApiService.getTemplates(category), {
    ...options,
    dependencies: [category],
  });
};

// Generate document from template
export const useGenerateDocument = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(
    ({ templateId, data }: { templateId: string; data: any }) =>
      TemplatesApiService.generateDocument(templateId, data),
    options,
  );
};

// ==================== AI ASSISTANT HOOKS ====================

// Query AI Assistant
export const useAIQuery = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  return useApiMutation(AIAssistantApiService.query, options);
};

// ==================== DOCUMENT SCANNER HOOKS ====================

// Scan document OCR
export const useScanDocument = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}) => {
  return useApiMutation(DocumentScannerApiService.scanDocument, options);
};

// Export all hooks for easy importing
export {
  useApi,
  useApiMutation,
  usePaginatedApi,
  useDebouncedApi,
} from "./useApi";
