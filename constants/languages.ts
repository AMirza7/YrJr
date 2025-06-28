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
    done: "Done",
    retry: "Retry",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    submit: "Submit",
    reset: "Reset",
    update: "Update",
    upload: "Upload",
    download: "Download",
    share: "Share",
    copy: "Copy",
    paste: "Paste",
    cut: "Cut",
    undo: "Undo",
    redo: "Redo",
    refresh: "Refresh",
    reload: "Reload",
    close: "Close",
    open: "Open",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    start: "Start",
    stop: "Stop",
    pause: "Pause",
    resume: "Resume",
    play: "Play",

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
    showPassword: "Show password",
    hidePassword: "Hide password",

    // Validation
    enterEmail: "Please enter email",
    enterPassword: "Please enter password",
    enterName: "Please enter your full name",
    enterPhone: "Please enter phone number",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid 10-digit phone number",
    passwordsNotMatch: "Passwords do not match",
    fieldRequired: "This field is required",

    // Terms
    agreeToTerms: "I agree to Terms & Conditions",
    termsAndConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    byCreatingAccount: "By creating an account, you agree to our",
    acceptTermsRequired: "You must accept the terms and conditions to continue",

    // Roles
    lawStudent: "Law Student",
    lawOfficeHelper: "Office Helper",
    lawyerAssistant: "Legal Assistant",
    juniorLawyer: "Junior Lawyer",
    seniorLawyer: "Senior Lawyer",
    administrator: "Administrator",

    // Features
    legalPinboard: "Legal Pinboard",
    caseTimeline: "Case Timeline",
    secureNotes: "Secure Notes",
    searchLegal: "Search Legal",
    aiComparator: "AI Comparator",
    templatesHub: "Templates Hub",
    flashcards: "Flashcards",
    notifications: "Notifications",
    documentScanner: "Document Scanner",
    voiceAssistant: "Voice Assistant",
    calendar: "Calendar",
    analytics: "Analytics",
    admin: "Admin",

    // Subscription
    subscription: "Subscription",
    upgradePlan: "Upgrade Plan",
    currentPlan: "Current Plan",
    freePlan: "Free Plan",
    proPlan: "Pro Plan",
    premiumPlan: "Premium Plan",
    subscriptionExpired: "Subscription Expired",
    upgradeToAccess: "Upgrade to access this feature",

    // Theme & Language
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System Default",
    themeSettings: "Theme Settings",
    languageSettings: "Language Settings",
    selectLanguage: "Select Language",
    changeLanguage: "Change Language",

    // Profile
    yourAccessLevel: "Your Access Level",
    verifiedAccount: "Verified Account",
    pendingVerification: "Pending Verification",
    completeProfile: "Complete Profile",
    accountSettings: "Account Settings",
    helpSupport: "Help & Support",
    aboutApp: "About App",

    // Logout
    logoutConfirm: "Are you sure you want to logout?",
    logoutSuccess: "Successfully logged out",

    // Errors
    loginFailed: "Login failed. Please try again.",
    signupFailed: "Signup failed. Please try again.",
    invalidCredentials: "Invalid credentials",
    somethingWentWrong: "Something went wrong. Please try again.",
    networkError: "Network error. Please check your connection.",
    sessionExpired: "Session expired. Please login again.",
    accessDenied: "Access denied",
    featureNotAvailable: "This feature is not available for your role",
    subscriptionRequired: "Subscription required to access this feature",

    // Success Messages
    accountCreated: "Account created successfully",
    profileUpdated: "Profile updated successfully",
    settingsSaved: "Settings saved successfully",
    emailSent: "Email sent successfully",
    phoneVerified: "Phone number verified successfully",

    // Phone Validation
    phoneNumberFormat: "Phone number format: +91-XXXXXXXXXX",
    indianPhoneRequired: "Only Indian phone numbers are supported",
    enterValidPhone: "Please enter a valid Indian phone number",

    // Biometric
    biometricAuth: "Biometric Authentication",
    useBiometric: "Use fingerprint or face ID to authenticate",
    biometricFailed: "Biometric authentication failed",
    biometricNotAvailable: "Biometric authentication not available",
    enterPasswordInstead: "Enter password instead",

    // Navigation
    goBack: "Go back",
    goHome: "Go to home",
    openMenu: "Open menu",
    closeMenu: "Close menu",

    // Time & Date
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    lastWeek: "Last week",
    thisMonth: "This month",
    lastMonth: "Last month",
    thisYear: "This year",

    // Actions
    viewDetails: "View details",
    viewAll: "View all",
    readMore: "Read more",
    showLess: "Show less",
    loadMore: "Load more",
    tryAgain: "Try again",
    contactSupport: "Contact support",

    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Completed",
    inProgress: "In progress",
    cancelled: "Cancelled",
    expired: "Expired",

    // Quick Actions
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    upcomingEvents: "Upcoming Events",
    recentUpdates: "Recent Updates",
    yourOverview: "Your Overview",
    advancedFeatures: "Advanced Features",

    // Stats
    activeCases: "Active Cases",
    upcomingHearings: "Upcoming Hearings",
    notesCreated: "Notes Created",
    studyScore: "Study Score",
    totalUsers: "Total Users",
    newUsers: "New Users",
    revenue: "Revenue",
    systemHealth: "System Health",

    // Not Available
    notAvailable: "Not available",
    comingSoon: "Coming soon",
    featureInDevelopment: "This feature is under development",
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
    done: "हो गया",
    retry: "फिर कोशिश करें",
    confirm: "पुष्टि करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    remove: "हटाएं",
    search: "खोजें",
    filter: "फिल्टर",
    sort: "क्रमबद्ध करें",
    submit: "जमा करें",
    reset: "रीसेट करें",
    update: "अपडेट करें",
    upload: "अपलोड करें",
    download: "डाउनलोड करें",
    share: "साझा करें",
    copy: "कॉपी करें",
    paste: "पेस्ट करें",
    cut: "कट करें",
    undo: "पूर्ववत करें",
    redo: "फिर से करें",
    refresh: "रिफ्रेश करें",
    reload: "पुनः लोड करें",
    close: "बंद करें",
    open: "खोलें",
    next: "अगला",
    previous: "पिछला",
    finish: "समाप्त करें",
    start: "शुरू करें",
    stop: "रोकें",
    pause: "रोकें",
    resume: "फिर से शुरू करें",
    play: "चलाएं",

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
    joinLegalCommunity: "कानूनी समुदाय में शामिल ह���ं",
    showPassword: "पासवर्ड दिखाएं",
    hidePassword: "पासवर्ड छुपाएं",

    // Validation
    enterEmail: "कृपया ईमेल दर्ज करें",
    enterPassword: "कृपया पासवर्ड दर्ज करें",
    enterName: "कृपया अपना पूरा नाम दर्ज करें",
    enterPhone: "कृपया फोन नंबर दर्ज करें",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    invalidPhone: "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें",
    passwordsNotMatch: "पासवर्ड मेल नहीं खाते",
    fieldRequired: "यह फील्ड आवश्यक है",

    // Terms
    agreeToTerms: "मैं नियम और शर्तों से सहमत हूं",
    termsAndConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    byCreatingAccount: "खाता बनाकर, ��प हमारी सहमति देते हैं",
    acceptTermsRequired:
      "जारी रखने के लिए आपको नियम और शर्तों को स्वीकार करना होगा",

    // Roles
    lawStudent: "कानून छात्र",
    lawOfficeHelper: "कार्यालय सहायक",
    lawyerAssistant: "कानूनी सहायक",
    juniorLawyer: "जूनियर वकील",
    seniorLawyer: "सीनियर वकील",
    administrator: "प्रशासक",

    // Features
    legalPinboard: "कानूनी पिनबोर्ड",
    caseTimeline: "केस टाइमलाइन",
    secureNotes: "सुरक्षित नोट्स",
    searchLegal: "कानूनी खोज",
    aiComparator: "AI तुलनाकर्ता",
    templatesHub: "टेम्प्लेट हब",
    flashcards: "फ्लैशकार्ड",
    notifications: "सूचनाएं",
    documentScanner: "दस्तावेज़ स्कैनर",
    voiceAssistant: "वॉयस असिस्टेंट",
    calendar: "कैलेंडर",
    analytics: "एनालिटिक्स",
    admin: "एडमिन",

    // Subscription
    subscription: "सब्स्क्रिप्शन",
    upgradePlan: "प्लान अपग्रेड करें",
    currentPlan: "वर्तमान प्लान",
    freePlan: "मुफ्त प्लान",
    proPlan: "प्रो प्लान",
    premiumPlan: "प्रीमियम प्लान",
    subscriptionExpired: "सब्स्क्रिप्शन समाप्त हो गई",
    upgradeToAccess: "इस सुविधा का उपयोग करने के लिए अपग्रेड करें",

    // Theme & Language
    lightTheme: "लाइट",
    darkTheme: "डार्क",
    systemTheme: "सिस्टम डिफ़ॉल्ट",
    themeSettings: "थीम सेटिंग्स",
    languageSettings: "भाषा सेटिंग्स",
    selectLanguage: "भाषा चुनें",
    changeLanguage: "भाषा बदलें",

    // Profile
    yourAccessLevel: "आपका एक्सेस स्तर",
    verifiedAccount: "सत्यापित खाता",
    pendingVerification: "सत्यापन लंबित",
    completeProfile: "प्रोफ़ाइल पूरा करें",
    accountSettings: "खाता सेटिंग्स",
    helpSupport: "सहायता और समर्थन",
    aboutApp: "ऐप के बारे में",

    // Logout
    logoutConfirm: "क्या आप वाकई लॉग आउट करना चाहते हैं?",
    logoutSuccess: "सफलतापूर्वक लॉग आउट हो गए",

    // Errors
    loginFailed: "लॉगिन असफल। कृपया फिर से कोशिश करें।",
    signupFailed: "साइनअप असफल। कृपया फिर से कोशिश करें।",
    invalidCredentials: "अमान्य क्रेडेंशियल",
    somethingWentWrong: "कुछ गलत हुआ। कृपया फिर से कोशिश करें।",
    networkError: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।",
    sessionExpired: "सत्र समाप्त हो गया। कृपया फिर से लॉगिन करें।",
    accessDenied: "पहुंच अस्वीकार",
    featureNotAvailable: "यह सुविधा आपकी भूमिका के लिए उपलब्ध नहीं है",
    subscriptionRequired:
      "इस सुविधा का उपयोग करने के लिए सब्स्क्रिप्शन आवश्यक है",

    // Success Messages
    accountCreated: "खाता सफलतापूर्वक बनाया गया",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया",
    settingsSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं",
    emailSent: "ईमेल सफलतापूर्वक भेजा गया",
    phoneVerified: "फोन नंबर सफलतापूर्वक सत्यापित किया गया",

    // Phone Validation
    phoneNumberFormat: "फोन नंबर प्रारूप: +91-XXXXXXXXXX",
    indianPhoneRequired: "केवल भारतीय फोन नंबर समर्थित हैं",
    enterValidPhone: "कृपया एक वैध भारतीय फोन नंबर दर्ज करें",

    // Biometric
    biometricAuth: "बायोमेट्रिक प्रमाणीकरण",
    useBiometric: "प्रमाणीकरण के लिए फिंगरप्रिंट या फेस आईडी का उपयोग करें",
    biometricFailed: "बायोमेट्रिक प्रमाणीकरण असफल",
    biometricNotAvailable: "बायोमेट्रिक प्रमाणीकरण उपलब्ध नहीं",
    enterPasswordInstead: "इसके बजाय पासवर्ड दर्ज करें",

    // Quick Actions
    quickActions: "त्वरित क्रियाएं",
    recentActivity: "हाल की गतिविधि",
    upcomingEvents: "आगामी घटनाएं",
    recentUpdates: "हाल की अपडेट",
    yourOverview: "आपका अवलोकन",
    advancedFeatures: "उन्नत सुविधाएं",

    // Stats
    activeCases: "सक्रिय मामले",
    upcomingHearings: "आगामी सुनवाई",
    notesCreated: "बनाए गए नोट्स",
    studyScore: "अध्ययन स्कोर",
    totalUsers: "कुल उपयोगकर्ता",
    newUsers: "नए उपयोगकर्ता",
    revenue: "आय",
    systemHealth: "सिस्टम स्वास्थ्य",

    // Not Available
    notAvailable: "उपलब्ध नहीं",
    comingSoon: "जल्द आ रहा है",
    featureInDevelopment: "यह सुविधा विकास के अधीन है",
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
    done: "مکمل",
    retry: "دوبارہ کوشش",
    confirm: "تصدیق",
    delete: "حذف کریں",
    edit: "ترمیم",
    add: "شامل کریں",
    remove: "ہٹائیں",
    search: "تلاش",
    filter: "فلٹر",
    sort: "ترتیب",
    submit: "جمع کریں",
    reset: "ری سیٹ",
    update: "اپ ڈیٹ",
    upload: "اپ لوڈ",
    download: "ڈاؤن لوڈ",
    share: "شیئر",
    copy: "کاپی",
    paste: "پیسٹ",
    cut: "کٹ",
    undo: "واپس",
    redo: "دوبارہ",
    refresh: "تازہ",
    reload: "دوبارہ لوڈ",
    close: "بند",
    open: "کھولیں",
    next: "اگلا",
    previous: "پچھلا",
    finish: "مکمل",
    start: "شروع",
    stop: "رک",
    pause: "رک",
    resume: "جاری",
    play: "چلائیں",

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
    showPassword: "پاس ورڈ دکھائیں",
    hidePassword: "پاس ورڈ چھپائیں",

    // Features
    legalPinboard: "قانونی پن بورڈ",
    caseTimeline: "کیس ٹائم لائن",
    secureNotes: "محفوظ نوٹس",
    searchLegal: "قانونی تلاش",
    aiComparator: "AI موازنہ کار",
    templatesHub: "ٹیمپلیٹ ہب",
    flashcards: "فلیش کارڈز",
    notifications: "اطلاعات",
    documentScanner: "دستاویز سکینر",
    voiceAssistant: "آواز کا معاون",
    calendar: "کیلنڈر",
    analytics: "تجزیات",
    admin: "ایڈمن",

    // Roles
    lawStudent: "قانون کا طالب علم",
    lawOfficeHelper: "دفتری معاون",
    lawyerAssistant: "قانونی معاون",
    juniorLawyer: "جونیئر وکیل",
    seniorLawyer: "سینیئر وکیل",
    administrator: "منتظم",

    // Add more Urdu translations as needed...
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
