import { httpClient, ApiResponse } from "@/services/httpClient";
import { Config } from "@/config/env";
import { Logger } from "@/utils/production";

// Lawyers API types
export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  experience: number;
  barCouncilId: string;
  isVerified: boolean;
  verificationDate?: Date;
  specializations: string[];
  languages: string[];
  location: {
    city: string;
    state: string;
    country: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  rating: {
    average: number;
    totalReviews: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  fees: {
    consultationFee: number;
    hourlyRate: number;
    caseMinimum?: number;
    currency: string;
  };
  availability: {
    isAvailable: boolean;
    nextAvailableSlot?: Date;
    workingHours: {
      [key: string]: { start: string; end: string } | null;
    };
    timeZone: string;
  };
  education: {
    degree: string;
    university: string;
    graduationYear: number;
  }[];
  achievements: string[];
  totalCases: number;
  successRate: number;
  responseTime: string; // e.g., "Usually responds within 2 hours"
  isOnline: boolean;
  lastSeen?: Date;
  joinedAt: Date;
  updatedAt: Date;
}

export interface LawyerReview {
  id: string;
  lawyerId: string;
  reviewerId: string;
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  caseType?: string;
  isVerified: boolean;
  helpfulVotes: number;
  createdAt: Date;
  response?: {
    content: string;
    respondedAt: Date;
  };
}

export interface LawyerFilters {
  search?: string;
  specializations?: string[];
  location?: {
    city?: string;
    state?: string;
    radius?: number; // in km
    coordinates?: { latitude: number; longitude: number };
  };
  experience?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
  };
  fees?: {
    min?: number;
    max?: number;
  };
  languages?: string[];
  isVerified?: boolean;
  isAvailable?: boolean;
  sortBy?: "rating" | "experience" | "fees" | "distance" | "responseTime";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ConsultationRequest {
  lawyerId: string;
  caseType: string;
  description: string;
  preferredDate: Date;
  preferredTime: string;
  isUrgent: boolean;
  budget?: number;
  contactMethod: "phone" | "video" | "inPerson";
}

export interface ReviewRequest {
  lawyerId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  caseType?: string;
}

// Mock data
const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "lawyer_001",
    name: "Advocate Rajesh Kumar Sharma",
    email: "rajesh.sharma@lawfirm.com",
    phone: "+91 9876543210",
    avatar: "https://cdn.yrjr.app/avatars/lawyer_001.jpg",
    bio: "Senior Criminal Lawyer with over 15 years of experience in handling complex criminal cases. Specialized in white-collar crimes, cyber crimes, and constitutional matters.",
    experience: 15,
    barCouncilId: "DL/2009/12345",
    isVerified: true,
    verificationDate: new Date("2024-01-15"),
    specializations: [
      "Criminal Law",
      "Cyber Crime",
      "Constitutional Law",
      "White Collar Crime",
    ],
    languages: ["English", "Hindi", "Punjabi"],
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      address: "Supreme Court Bar Association, New Delhi",
      coordinates: {
        latitude: 28.6139,
        longitude: 77.209,
      },
    },
    rating: {
      average: 4.8,
      totalReviews: 127,
      breakdown: {
        5: 89,
        4: 28,
        3: 7,
        2: 2,
        1: 1,
      },
    },
    fees: {
      consultationFee: 2500,
      hourlyRate: 8000,
      caseMinimum: 50000,
      currency: "INR",
    },
    availability: {
      isAvailable: true,
      nextAvailableSlot: new Date("2024-12-16T10:00:00Z"),
      workingHours: {
        monday: { start: "09:00", end: "18:00" },
        tuesday: { start: "09:00", end: "18:00" },
        wednesday: { start: "09:00", end: "18:00" },
        thursday: { start: "09:00", end: "18:00" },
        friday: { start: "09:00", end: "18:00" },
        saturday: { start: "10:00", end: "14:00" },
        sunday: null,
      },
      timeZone: "Asia/Kolkata",
    },
    education: [
      {
        degree: "B.A. LL.B (Hons)",
        university: "National Law School of India University, Bangalore",
        graduationYear: 2009,
      },
      {
        degree: "LL.M in Criminal Law",
        university: "Delhi University",
        graduationYear: 2011,
      },
    ],
    achievements: [
      "Best Young Lawyer Award 2015",
      "Successfully defended 250+ criminal cases",
      "Published 15 research papers on cyber law",
    ],
    totalCases: 267,
    successRate: 87.5,
    responseTime: "Usually responds within 2 hours",
    isOnline: true,
    joinedAt: new Date("2022-03-15"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "lawyer_002",
    name: "Advocate Priya Mehta",
    email: "priya.mehta@familylaw.in",
    phone: "+91 9876543211",
    avatar: "https://cdn.yrjr.app/avatars/lawyer_002.jpg",
    bio: "Experienced Family Law practitioner with a focus on matrimonial disputes, child custody, and women's rights. Certified mediator for family disputes.",
    experience: 12,
    barCouncilId: "MH/2012/67890",
    isVerified: true,
    verificationDate: new Date("2024-02-10"),
    specializations: [
      "Family Law",
      "Matrimonial Law",
      "Child Custody",
      "Women Rights",
    ],
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      address: "Bombay High Court Bar Association, Mumbai",
      coordinates: {
        latitude: 19.076,
        longitude: 72.8777,
      },
    },
    rating: {
      average: 4.6,
      totalReviews: 89,
      breakdown: {
        5: 62,
        4: 19,
        3: 6,
        2: 1,
        1: 1,
      },
    },
    fees: {
      consultationFee: 2000,
      hourlyRate: 6000,
      caseMinimum: 30000,
      currency: "INR",
    },
    availability: {
      isAvailable: true,
      nextAvailableSlot: new Date("2024-12-17T11:00:00Z"),
      workingHours: {
        monday: { start: "10:00", end: "17:00" },
        tuesday: { start: "10:00", end: "17:00" },
        wednesday: { start: "10:00", end: "17:00" },
        thursday: { start: "10:00", end: "17:00" },
        friday: { start: "10:00", end: "17:00" },
        saturday: { start: "10:00", end: "13:00" },
        sunday: null,
      },
      timeZone: "Asia/Kolkata",
    },
    education: [
      {
        degree: "B.A. LL.B",
        university: "Government Law College, Mumbai",
        graduationYear: 2012,
      },
    ],
    achievements: [
      "Successfully handled 180+ family law cases",
      "Certified Family Mediator",
      "Featured speaker at Women's Law conferences",
    ],
    totalCases: 198,
    successRate: 82.3,
    responseTime: "Usually responds within 4 hours",
    isOnline: false,
    lastSeen: new Date("2024-12-15T08:30:00Z"),
    joinedAt: new Date("2022-05-20"),
    updatedAt: new Date("2024-12-14"),
  },
  {
    id: "lawyer_003",
    name: "Advocate Arjun Singh",
    email: "arjun.singh@corporatelaw.co.in",
    phone: "+91 9876543212",
    bio: "Corporate and Commercial Law expert with extensive experience in mergers, acquisitions, and regulatory compliance.",
    experience: 18,
    barCouncilId: "KA/2006/54321",
    isVerified: true,
    verificationDate: new Date("2024-01-20"),
    specializations: [
      "Corporate Law",
      "Commercial Law",
      "M&A",
      "Regulatory Compliance",
    ],
    languages: ["English", "Hindi", "Kannada"],
    location: {
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      address: "High Court of Karnataka, Bangalore",
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
    },
    rating: {
      average: 4.9,
      totalReviews: 67,
      breakdown: {
        5: 59,
        4: 6,
        3: 1,
        2: 1,
        1: 0,
      },
    },
    fees: {
      consultationFee: 5000,
      hourlyRate: 15000,
      caseMinimum: 100000,
      currency: "INR",
    },
    availability: {
      isAvailable: false,
      nextAvailableSlot: new Date("2024-12-20T14:00:00Z"),
      workingHours: {
        monday: { start: "09:00", end: "19:00" },
        tuesday: { start: "09:00", end: "19:00" },
        wednesday: { start: "09:00", end: "19:00" },
        thursday: { start: "09:00", end: "19:00" },
        friday: { start: "09:00", end: "19:00" },
        saturday: null,
        sunday: null,
      },
      timeZone: "Asia/Kolkata",
    },
    education: [
      {
        degree: "B.Com LL.B",
        university: "National Law School of India University, Bangalore",
        graduationYear: 2006,
      },
      {
        degree: "LL.M in Corporate Law",
        university: "Harvard Law School",
        graduationYear: 2008,
      },
    ],
    achievements: [
      "Handled deals worth over ₹500 crores",
      "Legal consultant to Fortune 500 companies",
      'Author of "Indian Corporate Law Handbook"',
    ],
    totalCases: 156,
    successRate: 94.2,
    responseTime: "Usually responds within 1 hour",
    isOnline: true,
    joinedAt: new Date("2022-01-10"),
    updatedAt: new Date("2024-12-15"),
  },
];

