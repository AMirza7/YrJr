export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  name: string;
  profileImage?: string;
  barCouncilId?: string;
  isVerified: boolean;
  subscription: SubscriptionPlan;
  language: string;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole =
  | "lawyer"
  | "junior_lawyer"
  | "lawyer_assistant"
  | "law_office_helper"
  | "law_student";

export interface SubscriptionPlan {
  type: "monthly" | "quarterly" | "yearly";
  price: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: "bar_council_id" | "law_degree" | "experience_certificate" | "other";
  url: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface Case {
  id: string;
  title: string;
  clientName: string;
  courtName: string;
  judgeName: string;
  caseNumber: string;
  nextHearing: Date;
  status: "pending" | "ongoing" | "completed" | "dismissed";
  notes: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourtOrder {
  id: string;
  title: string;
  court: string;
  judge: string;
  date: Date;
  type: "judgment" | "order" | "notice";
  summary: string;
  pdfUrl: string;
  tags: string[];
  importance: "low" | "medium" | "high";
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  groupId?: string;
  content: string;
  type: "text" | "file" | "audio" | "image";
  timestamp: Date;
  isRead: boolean;
  fileUrl?: string;
  fileName?: string;
}

export interface LegalGuide {
  id: string;
  title: string;
  category: string;
  content: string;
  steps: string[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
}

export interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  location: string;
  experience: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  barCouncilId: string;
  contactEnabled: boolean;
  profileImage?: string;
  bio: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: Date;
  isAnswered: boolean;
}

export interface NotificationSettings {
  courtOrders: boolean;
  caseReminders: boolean;
  messages: boolean;
  communityUpdates: boolean;
  quizReminders: boolean;
  legalUpdates: boolean;
}

export interface AppSettings {
  language: string;
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
}

export interface SearchFilters {
  courtType?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  judge?: string;
  category?: string;
  tags?: string[];
}

export interface VoiceCommand {
  text: string;
  language: string;
  confidence: number;
  intent?: string;
}
