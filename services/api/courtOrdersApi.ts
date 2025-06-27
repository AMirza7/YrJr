import { httpClient, ApiResponse } from "@/services/httpClient";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";

// Court Orders API types
export interface CourtOrder {
  id: string;
  caseNumber: string;
  courtName: string;
  judgeName: string;
  orderDate: Date;
  orderType: "JUDGMENT" | "INTERIM" | "BAIL" | "NOTICE" | "SUMMONS" | "OTHER";
  parties: {
    petitioner: string[];
    respondent: string[];
  };
  subject: string;
  summary: string;
  content: string;
  status: "PENDING" | "DISPOSED" | "WITHDRAWN" | "DISMISSED";
  tags: string[];
  sections: string[];
  citations: string[];
  attachments: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  isPublic: boolean;
  isBookmarked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourtOrderFilters {
  search?: string;
  courtName?: string;
  orderType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  sections?: string[];
  tags?: string[];
  isBookmarked?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "date" | "relevance" | "title";
  sortOrder?: "asc" | "desc";
}

export interface BookmarkRequest {
  orderId: string;
  notes?: string;
  tags?: string[];
}

// Mock data for court orders
const MOCK_COURT_ORDERS: CourtOrder[] = [
  {
    id: "order_001",
    caseNumber: "CRL.M.C. 456/2024",
    courtName: "Delhi High Court",
    judgeName: "Justice Rajesh Sharma",
    orderDate: new Date("2024-12-15"),
    orderType: "JUDGMENT",
    parties: {
      petitioner: ["ABC Pvt. Ltd."],
      respondent: ["State of Delhi", "Commissioner of Police"],
    },
    subject: "Quashing of FIR under Section 420 IPC",
    summary:
      "Petition seeking quashing of FIR registered under Section 420 IPC on grounds of civil dispute.",
    content: `ORDER

This petition has been filed under Section 482 of the Code of Criminal Procedure, 1973 seeking quashing of FIR No. 123/2024 registered at Police Station Civil Lines, Delhi under Section 420 of the Indian Penal Code.

FACTS:
The petitioner company entered into a business agreement with the complainant for supply of goods. Disputes arose regarding quality and payment terms.

LEGAL POSITION:
The Supreme Court in State of Haryana v. Bhajan Lal has laid down guidelines for quashing of FIR. The matter appears to be purely civil in nature.

DECISION:
After hearing both parties and considering the materials on record, this court is of the opinion that the FIR discloses a civil dispute rather than criminal misconduct.

The petition is allowed. The FIR is hereby quashed.`,
    status: "DISPOSED",
    tags: ["Section 482", "Quashing", "Civil Dispute"],
    sections: ["IPC 420", "CrPC 482"],
    citations: [
      "State of Haryana v. Bhajan Lal",
      "R.P. Kapur v. State of Punjab",
    ],
    attachments: [
      {
        id: "att_001",
        name: "judgment_full.pdf",
        url: "https://cdn.yrjr.app/orders/order_001.pdf",
        size: 245760,
        type: "application/pdf",
      },
    ],
    isPublic: true,
    isBookmarked: false,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "order_002",
    caseNumber: "Crl. A. 789/2024",
    courtName: "Supreme Court of India",
    judgeName: "Justice Priya Mehta, Justice Arjun Singh",
    orderDate: new Date("2024-12-10"),
    orderType: "BAIL",
    parties: {
      petitioner: ["Ramesh Kumar"],
      respondent: ["State of Maharashtra"],
    },
    subject: "Bail Application under Section 437 CrPC",
    summary:
      "Application for regular bail in connection with FIR under Sections 302, 307 IPC.",
    content: `BAIL ORDER

The applicant has been in custody since 15.08.2024 in connection with FIR No. 456/2024 under Sections 302, 307 of IPC.

SUBMISSIONS:
Learned counsel for the applicant submitted that the applicant is innocent and has been falsely implicated. Investigation is complete and charge sheet has been filed.

COUNTER SUBMISSIONS:
The State opposed the bail application stating that the offences are serious in nature and the applicant is a flight risk.

CONSIDERATION:
While the offences are serious, the applicant has no previous criminal antecedents. The investigation is complete and there is no apprehension of tampering with evidence.

ORDER:
The bail application is allowed subject to conditions:
1. Furnishing personal bond of Rs. 2,00,000/-
2. Not to leave the city without court permission
3. Report to investigating officer monthly`,
    status: "DISPOSED",
    tags: ["Bail", "Section 302", "Criminal Appeal"],
    sections: ["IPC 302", "IPC 307", "CrPC 437"],
    citations: ["Gurcharan Singh v. State of Punjab"],
    attachments: [
      {
        id: "att_002",
        name: "bail_order.pdf",
        url: "https://cdn.yrjr.app/orders/order_002.pdf",
        size: 123456,
        type: "application/pdf",
      },
    ],
    isPublic: true,
    isBookmarked: true,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-10"),
  },
  {
    id: "order_003",
    caseNumber: "W.P. 1234/2024",
    courtName: "Bombay High Court",
    judgeName: "Justice Kavita Desai",
    orderDate: new Date("2024-12-08"),
    orderType: "INTERIM",
    parties: {
      petitioner: ["Citizens Welfare Association"],
      respondent: ["Municipal Corporation of Mumbai", "State of Maharashtra"],
    },
    subject: "Interim Relief for Environmental Protection",
    summary:
      "Writ petition seeking interim relief against construction activities affecting environment.",
    content: `INTERIM ORDER

This writ petition challenges the construction of a commercial complex without environmental clearance.

URGENCY:
The petitioners have demonstrated prima facie case and irreparable loss to environment if construction continues.

INTERIM RELIEF:
Considering the environmental concerns and pending detailed hearing:

1. The respondents are restrained from continuing construction activities
2. Status quo to be maintained
3. Respondents to file counter affidavit within 4 weeks
4. Next hearing on 15.01.2025

This order is subject to the final outcome of the petition.`,
    status: "PENDING",
    tags: ["Environment", "Interim Relief", "Public Interest"],
    sections: ["Environment Protection Act", "Article 21"],
    citations: ["M.C. Mehta v. Union of India"],
    attachments: [],
    isPublic: true,
    isBookmarked: false,
    createdAt: new Date("2024-12-08"),
    updatedAt: new Date("2024-12-08"),
  },
];

// Mock delay utility
const mockDelay = (ms: number = Config.MOCK_API_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Court Orders API service
export class CourtOrdersApiService {
  // Get court orders with filters
  static async getCourtOrders(
    filters: CourtOrderFilters = {},
  ): Promise<ApiResponse<CourtOrder[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      let filteredOrders = [...MOCK_COURT_ORDERS];

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.subject.toLowerCase().includes(searchTerm) ||
            order.caseNumber.toLowerCase().includes(searchTerm) ||
            order.parties.petitioner.some((p) =>
              p.toLowerCase().includes(searchTerm),
            ) ||
            order.parties.respondent.some((r) =>
              r.toLowerCase().includes(searchTerm),
            ),
        );
      }

      if (filters.courtName) {
        filteredOrders = filteredOrders.filter((order) =>
          order.courtName
            .toLowerCase()
            .includes(filters.courtName!.toLowerCase()),
        );
      }

      if (filters.orderType) {
        filteredOrders = filteredOrders.filter(
          (order) => order.orderType === filters.orderType,
        );
      }

      if (filters.status) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === filters.status,
        );
      }

      if (filters.isBookmarked !== undefined) {
        filteredOrders = filteredOrders.filter(
          (order) => order.isBookmarked === filters.isBookmarked,
        );
      }

      // Apply sorting
      if (filters.sortBy === "date") {
        filteredOrders.sort((a, b) => {
          const dateA = a.orderDate.getTime();
          const dateB = b.orderDate.getTime();
          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(
        startIndex,
        startIndex + limit,
      );

      Logger.debug("Mock court orders fetched:", {
        total: filteredOrders.length,
        page,
        limit,
        returned: paginatedOrders.length,
      });

      return {
        success: true,
        data: paginatedOrders,
        message: "Court orders fetched successfully",
        pagination: {
          page,
          limit,
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / limit),
        },
      };
    }

    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(","));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return httpClient.get<CourtOrder[]>(
      `/court-orders?${queryParams.toString()}`,
    );
  }

  // Get single court order by ID
  static async getCourtOrderById(id: string): Promise<ApiResponse<CourtOrder>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const order = MOCK_COURT_ORDERS.find((o) => o.id === id);
      if (!order) {
        throw {
          success: false,
          message: "Court order not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: order,
        message: "Court order fetched successfully",
      };
    }

    return httpClient.get<CourtOrder>(`/court-orders/${id}`);
  }

  // Bookmark/unbookmark court order
  static async toggleBookmark(
    bookmarkData: BookmarkRequest,
  ): Promise<ApiResponse<{ isBookmarked: boolean }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const order = MOCK_COURT_ORDERS.find(
        (o) => o.id === bookmarkData.orderId,
      );
      if (!order) {
        throw {
          success: false,
          message: "Court order not found",
          statusCode: 404,
        };
      }

      order.isBookmarked = !order.isBookmarked;

      return {
        success: true,
        data: {
          isBookmarked: order.isBookmarked,
        },
        message: order.isBookmarked ? "Order bookmarked" : "Bookmark removed",
      };
    }

    return httpClient.post(
      `/court-orders/${bookmarkData.orderId}/bookmark`,
      bookmarkData,
    );
  }

  // Get bookmarked orders
  static async getBookmarkedOrders(): Promise<ApiResponse<CourtOrder[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const bookmarkedOrders = MOCK_COURT_ORDERS.filter(
        (order) => order.isBookmarked,
      );

      return {
        success: true,
        data: bookmarkedOrders,
        message: "Bookmarked orders fetched successfully",
      };
    }

    return httpClient.get<CourtOrder[]>("/court-orders/bookmarks");
  }

  // Download court order document
  static async downloadOrderDocument(
    orderId: string,
    attachmentId: string,
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(2000); // Longer delay for download

      const order = MOCK_COURT_ORDERS.find((o) => o.id === orderId);
      const attachment = order?.attachments.find((a) => a.id === attachmentId);

      if (!order || !attachment) {
        throw {
          success: false,
          message: "Document not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: {
          downloadUrl: attachment.url,
        },
        message: "Download URL generated successfully",
      };
    }

    return httpClient.get<{ downloadUrl: string }>(
      `/court-orders/${orderId}/download/${attachmentId}`,
    );
  }

  // Get court order statistics
  static async getOrderStatistics(): Promise<
    ApiResponse<{
      totalOrders: number;
      totalBookmarks: number;
      ordersByType: Record<string, number>;
      ordersByStatus: Record<string, number>;
      recentActivity: number;
    }>
  > {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const stats = {
        totalOrders: MOCK_COURT_ORDERS.length,
        totalBookmarks: MOCK_COURT_ORDERS.filter((o) => o.isBookmarked).length,
        ordersByType: MOCK_COURT_ORDERS.reduce(
          (acc, order) => {
            acc[order.orderType] = (acc[order.orderType] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        ordersByStatus: MOCK_COURT_ORDERS.reduce(
          (acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        recentActivity: MOCK_COURT_ORDERS.filter((order) => {
          const daysSinceUpdate =
            (Date.now() - order.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceUpdate <= 7;
        }).length,
      };

      return {
        success: true,
        data: stats,
        message: "Statistics fetched successfully",
      };
    }

    return httpClient.get("/court-orders/statistics");
  }

  // Search court orders with advanced filters
  static async searchCourtOrders(
    query: string,
    filters?: Partial<CourtOrderFilters>,
  ): Promise<ApiResponse<CourtOrder[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(1500);

      return this.getCourtOrders({ ...filters, search: query });
    }

    return httpClient.post<CourtOrder[]>("/court-orders/search", {
      query,
      filters,
    });
  }

  // Get suggested tags for court orders
  static async getSuggestedTags(): Promise<ApiResponse<string[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const allTags = MOCK_COURT_ORDERS.flatMap((order) => order.tags);
      const uniqueTags = Array.from(new Set(allTags));

      return {
        success: true,
        data: uniqueTags,
        message: "Suggested tags fetched successfully",
      };
    }

    return httpClient.get<string[]>("/court-orders/tags");
  }

  // Get court names for filter dropdown
  static async getCourtNames(): Promise<ApiResponse<string[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const courtNames = Array.from(
        new Set(MOCK_COURT_ORDERS.map((order) => order.courtName)),
      );

      return {
        success: true,
        data: courtNames,
        message: "Court names fetched successfully",
      };
    }

    return httpClient.get<string[]>("/court-orders/courts");
  }
}

export default CourtOrdersApiService;
