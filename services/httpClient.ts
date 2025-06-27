import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";
import { tokenManager, AuthEvents } from "./tokenManager";

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  statusCode?: number;
}

// No need for local TokenManager - using enhanced version from tokenManager.ts

// HTTP Client class
class HttpClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
    this.setupTokenManagerEvents();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: Config.API_BASE_URL,
      timeout: Config.API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Client-Platform": Config.IS_IOS ? "ios" : "android",
        "X-Client-Version": "1.0.0", // You can get this from package.json
      },
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers["X-Request-ID"] = this.generateRequestId();

        Logger.debug(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            headers: config.headers,
            data: config.data,
          },
        );

        return config;
      },
      (error) => {
        Logger.error("Request interceptor error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        Logger.debug(
          `API Response: ${response.status} ${response.config.url}`,
          {
            data: response.data,
          },
        );

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        Logger.error(
          `API Error: ${error.response?.status} ${error.config?.url}`,
          {
            error: error.response?.data,
            status: error.response?.status,
          },
        );

        // Handle 401 errors (unauthorized)
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          if (this.isRefreshing) {
            // If already refreshing, wait for the new token
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await tokenManager.refreshAccessToken();
            if (newToken) {
              this.refreshSubscribers.forEach((callback) => callback(newToken));
              this.refreshSubscribers = [];
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            Logger.error("Token refresh failed:", refreshError);
            // Redirect to login or emit logout event
            this.handleAuthFailure();
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.normalizeError(error));
      },
    );
  }

  private handleAuthFailure(): void {
    // Clear tokens using enhanced token manager
    tokenManager.forceLogout();
    Logger.warn("Authentication failed, user needs to login again");
  }

  private setupTokenManagerEvents(): void {
    // Listen to token manager events
    tokenManager.on(AuthEvents.LOGIN_REQUIRED, () => {
      Logger.warn("Login required event received");
      // This will be handled by the auth context or navigation
    });

    tokenManager.on(AuthEvents.TOKEN_REFRESHED, (tokenData) => {
      Logger.debug("Token refreshed successfully");
    });

    tokenManager.on(AuthEvents.LOGOUT_COMPLETED, () => {
      Logger.debug("Logout completed");
    });
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private normalizeError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      success: false,
      message: "An unexpected error occurred",
      statusCode: error.response?.status,
    };

    if (error.response?.data) {
      const responseData = error.response.data as any;
      apiError.message = responseData.message || apiError.message;
      apiError.errors = responseData.errors;
      apiError.code = responseData.code;
    } else if (error.message) {
      apiError.message = error.message;
    }

    return apiError;
  }

  // Public methods for making HTTP requests
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(
    url: string,
    file: any,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response.data;
  }

  // Get axios instance for custom requests
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // Token management methods
  async setAuthTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn?: number,
  ): Promise<void> {
    await this.tokenManager.setTokens(accessToken, refreshToken, expiresIn);
  }

  async clearAuthTokens(): Promise<void> {
    await this.tokenManager.clearTokens();
  }

  async getAccessToken(): Promise<string | null> {
    return this.tokenManager.getAccessToken();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.tokenManager.getAccessToken();
    const isExpired = await this.tokenManager.isTokenExpired();
    return !!(token && !isExpired);
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient();

// Export types and utilities
export { TokenManager };
export default httpClient;
