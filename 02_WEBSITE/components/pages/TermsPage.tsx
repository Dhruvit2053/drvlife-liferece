import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#7F77DD] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/15 border border-[#7F77DD]/30 text-[#7F77DD] text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms & Conditions of Use
          </h1>
          <p className="text-base text-[#888799]">
            Please review these terms carefully before downloading, installing, or utilizing the DrvLife application.
          </p>
        </div>

        {/* Disclaimer Callout */}
        <div className="p-6 rounded-2xl bg-[#EF9F27]/10 border border-[#EF9F27]/30 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-[#EF9F27] shrink-0 mt-0.5" />
          <div className="text-xs text-[#E8E6F0] leading-relaxed">
            <strong className="text-white block mb-1">Educational AI Advisory Notice:</strong>
            DrvLife provides financial tracking tools, automated expense organization, and generative AI tips for informational and educational purposes only. DrvLife is not a registered financial advisor, wealth management firm, or legal consultant. AI recommendations should not be considered guaranteed financial returns or tax strategies.
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm text-[#888799] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By downloading the DrvLife Android APK, creating an account, or accessing our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use or install the application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Permitted Use</h2>
            <p>
              DrvLife is granted to you under a personal, non-exclusive, non-transferable license for personal, non-commercial financial tracking. You agree not to reverse engineer, decompile, or tamper with the application's binary or background services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. User Responsibilities & Device Permissions</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. If you enable Notification Access, you grant DrvLife permission to parse incoming transaction alerts locally on your device as described in our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Limitation of Liability</h2>
            <p>
              DrvLife is provided on an "as is" and "as available" basis without warranties of any kind. While our parsing algorithms and deduplication engines are engineered with high precision, DrvLife cannot guarantee 100% capture of every financial alert due to device operating system battery optimizations or third-party banking SMS formats.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Termination</h2>
            <p>
              You may terminate your relationship with DrvLife at any time by deleting your account inside the app and uninstalling the APK. DrvLife reserves the right to suspend or terminate accounts that violate our security rules or abuse our infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Inquiries</h2>
            <p>
              Questions regarding these Terms should be addressed to our legal and support team at <a href="mailto:support@drvlife.app" className="text-[#7F77DD] hover:underline">support@drvlife.app</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

