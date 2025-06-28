// Validation script for demo accounts
const demoAccounts = [
  {
    email: "lawyer@yrjr.app",
    password: "demo123",
    role: "lawyer",
    name: "Advocate Rajesh Kumar",
    displayTitle: "Senior Lawyer",
  },
  {
    email: "jr.lawyer@yrjr.app",
    password: "demo123",
    role: "junior_lawyer",
    name: "Priya Sharma",
    displayTitle: "Junior Lawyer",
  },
  {
    email: "assistant@yrjr.app",
    password: "demo123",
    role: "lawyer_assistant",
    name: "Rohit Gupta",
    displayTitle: "Legal Assistant",
  },
  {
    email: "helper@yrjr.app",
    password: "demo123",
    role: "law_office_helper",
    name: "Meera Singh",
    displayTitle: "Office Helper",
  },
  {
    email: "student@yrjr.app",
    password: "demo123",
    role: "law_student",
    name: "Arjun Patel",
    displayTitle: "Law Student",
  },
];

console.log("✅ Demo Accounts Validation:");
console.log("Total accounts:", demoAccounts.length);
demoAccounts.forEach((account, index) => {
  console.log(`${index + 1}. ${account.displayTitle} (${account.email})`);
  console.log(`   Role: ${account.role}`);
  console.log(`   Password: ${account.password}`);
  console.log("");
});

console.log("🔧 Navigation Flow:");
console.log("1. app/index.tsx - Splash screen with auth check");
console.log("2. app/login.tsx - Authentication with demo accounts");
console.log("3. app/(tabs) - Role-based dashboard");
console.log("");

console.log("🛡️ Role-based Features:");
const roleFeatures = {
  lawyer: [
    "All features",
    "Pinboard",
    "Timeline",
    "Notes",
    "AI Comparator",
    "Templates",
    "Flashcards",
  ],
  junior_lawyer: [
    "All features",
    "Pinboard",
    "Timeline",
    "Notes",
    "AI Comparator",
    "Templates",
    "Flashcards",
  ],
  lawyer_assistant: [
    "Pinboard",
    "Timeline",
    "Notes",
    "Templates",
    "Flashcards",
    "Scanner",
  ],
  law_office_helper: ["Notes", "Templates", "Flashcards", "Scanner"],
  law_student: ["AI Comparator", "Templates", "Flashcards"],
};

Object.entries(roleFeatures).forEach(([role, features]) => {
  console.log(`${role}: ${features.join(", ")}`);
});