const MOCK_REVIEWS: LawyerReview[] = [
  {
    id: "review_001",
    lawyerId: "lawyer_001",
    reviewerId: "client_001",
    reviewerName: "Amit Sharma",
    rating: 5,
    title: "Excellent criminal lawyer with great expertise",
    content:
      "Mr. Rajesh handled my cyber crime case with utmost professionalism. His knowledge of cyber laws is exceptional and he kept me informed throughout the process. Highly recommended!",
    caseType: "Cyber Crime",
    isVerified: true,
    helpfulVotes: 12,
    createdAt: new Date("2024-11-20"),
    response: {
      content:
        "Thank you for your kind words, Amit. It was a pleasure working on your case.",
      respondedAt: new Date("2024-11-21"),
    },
  },
  {
    id: "review_002",
    lawyerId: "lawyer_002",
    reviewerId: "client_002",
    reviewerName: "Sunita Patel",
    rating: 5,
    title: "Compassionate and skilled family lawyer",
    content:
      "Priya Ma'am handled my divorce case with great sensitivity. She understood the emotional aspects and provided excellent legal guidance. Very satisfied with the outcome.",
    caseType: "Divorce",
    isVerified: true,
    helpfulVotes: 8,
    createdAt: new Date("2024-10-15"),
  },
];

