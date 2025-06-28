export interface PinboardItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  dueDate?: Date;
  completed: boolean;
  caseId?: string;
}

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  title: string;
  description: string;
  date: Date;
  type: "filing" | "hearing" | "order" | "payment" | "document" | "meeting";
  status: "completed" | "upcoming" | "overdue";
  documents?: string[];
  notes?: string;
}

export interface CaseFolder {
  id: string;
  title: string;
  caseNumber: string;
  clientName: string;
  caseType: string;
  court: string;
  status: string;
  priority: "high" | "medium" | "low";
  startDate: Date;
  nextHearing?: Date;
  assignedLawyer: string;
  description: string;
  documents: Document[];
  timeline: CaseTimelineEvent[];
  notes: SecureNote[];
  messages: Message[];
}

export interface SecureNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  encrypted: boolean;
  tags: string[];
  caseId?: string;
  isPrivate: boolean;
}

export interface LegalTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  placeholders: string[];
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdAt: Date;
  lastReviewed?: Date;
  timesReviewed: number;
  correctAnswers: number;
}

export interface FlashcardSession {
  id: string;
  userId: string;
  category: string;
  totalCards: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  caseId?: string;
  url: string;
  thumbnailUrl?: string;
  ocrText?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  sentAt: Date;
  readAt?: Date;
  caseId?: string;
  attachments?: Document[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: "hearing" | "meeting" | "deadline" | "reminder";
  caseId?: string;
  location?: string;
  attendees?: string[];
  reminders: number[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "case_update" | "hearing_reminder" | "deadline" | "message" | "system";
  priority: "high" | "medium" | "low";
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  data?: any;
}

export interface VoiceQuery {
  id: string;
  userId: string;
  query: string;
  language: string;
  response: string;
  createdAt: Date;
  accuracy: number;
}

export interface LegalSection {
  section: string;
  title: string;
  description: string;
}

export interface SectionComparison {
  ipcSection: LegalSection;
  bnsSection: LegalSection;
  similarities: string[];
  differences: string[];
  notes: string;
}

export interface UserStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  upcomingHearings: number;
  flashcardScore: number;
  documentsScanned: number;
  notesCreated: number;
  templatesUsed: number;
}
