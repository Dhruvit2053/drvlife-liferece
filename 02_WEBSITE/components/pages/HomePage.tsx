import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { AppShowcaseSection } from '../components/AppShowcaseSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FaqAccordion } from '../components/FaqAccordion';
import { Download, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Highlights Grid */}
      <FeaturesSection />

      {/* App Module Interactive Showcase */}
      <AppShowcaseSection />

      {/* 4-Step Setup Flow */}
      <HowItWorksSection />

      {/* Privacy Guarantee Section */}
      <section className="py-20 bg-[#0C091A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 lg:p-14 border border-[#1D9E75]/30 relative overflow-hidden bg-gradient-to-r from-[#1D9E75]/10 via-transparent to-[#534AB7]/10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D9E75]/20 text-[#1D9E75] text-xs font-bold border border-[#1D9E75]/30">
                <ShieldCheck className="w-4 h-4" />
                <span>PRIVACY BY DESIGN</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Your Financial Secrets Stay Yours. Always.
              </h2>
              <p className="text-base text-[#888799] leading-relaxed">
                DrvLife was architected with a strict privacy shield. The Notification Listener Service processes transaction alert text locally on your device. We never inspect OTPs, two-factor authentication codes, personal chats, or banking passwords.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1D9E75] shrink-0" />
                  <span className="text-sm text-white font-medium">Zero OTP / PIN collection</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1D9E75] shrink-0" />
                  <span className="text-sm text-white font-medium">Local notification parsing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1D9E75] shrink-0" />
                  <span className="text-sm text-white font-medium">Isolated users/&#123;uid&#125;/* database rules</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1D9E75] shrink-0" />
                  <span className="text-sm text-white font-medium">Full account & data deletion at will</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/privacy"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1D9E75] hover:text-white transition-colors"
                >
                  <span>Read our complete Privacy Policy and Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-[#0A0716] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#888799]">
              Everything you need to know about DrvLife, APK installation, and notification tracking.
            </p>
          </div>

          <FaqAccordion limit={5} />

          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7F77DD] hover:text-white transition-colors"
            >
              <span>View all questions and answers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final Download CTA Banner */}
      <section className="py-20 bg-[#0C091A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden border border-[#7F77DD]/30 bg-gradient-to-b from-[#534AB7]/20 via-[#0C091A] to-[#0A0716]">
            
            <div className="max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/20 text-[#7F77DD] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL VERIFIED RELEASE</span>
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to Master Your Finances?
              </h2>

              <p className="text-base text-[#888799]">
                Download DrvLife v{APP_CONFIG.version} for Android today. Start understanding your money with automated UPI tracking, budget limits, and Gemini AI insights.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/download"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] hover:from-[#6259cb] hover:to-[#8f88e8] shadow-xl shadow-[#7F77DD]/30 transition-all hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Free APK (v{APP_CONFIG.version})</span>
                </Link>
              </div>

              <div className="pt-2 text-xs text-[#888799]">
                <span>Requires {APP_CONFIG.minAndroidVersion} · Size: {APP_CONFIG.apkFileSize}</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

