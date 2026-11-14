export interface AppReleaseConfig {
  appName: string;
  tagline: string;
  subTagline: string;
  version: string;
  apkDownloadUrl: string;
  apkFileSize: string;
  minAndroidVersion: string;
  targetAndroidVersion: string;
  releaseDate: string;
  sha256Checksum: string;
  supportEmail: string;
  whatsNew: string[];
}

export const APP_CONFIG: AppReleaseConfig = {
  appName: "DrvLife",
  tagline: "Your Financial Life. Understood.",
  subTagline: "Track smarter. Save better. Live financially free.",
  version: "1.0.0",
  apkDownloadUrl: "/downloads/drvlife-v1.0.apk",
  apkFileSize: "28.7 MB",
  minAndroidVersion: "Android 7.0+ (API 25+)",
  targetAndroidVersion: "Android 15 (API 36)",
  releaseDate: "November 2026",
  sha256Checksum: "A420F818FF0DBDD0D6FC36DB220283709956E3025D5C4949C831C8870907018E",
  supportEmail: "support@drvlife.app",
  whatsNew: [
    "Automatic UPI & Bank notification sync with local privacy filter",
    "Real Gemini AI financial advisor and context-aware savings recommendations",
    "Multimodal receipt scanner with camera & gallery image extraction",
    "Full category budget management with real-time overspending alerts",
    "Native PDF and CSV financial statement export via Android share sheet",
    "Dark obsidian glassmorphism UI with smooth 60fps animations"
  ]
};

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  details: string;
}

export const FEATURES: FeatureItem[] = [
  {
    id: "smart-tracking",
    title: "Smart Expense Tracking",
    description: "Capture every transaction in real-time with automated category mapping, payment source tracking, and custom notes.",
    icon: "Receipt",
    badge: "Core",
    details: "View your cashflow with comprehensive filtering across date ranges, amounts, and transaction types. Every rupee is accounted for."
  },
  {
    id: "upi-sync",
    title: "Automatic UPI Notification Sync",
    description: "Seamlessly parses incoming alerts from Google Pay, PhonePe, Paytm, BHIM, and bank SMS directly on your device.",
    icon: "Zap",
    badge: "Exclusive",
    details: "Built-in Privacy Shield automatically discards OTPs, PINs, and personal messages. Uses 5-minute SHA-256 fingerprint deduplication."
  },
  {
    id: "ai-advisor",
    title: "Gemini AI Financial Advisor",
    description: "Integrated Gemini AI analyzes your actual spending data to discover wasteful habits and tailor actionable savings blueprints.",
    icon: "Brain",
    badge: "AI Powered",
    details: "Chat directly with DrvLife AI to audit recurring subscriptions, calculate weekend spend patterns, and get personalized savings goals."
  },
  {
    id: "receipt-scanner",
    title: "Multimodal Receipt Scanner",
    description: "Snap paper receipts or restaurant bills using your camera. Gemini Multimodal extracts merchant, total, date, and category.",
    icon: "Camera",
    badge: "AI Powered",
    details: "Review and edit scanned data before confirming. Never lose track of paper receipts or cash transactions again."
  },
  {
    id: "budget-management",
    title: "Smart Budget Allocation",
    description: "Set overall monthly budgets alongside individual limits for Food, Shopping, Bills, Travel, and Entertainment.",
    icon: "PieChart",
    badge: "Real-time",
    details: "Color-coded progress gauges alert you when approaching 75% utilization and trigger warnings when thresholds are exceeded."
  },
  {
    id: "reports-export",
    title: "Executive Reports & Native Export",
    description: "Generate professional A4 PDF financial statements and CSV spreadsheets shared via native Android sharing.",
    icon: "FileText",
    badge: "Export",
    details: "Download detailed monthly executive statements complete with savings rates, category tables, and spending breakdowns."
  },
  {
    id: "spending-analysis",
    title: "Spending Pattern Intelligence",
    description: "Interactive weekly trend bar charts and category distribution diagrams uncover impulse buying and weekend spikes.",
    icon: "TrendingUp",
    details: "Understand your financial health score with our dynamic savings rate formula: 40%+ Excellent, 20%+ Healthy."
  },
  {
    id: "user-isolated-cloud",
    title: "Isolated Cloud & Firestore Rules",
    description: "Your data is stored strictly in your authenticated users/{uid}/* subcollection with zero cross-tenant access.",
    icon: "ShieldCheck",
    badge: "Secure",
    details: "Firebase Authentication and hardened security rules ensure that only your verified credentials can read and write your records."
  }
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "What is DrvLife?",
    answer: "DrvLife is an Android personal finance management application that unifies local UPI and bank transaction tracking, budget management, and Gemini AI financial advisory into one seamless, privacy-centric experience."
  },
  {
    question: "Is DrvLife free to use?",
    answer: "Yes, DrvLife is completely free to download and use for individual personal finance tracking, budget setting, and AI insights."
  },
  {
    question: "How do I install the APK on my Android device?",
    answer: "Download the APK file from our Download portal. When prompted, tap 'Install'. If this is your first time sideloading, enable 'Install unknown apps' for your browser in Android Settings. All installation steps are detailed with screenshots on our Download page."
  },
  {
    question: "Does DrvLife support UPI apps like GPay and PhonePe?",
    answer: "Yes! DrvLife's built-in Notification Listener Service listens for transaction alert notifications from Google Pay, PhonePe, Paytm, BHIM, and supported banking apps (SBI, HDFC, ICICI, Axis) and parses them into organized records."
  },
  {
    question: "Is automatic transaction sync mandatory?",
    answer: "No. You have complete control. During onboarding or anytime in Settings, you can switch to 'Manual Entry Only'. In manual mode, DrvLife requests zero notification permissions."
  },
  {
    question: "Can I manually add and edit transactions?",
    answer: "Absolutely. You can add, edit, search, filter, and delete any transaction manually at any time with customizable categories, payment methods, and notes."
  },
  {
    question: "How does the Gemini AI Advisor work?",
    answer: "DrvLife uses Google's Gemini generative AI (gemini-flash-latest) via Firebase AI. It analyzes your monthly income and anonymized category totals to generate actionable suggestions like dining cuts, subscription audits, and weekend budget limits."
  },
  {
    question: "Is my financial and notification data secure?",
    answer: "Yes. Our Privacy Shield immediately discards any notification containing OTPs, PINs, passwords, or personal messages. Only transaction text is processed locally. In Firestore, records are strictly quarantined under users/{uid}/* with robust database security rules."
  },
  {
    question: "How can I export my data or delete my account?",
    answer: "In the Profile & Settings screen, you can export your entire transaction history to CSV or formatted PDF. You can also delete your account permanently, which deletes all transactions, budgets, and your Firebase profile."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our engineering and support team via the Contact form on this website or by emailing support@drvlife.app."
  }
];

