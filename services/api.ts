// API Service for handling all backend API calls
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Case Folders API
  async getCaseFolders() {
    return this.request("/cases/folders");
  }

  async getCaseFolder(id: string) {
    return this.request(`/cases/folders/${id}`);
  }

  async createCaseFolder(data: any) {
    return this.request("/cases/folders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCaseFolder(id: string, data: any) {
    return this.request(`/cases/folders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCaseFolder(id: string) {
    return this.request(`/cases/folders/${id}`, {
      method: "DELETE",
    });
  }

  // Calendar Events API
  async getCalendarEvents() {
    return this.request("/calendar-events");
  }

  async getCalendarEvent(id: string) {
    return this.request(`/calendar-events/${id}`);
  }

  async createCalendarEvent(data: any) {
    return this.request("/calendar-events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCalendarEvent(id: string, data: any) {
    return this.request(`/calendar-events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCalendarEvent(id: string) {
    return this.request(`/calendar-events/${id}`, {
      method: "DELETE",
    });
  }

  // Documents API
  async getDocuments() {
    return this.request("/documents");
  }

  async getDocument(id: string) {
    return this.request(`/documents/${id}`);
  }

  async uploadDocument(formData: FormData) {
    const url = `${this.baseUrl}/documents`;

    const config: RequestInit = {
      method: "POST",
      body: formData,
      headers: this.token
        ? {
            Authorization: `Bearer ${this.token}`,
          }
        : {},
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: "DELETE",
    });
  }

  // Legal Templates API
  async getLegalTemplates() {
    return this.request("/legal-templates");
  }

  async getLegalTemplate(id: string) {
    return this.request(`/legal-templates/${id}`);
  }

  async createLegalTemplate(data: any) {
    return this.request("/legal-templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLegalTemplate(id: string, data: any) {
    return this.request(`/legal-templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLegalTemplate(id: string) {
    return this.request(`/legal-templates/${id}`, {
      method: "DELETE",
    });
  }

  // Messages API
  async getConversations() {
    return this.request("/messages/conversations");
  }

  async getConversation(id: string) {
    return this.request(`/messages/conversations/${id}`);
  }

  async getMessages(conversationId: string) {
    return this.request(`/messages/${conversationId}`);
  }

  async sendMessage(data: {
    recipientId: string;
    content: string;
    caseId?: string;
  }) {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: "PUT",
    });
  }

  // Flashcards API
  async getFlashcards() {
    return this.request("/flashcards");
  }

  async createFlashcard(data: any) {
    return this.request("/flashcards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getFlashcardSessions() {
    return this.request("/flashcards/sessions");
  }

  async createFlashcardSession(data: {
    category: string;
    totalCards: number;
    correctAnswers: number;
    score: number;
    timeSpent: number;
  }) {
    return this.request("/flashcards/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Secure Notes API
  async getSecureNotes() {
    return this.request("/secure-notes");
  }

  async getSecureNote(id: string) {
    return this.request(`/secure-notes/${id}`);
  }

  async createSecureNote(data: {
    title: string;
    content: string;
    tags: string[];
    isEncrypted: boolean;
    requiresBiometric: boolean;
  }) {
    return this.request("/secure-notes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSecureNote(id: string, data: any) {
    return this.request(`/secure-notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSecureNote(id: string) {
    return this.request(`/secure-notes/${id}`, {
      method: "DELETE",
    });
  }

  // User Preferences API
  async getUserPreferences() {
    return this.request("/user/preferences");
  }

  async updateUserPreferences(data: any) {
    return this.request("/user/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Health Check
  async healthCheck() {
    return this.request("/health");
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for custom instances
export { ApiService };

// Helper function to set auth token
export const setApiToken = (token: string) => {
  apiService.setToken(token);
};

// Helper function for error handling
export const handleApiError = (error: any) => {
  console.error("API Error:", error);

  if (error.message?.includes("401")) {
    // Handle unauthorized - redirect to login
    return "Authentication required. Please log in again.";
  } else if (error.message?.includes("403")) {
    // Handle forbidden
    return "You do not have permission to perform this action.";
  } else if (error.message?.includes("404")) {
    // Handle not found
    return "The requested resource was not found.";
  } else if (error.message?.includes("500")) {
    // Handle server error
    return "Server error. Please try again later.";
  } else if (
    error.message?.includes("NetworkError") ||
    error.message?.includes("fetch")
  ) {
    // Handle network error
    return "Network error. Please check your connection.";
  } else {
    // Generic error
    return error.message || "An unexpected error occurred.";
  }
};
