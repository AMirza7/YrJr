/**
 * Comprehensive API Client
 * Central interface for all API operations with consistent error handling,
 * loading states, and caching support
 */

import { httpClient, ApiResponse, ApiError } from "./httpClient";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";

// Import all API services
import AuthApiService from "./api/authApi";
import CourtOrdersApiService from "./api/courtOrdersApi";
import MessagesApiService from "./api/messagesApi";
import LawyersApiService from "./api/lawyersApi";
import {
  CaseManagementApiService,
  NotificationsApiService,
  SecureVaultApiService,
  TemplatesApiService,
  AIAssistantApiService,
  DocumentScannerApiService,
} from "./api";

// API Client interface
export interface ApiClientOptions {
  enableRetry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  enableCaching?: boolean;
  cacheTimeout?: number;
}

// API Client class
class ApiClient {
  private cacheStore = new Map<
    string,
    { data: any; timestamp: number; expiry: number }
  >();
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(private options: ApiClientOptions = {}) {
    this.options = {
      enableRetry: true,
      retryAttempts: 3,
      retryDelay: 1000,
      enableCaching: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      ...options,
    };
  }

  // ==================== AUTHENTICATION API ====================
  auth = {
    login: this.createMethod(AuthApiService.login),
    register: this.createMethod(AuthApiService.register),
    logout: this.createMethod(AuthApiService.logout),
    sendOTP: this.createMethod(AuthApiService.sendOTP),
    verifyOTP: this.createMethod(AuthApiService.verifyOTP),
    getProfile: this.createMethod(AuthApiService.getProfile, { cache: true }),
    updateProfile: this.createMethod(AuthApiService.updateProfile, {
      invalidateCache: ["getProfile"],
    }),
    changePassword: this.createMethod(AuthApiService.changePassword),
    forgotPassword: this.createMethod(AuthApiService.forgotPassword),
    resetPassword: this.createMethod(AuthApiService.resetPassword),
    refreshToken: this.createMethod(AuthApiService.refreshToken),
    checkEmailAvailability: this.createMethod(
      AuthApiService.checkEmailAvailability,
      { cache: true },
    ),
    updatePushToken: this.createMethod(AuthApiService.updatePushToken),
  };

  // ==================== COURT ORDERS API ====================
  courtOrders = {
    getAll: this.createMethod(CourtOrdersApiService.getCourtOrders, {
      cache: true,
    }),
    getById: this.createMethod(CourtOrdersApiService.getCourtOrderById, {
      cache: true,
    }),
    search: this.createMethod(CourtOrdersApiService.searchCourtOrders),
    toggleBookmark: this.createMethod(CourtOrdersApiService.toggleBookmark, {
      invalidateCache: ["getAll", "getBookmarked"],
    }),
    getBookmarked: this.createMethod(
      CourtOrdersApiService.getBookmarkedOrders,
      { cache: true },
    ),
    downloadDocument: this.createMethod(
      CourtOrdersApiService.downloadOrderDocument,
    ),
    getStatistics: this.createMethod(CourtOrdersApiService.getOrderStatistics, {
      cache: true,
    }),
    getSuggestedTags: this.createMethod(
      CourtOrdersApiService.getSuggestedTags,
      { cache: true },
    ),
    getCourtNames: this.createMethod(CourtOrdersApiService.getCourtNames, {
      cache: true,
    }),
  };

