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

// New types for advanced features
export interface PinnedItem {
  id: string;
  title: string;
  content: string;
  type: "note" | "case_link" | "update" | "reminder";
  color: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  linkedCaseId?: string;
}

export interface CaseTimeline {
  id: string;
  caseId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  milestone: "fir" | "investigation" | "hearing" | "orders" | "judgment";
  date: Date;
  documents: Document[];
  notes: string;
  assignedTo?: string;
}

export interface SecureNote {
  id: string;
  title: string;
  content: string;
  caseId?: string;
  tags: string[];
  priority: "low" | "medium" | "high";
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
}

export interface LegalSection {
  number: string;
  title: string;
  description: string;
  punishment?: string;
  bail?: string;
  cognizable: boolean;
  compoundable: boolean;
  category: string;
}

export interface SectionComparison {
  ipcSection: LegalSection;
  bnsSection: LegalSection;
  differences: string[];
  similarities: string[];
  migrationNotes: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: "ipc" | "crpc" | "landmark_cases" | "constitution" | "evidence_act";
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  imageUrl?: string;
  examples?: string[];
  relatedSections?: string[];
}

export interface FlashcardProgress {
  cardId: string;
  correct: number;
  incorrect: number;
  lastReviewed: Date;
  confidence: number;
  nextReview: Date;
}

export interface ClientFolder {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  cases: Case[];
  totalValue: number;
  status: "active" | "inactive" | "completed";
  createdAt: Date;
  lastActivity: Date;
  notes: string;
  color: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  cards: Flashcard[];
  currentIndex: number;
  score: number;
  totalQuestions: number;
  startTime: Date;
  endTime?: Date;
  mode: "learn" | "quiz";
  category: string;
}
