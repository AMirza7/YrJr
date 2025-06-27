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
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  displayTitle: string;
}

export interface RolePermissions {
  canEditCases: boolean;
  canViewClientFolders: boolean;
  canAccessSecureVault: boolean;
  canUsePinboard: boolean;
  canViewTimeline: boolean;
  canUseFlashcards: boolean;
  canCompareSections: boolean;
  maxClients: number;
  maxCases: number;
}
