import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Marketing & Portal Pages
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DownloadPage } from './pages/DownloadPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

// Authentication Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Web App Pages (Firebase Real-time Connected)
import { DashboardPage } from './pages/app/DashboardPage';
import { TransactionsPage } from './pages/app/TransactionsPage';
import { BudgetsPage } from './pages/app/BudgetsPage';
import { AdvisorPage } from './pages/app/AdvisorPage';
import { ProfilePage } from './pages/app/ProfilePage';

// Scroll to top and dynamic SEO / GA4 tracking on navigation change
const routeTitles: Record<string, string> = {
  '/': 'DrvLife — #1 AI-Powered Expense & UPI Auto-Tracker for Android | Smart Budgeting',
  '/features': 'Features & Capabilities — DrvLife AI Finance Tracker',
  '/how-it-works': 'How It Works — Automated UPI Tracking & Gemini AI | DrvLife',
  '/download': 'Download DrvLife Android APK — Free & Open Source Finance App',
  '/about': 'About DrvLife — Mission, Team & Vision for Intelligent Finance',
  '/privacy': 'Privacy Policy — Zero-Knowledge On-Device Tracking | DrvLife',
  '/terms': 'Terms of Service — DrvLife Expense Manager',
  '/faq': 'Frequently Asked Questions — DrvLife UPI & AI Expense Tracker',
  '/contact': 'Contact DrvLife Support — Feedback & Help',
  '/login': 'Sign In — DrvLife Cloud Finance Web Portal',
  '/register': 'Create Account — Join DrvLife Finance',
  '/app/dashboard': 'Financial Dashboard — DrvLife Real-Time Analytics',
  '/app/transactions': 'Transactions & UPI Ledger — DrvLife',
  '/app/budgets': 'Category Budgets & Expense Limits — DrvLife',
  '/app/advisor': 'Gemini AI Financial Advisor — DrvLife Insights',
  '/app/profile': 'Account Settings & Backup — DrvLife',
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Update document title dynamically
    const title = routeTitles[pathname] || 'DrvLife — #1 AI-Powered Expense & UPI Auto-Tracker for Android';
    document.title = title;

    // Update canonical link to match active origin dynamically (Vercel, Firebase, Surge)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    const origin = window.location.origin;
    canonical.href = `${origin}${pathname === '/' ? '/' : pathname}`;

    // Send page_view to GA4 / GTM
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#0C091A] text-[#E8E6F0] selection:bg-[#7F77DD] selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Marketing & Showcase */}
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Web App (Shared Firestore Database with Android App) */}
              <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/app/dashboard" element={<DashboardPage />} />
              <Route path="/app/transactions" element={<TransactionsPage />} />
              <Route path="/app/budgets" element={<BudgetsPage />} />
              <Route path="/app/advisor" element={<AdvisorPage />} />
              <Route path="/app/profile" element={<ProfilePage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