// Mock delay utility
const mockDelay = (ms: number = Config.MOCK_API_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Lawyers API service
export class LawyersApiService {
  // Get lawyers with filters
  static async getLawyers(
    filters: LawyerFilters = {},
  ): Promise<ApiResponse<Lawyer[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      let filteredLawyers = [...MOCK_LAWYERS];

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredLawyers = filteredLawyers.filter(
          (lawyer) =>
            lawyer.name.toLowerCase().includes(searchTerm) ||
            lawyer.bio.toLowerCase().includes(searchTerm) ||
            lawyer.specializations.some((spec) =>
              spec.toLowerCase().includes(searchTerm),
            ),
        );
      }

      // Apply specialization filter
      if (filters.specializations && filters.specializations.length > 0) {
        filteredLawyers = filteredLawyers.filter((lawyer) =>
          filters.specializations!.some((spec) =>
            lawyer.specializations.includes(spec),
          ),
        );
      }

      // Apply location filter
      if (filters.location?.city) {
        filteredLawyers = filteredLawyers.filter((lawyer) =>
          lawyer.location.city
            .toLowerCase()
            .includes(filters.location!.city!.toLowerCase()),
        );
      }

      // Apply experience filter
      if (filters.experience) {
        filteredLawyers = filteredLawyers.filter((lawyer) => {
          const exp = lawyer.experience;
          return (
            (!filters.experience!.min || exp >= filters.experience!.min) &&
            (!filters.experience!.max || exp <= filters.experience!.max)
          );
        });
      }

      // Apply rating filter
      if (filters.rating?.min) {
        filteredLawyers = filteredLawyers.filter(
          (lawyer) => lawyer.rating.average >= filters.rating!.min!,
        );
      }

      // Apply verification filter
      if (filters.isVerified !== undefined) {
        filteredLawyers = filteredLawyers.filter(
          (lawyer) => lawyer.isVerified === filters.isVerified,
        );
      }

      // Apply availability filter
      if (filters.isAvailable !== undefined) {
        filteredLawyers = filteredLawyers.filter(
          (lawyer) => lawyer.availability.isAvailable === filters.isAvailable,
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredLawyers.sort((a, b) => {
          let aValue: number, bValue: number;

          switch (filters.sortBy) {
            case "rating":
              aValue = a.rating.average;
              bValue = b.rating.average;
              break;
            case "experience":
              aValue = a.experience;
              bValue = b.experience;
              break;
            case "fees":
              aValue = a.fees.consultationFee;
              bValue = b.fees.consultationFee;
              break;
            default:
              return 0;
          }

          return filters.sortOrder === "asc"
            ? aValue - bValue
            : bValue - aValue;
        });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const paginatedLawyers = filteredLawyers.slice(
        startIndex,
        startIndex + limit,
      );

      Logger.debug("Mock lawyers fetched:", {
        total: filteredLawyers.length,
        page,
        limit,
        returned: paginatedLawyers.length,
      });

      return {
        success: true,
        data: paginatedLawyers,
        message: "Lawyers fetched successfully",
        pagination: {
          page,
          limit,
          total: filteredLawyers.length,
          totalPages: Math.ceil(filteredLawyers.length / limit),
        },
      };
    }

    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          queryParams.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          queryParams.append(key, value.join(","));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return httpClient.get<Lawyer[]>(`/lawyers?${queryParams.toString()}`);
  }

  // Get single lawyer by ID
  static async getLawyerById(id: string): Promise<ApiResponse<Lawyer>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const lawyer = MOCK_LAWYERS.find((l) => l.id === id);
      if (!lawyer) {
        throw {
          success: false,
          message: "Lawyer not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: lawyer,
        message: "Lawyer details fetched successfully",
      };
    }

    return httpClient.get<Lawyer>(`/lawyers/${id}`);
  }

  // Get lawyer reviews
  static async getLawyerReviews(
    lawyerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<LawyerReview[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const lawyerReviews = MOCK_REVIEWS.filter(
        (review) => review.lawyerId === lawyerId,
      );
      const startIndex = (page - 1) * limit;
      const paginatedReviews = lawyerReviews.slice(
        startIndex,
        startIndex + limit,
      );

      return {
        success: true,
        data: paginatedReviews,
        message: "Lawyer reviews fetched successfully",
        pagination: {
          page,
          limit,
          total: lawyerReviews.length,
          totalPages: Math.ceil(lawyerReviews.length / limit),
        },
      };
    }

    return httpClient.get<LawyerReview[]>(
      `/lawyers/${lawyerId}/reviews?page=${page}&limit=${limit}`,
    );
  }

  // Submit lawyer review
  static async submitReview(
    reviewData: ReviewRequest,
  ): Promise<ApiResponse<LawyerReview>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const newReview: LawyerReview = {
        id: `review_${Date.now()}`,
        lawyerId: reviewData.lawyerId,
        reviewerId: "current_user_id",
        reviewerName: "Current User", // Would come from auth context
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        caseType: reviewData.caseType,
        isVerified: false, // Would be verified later
        helpfulVotes: 0,
        createdAt: new Date(),
      };

      MOCK_REVIEWS.push(newReview);

      // Update lawyer's rating
      const lawyer = MOCK_LAWYERS.find((l) => l.id === reviewData.lawyerId);
      if (lawyer) {
        lawyer.rating.breakdown[reviewData.rating]++;
        lawyer.rating.totalReviews++;

        // Recalculate average
        const totalRating = Object.entries(lawyer.rating.breakdown).reduce(
          (sum, [rating, count]) => sum + parseInt(rating) * count,
          0,
        );
        lawyer.rating.average = Number(
          (totalRating / lawyer.rating.totalReviews).toFixed(1),
        );
      }

      return {
        success: true,
        data: newReview,
        message: "Review submitted successfully",
      };
    }

    return httpClient.post<LawyerReview>("/lawyers/reviews", reviewData);
  }

  // Request consultation
  static async requestConsultation(
    consultationData: ConsultationRequest,
  ): Promise<ApiResponse<{ consultationId: string }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay(1500);

      const consultationId = `consultation_${Date.now()}`;

      return {
        success: true,
        data: { consultationId },
        message:
          "Consultation request sent successfully. The lawyer will respond soon.",
      };
    }

    return httpClient.post<{ consultationId: string }>(
      "/lawyers/consultations",
      consultationData,
    );
  }

  // Get lawyer availability
  static async getLawyerAvailability(
    lawyerId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<ApiResponse<{ availableSlots: Date[] }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Generate mock available slots
      const slots: Date[] = [];
      const current = new Date(dateFrom);

      while (current <= dateTo) {
        // Skip weekends for simplicity
        if (current.getDay() !== 0 && current.getDay() !== 6) {
          // Add morning and afternoon slots
          slots.push(new Date(current.setHours(10, 0, 0, 0)));
          slots.push(new Date(current.setHours(14, 0, 0, 0)));
          slots.push(new Date(current.setHours(16, 0, 0, 0)));
        }
        current.setDate(current.getDate() + 1);
      }

      return {
        success: true,
        data: { availableSlots: slots.slice(0, 20) }, // Limit to 20 slots
        message: "Availability fetched successfully",
      };
    }

    return httpClient.get<{ availableSlots: Date[] }>(
      `/lawyers/${lawyerId}/availability?from=${dateFrom.toISOString()}&to=${dateTo.toISOString()}`,
    );
  }

  // Mark review as helpful
  static async markReviewHelpful(
    reviewId: string,
  ): Promise<ApiResponse<{ helpfulVotes: number }>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
      if (!review) {
        throw {
          success: false,
          message: "Review not found",
          statusCode: 404,
        };
      }

      review.helpfulVotes++;

      return {
        success: true,
        data: { helpfulVotes: review.helpfulVotes },
        message: "Review marked as helpful",
      };
    }

    return httpClient.post<{ helpfulVotes: number }>(
      `/lawyers/reviews/${reviewId}/helpful`,
    );
  }

  // Get specializations list
  static async getSpecializations(): Promise<ApiResponse<string[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      const allSpecializations = MOCK_LAWYERS.flatMap(
        (lawyer) => lawyer.specializations,
      );
      const uniqueSpecializations = Array.from(
        new Set(allSpecializations),
      ).sort();

      return {
        success: true,
        data: uniqueSpecializations,
        message: "Specializations fetched successfully",
      };
    }

    return httpClient.get<string[]>("/lawyers/specializations");
  }

  // Get featured lawyers
  static async getFeaturedLawyers(): Promise<ApiResponse<Lawyer[]>> {
    if (Config.ENABLE_API_MOCKS) {
      await mockDelay();

      // Return top-rated lawyers
      const featuredLawyers = MOCK_LAWYERS.filter(
        (lawyer) => lawyer.rating.average >= 4.5,
      )
        .sort((a, b) => b.rating.average - a.rating.average)
        .slice(0, 5);

      return {
        success: true,
        data: featuredLawyers,
        message: "Featured lawyers fetched successfully",
      };
    }

    return httpClient.get<Lawyer[]>("/lawyers/featured");
  }
}

export default LawyersApiService;
