import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  ShieldCheck, 
  Lock, 
  Database
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D9E75]/15 border border-[#1D9E75]/30 text-[#1D9E75] text-xs font-semibold">
            <span>TECHNICAL ARCHITECTURE & USER FLOW</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            How DrvLife Works Under the Hood
          </h1>
          <p className="text-base sm:text-lg text-[#888799]">
            A transparent overview of how our Android Notification Listener, privacy safeguards, and Gemini AI pipeline function.
          </p>
        </div>

        {/* Data Flow Architecture Card */}
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 lg:p-12 border border-[#7F77DD]/30 mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            The Safe Auto-Sync Data Pipeline
          </h2>

          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/30 flex items-center justify-center shrink-0 text-[#7F77DD] font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Notification Alert Interception</h3>
                <p className="text-xs text-[#888799] mt-1">
                  When you spend via GPay, PhonePe, Paytm, BHIM, or your bank, Android issues a push notification. DrvLife's <code className="text-[#7F77DD]">UpiNotificationListenerService</code> receives the system callback.
                </p>
              </div>
            </div>

            {/* Step 2: Privacy Shield */}
            <div className="p-5 rounded-2xl bg-[#1D9E75]/10 border border-[#1D9E75]/30 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/30 flex items-center justify-center shrink-0 text-[#1D9E75]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Privacy Shield & Safety Gate</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D9E75] text-black font-bold">CRUCIAL</span>
                </h3>
                <p className="text-xs text-[#E8E6F0] mt-1">
                  Before reading text, our safety algorithm scans for sensitive keywords: <span className="text-[#EF9F27]">"OTP"</span>, <span className="text-[#EF9F27]">"Verification Code"</span>, <span className="text-[#EF9F27]">"Security PIN"</span>, or personal messages. If detected, the alert is <strong>immediately destroyed from memory</strong>.
                </p>
              </div>
            </div>

            {/* Step 3: Regex & Categorization */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EF9F27]/20 border border-[#EF9F27]/30 flex items-center justify-center shrink-0 text-[#EF9F27] font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Regex Extraction & Auto-Categorization</h3>
                <p className="text-xs text-[#888799] mt-1">
                  Transaction amounts (e.g. ₹340.00), direction (Debit vs Credit), and merchant names (e.g. Swiggy) are extracted and mapped into clean categories: Food, Travel, Bills, or Shopping.
                </p>
              </div>
            </div>

            {/* Step 4: SHA-256 Deduplication */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#534AB7]/20 border border-[#534AB7]/30 flex items-center justify-center shrink-0 text-[#7F77DD]">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">SHA-256 Fingerprint Deduplication</h3>
                <p className="text-xs text-[#888799] mt-1">
                  To prevent duplicate records from duplicate SMS/app alerts, DrvLife generates a deterministic hash. If an identical hash was recorded within the last 5 minutes, it is automatically merged.
                </p>
              </div>
            </div>

            {/* Step 5: Isolated Firestore Cloud */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/30 flex items-center justify-center shrink-0 text-[#1D9E75]">
                <Lock className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">User-Isolated Firestore Storage</h3>
                <p className="text-xs text-[#888799] mt-1">
                  The verified record is committed to <code className="text-[#1D9E75]">users/&#123;uid&#125;/transactions</code>. No other user or outside party can read your documents.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/download"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] hover:from-[#6259cb] hover:to-[#8f88e8] shadow-lg shadow-[#7F77DD]/30 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Install DrvLife APK (v{APP_CONFIG.version})</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
