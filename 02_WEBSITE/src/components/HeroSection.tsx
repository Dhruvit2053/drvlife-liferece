import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, ShieldCheck, Zap, Sparkles, Globe } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { DeviceMockup } from './DeviceMockup';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7F77DD]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#534AB7]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse" />
              <span className="text-xs font-semibold text-[#E8E6F0] tracking-wide">
                DrvLife v{APP_CONFIG.version} · Android App & Web Portal Live
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Take Control of Your{' '}
              <span className="gradient-text">Financial Life.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-[#888799] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Meet DrvLife — your intelligent financial companion that automatically collects UPI alerts, organizes budgets, and delivers tailored Gemini AI savings insights across your mobile phone and web browser.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] hover:from-[#6259cb] hover:to-[#8f88e8] shadow-xl shadow-[#7F77DD]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#7F77DD]/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-4 h-4" />
                <span>Download for Android</span>
                <span className="text-xs font-normal text-white/70">({APP_CONFIG.apkFileSize})</span>
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Globe className="w-4 h-4 text-[#7F77DD]" />
                <span>Open Web App Online</span>
              </Link>

              <Link
                to="/features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl font-semibold text-sm text-[#888799] hover:text-white transition-colors"
              >
                <span>Features</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1D9E75] shrink-0" />
                <span className="text-xs text-[#888799] font-medium text-left">Zero OTP Interception</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#7F77DD] shrink-0" />
                <span className="text-xs text-[#888799] font-medium text-left">Automatic UPI Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EF9F27] shrink-0" />
                <span className="text-xs text-[#888799] font-medium text-left">Gemini AI Advisor</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <DeviceMockup />
          </div>

        </div>
      </div>
    </section>
  );
};
