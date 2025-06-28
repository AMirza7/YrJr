import {
  UserRole,
  NavigationPermissions,
  SubscriptionTier,
  FeatureAccess,
} from "@/types";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  lawyer: 90,
  junior_lawyer: 80,
  lawyer_assistant: 70,
  law_office_helper: 60,
  law_student: 50,
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin:
    "System administrator with full access to all features and user management",
  lawyer: "Senior legal practitioner with complete access to all legal tools",
  junior_lawyer:
    "Junior legal practitioner with comprehensive legal tool access",
  lawyer_assistant: "Legal support professional with case management access",
  law_office_helper: "Office support staff with limited administrative access",
  law_student: "Law student with educational and learning focused access",
};

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
    canAccessAdmin: false,
    canAccessAnalytics: false,
    canManageUsers: false,
    canManageSubscriptions: false,
    canAccessSettings: false,
  };

  switch (role) {
    case "admin":
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
        canAccessAdmin: true,
        canAccessAnalytics: true,
        canManageUsers: true,
        canManageSubscriptions: true,
        canAccessSettings: true,
      };

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
        canAccessSettings: true,
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
        canAccessSettings: true,
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
        canAccessSettings: true,
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
        canAccessSettings: true,
      };

    case "law_student":
      return {
        ...basePermissions,
        canAccessAIComparator: true,
        canAccessTemplates: true,
        canAccessFlashcards: true,
        canAccessVoiceAssistant: true,
        canAccessNotifications: true,
        canAccessSettings: true,
      };

    default:
      return basePermissions;
  }
};

export const FEATURE_ACCESS: FeatureAccess = {
  pinboard: {
    enabled: true,
    roleRequired: ["admin", "lawyer", "junior_lawyer", "lawyer_assistant"],
  },
  caseTimeline: {
    enabled: true,
    roleRequired: ["admin", "lawyer", "junior_lawyer", "lawyer_assistant"],
  },
  secureNotes: {
    enabled: true,
    roleRequired: [
      "admin",
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "law_office_helper",
    ],
  },
  aiComparator: {
    enabled: true,
    roleRequired: ["admin", "lawyer", "junior_lawyer", "law_student"],
  },
  templates: {
    enabled: true,
    roleRequired: [
      "admin",
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "law_office_helper",
      "law_student",
    ],
  },
  flashcards: {
    enabled: true,
    roleRequired: [
      "admin",
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "law_office_helper",
      "law_student",
    ],
  },
  documentScanner: {
    enabled: true,
    subscriptionRequired: "pro",
    roleRequired: [
      "admin",
      "lawyer",
      "junior_lawyer",
      "lawyer_assistant",
      "law_office_helper",
    ],
  },
  voiceAssistant: {
    enabled: true,
    subscriptionRequired: "pro",
    roleRequired: ["admin", "lawyer", "junior_lawyer", "law_student"],
  },
  advancedSearch: {
    enabled: true,
    subscriptionRequired: "pro",
  },
  bulkExport: {
    enabled: true,
    subscriptionRequired: "premium",
  },
  apiAccess: {
    enabled: true,
    subscriptionRequired: "premium",
    roleRequired: ["admin", "lawyer"],
  },
  prioritySupport: {
    enabled: true,
    subscriptionRequired: "premium",
  },
  adminDashboard: {
    enabled: true,
    roleRequired: ["admin"],
  },
  userManagement: {
    enabled: true,
    roleRequired: ["admin"],
  },
  analytics: {
    enabled: true,
    roleRequired: ["admin"],
  },
};

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    "Basic search",
    "3 templates per month",
    "10 flashcards",
    "Basic notes",
    "Email support",
  ],
  pro: [
    "Advanced search with AI",
    "Unlimited templates",
    "Unlimited flashcards",
    "Document scanner with OCR",
    "Voice assistant",
    "Secure biometric notes",
    "Priority email support",
    "Case timeline management",
    "Advanced pinboard features",
  ],
  premium: [
    "All Pro features",
    "Bulk export/import",
    "API access",
    "Custom templates",
    "Advanced analytics",
    "White-label options",
    "Dedicated support",
    "Custom integrations",
    "Team collaboration tools",
  ],
};

export const SUBSCRIPTION_PRICING = {
  pro: {
    monthly: 499,
    yearly: 4999,
    currency: "INR",
  },
  premium: {
    monthly: 999,
    yearly: 9999,
    currency: "INR",
  },
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "#DC2626";
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

export const getRoleIcon = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "👑";
    case "lawyer":
      return "⚖️";
    case "junior_lawyer":
      return "📚";
    case "lawyer_assistant":
      return "📋";
    case "law_office_helper":
      return "🏢";
    case "law_student":
      return "🎓";
    default:
      return "👤";
  }
};

export const canAccessFeature = (
  userRole: UserRole,
  userSubscription: SubscriptionTier,
  featureName: string,
): boolean => {
  const feature = FEATURE_ACCESS[featureName];
  if (!feature || !feature.enabled) return false;

  // Check role requirement
  if (feature.roleRequired && !feature.roleRequired.includes(userRole)) {
    return false;
  }

  // Check subscription requirement
  if (feature.subscriptionRequired) {
    const subscriptionHierarchy = { free: 0, pro: 1, premium: 2 };
    const requiredLevel = subscriptionHierarchy[feature.subscriptionRequired];
    const userLevel = subscriptionHierarchy[userSubscription];

    if (userLevel < requiredLevel) {
      return false;
    }
  }

  return true;
};

export const getUpgradeRequirement = (
  userRole: UserRole,
  userSubscription: SubscriptionTier,
  featureName: string,
): { type: "role" | "subscription" | null; required?: string } => {
  const feature = FEATURE_ACCESS[featureName];
  if (!feature || !feature.enabled) return { type: null };

  // Check role requirement first
  if (feature.roleRequired && !feature.roleRequired.includes(userRole)) {
    return { type: "role", required: feature.roleRequired.join(", ") };
  }

  // Check subscription requirement
  if (feature.subscriptionRequired) {
    const subscriptionHierarchy = { free: 0, pro: 1, premium: 2 };
    const requiredLevel = subscriptionHierarchy[feature.subscriptionRequired];
    const userLevel = subscriptionHierarchy[userSubscription];

    if (userLevel < requiredLevel) {
      return { type: "subscription", required: feature.subscriptionRequired };
    }
  }

  return { type: null };
};

export const hasRoleHierarchy = (
  userRole: UserRole,
  requiredRole: UserRole,
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