  // ==================== MESSAGES API ====================
  messages = {
    getConversations: this.createMethod(MessagesApiService.getConversations, {
      cache: true,
    }),
    getMessages: this.createMethod(MessagesApiService.getMessages, {
      cache: true,
    }),
    sendMessage: this.createMethod(MessagesApiService.sendMessage, {
      invalidateCache: ["getConversations", "getMessages"],
    }),
    createConversation: this.createMethod(
      MessagesApiService.createConversation,
      {
        invalidateCache: ["getConversations"],
      },
    ),
    markAsRead: this.createMethod(MessagesApiService.markAsRead, {
      invalidateCache: ["getConversations", "getUnreadCount"],
    }),
    deleteMessage: this.createMethod(MessagesApiService.deleteMessage, {
      invalidateCache: ["getMessages", "getConversations"],
    }),
    editMessage: this.createMethod(MessagesApiService.editMessage, {
      invalidateCache: ["getMessages"],
    }),
    addReaction: this.createMethod(MessagesApiService.addReaction, {
      invalidateCache: ["getMessages"],
    }),
    searchMessages: this.createMethod(MessagesApiService.searchMessages),
    getConversationInfo: this.createMethod(
      MessagesApiService.getConversationInfo,
      { cache: true },
    ),
    updateConversation: this.createMethod(
      MessagesApiService.updateConversation,
      {
        invalidateCache: ["getConversations", "getConversationInfo"],
      },
    ),
    getUnreadCount: this.createMethod(MessagesApiService.getUnreadCount, {
      cache: true,
    }),
  };

  // ==================== LAWYERS API ====================
  lawyers = {
    getAll: this.createMethod(LawyersApiService.getLawyers, { cache: true }),
    getById: this.createMethod(LawyersApiService.getLawyerById, {
      cache: true,
    }),
    getReviews: this.createMethod(LawyersApiService.getLawyerReviews, {
      cache: true,
    }),
    submitReview: this.createMethod(LawyersApiService.submitReview, {
      invalidateCache: ["getReviews", "getById"],
    }),
    requestConsultation: this.createMethod(
      LawyersApiService.requestConsultation,
    ),
    getAvailability: this.createMethod(
      LawyersApiService.getLawyerAvailability,
      { cache: true },
    ),
    markReviewHelpful: this.createMethod(LawyersApiService.markReviewHelpful, {
      invalidateCache: ["getReviews"],
    }),
    getSpecializations: this.createMethod(
      LawyersApiService.getSpecializations,
      { cache: true },
    ),
    getFeatured: this.createMethod(LawyersApiService.getFeaturedLawyers, {
      cache: true,
    }),
  };

  // ==================== CASE MANAGEMENT API ====================
  cases = {
    getAll: this.createMethod(CaseManagementApiService.getCases, {
      cache: true,
    }),
    create: this.createMethod(CaseManagementApiService.createCase, {
      invalidateCache: ["getAll"],
    }),
    update: this.createMethod(
      ({ id, data }: { id: string; data: any }) =>
        CaseManagementApiService.updateCase(id, data),
      {
        invalidateCache: ["getAll"],
      },
    ),
  };

  // ==================== NOTIFICATIONS API ====================
  notifications = {
    getAll: this.createMethod(NotificationsApiService.getNotifications, {
      cache: true,
    }),
    markAsRead: this.createMethod(NotificationsApiService.markAsRead, {
      invalidateCache: ["getAll", "getUnreadCount"],
    }),
    getUnreadCount: this.createMethod(NotificationsApiService.getUnreadCount, {
      cache: true,
    }),
  };

  // ==================== SECURE VAULT API ====================
  vault = {
    getDocuments: this.createMethod(SecureVaultApiService.getDocuments, {
      cache: true,
    }),
    uploadDocument: this.createMethod(
      ({ file, metadata }: { file: any; metadata: any }) =>
        SecureVaultApiService.uploadDocument(file, metadata),
      {
        invalidateCache: ["getDocuments"],
      },
    ),
  };

  // ==================== TEMPLATES API ====================
  templates = {
    getAll: this.createMethod(TemplatesApiService.getTemplates, {
      cache: true,
    }),
    generateDocument: this.createMethod(
      ({ templateId, data }: { templateId: string; data: any }) =>
        TemplatesApiService.generateDocument(templateId, data),
    ),
  };

  // ==================== AI ASSISTANT API ====================
  ai = {
    query: this.createMethod(AIAssistantApiService.query),
  };

  // ==================== DOCUMENT SCANNER API ====================
  scanner = {
    scanDocument: this.createMethod(DocumentScannerApiService.scanDocument),
  };

  // ==================== UTILITY METHODS ====================

