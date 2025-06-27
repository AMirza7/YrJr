// Central API services export
export { default as AuthApiService } from "./authApi";
export { default as CourtOrdersApiService } from "./courtOrdersApi";
export { default as MessagesApiService } from "./messagesApi";
export { default as LawyersApiService } from "./lawyersApi";

// Additional API services (with mock implementations)
import { httpClient, ApiResponse } from "@/services/httpClient";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";

// Mock delay utility
const mockDelay = (ms: number = Config.MOCK_API_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ==================== CASE MANAGEMENT API ====================
export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  status: "ACTIVE" | "PENDING" | "CLOSED" | "DISMISSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  clientName: string;
  clientContact: string;
  assignedLawyer: string;
  courtName?: string;
  nextHearing?: Date;
  filingDate: Date;
  lastUpdated: Date;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }>;
  timeline: Array<{
    id: string;
    event: string;
    date: Date;
    description: string;
  }>;
  notes: string;
  tags: string[];
}

export class CaseManagementApiService {
  static async getCases(filters?: any): Promise<ApiResponse<LegalCase[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const mockCases: LegalCase[] = [
        {
          id: "case_001",
          caseNumber: "CRL.M.C. 456/2024",
          title: "Quashing of FIR - Cyber Crime",
          description: "Petition seeking quashing of FIR under Section 420 IPC",
          caseType: "Criminal",
          status: "ACTIVE",
          priority: "HIGH",
          clientName: "ABC Pvt. Ltd.",
          clientContact: "+91 9876543210",
          assignedLawyer: "Advocate Rajesh Kumar",
          courtName: "Delhi High Court",
          nextHearing: new Date("2024-12-20"),
          filingDate: new Date("2024-11-15"),
          lastUpdated: new Date(),
          documents: [],
          timeline: [],
          notes: "Case filed for quashing FIR. Strong grounds available.",
          tags: ["Cyber Crime", "Quashing", "Section 420"],
        },
      ];

      return {
        success: true,
        data: mockCases,
        message: "Cases fetched successfully",
      };
    }

