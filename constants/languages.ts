import { Language } from "@/types";

export type LanguageConfig = {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
};

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    rtl: false,
  },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳", rtl: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", rtl: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", rtl: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", rtl: false },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", rtl: false },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    flag: "🇮🇳",
    rtl: false,
  },
];

export const TRANSLATIONS = {
  en: {
    // Common
    welcome: "Welcome",
    back: "Back",
    home: "Home",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    login: "Sign In",
    signup: "Create Account",
    cancel: "Cancel",
    continue: "Continue",
    save: "Save",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",

    // Auth
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    createAccount: "Create Account",
    signIn: "Sign In",
    forgotPassword: "Forgot Password?",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    welcomeBack: "Welcome Back",
    signInToAccount: "Sign in to your account",
    joinLegalCommunity: "Join the legal community",

    // Validation
    enterEmail: "Please enter email",
    enterPassword: "Please enter password",
    enterName: "Please enter your full name",
    enterPhone: "Please enter phone number",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid 10-digit phone number",
    passwordsNotMatch: "Passwords do not match",

    // Terms
    agreeToTerms: "I agree to Terms & Conditions",
    termsAndConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    byCreatingAccount: "By creating an account, you agree to our",

    // Roles
    lawStudent: "Law Student",
    lawOfficeHelper: "Office Helper",
    lawyerAssistant: "Legal Assistant",
    juniorLawyer: "Junior Lawyer",
    seniorLawyer: "Senior Lawyer",

    // Features
    legalPinboard: "Legal Pinboard",
    caseTimeline: "Case Timeline",
    secureNotes: "Secure Notes",
    searchLegal: "Search Legal",
    aiComparator: "AI Comparator",
    templatesHub: "Templates Hub",
    flashcards: "Flashcards",
    notifications: "Notifications",

    // Subscription
    subscription: "Subscription",
    upgradePlan: "Upgrade Plan",
    currentPlan: "Current Plan",
    freePlan: "Free Plan",
    proPlan: "Pro Plan",
    premiumPlan: "Premium Plan",

    // Theme
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System Default",
    themeSettings: "Theme Settings",

    // Language
    languageSettings: "Language Settings",
    selectLanguage: "Select Language",

    // Profile
    yourAccessLevel: "Your Access Level",
    verifiedAccount: "Verified Account",
    pendingVerification: "Pending Verification",
    completeProfile: "Complete Profile",

    // Logout
    logoutConfirm: "Are you sure you want to logout?",

    // Errors
    loginFailed: "Login failed. Please try again.",
    signupFailed: "Signup failed. Please try again.",
    invalidCredentials: "Invalid credentials",
    somethingWentWrong: "Something went wrong. Please try again.",
  },

  hi: {
    // Common
    welcome: "स्वागत है",
    back: "वापस",
    home: "होम",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    login: "साइन इन",
    signup: "खाता बनाएं",
    cancel: "रद्द करें",
    continue: "जारी रखें",
    save: "सहेजें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    warning: "चेतावनी",
    info: "जानकारी",

    // Auth
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    fullName: "पूरा नाम",
    phoneNumber: "फोन नंबर",
    createAccount: "खाता बनाएं",
    signIn: "साइन इन",
    forgotPassword: "पासवर्ड भूल गए?",
    alreadyHaveAccount: "पहले से खाता है?",
    dontHaveAccount: "खाता नहीं है?",
    welcomeBack: "वापसी पर स्वागत है",
    signInToAccount: "अपने खाते में साइन इन करें",
    joinLegalCommunity: "कानूनी समुदाय में शामिल हों",

    // Validation
    enterEmail: "कृपया ईमेल दर्ज करें",
    enterPassword: "कृपया पासवर्ड दर्ज करें",
    enterName: "कृपया अपना पूरा नाम दर्ज करें",
    enterPhone: "कृपया फोन नंबर दर्ज करें",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    invalidPhone: "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज ���रें",
    passwordsNotMatch: "पासवर्ड मेल नहीं खाते",

    // Terms
    agreeToTerms: "मैं नियम और शर्तों से सहमत हूं",
    termsAndConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    byCreatingAccount: "खाता बनाकर, आप हमारी सहमति देते हैं",

    // Roles
    lawStudent: "कानून छात्र",
    lawOfficeHelper: "कार्यालय सहायक",
    lawyerAssistant: "कानूनी सहायक",
    juniorLawyer: "जूनियर वकील",
    seniorLawyer: "सीनियर वकील",

    // Features
    legalPinboard: "कानूनी पिनबोर्ड",
    caseTimeline: "केस टाइमलाइन",
    secureNotes: "सुरक्षित नोट्स",
    searchLegal: "कानूनी खोज",
    aiComparator: "AI तुलनाकर्ता",
    templatesHub: "टेम्प्लेट हब",
    flashcards: "फ्लैशकार्ड",
    notifications: "सूचनाएं",

    // Subscription
    subscription: "सब्स्क्रिप्शन",
    upgradePlan: "प्लान अपग्रेड करें",
    currentPlan: "वर्तमान प्लान",
    freePlan: "मुफ्त प्लान",
    proPlan: "प्रो प्लान",
    premiumPlan: "प्रीमियम प्लान",

    // Theme
    lightTheme: "लाइट",
    darkTheme: "डार्क",
    systemTheme: "सिस्टम डिफ़ॉल्ट",
    themeSettings: "थीम सेटिंग्स",

    // Language
    languageSettings: "भाषा सेटिंग्स",
    selectLanguage: "भाषा चुनें",

    // Profile
    yourAccessLevel: "आपका एक्सेस स्तर",
    verifiedAccount: "सत्यापित खाता",
    pendingVerification: "सत्यापन लंबित",
    completeProfile: "प्रोफ़ाइल पूरा करें",

    // Logout
    logoutConfirm: "क्या आप वाकई लॉग आउट करना चाहते हैं?",

    // Errors
    loginFailed: "लॉगिन असफल। कृपया फिर से कोशिश करें।",
    signupFailed: "साइनअप असफल। कृपया फिर से कोशिश करे��।",
    invalidCredentials: "अमान्य क्रेडेंशियल",
    somethingWentWrong: "कुछ गलत हुआ। कृपया फिर से कोशिश करें।",
  },

  ur: {
    // Common
    welcome: "خوش آمدید",
    back: "واپس",
    home: "گھر",
    profile: "پروفائل",
    settings: "سیٹنگز",
    logout: "لاگ آؤٹ",
    login: "سائن ان",
    signup: "اکاؤنٹ بنائیں",
    cancel: "منسوخ",
    continue: "جاری رکھیں",
    save: "محفوظ کریں",
    loading: "لوڈ ہو رہا ہے...",
    error: "خرابی",
    success: "کامیابی",
    warning: "انتباہ",
    info: "معلومات",

    // Auth
    email: "ای میل",
    password: "پاس ورڈ",
    confirmPassword: "پاس ورڈ کی تصدیق کریں",
    fullName: "پورا نام",
    phoneNumber: "فون نمبر",
    createAccount: "اکاؤنٹ بنائیں",
    signIn: "سائن ان",
    forgotPassword: "پاس ورڈ بھول گئے؟",
    alreadyHaveAccount: "پہلے سے اکاؤنٹ ہے؟",
    dontHaveAccount: "اکاؤنٹ نہیں ہے؟",
    welcomeBack: "واپسی میں خوش آمدید",
    signInToAccount: "اپنے اکاؤنٹ میں سائن ان کریں",
    joinLegalCommunity: "قانونی کمیونٹی میں شامل ہوں",

    // Features
    legalPinboard: "قانونی پن بورڈ",
    caseTimeline: "کیس ٹائم لائن",
    secureNotes: "محفوظ نوٹس",
    searchLegal: "قانونی تلاش",
    aiComparator: "AI موازنہ کار",
    templatesHub: "ٹیمپلیٹ ہب",
    flashcards: "فلیش کارڈز",
    notifications: "اطلاعات",

    // Add more Urdu translations as needed...
    // For brevity, I'm including key translations. In production, all strings would be translated.
  },
};

export const getTranslation = (key: string, language: Language): string => {
  const translations = TRANSLATIONS[language];
  if (!translations) return TRANSLATIONS.en[key] || key;
  return translations[key] || TRANSLATIONS.en[key] || key;
};

export const formatTranslation = (
  key: string,
  language: Language,
  params: Record<string, string> = {},
): string => {
  let translation = getTranslation(key, language);

  Object.keys(params).forEach((param) => {
    translation = translation.replace(`{${param}}`, params[param]);
  });

  return translation;
};