  /**
   * Create a method wrapper with retry, caching, and error handling
   */
  private createMethod<T extends any[], R>(
    method: (...args: T) => Promise<ApiResponse<R>>,
    options: {
      cache?: boolean;
      invalidateCache?: string[];
      retry?: boolean;
    } = {},
  ) {
    return async (...args: T): Promise<ApiResponse<R>> => {
      const methodName = method.name;
      const cacheKey = `${methodName}_${JSON.stringify(args)}`;

      // Check cache first
      if (options.cache && this.options.enableCaching) {
        const cached = this.getCachedData(cacheKey);
        if (cached) {
          Logger.debug(`Cache hit for ${methodName}`);
          return cached;
        }
      }

      // Check for pending request (deduplication)
      if (this.pendingRequests.has(cacheKey)) {
        Logger.debug(`Deduplicating request for ${methodName}`);
        return this.pendingRequests.get(cacheKey)!;
      }

      // Execute request with retry logic
      const requestPromise = this.executeWithRetry(method, args);
      this.pendingRequests.set(cacheKey, requestPromise);

      try {
        const result = await requestPromise;

        // Cache successful results
        if (options.cache && this.options.enableCaching && result.success) {
          this.setCachedData(cacheKey, result);
        }

        // Invalidate related cache entries
        if (options.invalidateCache) {
          this.invalidateCache(options.invalidateCache);
        }

        return result;
      } catch (error) {
        Logger.error(`API method ${methodName} failed:`, error);
        throw error;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    };
  }

  /**
   * Execute method with retry logic
   */
  private async executeWithRetry<T extends any[], R>(
    method: (...args: T) => Promise<ApiResponse<R>>,
    args: T,
    attempt: number = 1,
  ): Promise<ApiResponse<R>> {
    try {
      return await method(...args);
    } catch (error) {
      const shouldRetry =
        this.options.enableRetry &&
        attempt < this.options.retryAttempts! &&
        this.isRetryableError(error);

      if (shouldRetry) {
        Logger.debug(`Retrying API call, attempt ${attempt + 1}`);
        await this.delay(this.options.retryDelay! * attempt);
        return this.executeWithRetry(method, args, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    if (!error || typeof error !== "object") return false;

    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    return retryableStatusCodes.includes(error.statusCode);
  }

  /**
   * Get cached data if valid
   */
  private getCachedData(key: string): any | null {
    const cached = this.cacheStore.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cacheStore.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cached data with expiry
   */
  private setCachedData(key: string, data: any): void {
    this.cacheStore.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + this.options.cacheTimeout!,
    });
  }

  /**
   * Invalidate cache entries by pattern
   */
  private invalidateCache(patterns: string[]): void {
    for (const [key] of this.cacheStore) {
      if (patterns.some((pattern) => key.includes(pattern))) {
        this.cacheStore.delete(key);
        Logger.debug(`Invalidated cache for ${key}`);
      }
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cacheStore.clear();
    Logger.debug("All cache cleared");
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number;
    totalSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const entries = Array.from(this.cacheStore.values());

    return {
      totalEntries: entries.length,
      totalSize: JSON.stringify(entries).length,
      oldestEntry:
        entries.length > 0
          ? Math.min(...entries.map((e) => e.timestamp))
          : null,
      newestEntry:
        entries.length > 0
          ? Math.max(...entries.map((e) => e.timestamp))
          : null,
    };
  }

  /**
   * Check authentication status
   */
  async checkAuth(): Promise<boolean> {
    return httpClient.isAuthenticated();
  }

  /**
   * Get network status
   */
  getNetworkStatus(): {
    isOnline: boolean;
    connectionType?: string;
  } {
    // In React Native, you would use @react-native-community/netinfo
    return {
      isOnline: true, // Default to online
    };
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient({
  enableRetry: !Config.IS_DEV, // Disable retry in development for faster debugging
  retryAttempts: 3,
  retryDelay: 1000,
  enableCaching: true,
  cacheTimeout: Config.IS_DEV ? 60 * 1000 : 5 * 60 * 1000, // 1 min in dev, 5 min in prod
});

// Export types
export type { ApiClientOptions };
export default apiClient;