    return httpClient.get<LegalCase[]>("/cases");
  }

  static async createCase(
    caseData: Partial<LegalCase>,
  ): Promise<ApiResponse<LegalCase>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const newCase: LegalCase = {
        id: `case_${Date.now()}`,
        caseNumber: `CASE/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
        title: caseData.title || "New Case",
        description: caseData.description || "",
        caseType: caseData.caseType || "General",
        status: "ACTIVE",
        priority: caseData.priority || "MEDIUM",
        clientName: caseData.clientName || "",
        clientContact: caseData.clientContact || "",
        assignedLawyer: caseData.assignedLawyer || "",
        filingDate: new Date(),
        lastUpdated: new Date(),
        documents: [],
        timeline: [],
        notes: caseData.notes || "",
        tags: caseData.tags || [],
      };

      return {
        success: true,
        data: newCase,
        message: "Case created successfully",
      };
    }

    return httpClient.post<LegalCase>("/cases", caseData);
  }

  static async updateCase(
    id: string,
    updates: Partial<LegalCase>,
  ): Promise<ApiResponse<LegalCase>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Mock update logic
      const updatedCase = {
        ...updates,
        id,
        lastUpdated: new Date(),
      } as LegalCase;

      return {
        success: true,
        data: updatedCase,
        message: "Case updated successfully",
      };
    }

    return httpClient.put<LegalCase>(`/cases/${id}`, updates);
  }
}

// ==================== NOTIFICATIONS API ====================
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type:
    | "case_update"
    | "court_hearing"
    | "message"
    | "document_verified"
    | "system";
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  data?: Record<string, any>;
  timestamp: Date;
  userId: string;
}

export class NotificationsApiService {
  static async getNotifications(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<AppNotification[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const mockNotifications: AppNotification[] = [
        {
          id: "notif_001",
          title: "Court Hearing Tomorrow",
          body: "You have a court hearing scheduled for tomorrow at 10:00 AM",
          type: "court_hearing",
          isRead: false,
          priority: "high",
          timestamp: new Date(),
          userId: "current_user",
        },
        {
          id: "notif_002",
          title: "New Message",
          body: "You have received a new message from Advocate Priya",
          type: "message",
          isRead: true,
          priority: "medium",
          timestamp: new Date(Date.now() - 3600000),
          userId: "current_user",
        },
      ];

      return {
        success: true,
        data: mockNotifications,
        message: "Notifications fetched successfully",
      };
    }

    return httpClient.get<AppNotification[]>(
      `/notifications?page=${page}&limit=${limit}`,
    );
  }

  static async markAsRead(notificationId: string): Promise<ApiResponse<{}>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: {},
        message: "Notification marked as read",
      };
    }

    return httpClient.put(`/notifications/${notificationId}/read`);
  }

  static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      return {
        success: true,
        data: { count: 3 },
        message: "Unread count fetched successfully",
      };
    }

    return httpClient.get<{ count: number }>("/notifications/unread-count");
  }
}

// ==================== SECURE VAULT API ====================
export interface VaultDocument {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  isEncrypted: boolean;
  tags: string[];
  uploadedAt: Date;
  lastAccessed?: Date;
  accessCount: number;
}

export class SecureVaultApiService {
  static async getDocuments(): Promise<ApiResponse<VaultDocument[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const mockDocuments: VaultDocument[] = [
        {
          id: "vault_001",
          name: "Confidential Agreement.pdf",
          description: "NDA with client ABC Corp",
          fileUrl: "https://cdn.yrjr.app/vault/doc_001.pdf",
          fileSize: 245760,
          mimeType: "application/pdf",
          isEncrypted: true,
          tags: ["NDA", "Confidential", "ABC Corp"],
          uploadedAt: new Date(),
          accessCount: 5,
        },
      ];

      return {
        success: true,
        data: mockDocuments,
        message: "Vault documents fetched successfully",
      };
    }

    return httpClient.get<VaultDocument[]>("/vault/documents");
  }

  static async uploadDocument(
    file: any,
    metadata: any,
  ): Promise<ApiResponse<VaultDocument>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000);

      const newDocument: VaultDocument = {
        id: `vault_${Date.now()}`,
        name: metadata.name || "New Document",
        description: metadata.description,
        fileUrl: "https://cdn.yrjr.app/vault/placeholder.pdf",
        fileSize: 100000,
        mimeType: "application/pdf",
        isEncrypted: true,
        tags: metadata.tags || [],
        uploadedAt: new Date(),
        accessCount: 0,
      };

      return {
        success: true,
        data: newDocument,
        message: "Document uploaded successfully",
      };
    }

    return httpClient.uploadFile<VaultDocument>("/vault/upload", file);
  }
}

// ==================== TEMPLATES API ====================
export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "date" | "number" | "select";
    required: boolean;
    options?: string[];
  }>;
  isPopular: boolean;
  downloadCount: number;
  createdAt: Date;
}

export class TemplatesApiService {
  static async getTemplates(
    category?: string,
  ): Promise<ApiResponse<LegalTemplate[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const mockTemplates: LegalTemplate[] = [
        {
          id: "template_001",
          title: "General Affidavit",
          description: "A general purpose affidavit template",
          category: "Affidavit",
          content: "AFFIDAVIT\n\nI, {name}, do hereby solemnly affirm...",
          fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "date", label: "Date", type: "date", required: true },
          ],
          isPopular: true,
          downloadCount: 1250,
          createdAt: new Date(),
        },
      ];

      return {
        success: true,
        data: mockTemplates,
        message: "Templates fetched successfully",
      };
    }

    return httpClient.get<LegalTemplate[]>(
      `/templates${category ? `?category=${category}` : ""}`,
    );
  }

  static async generateDocument(
    templateId: string,
    data: Record<string, any>,
  ): Promise<ApiResponse<{ documentUrl: string }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000);

      return {
        success: true,
        data: { documentUrl: "https://cdn.yrjr.app/generated/document.pdf" },
        message: "Document generated successfully",
      };
    }

    return httpClient.post<{ documentUrl: string }>(
      `/templates/${templateId}/generate`,
      data,
    );
  }
}

// ==================== AI ASSISTANT API ====================
export interface AIQuery {
  query: string;
  context?: string;
  language?: string;
}

export interface AIResponse {
  response: string;
  confidence: number;
  suggestions?: string[];
  references?: Array<{
    title: string;
    url: string;
    type: "case" | "section" | "article";
  }>;
}

export class AIAssistantApiService {
  static async query(queryData: AIQuery): Promise<ApiResponse<AIResponse>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000);

      const mockResponse: AIResponse = {
        response: `Based on your query about "${queryData.query}", here's what I found:\n\nThis appears to be related to legal proceedings under the Indian legal system. The relevant provisions would depend on the specific circumstances of your case.\n\nWould you like me to explain any specific legal section or procedure?`,
        confidence: 0.85,
        suggestions: [
          "Explain IPC Section 420",
          "How to file a bail application",
          "What is the procedure for divorce",
        ],
        references: [
          {
            title: "Indian Penal Code Section 420",
            url: "/legal-sections/ipc-420",
            type: "section",
          },
        ],
      };

      return {
        success: true,
        data: mockResponse,
        message: "AI response generated successfully",
      };
    }

    return httpClient.post<AIResponse>("/ai/query", queryData);
  }
}

// ==================== DOCUMENT SCANNER API ====================
export interface ScanResult {
  extractedText: string;
  confidence: number;
  detectedFields: Record<string, string>;
  documentType?: string;
  suggestions: string[];
}

export class DocumentScannerApiService {
  static async scanDocument(imageFile: any): Promise<ApiResponse<ScanResult>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(3000);

      const mockResult: ScanResult = {
        extractedText:
          "FIRST INFORMATION REPORT\n\nFIR No: 123/2024\nPolice Station: Civil Lines\nDate: 15/12/2024\n\nComplainant: Rajesh Kumar\nAddress: 123 Main Street, Delhi\n\nIncident Details: Theft of mobile phone from residence...",
        confidence: 0.92,
        detectedFields: {
          firNumber: "123/2024",
          policeStation: "Civil Lines",
          complainant: "Rajesh Kumar",
          date: "15/12/2024",
        },
        documentType: "FIR",
        suggestions: [
          "Generate FIR response template",
          "Search related case laws",
          "Find similar FIR patterns",
        ],
      };

      return {
        success: true,
        data: mockResult,
        message: "Document scanned successfully",
      };
    }

    return httpClient.uploadFile<ScanResult>("/scan/document", imageFile);
  }
}

// Export all services
export {
  CaseManagementApiService,
  NotificationsApiService,
  SecureVaultApiService,
  TemplatesApiService,
  AIAssistantApiService,
  DocumentScannerApiService,
};

// Export types
export type {
  LegalCase,
  AppNotification,
  VaultDocument,
  LegalTemplate,
  AIQuery,
  AIResponse,
  ScanResult,
};
