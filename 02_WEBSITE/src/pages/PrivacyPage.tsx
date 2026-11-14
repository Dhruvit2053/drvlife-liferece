import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#7F77DD] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D9E75]/15 border border-[#1D9E75]/30 text-[#1D9E75] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LAST UPDATED: NOVEMBER 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Architecture
          </h1>
          <p className="text-base text-[#888799]">
            DrvLife was designed from day one with a strict privacy shield. We believe your financial data belongs exclusively to you.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-6 rounded-2xl bg-[#1D9E75]/10 border border-[#1D9E75]/30 space-y-3">
          <div className="flex items-center gap-2 text-[#1D9E75] font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>Our 4 Ironclad Privacy Guarantees</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#E8E6F0]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D9E75] shrink-0" />
              <span>Zero OTP, PIN, or password collection.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D9E75] shrink-0" />
              <span>Local on-device notification parsing.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D9E75] shrink-0" />
              <span>User-isolated Cloud Firestore database security rules.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D9E75] shrink-0" />
              <span>Permanent one-click account and data wiping.</span>
            </li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm text-[#888799] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              When you create an account on DrvLife, we store your email address and authentication credentials securely via Firebase Authentication. During onboarding, you may optionally input your display name and stated monthly income (in INR) to establish budget benchmarks.
            </p>
            <p>
              When you use our transaction features, DrvLife records transaction metadata (merchant name, amount, date, category, payment method, and optional notes) under your private account path: <code className="text-[#7F77DD]">users/&#123;uid&#125;/transactions</code>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Android Notification Listener Service</h2>
            <p>
              If you opt-in to Automatic Transaction Sync, DrvLife uses Android's <code className="text-[#7F77DD]">NotificationListenerService</code>. This permission is strictly utilized to detect financial transaction alerts from supported banking institutions and payment applications (Google Pay, PhonePe, Paytm, BHIM, SBI, HDFC, ICICI, Axis).
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <strong className="text-white block">Strict Privacy Filter:</strong>
              <p className="text-xs">
                Our service immediately checks every incoming alert for sensitive terms like <em>"OTP"</em>, <em>"verification code"</em>, <em>"password reset"</em>, <em>"security PIN"</em>, or personal chat messages. Any notification containing these elements is discarded instantly from device memory.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Artificial Intelligence & Gemini Processing</h2>
            <p>
              Our AI Financial Advisor integrates Google's Gemini models via Firebase AI. When requesting financial analysis, anonymized category aggregates (e.g. "Food: ₹4,800", "Bills: ₹3,100") and recent transaction amounts are provided to generate savings tips. Your personal identity, account passwords, and bank account numbers are never submitted to the model.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Deletion & Rights</h2>
            <p>
              You maintain total control over your data. Inside the DrvLife app under <strong>Profile & Settings</strong>, you can:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#E8E6F0]">
              <li>Export all your transactions to CSV or formatted PDF at any time.</li>
              <li>Toggle off Automatic Sync to halt all notification parsing.</li>
              <li>Tap <strong>Delete Account</strong> to permanently purge your user profile, transactions, budgets, and authentication credentials from Firebase.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Contact Our Privacy Team</h2>
            <p>
              For any questions regarding our privacy architecture, data rights, or security protocols, please contact our team at <a href="mailto:support@drvlife.app" className="text-[#7F77DD] hover:underline">support@drvlife.app</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
