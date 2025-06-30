export type UserRole =
  | "lawyer"
  | "junior_lawyer"
  | "lawyer_assistant"
  | "law_office_helper"
  | "law_student"
  | "admin";

export type SubscriptionTier = "free" | "pro" | "premium";

export type ThemeMode = "light" | "dark" | "modern" | "system";

export type Language =
  | "en"
  | "hi"
  | "ur"
  | "bn"
  | "te"
  | "ta"
  | "mr"
  | "gu"
  | "kn"
  | "ml";

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  isApproved: boolean;
  hasVerificationBadge: boolean;
  subscriptionTier: SubscriptionTier;
  profilePicture?: string;
  bio?: string;
  specialization?: string[];
  practiceYears?: number;
  barCouncilNumber?: string;
  officeAddress?: string;
  createdAt: string;
  lastActiveAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: Language;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  caseUpdates: boolean;
  reminders: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  contactInfoVisible: boolean;
  showOnlineStatus: boolean;
}

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  displayTitle: string;
}

export interface TabConfig {
  name: string;
  title: string;
  icon: string;
  requiredRoles: UserRole[];
  color: string;
}

export interface NavigationPermissions {
  canAccessPinboard: boolean;
  canAccessCaseTimeline: boolean;
  canAccessSecureNotes: boolean;
  canAccessAIComparator: boolean;
  canAccessTemplates: boolean;
  canAccessFlashcards: boolean;
  canAccessCaseFolders: boolean;
  canAccessDocumentScanner: boolean;
  canAccessVoiceAssistant: boolean;
  canAccessCalendar: boolean;
  canAccessNotifications: boolean;
  canAccessAdmin: boolean;
  canAccessAnalytics: boolean;
  canManageUsers: boolean;
  canManageSubscriptions: boolean;
  canAccessSettings: boolean;
}

export interface LegalTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  downloads: number;
  rating: number;
  isPublic: boolean;
  requiredRole: UserRole[];
  subscriptionRequired: SubscriptionTier;
}

export interface PinboardItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category:
    | "case"
    | "research"
    | "deadline"
    | "meeting"
    | "document"
    | "reminder";
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  attachments: FileAttachment[];
  dueDate?: string;
  isCompleted: boolean;
  reminders: Reminder[];
  comments: Comment[];
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Reminder {
  id: string;
  message: string;
  scheduleFor: string;
  isActive: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  nextReview: string;
  reviewCount: number;
  correctCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: string[];
  isPublic: boolean;
  createdBy: string;
  tags: string[];
  createdAt: string;
}

export interface SecureNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isEncrypted: boolean;
  requiresBiometric: boolean;
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseTimeline {
  id: string;
  userId: string;
  caseNumber: string;
  title: string;
  description: string;
  status: "active" | "pending" | "closed" | "on_hold";
  courtName: string;
  judgeDetails?: string;
  nextHearing?: string;
  events: TimelineEvent[];
  documents: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "hearing" | "filing" | "meeting" | "deadline" | "milestone";
  isCompleted: boolean;
  attachments: FileAttachment[];
}

export interface LegalSearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  section?: string;
  act?: string;
  relevanceScore: number;
  type: "act" | "case_law" | "regulation" | "precedent";
  url?: string;
  tags: string[];
}

export interface SearchFilter {
  source?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  court?: string[];
  judge?: string[];
  category?: string[];
  jurisdiction?: string[];
}

export interface AIComparison {
  id: string;
  ipcSection: string;
  bnsSection: string;
  comparison: {
    similarities: string[];
    differences: string[];
    keyChanges: string[];
    practicalImplications: string[];
  };
  timestamp: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: "active" | "cancelled" | "expired" | "pending";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  features: string[];
}

export interface PaymentMethod {
  type: "upi" | "card" | "netbanking" | "wallet";
  provider: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  subscriptionRevenue: number;
  pendingApprovals: number;
  totalCases: number;
  totalTemplates: number;
  systemHealth: "good" | "warning" | "critical";
}

export interface UserManagement {
  id: string;
  userId: string;
  action: "approved" | "rejected" | "verified" | "suspended" | "activated";
  reason?: string;
  performedBy: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "reminder";
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AppSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  minAppVersion: string;
  maxConcurrentUsers: number;
  featuresEnabled: {
    aiComparator: boolean;
    templates: boolean;
    flashcards: boolean;
    payments: boolean;
    notifications: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  requiresVerification?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  specialization?: string[];
  practiceYears?: number;
  barCouncilNumber?: string;
  officeAddress?: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  fallbackToPassword?: boolean;
}

export interface VoiceSearchResult {
  transcript: string;
  confidence: number;
  searchQuery: string;
}

export interface DocumentScanResult {
  text: string;
  confidence: number;
  boundingBoxes: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface LegalConstant {
  id: string;
  section: string;
  title: string;
  description: string;
  act: string;
  chapter?: string;
  amendments?: Array<{
    date: string;
    description: string;
  }>;
  relatedSections?: string[];
  keywords: string[];
}

export interface FeatureAccess {
  [key: string]: {
    enabled: boolean;
    subscriptionRequired?: SubscriptionTier;
    roleRequired?: UserRole[];
  };
}

export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  typography: {
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}
