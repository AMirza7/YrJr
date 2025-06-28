export type UserRole =
  | "lawyer"
  | "junior_lawyer"
  | "lawyer_assistant"
  | "law_office_helper"
  | "law_student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
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
}
