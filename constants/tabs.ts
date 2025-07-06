import { TabConfig, UserRole, NavigationPermissions } from "@/types";

export const TAB_CONFIGS: TabConfig[] = [
  {
    name: "home",
    title: "Home",
    icon: "🏠",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
      "law_student",
    ],
    color: "#1e40af",
  },
  {
    name: "pinboard",
    title: "Pinboard",
    icon: "📌",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
    ],
    color: "#7c3aed",
  },
  {
    name: "timeline",
    title: "Cases",
    icon: "⏱️",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
    ],
    color: "#059669",
  },
  {
    name: "notes",
    title: "Notes",
    icon: "🔐",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
    ],
    color: "#dc2626",
  },
  {
    name: "scanner",
    title: "Scanner",
    icon: "📱",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
      "law_student",
    ],
    color: "#8b5cf6",
  },
  {
    name: "search",
    title: "Search",
    icon: "🔍",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
      "law_student",
    ],
    color: "#ea580c",
  },
  {
    name: "referrals",
    title: "Referrals",
    icon: "🎁",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
      "law_student",
    ],
    color: "#059669",
  },
  {
    name: "wallet",
    title: "Wallet",
    icon: "💰",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
      "law_student",
    ],
    color: "#dc2626",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "👤",
    requiredRoles: [
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "legal_clerk_typist",
      "law_office_helper",
      "law_student",
    ],
    color: "#6b7280",
  },
];

export const getRolePermissions = (role: UserRole): NavigationPermissions => {
  const basePermissions: NavigationPermissions = {
    canAccessPinboard: false,
    canAccessCaseTimeline: false,
    canAccessSecureNotes: false,
    canAccessAIComparator: false,
    canAccessTemplates: false,
    canAccessFlashcards: false,
    canAccessCaseFolders: false,
    canAccessDocumentScanner: false,
    canAccessVoiceAssistant: false,
    canAccessCalendar: false,
    canAccessNotifications: false,
  };

  switch (role) {
    case "lawyer":
      return {
        ...basePermissions,
        canAccessPinboard: true,
        canAccessCaseTimeline: true,
        canAccessSecureNotes: true,
        canAccessAIComparator: true,
        canAccessTemplates: true,
        canAccessFlashcards: true,
        canAccessCaseFolders: true,
        canAccessDocumentScanner: true,
        canAccessVoiceAssistant: true,
        canAccessCalendar: true,
        canAccessNotifications: true,
      };

    case "junior_lawyer":
      return {
        ...basePermissions,
        canAccessPinboard: true,
        canAccessCaseTimeline: true,
        canAccessSecureNotes: true,
        canAccessAIComparator: true,
        canAccessTemplates: true,
        canAccessFlashcards: true,
        canAccessCaseFolders: true,
        canAccessDocumentScanner: true,
        canAccessVoiceAssistant: true,
        canAccessCalendar: true,
        canAccessNotifications: true,
      };

    case "lawyer_assistant":
      return {
        ...basePermissions,
        canAccessPinboard: true,
        canAccessCaseTimeline: true,
        canAccessSecureNotes: true,
        canAccessTemplates: true,
        canAccessFlashcards: true,
        canAccessCaseFolders: true,
        canAccessDocumentScanner: true,
        canAccessCalendar: true,
        canAccessNotifications: true,
      };

    case "law_office_helper":
      return {
        ...basePermissions,
        canAccessSecureNotes: true,
        canAccessTemplates: true,
        canAccessFlashcards: true,
        canAccessDocumentScanner: true,
        canAccessCalendar: true,
        canAccessNotifications: true,
      };

    case "law_student":
      return {
        ...basePermissions,
        canAccessAIComparator: true,
        canAccessTemplates: true,
        canAccessFlashcards: true,
        canAccessVoiceAssistant: true,
      };

    default:
      return basePermissions;
  }
};

export const getVisibleTabs = (
  role: UserRole,
  subscriptionTier?: string,
): TabConfig[] => {
  const allTabs = TAB_CONFIGS.filter((tab) => tab.requiredRoles.includes(role));

  // Filter out premium-only tabs for free users
  if (subscriptionTier === "free") {
    return allTabs.filter((tab) => !["referrals", "wallet"].includes(tab.name));
  }

  return allTabs;
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case "lawyer":
      return "#8B5CF6";
    case "junior_lawyer":
      return "#06B6D4";
    case "lawyer_assistant":
      return "#10B981";
    case "law_office_helper":
      return "#F59E0B";
    case "law_student":
      return "#EF4444";
    default:
      return "#64748b";
  }
};
