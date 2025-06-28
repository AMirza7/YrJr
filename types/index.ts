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
